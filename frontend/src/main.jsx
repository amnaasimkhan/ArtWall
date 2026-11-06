import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from "@mui/material/styles";
import './index.scss'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import theme from './theme.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
        <AuthContextProvider>
          <App/>
        </AuthContextProvider>
      </ThemeProvider>
  </StrictMode>,
)
