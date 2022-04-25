import {keyframes, styled} from '../stiches.config';
import * as LabelPrimative from '@radix-ui/react-label'


export const Button=styled('button',{
	all:'unset',
	backgroundColor:'$bgSolid',
	padding:'0.5rem',
	color:'$textHigh',
	margin:'1rem 1rem',
	position:'relative',
		top:0,
		left:0,
	//boxShadow:'1rem 1rem $colors$borderInteractHover',
	
	'&::before':{
		beforeUseAsBg:null,
		$$imagebordercolor:'$colors$borderInteract',
		bracketBg:['$$imagebordercolor'],
		transform: 'scale(1)',
		opacity:0,
		transition: 'transform 0.5s, opacity 0.5s',
	},
	'&:hover':{
		backgroundColor:'$bgSolidHover',
		
		
	},
	'&:hover::before':{
		$$imagebordercolor:'$colors$borderInteractHover',
		transform:'scale(1.5)',
		opacity:1
	},
	variants:{
		kind:{
			danger:{
				backgroundColor:'$bgSolidDanger',
				color:'$textHighDanger',
				'&::before':{
					$$imagebordercolor:'$colors$borderInteractDanger',
				},
				'&:hover':{
					backgroundColor:'$bgSolidHoverDanger',
					
					
				},
				'&:hover::before':{
					$$imagebordercolor:'$colors$borderInteractHoverDanger',
				},
			},
		},
	},

});


export const Input=styled('input',{
	all:'unset',
	backgroundColor:'$bgUI',
	margin:'1rem',
	padding:'0.5rem',
	display:'inline-block',
	borderColor:'$border',
	borderWidth:'0.1rem',
	borderStyle:'solid',
	width:'calc(100% - 3.2rem)',
	$$shadowcolorA:'$colors$bgUI',
	$$shadowcolorB:'$colors$bgUI',
	boxShadow:'0rem 0rem 0rem 0rem $$shadowcolorA,0rem 0rem 0rem 0rem $$shadowcolorB',
	transition: 'background-color 0.5s,box-shadow 0.5s',
	position:'relative',
	top:0,
	left:0,
	'&:hover':{
		backgroundColor:'$bgUIHover',
	},
	'&:focus':{
		$$shadowcolorA:'$colors$bgUISelInfo',
		$$shadowcolorB:' $colors$bgUIHoverInfo',
		boxShadow:'0.9rem 0.9rem 0rem -0.1rem $$shadowcolorA,-0.9rem -0.9rem 0rem -0.1rem $$shadowcolorB',
		backgroundColor:'$bgUISel',
	},'&:invalid':{
		borderColor:'$borderDanger',
		backgroundColor:'$bgUIDanger',

	},
	'&:hover:invalid':{
		backgroundColor:'$bgUIHoverDanger',

	},
	'&:focus:invalid':{
		$$shadowcolorA:'$colors$bgSolidHoverDanger',
		$$shadowcolorB:' $colors$bgSolidDanger',
		backgroundColor:'$bgUISelDanger',
		boxShadow:'-1.1rem 1.1rem 0rem -0.1rem $$shadowcolorA,1.1rem -1.1rem 0rem -0.1rem $$shadowcolorB'

	},
	

})

export const Label=styled(LabelPrimative.Root,{
	all:'unset',
	display:'inline-block',
	margin:'1rem',
	color:'$textLow',
	padding:'0.5rem',
	maxWidth:'calc(100% - 3.2rem)',
	borderStyle:'solid',
	borderColor:'$border',
	borderWidth:'0 0 0 0.5rem',
});


const formLoadingAnimation=keyframes({
	'0%':{
		backgroundColor:'$bgUIInfo'
	},
	'50%':{
		backgroundColor:'$bgUISelInfo'
	},
	'100%':{
		backgroundColor:'$bgUIInfo'
	}
})

export const Form=styled('form',{
	all:'unset',
	backgroundColor:'$bgSubtle',
	margin:'4rem auto',
	padding:'2rem',
	display:'block',
	borderColor:'$border',
	borderWidth:'0.1rem',
	borderStyle:'solid',
	width:'calc(100% - 6.2rem)',
	$$shadowcolor:'$colors$shadows',
	boxShadow:'0rem 0rem 2rem 0rem $$shadowcolor',
	transition: 'box-shadow 0.5s',
	'&:hover':{
		$$shadowcolor:'$colors$shadows',
		boxShadow:'0rem 0rem 5rem 0rem $$shadowcolor',
	},
	variants:{
		loading:{
			true:{
				animationName:`${formLoadingAnimation}`,
				animationDuration:'500ms',
				animationTimingFunction:'linear',
				animationIterationCount:'infinite'
			}
		}
	}
});





export const H1=styled('h1',{
	headerStyle:1,
});

export const H2=styled('h2',{
	headerStyle:2,
});

export const H3=styled('h3',{
	headerStyle:3,
});

export const H4=styled('h4',{
	headerStyle:4,
});

export const H5=styled('h5',{
	headerStyle:5,
});


export const H6=styled('h6',{
	headerStyle:6,
});


export const H7=styled('h7',{
	headerStyle:7,
});