import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fsPromises from 'fs/promises'; // Renamed to avoid conflict
import fs from 'fs'; // Import the synchronous fs module
import { Groq } from 'groq-sdk';
import { PDFExtract } from 'pdf.js-extract';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Create uploads directory if it doesn't exist
const ensureUploadsDirectory = async () => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  try {
    await fsPromises.mkdir(uploadsDir, { recursive: true }); // Use fsPromises here
    console.log('Uploads directory created or confirmed');
  } catch (error) {
    console.error('Error creating uploads directory:', error);
  }
};

ensureUploadsDirectory();

// Initialize Groq client
const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('GROQ_API_KEY is not defined in environment variables');
    throw new Error('GROQ API key is missing');
  }
  return new Groq({ apiKey });
};

// Initialize PDF extractor
const pdfExtract = new PDFExtract();

// Extract text from PDF
async function extractTextFromPdf(filePath: string): Promise<string> {
  try {
    const data = await pdfExtract.extract(filePath);
    let text = '';
    
    // Concatenate text from all pages
    for (const page of data.pages) {
      for (const item of page.content) {
        text += item.str + ' ';
      }
      text += '\n\n';
    }
    
    return text.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Error handling middleware
const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  console.error('API Error:', err);
  
  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds the 10MB limit' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  
  // Generic error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  return res.status(statusCode).json({ error: message });
};

// API endpoints
app.post('/api/analyze-resume', upload.single('resume'), async (req, res, next) => {
  try {
    console.log('Received analyze-resume request:', {
      hasFile: !!req.file,
      body: req.body,
      contentType: req.headers['content-type']
    });
    
    const analysisType = req.body.analysisType || req.body.type || 'ai-check';
    let extractedText = '';
    let resumeDataForAnalysis: any = null;

    console.log(`Processing resume analysis request of type: ${analysisType}`);

    if (req.file) {
      // Handle file upload case
      const filePath = req.file.path;
      console.log(`File uploaded: ${filePath}`);
      extractedText = await extractTextFromPdf(filePath);
      await fsPromises.unlink(filePath); // Use fsPromises here

      if (!extractedText || extractedText.trim().length === 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Could not extract text from the uploaded PDF. It may be image-based or scanned.' 
        });
      }
      resumeDataForAnalysis = extractedText; // Use extracted text for analysis
    } else if (req.body.resumeData) {
      // Handle JSON data case (no file upload)
      console.log('Processing JSON resume data', typeof req.body.resumeData);
      // Make sure resumeDataForAnalysis is a string for proper prompt formatting
      resumeDataForAnalysis = typeof req.body.resumeData === 'string' 
        ? req.body.resumeData 
        : JSON.stringify(req.body.resumeData, null, 2);
    } else {
      return res.status(400).json({ 
        success: false,
        error: 'No resume file uploaded or resume data provided in the request body' 
      });
    }

    // Choose prompt based on analysis type
    let prompt = '';
    let systemPrompt = "You are a professional resume analyst specialized in helping job seekers improve their resumes.";
    let responseFormat = { type: "text" }; // Default response format

    switch (analysisType) {
      case 'ai-check':
        systemPrompt = "You are an expert resume reviewer. Your task is to provide detailed feedback on a resume including strengths, weaknesses, specific recommendations, formatting feedback, and an overall assessment. Score the resume out of 100. Format your response as a properly structured JSON object.";
        prompt = `
Please analyze this resume and provide comprehensive feedback.

Resume data:
${resumeDataForAnalysis}

Format your response as a JSON object with the following structure:
{
  "score": <number 0-100>,
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", ...],
  "formattingFeedback": "<feedback on resume formatting and structure>",
  "overallAssessment": "<overall assessment paragraph>"
}
`;
        responseFormat = { type: "json_object" };
        break;
      // ... other cases remain unchanged ...
    }

    console.log('Sending request to Groq API...');
    console.log('System prompt:', systemPrompt);
    console.log('User prompt (excerpt):', prompt.substring(0, 100) + '...');
    
    try {
      // Send to Groq API
      const groqClient = getGroqClient();
      const completion = await groqClient.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: analysisType === 'ai-check' ? 0.2 : 0.7, // Lower temp for JSON output
        response_format: responseFormat,
      });

      console.log('Received response from Groq API');
      
      let analysisResult = completion.choices[0].message.content;
      console.log('Raw response:', typeof analysisResult, analysisResult ? analysisResult.substring(0, 100) + '...' : 'empty');

      // Handle JSON formatting for ai-check specifically
      if (analysisType === 'ai-check') {
        try {
          // If it's already a string, parse it to object
          let analysisObject: Record<string, any> = {};
          
          if (typeof analysisResult === 'string') {
            analysisObject = JSON.parse(analysisResult);
          } else {
            analysisObject = analysisResult as Record<string, any>;
          }
          
          // Validate the required fields exist
          const requiredFields = ['score', 'strengths', 'weaknesses', 'recommendations'];
          const missingFields = requiredFields.filter(field => !analysisObject[field]);
          
          if (missingFields.length > 0) {
            console.warn(`Response missing required fields: ${missingFields.join(', ')}`);
            
            // Add default values for missing fields
            missingFields.forEach(field => {
              if (field === 'score') {
                analysisObject['score'] = 70; // Default score
              } else {
                analysisObject[field] = [`No ${field} provided in analysis`];
              }
            });
          }
          
          // Return the analysis with any fixes applied
          console.log('Sending validated analysis response');
          return res.json({
            success: true,
            analysis: analysisObject,
            extractedText: extractedText
          });
        } catch (parseError: unknown) {
          const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parsing error';
          console.error('Failed to parse or validate LLM response:', errorMessage);
          
          if (typeof analysisResult === 'string') {
            console.error('Raw response causing error:', analysisResult.substring(0, 200) + '...');
          }
          
          // Return a fallback error response
          return res.status(500).json({
            success: false,
            error: 'Failed to parse AI analysis response',
            details: errorMessage
          });
        }
      }

      // For other types, return the raw analysis
      return res.json({
        success: true,
        analysis: analysisResult,
        extractedText: extractedText
      });
    } catch (apiError: unknown) {
      const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown API error';
      console.error('Groq API error:', errorMessage);
      
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to get analysis from AI service', 
        details: errorMessage
      });
    }
  } catch (error: any) {
    console.error('General error in analyze-resume:', error);
    next(error); // Pass error to the generic error handler
  }
});

