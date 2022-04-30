import * as jose from 'jose';
import {  gql } from "@apollo/client";
export const TokenStorageKey='catImgAuthToken';

export function logInUser(token,client){
	
	sessionStorage.setItem(TokenStorageKey,token);
	client.resetStore();
}

export function logOutUser(client){
	sessionStorage.removeItem(TokenStorageKey);
	client.resetStore();
}


//does not check if jwt is signed! This Is to help with knowing who a user CLAIMS TO BE! is it is not safe to use for anything related to security! IT is for the user argument in queries
//TODO check if signed
export function getUserIdFromJWT(){
	let jwt=sessionStorage.getItem(TokenStorageKey);
	let jwtClaims=jose.decodeJwt(jwt);

	return parseInt(jwtClaims?.['https://hasura.io/jwt/claims']?.['x-hasura-user-id'],10);

}

//todo check token is token and valid right now just check it exists
export function isAuthenticated(){
	
	return typeof sessionStorage!=='undefined'&& sessionStorage.getItem(TokenStorageKey)!==null ;
}


export async function getUserDetails(client){
	return (await client.query(gql`
	query getUserData($uid:Int!){
		appuser_by_pk(id:$uid){
			id
			email
			profiles{
				name
				id
				description
			}
		}
	}
	
	`)).data.appuser_by_pk;
}