import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  redirectPath?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialTab = 'login',
  redirectPath
}) => {
  const [tabIndex, setTabIndex] = useState(initialTab === 'login' ? 0 : 1);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          {tabIndex === 0 ? 'Sign In' : 'Create Account'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs index={tabIndex} onChange={handleTabChange} isFitted variant="soft-rounded">
            <TabList mb={3}>
              <Tab>Sign In</Tab>
              <Tab>Register</Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0}>
                <LoginForm 
                  onToggleForm={() => setTabIndex(1)} 
                  redirectPath={redirectPath} 
                />
              </TabPanel>
              <TabPanel px={0}>
                <RegisterForm 
                  onToggleForm={() => setTabIndex(0)} 
                  redirectPath={redirectPath} 
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
