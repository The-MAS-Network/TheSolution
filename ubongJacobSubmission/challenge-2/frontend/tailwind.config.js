/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        appBlue100: '#0074FF',
        appBlue110: '#03499D73',
        appBlue200: '#0055BB',
        appBlue300: '#3381E1',
        appBlue400: '#0072FB',
        appBlue500: '#0072FB80',
        appBlue600: '#003DBE',
        appBlue700: '#043191',
        appBlue800: '#012B5D',
        appBlue900: '#0F3367',
        appDarkBlue100: '#13203B',
        appDarkBlue200: '#283042',
        appDarkBlue300: '#2C3140',
        appGray100:'#424C62',
        appGray200:'#929292',
        appGray300:'#BDBDBD',
        appGray400:'#E0E0E0',
        appGray500:'#3F3F3F',
        appGray600:'#CACACA99',
        appGreen100:'#082700',
        appGreen200:'#11813E',
        appGreen300:'#0F9D58',
        appRed100:'#F9B9BB',
        appRed200:'#FD6969',
        appRed300:'#EC1C24',
        appRed400:'#FDE8E9C4',
        appYellow100: '#fbb11c',
        appYellow200: '#E9CE0266',
        appYellow300: '#FFD000',
        appYellow400: '#FFF0B042'
      },
      fontFamily: {
        baloo2: ['Baloo2']
      },
      boxShadow: {
        appButtonInnerShadow: '0px -4px 2px 0px #03499D73 inset'
      }
    },
  },
  plugins: [],
}