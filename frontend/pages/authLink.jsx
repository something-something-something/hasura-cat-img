import {gql,useMutation,ApolloConsumer} from '@apollo/client';
import {Button} from '../components/base';

import  { useRouter } from 'next/router';

import {logInUser} from '../util/auth';

//move some of this somewhere  else
export default function AuthUser(props){
	const router=useRouter();
	const AUTH_USER_FROM_LINK=gql`
		mutation authUserFromLink{
			authEmailToken{
				success
				authKey
				id
			}
		}
	`

	const [authUserFromLink,{data,loading,error}]=useMutation(AUTH_USER_FROM_LINK,{
		context:{
			headers:{
				authorization:'Bearer '+router.query?.authToken,
			}
		}
	});
	
	if(loading){
		return <>Loading!</>
	}

	if(error){
		return <>Error!<>{error.message}</></>
	}
	
	if(data?.authEmailToken?.success){
		return <ApolloConsumer>

		{(client)=>{
			logInUser(data.authEmailToken.authKey,client);
			router.push('/profile');
				return <>Directing you to profile</>
			}
		}
		
		</ApolloConsumer>
	}

	return <>
		Athentication Page
		<Button onClick={()=>{
			authUserFromLink();
		}}>Log IN</Button>
	</>
}