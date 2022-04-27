import {EmailForm} from '../components/authuser'
import { useState } from 'react';
import { useMutation ,gql} from '@apollo/client';

export default function LoginPage(){
	const LOGIN_TO_ACCOUNT = gql`
		mutation askforloginemail($email:String!){
			loginUser(userinfo:{email:$email}){
				success
			}
		}
	`;
	const [email,setEmail] =useState('');
		const [loginUser,{data,loading,error}]=useMutation(LOGIN_TO_ACCOUNT);
	
	if(data?.loginUser?.success){
		return <>Please check your email</>
	}
	
	return <><EmailForm buttonSubmitText="Login" formHeader="Login" emailInputId="loginEmailInput" email={email} isLoading={loading} setEmail={setEmail} formSubmit={(ev)=>{
		ev.preventDefault();
		loginUser({variables:{
			email:email
		}})
		console.log(email);
	}}/>
	{error&&<div>{error.message}</div>}
	</>
}