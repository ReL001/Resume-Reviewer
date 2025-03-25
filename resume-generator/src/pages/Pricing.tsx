import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FaCheck } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { plans } from '../services/stripeService';
import AuthModal from '../components/Auth/AuthModal';
import { useState } from 'react';

interface PricingCardProps {
  title: string;
  price: string | number;
  features: string[];
  isPopular?: boolean;
  onSubscribe: () => void;
}

const PricingCard = ({
  title,
  price,
  features,
  isPopular,
  onSubscribe,
}: PricingCardProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = isPopular ? 'blue.500' : 'gray.200';

  return (
    <Card
      bg={bgColor}
      borderWidth={isPopular ? '2px' : '1px'}
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      boxShadow={isPopular ? 'md' : 'sm'}
      transform={isPopular ? 'scale(1.05)' : 'scale(1)'}
      transition="all 0.2s"
      _hover={{ transform: isPopular ? 'scale(1.08)' : 'scale(1.03)' }}
    >
      <CardHeader>
        <VStack spacing={2}>
          <Heading size="md">{title}</Heading>
          <Text fontSize="3xl" fontWeight="bold">
            ${price}
            <Text as="span" fontSize="md" color="gray.500">
              /month
            </Text>
          </Text>
          {isPopular && (
            <Text
              bg="blue.500"
              color="white"
              px={2}
              py={1}
              borderRadius="full"
              fontSize="sm"
            >
              Most Popular
            </Text>
          )}
        </VStack>
      </CardHeader>
      <CardBody>
        <List spacing={3}>
          {features.map((feature, index) => (
            <ListItem key={index}>
              <ListIcon as={FaCheck} color="green.500" />
              {feature}
            </ListItem>
          ))}
        </List>
      </CardBody>
      <CardFooter>
        <Button
          colorScheme={isPopular ? 'blue' : 'gray'}
          width="full"
          onClick={onSubscribe}
        >
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
};

const Pricing = () => {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [selectedPlan, setSelectedPlan] = useState('');

  const handleSubscribe = (plan: string) => {
    setSelectedPlan(plan);
    
    if (!user) {
      onOpen();
      return;
    }
    
    // Implement subscription logic here
    toast({
      title: `Subscription to ${plan} plan initiated`,
      description: "This is a demo. In a real app, you would be redirected to Stripe.",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} mb={16}>
        <Heading size="xl">Choose Your Plan</Heading>
        <Text fontSize="lg" textAlign="center" maxW="container.md">
          Get the right features for your career advancement needs.
          All plans include basic resume analysis and ATS compatibility checks.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 10, md: 5 }} mb={20}>
        <PricingCard
          title="Free"
          price="0"
          features={plans[0].features}
          onSubscribe={() => handleSubscribe("Free")}
        />
        <PricingCard
          title="Pro"
          price="19"
          features={plans[1].features}
          isPopular={true}
          onSubscribe={() => handleSubscribe("Pro")}
        />
        <PricingCard
          title="Enterprise"
          price="49"
          features={plans[2].features}
          onSubscribe={() => handleSubscribe("Enterprise")}
        />
      </SimpleGrid>

      <Box textAlign="center" py={8} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
        <Heading size="md" mb={4}>Need a custom plan for your organization?</Heading>
        <Text mb={4}>Contact us for volume discounts and custom features</Text>
        <Button variant="outline" colorScheme="blue" onClick={() => window.location.href = 'mailto:contact@resumegenerator.com'}>
          Contact Sales
        </Button>
      </Box>

      <AuthModal 
        isOpen={isOpen} 
        onClose={onClose} 
        redirectPath="/pricing" 
      />
    </Container>
  );
};

export default Pricing;