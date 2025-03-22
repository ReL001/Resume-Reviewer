import { Box, Container, Heading, Text } from '@chakra-ui/react';

const Dashboard = () => {
  return (
    <Container maxW="container.xl" py={10}>
      <Box>
        <Heading mb={4}>Dashboard</Heading>
        <Text>Welcome to your dashboard! Your documents will appear here.</Text>
      </Box>
    </Container>
  );
};

export default Dashboard; 