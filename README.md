# AI Shayari Generator

AI Shayari Generator is a web application that uses Next.js and the Google Gemini API to generate beautiful shayari (poetic verses) based on user-selected themes and languages.

## Features

- Generate shayari on various themes like love, friendship, sadness, motivation, etc.
- Support for multiple languages (Hindi, Urdu, English)
- Voice input for theme selection
- Text-to-speech functionality to listen to generated shayari
- Save favorite shayari to local storage
- Copy, download, or share generated shayari
- Responsive design with dark mode support

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for building the application
- [TypeScript](https://www.typescriptlang.org/) - For type-safe code
- [Tailwind CSS](https://tailwindcss.com/) - For styling the application
- [Google Gemini API](https://ai.google.dev/) - For AI-powered shayari generation
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - For voice input and text-to-speech functionality

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/aisayari.git
   cd aisayari
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your Google Gemini API key
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Deployment

This application can be easily deployed on Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add your Google Gemini API key as an environment variable in Vercel
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Google for providing the Gemini API
- Next.js team for the amazing framework
- All contributors and users of this application
