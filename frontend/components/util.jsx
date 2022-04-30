import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../util/auth";
import Link from "next/link";
import { Button } from "./base";

export function useIsServer(){
	const [isServer,setIsServer]=useState(true);

	useEffect(()=>{
		setIsServer(false);
	});
	return isServer;
}

export function ClientSide(props){

	const isServer=useIsServer();
	return <>
		{!isServer&&props.children}
	</>
}

export function RequireAuth(props){

	const router=useRouter();
	if(isAuthenticated()){
		return <>{props.children}</>;
	}
	else{
		router.push('/login');
	}
	return <></>;

	
}

export function ContentNeedsLogin(props){

	if(isAuthenticated()){
		return <>{props.children}</>
	}
	else{
		return <><Link href="/login"><Button as="a">Please Login</Button></Link></>;
	}

}