import { Form, Input,Label,Button ,InputWithLabel} from "../base"
import { useId } from "react"
export function ProfileForm({nameInputID,descriptionInputID,name,setName,description,setDescription,formSubmit,isLoading=false}){
	return <Form kind={isLoading?'loading':null} onSubmit={formSubmit}>
		

		<InputWithLabel inputID={nameInputID} labelText='Name' inputProps={{value:name,onChange:(ev)=>{setName(ev.target.value)}}}/>


		<InputWithLabel inflex={false} inputID={descriptionInputID} labelText='Description' labelProps={{kind:'fullwidth'}} inputProps={{value:description,onChange:(ev)=>{setDescription(ev.target.value)},as:'textarea'}}/>
		<Button type="submit">Create Profile</Button>
		
	</Form>
}

export function CommentForm({comment,setComment,formSubmit,isLoading=false,profileOptions,chosenProfile,setChosenProfile}){
	const textareaId=useId();
	const profileSelID=useId();
	return (<Form kind={isLoading?'loading':null} onSubmit={formSubmit}>
		<InputWithLabel inputID={textareaId}  inflex={false} labelProps={{kind:'fullwidth'}}  labelText='Comment' inputProps={{as:'textarea',value:comment,onChange:(ev)=>{setComment(ev.target.value)}}} />
		<div style={{display:'flex'}}><Label htmlFor={profileSelID}>PostAs</Label>
		<select value={chosenProfile} onChange={(ev)=>{setChosenProfile(ev.target.value)}} id={profileSelID}>
			{profileOptions.map((profile)=>{
				return <option key={profile.id} value={profile.id}>{profile.name}</option>
			})}
		</select>
		</div>

		<Button type="submit">Post Comment</Button>
	</Form>)
}