import { ApolloClient ,InMemoryCache} from "@apollo/client";

export const graphqlclient=new ApolloClient({
	uri:process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
	cache:new InMemoryCache(),
	defaultOptions:{
		query:{
			fetchPolicy:'cache-and-network'
		},
		
		mutate:{
			fetchPolicy:'network-only'
		},
	}
})