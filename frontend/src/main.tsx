import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { GoogleOAuthProvider } from '@react-oauth/google';
import { TokenProvider } from './context/TokenProvider.tsx';
import { LoginModalProvider } from './context/LoginModalContext.tsx';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='439113069317-2sahsmav9eoppb7f9jqkqbuv1r2se6ik.apps.googleusercontent.com'>
      <BrowserRouter>
        <TokenProvider>
          <LoginModalProvider>
            <App />
          </LoginModalProvider>
        </TokenProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
