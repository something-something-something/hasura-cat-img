import {EmailForm} from '../components/authuser'
import { useState } from 'react';

export default function LoginPage(){

	const [email,setEmail] =useState('');

	return <EmailForm buttonSubmitText="Login" formHeader="Login" emailInputId="loginEmailInput" email={email} setEmail={setEmail} formSubmit={(ev)=>{
		ev.preventDefault();

		console.log(email);
	}}/>
}