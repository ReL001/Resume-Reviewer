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
} from '@chakra-ui/react';
import { FaCheck } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const PricingCard = ({
  title,
  price,
  features,
  isPopular,
  onSubscribe,
}: {
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  onSubscribe: () => void;
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = isPopular ? 'blue.500' : 'gray.200';

  return (
    <Card
      bg={bgColor}
      borderWidth={isPopular ? '2px' : '1px'}
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
    >
      <CardHeader>
        <VStack spacing={2}>
          <Heading size="md">{title}</Heading>
          <Text fontSize="3xl" fontWeight="bold">
            {price}
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

  const handleSubscribe = (plan: string) => {
    // TODO: Implement subscription logic
    console.log(`Subscribing to ${plan} plan`);
  };

  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={8} textAlign="center">
        <Heading>Simple, Transparent Pricing</Heading>
        <Text fontSize="xl" color="gray.600" maxW="2xl">
          Choose the plan that best fits your needs. All plans include our core features,
          with premium features available for paid users.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mt={12}>
        <PricingCard
          title="Free"
          price="$0"
          features={[
            'Basic resume generation',
            'Basic cover letter generation',
            'Standard templates',
            'PDF download',
            'Email support',
          ]}
          onSubscribe={() => handleSubscribe('free')}
        />

        <PricingCard
          title="Pro"
          price="$19"
          features={[
            'Advanced resume generation',
            'Advanced cover letter generation',
            'All templates',
            'AI-powered optimization',
            'Priority support',
            'Unlimited downloads',
            'Resume analytics',
          ]}
          isPopular
          onSubscribe={() => handleSubscribe('pro')}
        />

        <PricingCard
          title="Enterprise"
          price="$49"
          features={[
            'Everything in Pro',
            'Custom templates',
            'API access',
            'Team collaboration',
            'Dedicated support',
            'Advanced analytics',
            'Custom branding',
          ]}
          onSubscribe={() => handleSubscribe('enterprise')}
        />
      </SimpleGrid>

      <Box mt={12} textAlign="center">
        <Text fontSize="lg" color="gray.600">
          Need a custom plan? Contact us for enterprise solutions.
        </Text>
        <Button mt={4} variant="outline" colorScheme="blue">
          Contact Sales
        </Button>
      </Box>
    </Container>
  );
};

export default Pricing; 