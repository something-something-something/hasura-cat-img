const express = require('express');
const { subtle } = require('crypto').webcrypto;
const jose = require('jose');
const nodemailer=require('nodemailer');
//import url from 'url';


// const _sodium = require('libsodium-wrappers');


const serverport = 3020;
const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT;
const smtpHost= process.env.SMTP_HOST;
const smtpPort=process.env.SMTP_PORT;
const smtpUser=process.env.SMTP_USER;
const smtpPassword=process.env.SMTP_PASS;
const fromEmail=process.env.FROM_EMAIL_ADDRESS;
const frontendUrl=process.env.FRONTEND_URL;
//async function hashPassword(password) {
//	await _sodium.ready;
//
//	return _sodium.crypto_pwhash_str(password, _sodium.crypto_pwhash_OPSLIMIT_MODERATE, _sodium.crypto_pwhash_MEMLIMIT_MODERATE);
//}
//async function verifyPassword(pass, hash) {
//	await _sodium;
//	return _sodium.crypto_pwhash_str_verify(hash, pass);
//}

async function sendEmail(toEmail,subject,emailText){
	const transporter=nodemailer.createTransport({
		host:smtpHost,
		port:smtpPort,
		//auth does not mater right now
		auth:{
			user:smtpUser,
			pass:smtpPassword,
		}
	});

	try{
		transporter.sendMail({
			to:toEmail,
			from:fromEmail,
			subject:subject,
			text:emailText
		})
	}
	catch(e){
		return false;
	}
	return true;
}

async function genKeys() {
	return await subtle.generateKey({
		name: 'RSASSA-PKCS1-v1_5', modulusLength: 4096, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-512"
	}, true, ['sign', 'verify']);
}

async function genSystemJWT(privateKey) {
	return await new jose.SignJWT({
		"https://hasura.io/jwt/claims": {
			"x-hasura-allowed-roles": ["admin"],
			"x-hasura-default-role": "admin"
		}

	}).setProtectedHeader({ alg: 'RS512' }).sign(privateKey);
}

async function genUserJWT(id, privateKey) {
	return await new jose.SignJWT({
		"https://hasura.io/jwt/claims": {
			"x-hasura-allowed-roles": ["user"],
			"x-hasura-default-role": "user",
			"x-hasura-user-id": '' + id
		}

	}).setProtectedHeader({ alg: 'RS512' }).sign(privateKey);
}

//token for login from email link
async function genMailJWT(id, privateKey) {
	return await new jose.SignJWT({
		"https://hasura.io/jwt/claims": {
			"x-hasura-allowed-roles": ["mailauthlink"],
			"x-hasura-default-role": "mailauthlink",
			"x-hasura-user-id-to-auth": '' + id
		}
	}).setProtectedHeader({ alg: 'RS512' }).sign(privateKey);
}

async function runServer(port) {

	let { publicKey, privateKey } = await genKeys();
	const app = express();

	let errorMessage = { "message": "An error Occured" } 

	app.use(express.json());

	app.post('/register', async (req, res) => {

		const data = req.body;
		console.log(req.body);;
		if (typeof req.body?.input?.userinfo?.email === 'string') {
			try {
				let apiRes = await fetch(graphqlEndpoint, {
					method: 'POST',
					headers: {
						Authorization: 'Bearer ' + await genSystemJWT(privateKey)
					},
					body: JSON.stringify({

						query: `
					mutation addUser($useremail:String!){
						insert_appuser_one(object:{email:$useremail}){
							
								id
							
						}

					}

					`,
						variables: {
							useremail: req.body.input.userinfo.email
						}
					})
				});
				let apiObj = await apiRes.json();

				console.log(JSON.stringify(apiObj))
				console.log(apiObj?.data?.insert_appuser_one?.id)
				if (apiObj?.data?.insert_appuser_one?.id !== undefined) {
					let x = {
						success: true,
						id: apiObj?.data?.insert_appuser_one?.id
					}
					console.log(JSON.stringify(x, null, '\t'));
					res.send(x)
				}
				else {
					console.log(apiObj)
					res.send({
						success: false,
						id: 0
					})
				}

			}
			catch (e) {
				console.log(e);
				res.send(errorMessage)
			}
		}
		else {
			res.send(errorMessage)
		}

	});


	app.post('/login', async (req, res) => {
		if (typeof req.body?.input?.userinfo?.email === 'string') {

			try {
				let apiRes = await fetch(graphqlEndpoint, {
					method: 'POST',
					headers: {
						Authorization: 'Bearer ' + await genSystemJWT(privateKey)
					},
					body: JSON.stringify({
						query: `
							query getusers($useremail:String!){
								appuser(where: {email:{_eq:$useremail}}){
									id
									email
								}
							}
						`,
						variables: {
							useremail: req.body.input.userinfo.email
						}
					})
				});
				let apiObj = await apiRes.json();
				console.log(apiObj);
				//TODO Dont inform if email exists or not
				if (typeof apiObj?.data?.appuser?.[0]?.id === 'number' && typeof apiObj?.data?.appuser?.[0]?.email === 'string') {
					//send email
					let authKey= await genMailJWT(apiObj.data.appuser[0].id, privateKey)


					let loginUrl=new URL(`${frontendUrl}/authLink`)
					loginUrl.search=`authToken=${authKey}`;
					console.log(loginUrl.href)
					sendEmail(apiObj?.data?.appuser?.[0]?.email ,'Go to Url To Login',`
Login here:

${loginUrl.href}
					
					
					
					`)

					res.send({
						success: true,

					});
				}
				else {
					res.status(401);
					res.send({ message: 'no user found' });
				}
			}
			catch (e) {
				console.log(e);
				res.send(errorMessage)
			}
		}
		else {
			res.send(errorMessage);
		}
	});


	app.post('/authEmailToken', async (req, res) => {
		try {
			const checkForValidReq = req.body?.session_variables?.["x-hasura-role"] === 'mailauthlink' && !Number.isNaN(parseInt(req.body?.session_variables?.["x-hasura-user-id-to-auth"], 10));
			if (checkForValidReq) {
				let uid=parseInt(req.body?.session_variables?.["x-hasura-user-id-to-auth"], 10);
				//check user still exists.
				let gqlRes = await fetch(graphqlEndpoint, {
					method: 'POST',
					headers: {
						Authorization: 'Bearer ' + await genSystemJWT(privateKey)
					},
					body: JSON.stringify({
						query: `
					query getusers($userid:Int!){
						appuser_by_pk(id:$userid){
							id
							email
						}
					}
					`,
						variables: {
							userid: uid,
						}
					})
				});
				let grqldata=await gqlRes.json();

				if(grqldata?.data?.appuser_by_pk?.id===uid){
					res.send({
						success:true,
						authKey:await genUserJWT(uid,privateKey),
						id:grqldata?.data?.appuser_by_pk?.id
					})
				}
				else{
					res.status(401);
					res.send(errorMessage);
				}
			}
			else{
				res.status(401);
				res.send(errorMessage);
			}
		}
		catch (e) {
			res.status(401);
			res.send(errorMessage);
		}
	})

	//TODO: Secure this endpoint
	app.get('/getmachinejwt', async (req, res) => {
		res.send(await genSystemJWT(privateKey));
	})

	app.all('/jwk', async (req, res) => {
		res.send(
			{ keys: [await jose.exportJWK(publicKey)] }
		);
	})



	app.listen(port);

}

runServer(serverport)