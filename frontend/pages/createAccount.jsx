import { EmailForm } from '../components/authuser'
import { useState } from 'react';

import { gql, useMutation } from '@apollo/client';

import { useRouter } from 'next/router';

export default function CreateAcountPage() {
	const CREATE_ACCOUNT = gql`
		mutation registeruser($email:String!){
			registerUser(userinfo:{email:$email,password:"pass"}){
				id
				success
			}
		}
	`;
	const [email, setEmail] = useState('');
	const [registerUser, { data, loading, error }] = useMutation(CREATE_ACCOUNT);
	const router=useRouter();
	

	// if (loading) {
	// 	return 'submitting form'
	// }

	if (data?.registerUser?.success) {
		router.push('/login');
		return 'Account created...Redirecting to Login'
	}

	return <><EmailForm buttonSubmitText="Create Account!" formHeader="Create Account" emailInputId="createAccountEmailInput" email={email} setEmail={setEmail} isLoading={loading} formSubmit={(ev) => {
		ev.preventDefault();
		registerUser({
			variables: {
				email: email
			}
		})
		console.log(email);
	}} />
		{error && <div>Error:{error.message}</div>}
		{data?.registerUser?.success===false&&<>Failed to create account</>}
	</>
}