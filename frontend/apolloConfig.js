import { ApolloClient ,InMemoryCache,createHttpLink,from} from "@apollo/client";
import {setContext} from '@apollo/client/link/context';
import {TokenStorageKey} from './util/auth';

const httpLink=createHttpLink({
	uri:process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

const authLink=setContext((req,prevContext)=>{
	if(prevContext?.headers?.authorization===undefined&&sessionStorage.getItem(TokenStorageKey)!==null){
		
		return {
			...prevContext,
			headers:{
				...prevContext.headers,
				authorization:'Bearer '+sessionStorage.getItem(TokenStorageKey)
			}
		}
	}
	else{
		return prevContext;
	}
})

export const graphqlclient=new ApolloClient({
	link:from([authLink,httpLink]),
	cache:new InMemoryCache(),
	defaultOptions:{
		query:{
			fetchPolicy:'cache-and-network'
		},
		
		mutate:{
			fetchPolicy:'network-only'
		},
	},
	
});




// headers: {
// 	sessionStorage.getItem('token')
// },