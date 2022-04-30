import { ApolloConsumer, gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ClientSide,ContentNeedsLogin } from "../../components/util";

import { CommentForm } from "../../components/profile/profile";
import {H2,Label} from '../../components/base'

import { getUserDetails, getUserIdFromJWT } from "../../util/auth";
export default function ProfilePage(){
	return (<ClientSide>
		<ProfilePageContent/>
	</ClientSide>)
}


export function ProfilePageContent(){
	const router=useRouter();

	
	console.log(router.query)
	const PROFILE_INFO_FRAGMENT=gql`
		fragment profileInfoFragment on profile{
			name
			id
			description
			profilecomments{
				author{
					name
					id
					description
				}
				created
				modified
				comment
				id
			}
			profileposts{
				name
				description
				id
				image
				created
				modified
				profilepostcomments{
					author{
						id
						name
						description
					}
					id
					comment
					created
					modified
				}
			}
		}
	`
	const PROFILE_INFO_SUBSCRIPTION=gql`
		${PROFILE_INFO_FRAGMENT}
		subscription getProfileInfo($profileID:Int!){
			profile_by_pk(id:$profileID){
				...profileInfoFragment
			}
			
		
		}
	
	`;

	const PROFILE_INFO_QUERY=gql`
		${PROFILE_INFO_FRAGMENT}
		query getProfileInfoQuery($profileID:Int!){
			profile_by_pk(id:$profileID){
				...profileInfoFragment
			}
		
		
		}
	
	`;
		let profileid=router?.query?.profileid?.[0]
		
		profileid= profileid!==undefined?profileid:0;
		
		const {subscribeToMore,data,loading,error}=useQuery(PROFILE_INFO_QUERY,{variables:{profileID:profileid}});

		useEffect(()=>{
				subscribeToMore({document:PROFILE_INFO_SUBSCRIPTION,variables:{profileID:profileid}});
		})
		if(loading){
			return <>Loading..</>
		}
		if(error){
			return <>Plese refresh the page and try again <br/> Error Message: {error.message}</>
		}

	
	
		return (<><pre>
			
				{JSON.stringify(data,null,'\t')}

			</pre>
			
			<H2>Comment</H2>
			<ContentNeedsLogin>
				<ApolloConsumer>{(client)=>{
					return <ProfileCommentForm profileid={profileid} client={client}/>
				}
					
				}
				</ApolloConsumer>
				
			</ContentNeedsLogin>
			</>);

}

function ProfileCommentForm({profileid,client}){

	const [comment,setComment]=useState('');

	const [selectedProfile,setSelectedProfile]=useState(null);

	const ADD_COMMENT=gql`
		mutation addProfileComment($comment:String!,$author:Int!,$profile:Int!){
			insert_profilecomment_one(object:{comment:$comment,authorid:$author,profileid:$profile}){
				id
			}
		}
	`;
	const USER_DATA=gql`
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
	const {data:userdata}=useQuery(USER_DATA,{variables:{uid:getUserIdFromJWT()}
});


	let profilesAuthorOwns=userdata?.appuser_by_pk?.profiles
	profilesAuthorOwns=profilesAuthorOwns!==undefined?profilesAuthorOwns:[];
	const [addComment,{data,error,loading}]=useMutation(ADD_COMMENT);
	let formSubmit=(ev)=>{
		ev.preventDefault();

		addComment({variables:{
			comment:comment,
			author:selectedProfile,
			profile:profileid
		}})
	};
	return <>
		
		<CommentForm formSubmit={formSubmit} profileOptions={profilesAuthorOwns} setComment={setComment} chosenProfile={selectedProfile} setChosenProfile={setSelectedProfile}/>
	</>;
}