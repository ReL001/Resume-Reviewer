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
    <Container maxW="container.xl" py={10}>
      <Box>
        <Heading mb={4}>Pricing</Heading>
        <Text>Choose the plan that best fits your needs.</Text>
      </Box>
    </Container>
  );
};

export default Pricing; 