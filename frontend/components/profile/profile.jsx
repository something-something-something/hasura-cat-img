import { Form, Input,Label,Button ,InputWithLabel} from "../base"

export function ProfileForm({nameInputID,descriptionInputID,name,setName,description,setDescription,formSubmit,isLoading=false}){
	return <Form kind={isLoading?'loading':null} onSubmit={formSubmit}>
		

		<InputWithLabel inputID={nameInputID} labelText='Name' inputProps={{value:name,onChange:(ev)=>{setName(ev.target.value)}}}/>


		<InputWithLabel inflex={false} inputID={descriptionInputID} labelText='Description' labelProps={{kind:'fullwidth'}} inputProps={{value:description,onChange:(ev)=>{setDescription(ev.target.value)},as:'textarea'}}/>
		<Button type="submit">Create Profile</Button>
		
	</Form>
}