app.post('/api/generate-resume', bodyParser.json(), async (req, res, next) => {
  try {
    const resumeData = req.body;
    
    if (!resumeData || !resumeData.contactInfo) {
      return res.status(400).json({ error: 'Invalid resume data provided' });
    }

    console.log('Generating ATS resume from data');
    
    // Build prompt for the AI
    let prompt = `Generate an ATS-optimized resume using the following information:\n\n`;
    prompt += `Contact Information:\nName: ${resumeData.contactInfo.name}\n`;
    prompt += `Email: ${resumeData.contactInfo.email}\n`;
    prompt += `Phone: ${resumeData.contactInfo.phone}\n`;
    prompt += `Location: ${resumeData.contactInfo.location}\n`;
    
    if (resumeData.contactInfo.linkedin) {
      prompt += `LinkedIn: ${resumeData.contactInfo.linkedin}\n`;
    }
    
    if (resumeData.contactInfo.website) {
      prompt += `Website: ${resumeData.contactInfo.website}\n`;
    }
    
    // Professional Summary
    if (resumeData.summary) {
      prompt += `\nProfessional Summary:\n${resumeData.summary}\n`;
    }
    
    // Work Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      prompt += `\nWork Experience:\n`;
      resumeData.experience.forEach((exp: any, i: number) => {
        prompt += `${i+1}. ${exp.company}, ${exp.position}\n`;
        prompt += `   ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
        prompt += `   Description: ${exp.description}\n\n`;
      });
    }
    
    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      prompt += `\nEducation:\n`;
      resumeData.education.forEach((edu: any, i: number) => {
        prompt += `${i+1}. ${edu.institution}, ${edu.degree} in ${edu.field}\n`;
        prompt += `   ${edu.startDate} - ${edu.endDate}\n`;
        if (edu.gpa) prompt += `   GPA: ${edu.gpa}\n`;
        if (edu.achievements) prompt += `   Achievements: ${edu.achievements}\n\n`;
      });
    }
    
    // Skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      prompt += `\nSkills:\n`;
      prompt += resumeData.skills.map((skill: any) => skill.name).join(', ') + '\n';
    }
    
    // Projects
    if (resumeData.projects && resumeData.projects.length > 0) {
      prompt += `\nProjects:\n`;
      resumeData.projects.forEach((proj: any, i: number) => {
        prompt += `${i+1}. ${proj.name}\n`;
        prompt += `   Description: ${proj.description}\n`;
        prompt += `   Technologies: ${proj.technologies}\n`;
        if (proj.url) prompt += `   URL: ${proj.url}\n\n`;
      });
    }
    
    prompt += `\nPlease format the resume professionally, making it ATS-friendly. Focus on using industry-relevant keywords, quantify achievements where possible, and create clear sections. The output should be plain text formatted as a professional resume.`;

    try {
      // Use Groq API to generate the resume
      const groqClient = getGroqClient();
      const completion = await groqClient.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are a professional resume writer specializing in ATS-optimized resumes. Your task is to create a polished, professional resume from the provided information that will pass through Applicant Tracking Systems."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      console.log('Received resume from Groq API');
      
      // Return the generated resume
      return res.json({
        success: true,
        resumeText: completion.choices[0].message.content
      });
    } catch (apiError) {
      console.error('Groq API error:', apiError);
      
      // Return a fallback response for demo purposes
      return res.json({
        success: true,
        resumeText: generateFallbackResume(resumeData)
      });
    }
  } catch (error) {
    next(error);
  }
});

// Helper function to generate a simple fallback resume when API fails
function generateFallbackResume(data: any) {
  const { contactInfo, summary, education, experience, skills, projects } = data;
  
  let resumeText = `${contactInfo.name}\n`;
  resumeText += `${contactInfo.email} | ${contactInfo.phone} | ${contactInfo.location}\n`;
  
  if (contactInfo.linkedin) {
    resumeText += `LinkedIn: ${contactInfo.linkedin}\n`;
  }
  
  if (contactInfo.website) {
    resumeText += `Website: ${contactInfo.website}\n`;
  }
  
  resumeText += '\n';
  
  // Summary
  if (summary) {
    resumeText += 'PROFESSIONAL SUMMARY\n';
    resumeText += `${summary}\n\n`;  // Fixed the missing closing quote
  }
  
  // Experience
  if (experience && experience.length > 0) {
    resumeText += 'PROFESSIONAL EXPERIENCE\n';
    experience.forEach((exp: any) => {
      resumeText += `${exp.position} | ${exp.company}, ${exp.location}\n`;
      resumeText += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
      resumeText += `${exp.description}\n\n`;
    });
  }
  
  // Education
  if (education && education.length > 0) {
    resumeText += 'EDUCATION\n';
    education.forEach((edu: any) => {
      resumeText += `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}\n`;
      resumeText += `${edu.institution} | ${edu.startDate} - ${edu.endDate}\n`;
      
      if (edu.gpa) {
        resumeText += `GPA: ${edu.gpa}\n`;
      }
      
      if (edu.achievements) {
        resumeText += `${edu.achievements}\n`;
      }
      
      resumeText += '\n';
    });
  }
  
  // Skills
  if (skills && skills.length > 0) {
    resumeText += 'SKILLS\n';
    const skillsList = skills.map((skill: any) => {
      return skill.level ? `${skill.name} (${skill.level})` : skill.name;
    }).join(', ');
    
    resumeText += `${skillsList}\n\n`;
  }
  
  // Projects
  if (projects && projects.length > 0) {
    resumeText += 'PROJECTS\n';
    projects.forEach((proj: any) => {
      resumeText += `${proj.name}\n`;
      resumeText += `${proj.description}\n`;
      resumeText += `Technologies: ${proj.technologies}\n`;
      
      if (proj.url) {
        resumeText += `URL: ${proj.url}\n`;
      }
      
      resumeText += '\n';
    });
  }
  
  return resumeText;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Resume analysis service is running' });
});

// Use the error handling middleware
app.use(errorHandler);

// Update the server startup logic to try alternative ports
const startServer = async (initialPort: number = 5000, maxAttempts: number = 5) => {
  let currentPort = initialPort;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const server = app.listen(currentPort, () => {
        console.log(`Server running on port ${currentPort}`);
      });

      server.on('listening', () => {
        // Save the successful port to a file that the frontend can read
        try {
          fs.writeFileSync('./.port', currentPort.toString()); // Use imported fs here
          console.log(`Port ${currentPort} saved to ./.port`);
        } catch (writeError) {
          console.error('Error writing port file:', writeError);
        }
      });
      
      return; // Successfully started
    } catch (error: any) {
      if (error.code === 'EADDRINUSE') {
        console.log(`Port ${currentPort} is already in use, trying port ${currentPort + 1}...`);
        currentPort++;
        attempts++;
      } else {
        console.error('Error starting server:', error);
        throw error; // Rethrow if it's not a port conflict
      }
    }
  }
  
  console.error(`Could not find an available port after ${maxAttempts} attempts`);
  process.exit(1);
};

// Replace your current app.listen call with this
startServer();

export default app;
