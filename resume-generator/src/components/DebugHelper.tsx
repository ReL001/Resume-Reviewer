import React from 'react';
import { Box, Text, Badge } from '@chakra-ui/react';

interface DebugHelperProps {
  show?: boolean;
  label: string;
  value: any;
}

const DebugHelper: React.FC<DebugHelperProps> = ({ show = true, label, value }) => {
  if (!show || process.env.NODE_ENV === 'production') return null;
  
  return (
    <Box 
      position="fixed" 
      bottom="10px" 
      right="10px" 
      p={2} 
      bg="gray.100" 
      borderRadius="md" 
      zIndex={9999}
      boxShadow="sm"
    >
      <Text fontSize="xs">
        {label}: <Badge colorScheme="blue">{JSON.stringify(value)}</Badge>
      </Text>
    </Box>
  );
};

export default DebugHelper;
