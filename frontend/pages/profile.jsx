import { useLazyQuery,gql, ApolloConsumer} from '@apollo/client'
import { useEffect, useState } from 'react';
import {getUserIdFromJWT,logOutUser} from '../util/auth';
import { Button } from '../components/base';

import  { useRouter } from 'next/router';

export default function ProfilePage(){
	const router=useRouter();
	const USER_DATA=gql`
		query getUserData($uid:Int!){
			appuser_by_pk(id:$uid){
				id
				email
			}
		}
	`;

	

	useEffect(()=>{
		
		loadProfile({variables:{uid:getUserIdFromJWT()}});
	},[])
	const [loadProfile,{loading,error,data}]=useLazyQuery(USER_DATA);
	if(loading){
		return <>Loading</>;
	}

	if(error){
		return <>{error.message}</>
	}

	return (<><ApolloConsumer>{(client)=>{
		return <Button onClick={(ev)=>{
			 
			logOutUser(client);
			router.push('/login');
		}}>Logout</Button> 
		
	}}</ApolloConsumer>
		<pre>{JSON.stringify(data,null,'\t')}
	</pre>
	</>);
}