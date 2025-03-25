import {
  Box,
  Button,
  VStack,
  Text,
  useToast,
  Progress,
  Icon,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

interface ResumeUploaderProps {
  onUploadComplete: (file: File) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const { user } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF file',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      setFile(selectedFile);
      onUploadComplete(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }

      // TODO: Implement actual file upload to Firebase Storage
      // const storageRef = ref(storage, `resumes/${user?.uid}/${file.name}`);
      // await uploadBytes(storageRef, file);

      toast({
        title: 'Upload successful',
        description: 'Your resume has been uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your resume',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Box
      p={6}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      w="100%"
    >
      <VStack spacing={4}>
        <Input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          ref={fileInputRef}
          display="none"
          id="resume-upload"
        />
        <label htmlFor="resume-upload">
          <Button
            as="span"
            leftIcon={<Icon as={FiUpload} />}
            colorScheme="blue"
            variant="outline"
            cursor="pointer"
          >
            Select Resume
          </Button>
        </label>

        {file && (
          <Box w="100%" p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Icon as={FiFile} mr={2} />
                <Text noOfLines={1}>{file.name}</Text>
              </Box>
              <Button
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={handleRemoveFile}
              >
                <Icon as={FiX} />
              </Button>
            </Box>
            <Text fontSize="sm" color="gray.500" mt={2}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </Text>
          </Box>
        )}

        {uploading && (
          <Box w="100%">
            <Progress value={progress} colorScheme="blue" />
            <Text fontSize="sm" mt={2} textAlign="center">
              Uploading... {progress}%
            </Text>
          </Box>
        )}

        {file && !uploading && (
          <Button
            colorScheme="blue"
            onClick={handleUpload}
            isLoading={uploading}
          >
            Upload Resume
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default ResumeUploader; 