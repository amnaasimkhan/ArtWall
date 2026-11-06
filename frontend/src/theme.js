import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {main: "#f6f3ec;"},  
    secondary: {main: "#d5b9b2;"},
    contrast : {main: "#a26769;"}, 
    background: {default: "#f6f3ec"},
  },
  typography: {
    fontFamily: '"DM Sans", "Roboto", "Playfair Display", sans-serif',
    h1: {fontWeight: 700},
    h2: {fontWeight: 600 },
    h3: {fontWeight: 500},
    body1: {fontSize: 16},
  },
});

export default theme;
