const express = require('express');
const Minio=require('minio');
const {Buffer}=require('node:buffer');
const { subtle } = require('crypto').webcrypto;

const serverport = 3020;
const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT;
const minioEndpoint=process.env.MINIO_ENDPOINT;
const minioPort=parseInt(process.env.MINIO_PORT,10);
const minioUseSSL=process.env.MINIO_USESSL==='no'?false:true;
const minioAccessKey=process.env.MINIO_ACCESSKEY;
const minioSecretKey=process.env.MINIO_SECRETKEY;
const authEndpoint=process.env.AUTHENDPOINT;
const bucketPostImgName='uploadedPost'
const bucketPostImgRegion='blahblah'

const imageMimeType=['PNG','JPEG'] 

function getMinioClient(){
	const minioClient=new Minio.Client({
		endPoint:minioEndpoint,
		port:minioPort,
		useSSL:minioUseSSL,
		accessKey:minioAccessKey,
		secretKey:minioSecretKey
	});

	return minioClient;

}


async function runServer(port) {
	const app = express();

	const minioClient=getMinioClient();


	// if(!(await minioClient.bucketExists(bucketPostImgName))){

	// 	await minioClient.makeBucket(bucketPostImgName,bucketPostImgRegion);

	// }

	// await minioClient.setBucketPolicy(bucketPostImgName,JSON.stringify({
	// 	Version:'2012-10-17',
	// 	Statement:[
	// 		{
	// 			Effect:"Allow",
	// 			Principal:{AWS:"*"},
	// 			Action:["s3:GetBucketLocation","s3:ListBucket"],
	// 			Resource:"arn:aws:s3:::"+bucketPostImgName
	// 		},
	// 		{
	// 			Effect:"Allow",
	// 			Principal:{AWS:"*"},
	// 			Action:"s3:getObject",
	// 			Resource:"arn:aws:s3:::"+bucketPostImgName+"/*"
	// 		}
	// 	]
	// }));

	app.use(express.json());

	app.post('/addpost', async (req, res) => {

		let hasData=typeof req.body?.input?.postImageData?.imageBase64 === 'string'&& 
		typeof req.body?.input?.postImageData?.mimetype === 'string'&& 
		imageMimeType.indexOf(req.body?.input?.postImageData?.mimetype)!==-1&&typeof req.body?.input?.postImageData?.name === 'string'&&
		typeof req.body?.input?.postImageData?.name === 'imageBase64'&&
		req.body?.input?.postImageData?.profile === 'number'&&
		!Number.isNaN(parseInt(req.body?.session_variables?.["x-hasura-user-id"], 10))
		
		
		;

		if (hasData){
			let getTokenRes =await fetch(authEndpoint+'/getmachinejwt');
			let jwt=await getTokenRes.text();
			
			let userid=parseInt(req.body?.session_variables?.["x-hasura-user-id"], 10);
			let profileid=req.body?.input?.postImageData?.profile;
			let getProfilesByUser=await fetch(process.env.GRAPHQL_ENDPOINT,{
				method:'POST',
				headers:{
					Authorization: 'Bearer '+jwt
				},
				body:JSON.stringify({
					query:`
						query getProfiles($userID:Int!){
							appuser_by_pk(id:$userID){
								profiles{
									id
								}
							}
						}
					`,
					variables:{
						userID:userid
					}
				})

			});
			

			let isVaildUserForProfile=(await getProfilesByUser.json())?.data?.appuser_by_pk?.profiles.some((el)=>{
				return el.id===profileid;
			});

			if(isVaildUserForProfile){
				let imageBuffer=Buffer.from(req.body?.input?.postImageData?.imageBase64,'base64');
			
				let uuid=subtle.randomUUID();

				console.log(imageBuffer);
				res.send({
					uuid:uuid,
					success:true,
					id:0
				})
			}
			else{
				res.send({message:'wrongprofile'});
			}
			
			
			
		}
		else{
			res.send({message:'datamissing'});
		}
		
	});




	app.listen(port);
}



runServer(serverport);