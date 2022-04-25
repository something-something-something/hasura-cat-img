import { ApolloProvider } from '@apollo/client';
import {graphqlclient} from '../apolloConfig';

export default function SiteApp({Component,pageProps}){
	return<>
	<ApolloProvider client={graphqlclient}>
		<Component {...pageProps}/>	
	</ApolloProvider>
	</>
}