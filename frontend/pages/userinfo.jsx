import { useLazyQuery, gql, ApolloConsumer, useMutation } from '@apollo/client'
import { useEffect, useState } from 'react';
import { getUserIdFromJWT, logOutUser } from '../util/auth';
import { Button } from '../components/base';
import { ProfileForm } from '../components/profile/profile';
import { useRouter } from 'next/router';
import { ClientSide, RequireAuth } from '../components/util';

export default function UserInfoPage() {

	return (
		<ClientSide>
			<RequireAuth>
				<UserInfoPageContent />
			</RequireAuth>
		</ClientSide>
	);
}
function UserInfoPageContent() {
	const router = useRouter();
	const [showCreateProfileInput, setShowProfileCreateInput] = useState(false);
	const [createProfileName, setCreateProfileName] = useState('');
	const [createProfileDescription, setCreateProfileDescription] = useState('');
	const USER_DATA = gql`
		query getUserData($uid:Int!){
			appuser_by_pk(id:$uid){
				id
				email
				profiles{
					name
					id
					description
				}
			}
		}
	`;
	
	const CREATE_PROFILE=gql`
		mutation createProfile($profilename:String!,$uid:Int!,$description:String!){
			insert_profile_one(object:{appuserid:$uid,name:$profilename,description:$description}){
				appuserid
				id
				description
				name
			}
		}
	`;
	const [createProfile,{error:createProfileError,loading:createProfileLoading,data:createProfileData}]=useMutation(CREATE_PROFILE);
	useEffect(() => {

		loadProfile({ variables: { uid: getUserIdFromJWT() } });
	}, []);

	const [loadProfile, { loading, error, data,refetch:loadProfileRefetch }] = useLazyQuery(USER_DATA);

	if (loading) {
		return <>Loading</>;
	}

	if (error) {
		return <>{error.message}</>
	}
	const toggleShowCreateProfileForm = (ev) => {
		setShowProfileCreateInput(!showCreateProfileInput);
	}

	
	const submitCreateProfile=async (ev)=>{
		ev.preventDefault();
		await createProfile({variables:{
			uid:await getUserIdFromJWT(),
			profilename:createProfileName,
			description:createProfileDescription
		}});
		setShowProfileCreateInput(false);
		loadProfileRefetch();

	}
	return (<>

		{/* <ApolloConsumer>{(client) => {
		return <Button onClick={(ev) => {

			logOutUser(client);
			router.push('/login');
		}}>Logout</Button>

	}}</ApolloConsumer> */}
		
		<Button kind={showCreateProfileInput ? 'danger' : null} onClick={toggleShowCreateProfileForm}>
			
			{
				showCreateProfileInput 
					?'Cancel Create Profile' 
					:'Create New Profile'
			}
		</Button>
		{
			showCreateProfileInput && 
				<ProfileForm formSubmit={submitCreateProfile} nameInputID="createProfileInputName" name={createProfileName} setName={setCreateProfileName} descriptionInputID="createProfileInputDescription" description={createProfileDescription} setDescription={setCreateProfileDescription}/>
		}<pre>{JSON.stringify(data, null, '\t')}
		</pre>
	</>);
}