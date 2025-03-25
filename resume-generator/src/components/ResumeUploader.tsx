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
import * as pdfjs from 'pdfjs-dist';

// Set the PDF.js workerSrc
const pdfjsVersion = '3.4.120'; // Use the version that matches your installed package
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

interface ResumeUploaderProps {
  onUploadComplete: (file: File, extractedText: string) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const { user } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const extractTextFromPdf = async (pdfFile: File): Promise<string> => {
    setProcessing(true);
    try {
      // Convert file to ArrayBuffer
      const arrayBuffer = await pdfFile.arrayBuffer();
      
      // Load PDF document
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n';
        
        // Update progress for visual feedback
        setProgress(Math.floor((i / pdf.numPages) * 100));
      }
      
      return fullText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF file');
    } finally {
      setProcessing(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: 'File too large',
          description: 'Please upload a file smaller than 10MB',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      try {
        setUploading(true);
        setProgress(0);
        setFile(selectedFile);
        
        // Process the PDF and extract text
        toast({
          title: 'Processing PDF',
          description: 'Extracting text from your resume...',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        
        const extractedText = await extractTextFromPdf(selectedFile);
        
        if (extractedText.trim().length === 0) {
          toast({
            title: 'Text extraction failed',
            description: 'Could not extract text from your PDF. It may be image-based or scanned.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
          return;
        }
        
        onUploadComplete(selectedFile, extractedText);
        
        toast({
          title: 'Resume processed successfully',
          description: 'Your resume is ready for analysis',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('File processing error:', error);
        toast({
          title: 'Processing failed',
          description: 'There was an error processing your PDF file',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setUploading(false);
        setProgress(0);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
            variant={file ? 'solid' : 'outline'}
            cursor="pointer"
            isLoading={uploading}
            loadingText="Processing"
            _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
            transition="all 0.2s"
            isDisabled={uploading || processing}
          >
            {file ? 'Resume Selected' : 'Select Resume (PDF)'}
          </Button>
        </label>

        {(uploading || processing) && (
          <Box w="100%">
            <Progress value={progress} colorScheme="blue" />
            <Text fontSize="sm" mt={2} textAlign="center">
              {processing ? `Extracting text... ${progress}%` : `Processing... ${progress}%`}
            </Text>
          </Box>
        )}

        {file && !uploading && !processing && (
          <Box 
            w="100%" 
            p={4} 
            bg={useColorModeValue('gray.50', 'gray.700')} 
            borderRadius="md"
            transition="all 0.2s"
            _hover={{ shadow: 'md' }}
          >
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
      </VStack>
    </Box>
  );
};

export default ResumeUploader;