// SignupModalContext.tsx
import React, { createContext, useContext, useState } from 'react';
import SignupModal from '../components/Signup';

interface SignupModalContextType {
  showSignupModal: () => void;
  hideSignupModal: () => void;
}

const SignupModalContext = createContext<SignupModalContextType | undefined>(undefined);

export const useSignupModal = () => {
  const context = useContext(SignupModalContext);
  if (!context) throw new Error("useSignupModal must be used within SignupModalProvider");
  return context;
};

export const SignupModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showSignupModal = () => setIsVisible(true);
  const hideSignupModal = () => setIsVisible(false);

  return (
    <SignupModalContext.Provider value={{ showSignupModal, hideSignupModal }}>
      {children}
      {isVisible && <SignupModal onClose={hideSignupModal} />}
    </SignupModalContext.Provider>
  );
};
