import * as jose from 'jose';

export function logInUser(token,client){
	
	sessionStorage.setItem('catImgAuthToken',token);
	client.resetStore();
}

export function logOutUser(client){
	sessionStorage.removeItem('catImgAuthToken');
	client.resetStore();
}


//does not check if jwt is signed! This Is to help with knowing who a user CLAIMS TO BE! is it is not safe to use for anything related to security! IT is for the user argument in queries
//TODO check if signed
export function getUserIdFromJWT(){
	let jwt=sessionStorage.getItem('catImgAuthToken');
	let jwtClaims=jose.decodeJwt(jwt);

	return parseInt(jwtClaims?.['https://hasura.io/jwt/claims']?.['x-hasura-user-id'],10);

}