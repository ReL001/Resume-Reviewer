import axios from 'axios';

/**
 * Service for resume analysis and processing
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface ResumeAnalysisRequest {
  analysisType: 'ai-check' | 'report' | 'ats-check' | 'ats-score' | 'job-match' | 'cover-letter';
  file: File;
}

export interface ResumeAnalysisResponse {
  success: boolean;
  analysis: string;
  extractedText: string;
}

/**
 * Analyzes a resume using the backend API
 * 
 * @param params Analysis parameters including file and analysis type
 * @returns Analysis results
 */
export const analyzeResume = async (params: ResumeAnalysisRequest): Promise<ResumeAnalysisResponse> => {
  try {
    const formData = new FormData();
    formData.append('resume', params.file);
    formData.append('analysisType', params.analysisType);

    const response = await axios.post(`${API_URL}/analyze-resume`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Error analyzing resume');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

/**
 * Formats the analysis results based on the analysis type
 * 
 * @param analysis Raw analysis text from the API
 * @param analysisType Type of analysis performed
 * @returns Formatted analysis object
 */
export const formatAnalysisResults = (analysis: string, analysisType: string) => {
  // Extract score (between 0-100)
  const scoreRegex = /(\d{1,3})\/100/;
  const scoreMatch = analysis.match(scoreRegex);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 70;

  // Extract strengths and improvements
  let strengths: string[] = [];
  let improvements: string[] = [];

  if (analysisType === 'ai-check' || analysisType === 'ats-check') {
    // Try to find sections with strengths and improvements
    const strengthsSection = analysis.match(/(?:Strengths|Positives|Pros|Strong points):([\s\S]*?)(?=(?:Areas|Weaknesses|Improvements|Cons|To improve):)/i);
    const improvementsSection = analysis.match(/(?:Areas|Weaknesses|Improvements|Cons|To improve):([\s\S]*?)(?=(?:Recommendations|Suggestions|Next steps|Overall|Score):|\n\n|$)/i);
    
    if (strengthsSection) {
      strengths = strengthsSection[1]
        .split(/[-•*]\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }
    
    if (improvementsSection) {
      improvements = improvementsSection[1]
        .split(/[-•*]\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }
  }

  // If we couldn't extract properly, use fallbacks
  if (strengths.length === 0) {
    strengths = [
      'Clear professional experience section',
      'Good use of action verbs',
      'Appropriate resume length'
    ];
  }
  
  if (improvements.length === 0) {
    improvements = [
      'Add more quantifiable achievements',
      'Improve formatting consistency',
      'Include more keywords from job descriptions'
    ];
  }

  return {
    score,
    feedback: {
      strengths,
      improvements
    },
    rawAnalysis: analysis
  };
};

// Add new function to generate an ATS-optimized resume from user data
export const generateATSResume = async (resumeData: any) => {
  try {
    console.log("Generating ATS resume with data:", resumeData);
    
    // Call the backend API to generate the resume
    const response = await axios.post(`${API_URL}/generate-resume`, resumeData);
    
    if (response.data && response.data.success) {
      return response.data.resumeText;
    } else {
      // Fallback in case the API response structure is unexpected
      return formatResumeText(resumeData);
    }
  } catch (error) {
    console.error("Error generating ATS resume:", error);
    // If API call fails, use the local formatter as a fallback
    return formatResumeText(resumeData);
  }
};

// Helper function to format resume data into a text resume
function formatResumeText(data: any) {
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
    resumeText += `${summary}\n\n`;
  }
  
  // Experience
  if (experience.length > 0) {
    resumeText += 'PROFESSIONAL EXPERIENCE\n';
    experience.forEach((exp: any) => {
      resumeText += `${exp.company}, ${exp.location}\n`;
      resumeText += `${exp.position}\n`;
      resumeText += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
      
      // Format the description - if it contains bullet points, preserve them
      const description = exp.description.split('\n').map((line: string) => {
        // If line starts with dash, add spacing for bullet point
        if (line.trim().startsWith('-')) {
          return `  ${line.trim()}`;
        }
        return line;
      }).join('\n');
      
      resumeText += `${description}\n\n`;
    });
  }
  
  // Education
  if (education.length > 0) {
    resumeText += 'EDUCATION\n';
    education.forEach((edu: any) => {
      resumeText += `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}\n`;
      resumeText += `${edu.institution}\n`;
      resumeText += `${edu.startDate} - ${edu.endDate}\n`;
      
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
  if (skills.length > 0) {
    resumeText += 'SKILLS\n';
    const skillsList = skills.map((skill: any) => {
      return skill.level ? `${skill.name} (${skill.level})` : skill.name;
    }).join(', ');
    
    resumeText += `${skillsList}\n\n`;
  }
  
  // Projects
  if (projects.length > 0) {
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
