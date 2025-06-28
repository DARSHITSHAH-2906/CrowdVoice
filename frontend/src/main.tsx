import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { GoogleOAuthProvider } from '@react-oauth/google';
import { TokenProvider } from './context/TokenProvider.tsx';
import { LoginModalProvider } from './context/LoginModalContext.tsx';
import './index.css'
import App from './App.tsx'
import { SignupModalProvider } from './context/SignupModal.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='439113069317-q1i4s4isn3k0f595c243h8qbqq8as7gf.apps.googleusercontent.com'>
      <BrowserRouter>
        <TokenProvider>
            <LoginModalProvider>
          <SignupModalProvider>
              <App />
          </SignupModalProvider>
            </LoginModalProvider>
        </TokenProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
