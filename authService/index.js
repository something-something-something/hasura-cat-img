const express = require('express');
const { subtle } = require('crypto').webcrypto;
const jose = require('jose');
const _sodium = require('libsodium-wrappers');


const serverport = 3020;
const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT;

async function hashPassword(password) {
	await _sodium.ready;

	return _sodium.crypto_pwhash_str(password, _sodium.crypto_pwhash_OPSLIMIT_MODERATE, _sodium.crypto_pwhash_MEMLIMIT_MODERATE);
}
async function verifyPassword(pass, hash) {
	await _sodium;
	return _sodium.crypto_pwhash_str_verify(hash, pass);
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

async function runServer(port) {

	let { publicKey, privateKey } = await genKeys();
	const app = express();

	let errorMessage = { error: { "message": "An error Occured" } }

	app.use(express.json());

	app.post('/register', async (req, res) => {

		const data = req.body;
		console.log(req.body);;
		if (typeof req.body?.input?.userinfo?.password === 'string' && typeof req.body?.input?.userinfo?.email === 'string') {
			try {
				let apiRes = await fetch(graphqlEndpoint, {
					method: 'POST',
					headers: {
						Authorization: 'Bearer ' + await genSystemJWT(privateKey)
					},
					body: JSON.stringify({

						query: `
					mutation addUser($useremail:String!,$userpass:String!){
						insert_appuser_one(object:{email:$useremail,password:$userpass}){
							
								id
							
						}

					}

					`,
						variables: {
							useremail: req.body.input.userinfo.email,
							userpass: await hashPassword(req.body.input.userinfo.password)
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
		if (typeof req.body?.input?.userinfo?.password === 'string' && typeof req.body?.input?.userinfo?.email === 'string') {

			try {
				let apiRes = await fetch(graphqlEndpoint, {
					method: 'POST',
					headers: {
						Authorization: 'Bearer ' + await genSystemJWT(privateKey)
					},
					body: JSON.stringify({
						query:`
							query getusers($useremail:String!){
								appuser(where: {email:{_eq:$useremail}}){
									id
									email
									password
								}
							}
						`,
						variables:{
							useremail:req.body.input.userinfo.email
						}
					})
				});
				let apiObj=await apiRes.json();
				console.log(apiObj);
				//TODO: USE SAME ERROR FOR WRONG PASS AND EMAIL NOT FOUND
				if(typeof apiObj?.data?.appuser?.[0]?.password==='string'&&typeof apiObj?.data?.appuser?.[0]?.id==='number'){
					if(await verifyPassword(req.body.input.userinfo.password,apiObj.data.appuser[0].password)){
						res.send({
							success:true,
							authKey:await genUserJWT(apiObj.data.appuser[0].id,privateKey)
						})
					}
					else{
						res.status(401);
						res.send({message:'password wrong'});
					}
				}
				else{
					res.status(401);
					res.send({message:'no user found'});
				}
			}
			catch (e) {
				console.log(e);
				res.send(errorMessage)
			}
		}
		else{
			res.send(errorMessage);
		}
	});

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