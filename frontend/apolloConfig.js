import { ApolloClient ,InMemoryCache,createHttpLink,from,split} from "@apollo/client";
import {setContext} from '@apollo/client/link/context';
import {TokenStorageKey,isAuthenticated} from './util/auth';
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink=createHttpLink({
	uri:process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

const wsLink=typeof WebSocket==='undefined'?null: new GraphQLWsLink(createClient({
	url:process.env.NEXT_PUBLIC_GRAPHQL_WEBSOCKET_ENDPOINT,
	connectionParams:isAuthenticated()?{
		authorization:'Bearer '+sessionStorage.getItem(TokenStorageKey)
	}:{}
}));




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
const splitHttpWebsocketsLink=split(({query})=>{
	const def=getMainDefinition(query);
	return def.kind==='OperationDefinition'&& def.operation==='subscription';
},wsLink===null?from([authLink,httpLink]):wsLink,from([authLink,httpLink]));

export const graphqlclient=new ApolloClient({
	link:splitHttpWebsocketsLink,
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