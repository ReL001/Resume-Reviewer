# AI-Powered Resume & Cover Letter Generator

A full-stack web application that uses AI to generate professional resumes and cover letters. Built with React, TypeScript, and modern web technologies.

## Features

- 🤖 AI-powered resume and cover letter generation
- 📝 Multiple resume templates
- ✉️ Customizable cover letters
- 🔒 User authentication with Firebase
- 💳 Subscription management with Stripe
- 📱 Responsive design
- 🎨 Modern UI with Chakra UI

## Tech Stack

- Frontend:
  - React.js
  - TypeScript
  - Chakra UI
  - React Router
  - Stripe.js

- Backend:
  - Firebase (Authentication & Firestore)
  - OpenAI API (GPT-4)
  - Gorq API
  - Stripe API

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- OpenAI API key
- Gorq API key
- Stripe account

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/resume-generator.git
   cd resume-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id

   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_GORQ_API_KEY=your_gorq_api_key

   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API and service functions
├── contexts/      # React contexts
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── assets/        # Static assets
└── types/         # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the GPT-4 API
- Firebase for authentication and database services
- Stripe for payment processing
- Chakra UI for the component library 