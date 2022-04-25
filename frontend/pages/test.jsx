
import {Button,Input,Form,Label,H1,H2,H3,H4,H5,H6,H7} from '../components/base'


function TestPage(){
	return <> 
	
	
	Hello
	
	<Button>hello</Button>
	<Input/>
	<div style={{
		width:'80%'
	}}><Input/></div>

	<Form>
		<div style={{display:'flex'}}><Label htmlFor="email">Email</Label>
		<Input id="email" type="text"/></div>
		<Label htmlFor="sometextarea">Something</Label>
		<Input id="sometextarea" as="textarea" css={{height:'10rem'}}/>
		<Button type='submit'>Submit</Button><Button kind="danger" type="button">Delete</Button>
	</Form>
	<Form css={{maxWidth:'50rem'}}>
		<div style={{display:'flex'}}><Label htmlFor="email2">Email</Label>
		<Input id="email2" type="text"/></div>
		<Label htmlFor="sometextarea2">Something</Label>
		<Input id="sometextarea2" as="textarea" css={{height:'10rem'}}/>
		<Button type="submit">Submit</Button><Button type="button" kind="danger">Delete</Button>
	</Form>


	<H1>Test</H1>
	
	<H2>Test</H2>
	
	<H3>Test</H3>
	
	<H4>Test</H4>
	
	<H5>Test</H5>
	
	<H6>Test</H6>
	
	<H7>Test</H7>
	
	
	
	 </>
}


export default TestPage;