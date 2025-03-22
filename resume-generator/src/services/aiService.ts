import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

interface ResumeData {
  jobTitle: string;
  experience: string;
  skills: string;
  education: string;
  additionalDetails: string;
  template: string;
}

interface CoverLetterData {
  companyName: string;
  position: string;
  jobDescription: string;
  experience: string;
  skills: string;
  additionalNotes: string;
}

export const generateResume = async (
  data: ResumeData,
  isPremium: boolean = false
): Promise<string> => {
  try {
    if (isPremium) {
      // Use OpenAI GPT-4 for premium users
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a professional resume writer. Create a well-structured, ATS-friendly resume based on the provided information."
          },
          {
            role: "user",
            content: `Create a professional resume for a ${data.jobTitle} position with the following details:
              Experience: ${data.experience}
              Skills: ${data.skills}
              Education: ${data.education}
              Additional Details: ${data.additionalDetails}
              Template Style: ${data.template}`
          }
        ],
        temperature: 0.7,
      });

      return completion.choices[0].message.content || '';
    } else {
      // Use Gorq API for free users
      const response = await fetch('https://api.gorq.com/v1/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GORQ_API_KEY}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate resume with Gorq API');
      }

      const result = await response.json();
      return result.content;
    }
  } catch (error) {
    console.error('Error generating resume:', error);
    throw error;
  }
};

export const generateCoverLetter = async (
  data: CoverLetterData,
  isPremium: boolean = false
): Promise<string> => {
  try {
    if (isPremium) {
      // Use OpenAI GPT-4 for premium users
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a professional cover letter writer. Create a compelling, personalized cover letter based on the provided information."
          },
          {
            role: "user",
            content: `Create a professional cover letter for ${data.position} at ${data.companyName} with the following details:
              Job Description: ${data.jobDescription}
              Experience: ${data.experience}
              Skills: ${data.skills}
              Additional Notes: ${data.additionalNotes}`
          }
        ],
        temperature: 0.7,
      });

      return completion.choices[0].message.content || '';
    } else {
      // Use Gorq API for free users
      const response = await fetch('https://api.gorq.com/v1/cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GORQ_API_KEY}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate cover letter with Gorq API');
      }

      const result = await response.json();
      return result.content;
    }
  } catch (error) {
    console.error('Error generating cover letter:', error);
    throw error;
  }
};

export const optimizeResume = async (resume: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a professional resume optimizer. Analyze the resume and provide suggestions for improvement while maintaining the original content structure."
        },
        {
          role: "user",
          content: `Optimize this resume for better ATS compatibility and impact:
            ${resume}`
        }
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error optimizing resume:', error);
    throw error;
  }
}; 