import { ApolloConsumer, ApolloProvider } from '@apollo/client';
import { graphqlclient } from '../apolloConfig';
import { A, Button } from '../components/base';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { logOutUser } from '../util/auth'
export default function SiteApp({ Component, pageProps }) {
	const router=useRouter();
	return <>
		<ApolloProvider client={graphqlclient}>
			<div style={{ display: 'flex',justifyContent:'center' }}><Link href="/" passHref={true}><Button as="a">Home</Button></Link>
				<Link href="/login" passHref={true}><Button as="a">Login</Button></Link>
				<Link href="/createAccount" passHref={true}><Button as="a">Create Account</Button></Link>
				<Link href="/userinfo" passHref={true}><Button as="a">User Details</Button></Link>
				<ApolloConsumer>{(client) => {
					return (
					<Button kind="danger" onClick={() => { 
						logOutUser(client);
						router.push('/');
					}}>
						Log Out
					</Button>
					)
				}}</ApolloConsumer>
			</div>

			<div style={{margin:'1rem auto' ,maxWidth:'80rem'}}><Component {...pageProps} /></div>
		</ApolloProvider>
	</>
}