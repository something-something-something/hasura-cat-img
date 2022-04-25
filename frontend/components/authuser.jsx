//ui componentss related to user auth.
import {Form,Input,Label,Button,H2} from './base';



export function EmailForm({email,setEmail,buttonSubmitText,formSubmit,formHeader,emailInputId,isLoading}){
	return <Form loading={isLoading} onSubmit={formSubmit}>
		<H2>{formHeader}</H2>
		<div style={{display:'flex'}}>
			<Label htmlFor={emailInputId}>
			Email
			</Label>
			<Input id={emailInputId} value={email} onChange={(ev)=>{setEmail(ev.target.value)}} type="email" title="Must be Email"/>
		</div>
		<Button type="submit"> {buttonSubmitText}</Button>
	</Form>
}