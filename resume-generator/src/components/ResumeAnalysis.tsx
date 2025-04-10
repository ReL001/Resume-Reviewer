import {
  Box,
  SimpleGrid,
  Button,
  Text,
  Icon,
  VStack,
  useColorModeValue,
  Badge,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import {
  FiCheckCircle,
  FiFileText,
  FiSearch,
  FiTarget,
  FiEdit2,
  FiMail,
  FiLock,
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

interface AnalysisOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  isPremium: boolean;
  onClick: () => void;
}

interface ResumeAnalysisProps {
  onAnalysisSelect: (optionId: string) => void;
  isAnalyzing: boolean;
}

const ResumeAnalysis: React.FC<ResumeAnalysisProps> = ({ onAnalysisSelect, isAnalyzing }) => {
  const { user } = useAuth();
  const { isOpen: isPremiumModalOpen, onOpen: openPremiumModal, onClose: closePremiumModal } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const analysisOptions: AnalysisOption[] = [
    {
      id: 'ai-check',
      title: 'AI Resume Check',
      description: 'Get detailed feedback on your resume from our AI',
      icon: FiCheckCircle,
      isPremium: false,
      onClick: () => onAnalysisSelect('ai-check'),
    },
    {
      id: 'report',
      title: 'Detailed Report',
      description: 'Receive a comprehensive analysis of your resume',
      icon: FiFileText,
      isPremium: true,
      onClick: () => onAnalysisSelect('report'),
    },
    {
      id: 'ats-check',
      title: 'ATS Check',
      description: 'Check how well your resume performs in ATS systems',
      icon: FiSearch,
      isPremium: false,
      onClick: () => onAnalysisSelect('ats-check'),
    },
    {
      id: 'ats-score',
      title: 'ATS Score Improvement',
      description: 'Get specific suggestions to improve your ATS score',
      icon: FiTarget,
      isPremium: true,
      onClick: () => onAnalysisSelect('ats-score'),
    },
    {
      id: 'job-match',
      title: 'Job Description Match',
      description: 'Optimize your resume for specific job descriptions',
      icon: FiEdit2,
      isPremium: true,
      onClick: () => onAnalysisSelect('job-match'),
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter Generation',
      description: 'Generate a matching cover letter for your resume',
      icon: FiMail,
      isPremium: true,
      onClick: () => onAnalysisSelect('cover-letter'),
    },
  ];

  const handleOptionClick = (option: AnalysisOption) => {
    if (option.isPremium && !user) {
      openPremiumModal();
      return;
    }
    option.onClick();
  };

  return (
    <Box p={6} bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg">
      <VStack spacing={6} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          Resume Analysis Options
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {analysisOptions.map((option) => (
            <Tooltip
              key={option.id}
              label={option.isPremium ? 'Premium Feature' : ''}
              placement="top"
              isDisabled={!option.isPremium}
            >
              <Box
                p={4}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="md"
                cursor="pointer"
                _hover={{ shadow: 'md' }}
                onClick={() => !isAnalyzing && handleOptionClick(option)}
                opacity={isAnalyzing ? 0.7 : 1}
                transition="all 0.2s"
                position="relative"
              >
                <VStack spacing={3} align="start" position="relative">
                  {isAnalyzing && option.id === 'ai-check' && (
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg="rgba(255, 255, 255, 0.8)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="md"
                      zIndex={2}
                    >
                      <Spinner size="xl" color="blue.500" />
                    </Box>
                  )}
                  <Box display="flex" alignItems="center" justifyContent="space-between" w="100%">
                    <Icon as={option.icon} boxSize={6} color="blue.500" />
                    {option.isPremium && (
                      <Badge colorScheme="purple">Premium</Badge>
                    )}
                  </Box>
                  <Text fontWeight="semibold">{option.title}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {option.description}
                  </Text>
                  {option.isPremium && !user && (
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg="rgba(0, 0, 0, 0.1)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="md"
                    >
                      <Icon as={FiLock} boxSize={6} color="gray.500" />
                    </Box>
                  )}
                </VStack>
              </Box>
            </Tooltip>
          ))}
        </SimpleGrid>
      </VStack>

      <Modal isOpen={isPremiumModalOpen} onClose={closePremiumModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Premium Feature</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Upgrade to premium to access this feature!</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' onClick={() => {
              window.location.href = '/pricing';
              closePremiumModal();
            }}>
              Upgrade Now
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ResumeAnalysis;