// LoginModalContext.tsx
import React, { createContext, useContext, useState } from 'react';
import LoginModal from '../components/Login';

interface LoginModalContextType {
  showLoginModal: () => void;
  hideLoginModal: () => void;
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export const useLoginModal = () => {
  const context = useContext(LoginModalContext);
  if (!context) throw new Error("useLoginModal must be used within LoginModalProvider");
  return context;
};

export const LoginModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showLoginModal = () => setIsVisible(true);
  const hideLoginModal = () => setIsVisible(false);

  return (
    <LoginModalContext.Provider value={{ showLoginModal, hideLoginModal }}>
      {children}
      {isVisible && <LoginModal onClose={hideLoginModal} />}
    </LoginModalContext.Provider>
  );
};
