import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../util/auth";



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