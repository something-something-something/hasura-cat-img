import {
	tomato, mint, amber, indigo, mauve, green,
} from '@radix-ui/colors';

import { createStitches } from '@stitches/react';

export const { styled, css, globalCss, keyframes, getCssText, theme, createTheme, config } = createStitches({

	theme: {
		colors: {
			...amber,
			...mint,
			...tomato,
			...indigo,
			...mauve,
			bgApp: '$mint1',
			bgSubtle: '$mint2',
			bgUI: '$mint3',
			bgUIHover: '$mint4',
			bgUISel: '$mint5',
			border: '$mint6',
			borderFocus: '$mint7',
			borderInteract: '$mint7',
			borderInteractHover: '$mint8',
			bgSolid: '$mint9',
			bgSolidHover: '$mint10',
			textLow: '$mint11',
			textHigh: '$mint12',
			shadows: '$mauve10',

			bgAppDanger: '$tomato1',
			bgSubtleDanger: '$tomato2',
			bgUIDanger: '$tomato3',
			bgUIHoverDanger: '$tomato4',
			bgUISelDanger: '$tomato5',
			borderDanger: '$tomato6',
			borderFocusDanger: '$tomato7',
			borderInteractDanger: '$tomato7',
			borderInteractHoverDanger: '$tomato8',
			bgSolidDanger: '$tomato9',
			bgSolidHoverDanger: '$tomato10',
			textLowDanger: '$tomato11',
			textHighDanger: '$tomato12',

			bgAppInfo: '$indigo1',
			bgSubtleInfo: '$indigo2',
			bgUIInfo: '$indigo3',
			bgUIHoverInfo: '$indigo4',
			bgUISelInfo: '$indigo5',
			borderInfo: '$indigo6',
			borderFocusInfo: '$indigo7',
			borderInteractInfo: '$indigo7',
			borderInteractHoverInfo: '$indigo8',
			bgSolidInfo: '$indigo9',
			bgSolidHoverInfo: '$indigo10',
			textLowInfo: '$indigo11',
			textHighInfo: '$indigo12',


		}
	},
	utils: {

		beforeUseAsBg: () => {
			return {
				content: '',
				width: '100%',
				height: '100%',
				display: 'inline-block',
				position: 'absolute',
				top: 0,
				left: 0,
				//zIndex: 0,
			}

		},
		bracketBg: ([color, thickness = '0.08rem', length = '0.3rem']) => {


			return {

				backgroundImage: (new Array(8)).fill('').map((el, index) => {
					return `linear-gradient( 0deg, ${color} , ${color} )`
				}).join(' , '),


				backgroundSize:
					(new Array(8)).fill('').map((el, index) => {
						return index % 2 === 1 ? `${thickness} ${length}` : `${length} ${thickness}`
					}).join(' , '),
				backgroundPosition: (new Array(8)).fill('').map((el, index) => {
					const vert = index < 4 ? 'top' : 'bottom';
					//alternate two lefts two rights
					const horiz = index % 4 < 2 ? 'left' : 'right';
					return `${vert} ${horiz}`;
				}).join(' , '),
				backgroundRepeat: 'no-repeat',

			}
		},
		headerStyle: (rank) => {

			const fSize=1.2+   (((7-rank)/6)*1);
			const pad=0.4+  (((7-rank)/6)*0.5);
			const bWidth=0.1+  (((7-rank)/6)*0.9);
			return {
				all: 'unset',
				display: 'block',
				color: '$textLow',
				padding: pad+'rem',
				margin:'0 0 1rem 0',
				borderColor: '$border',
				borderWidth: `0 0 ${bWidth}rem 0`,
				borderStyle: 'solid',
				width: `calc(100% - ${pad *2}rem)`,
				fontSize:fSize+'rem'
			}
		}
	}
})