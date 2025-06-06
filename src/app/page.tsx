'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// Define theme options
const THEMES = [
  'Love', 'Friendship', 'Sadness', 'Motivation', 
  'Life', 'Nature', 'Happiness', 'Hope',
  'Betrayal', 'Patriotism', 'Spirituality'
];

// Define language options
const LANGUAGES = ['Hindi',  'English'  ];

// Define line count options
const LINE_COUNTS = [2, 4, 6, 8];


export default function Home() {
  // State variables
  const [theme, setTheme] = useState('Love');
  const [language, setLanguage] = useState('Hindi');
  const [customInput, setCustomInput] = useState('');
  const [lineCount, setLineCount] = useState(4);
  const [length, setLength] = useState('Medium');
  const [shayari, setShayari] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    // Initialize speech synthesis
    if (typeof window !== 'undefined') {
      speechSynthesisRef.current = window.speechSynthesis;
      
      // Initialize speech recognition if available
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        speechRecognitionRef.current = new SpeechRecognition();
        speechRecognitionRef.current.continuous = false;
        speechRecognitionRef.current.lang = 'hi-IN'; // Default to Hindi
        
        speechRecognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setTheme(transcript);
        };
        
        speechRecognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Function to generate shayari
  const generateShayari = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          theme, 
          language, 
          customInput, 
          lineCount, 
          length 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShayari(data.shayari);
      } else {
        setError(data.error?.message || data.error || 'Failed to generate shayari');
      }
    } catch (err) {
      setError('An error occurred while generating shayari');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to save shayari to favorites
  const saveToFavorites = () => {
    if (shayari && !favorites.includes(shayari)) {
      setFavorites([...favorites, shayari]);
    }
  };

  // Function to remove shayari from favorites
  const removeFromFavorites = (index: number) => {
    const newFavorites = [...favorites];
    newFavorites.splice(index, 1);
    setFavorites(newFavorites);
  };

  // Function to copy shayari to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shayari);
    alert('Shayari copied to clipboard!');
  };

  // Function to speak the shayari
  const speakShayari = () => {
    if (speechSynthesisRef.current && shayari) {
      speechSynthesisRef.current.cancel(); // Stop any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(shayari);
      
      // Set language based on selected language
      switch (language) {
        case 'Hindi':
          utterance.lang = 'hi-IN';
          break;
        case 'Urdu':
          utterance.lang = 'ur';
          break;
        case 'English':
          utterance.lang = 'en-US';
          break;
        default:
          utterance.lang = 'hi-IN';
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesisRef.current.speak(utterance);
    }
  };

  // Function to stop speaking
  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Function to start voice input
  const startVoiceInput = () => {
    if (speechRecognitionRef.current) {
      // Set language for speech recognition
      switch (language) {
        case 'Hindi':
          speechRecognitionRef.current.lang = 'hi-IN';
          break;
        case 'Urdu':
          speechRecognitionRef.current.lang = 'ur';
          break;
        case 'English':
          speechRecognitionRef.current.lang = 'en-US';
          break;
        default:
          speechRecognitionRef.current.lang = 'hi-IN';
      }
      
      speechRecognitionRef.current.start();
      setIsListening(true);
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  // Function to download shayari as text file
  const downloadShayari = () => {
    const element = document.createElement('a');
    const file = new Blob([shayari], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `shayari_${theme.toLowerCase().replace(' ', '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
      <header className="text-center py-6">
        <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-300">AI Shayari Generator</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Create beautiful shayari with the power of AI</p>
      </header>

      <main className="max-w-4xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Theme
              </label>
              <div className="flex flex-wrap gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-3 py-1 text-sm rounded-full ${theme === t 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center">
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Or type your own theme..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={startVoiceInput}
                  disabled={isListening}
                  className={`p-2 rounded-r-md ${isListening 
                    ? 'bg-red-500 text-white' 
                    : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                  title="Voice input"
                >
                  {isListening ? '🎤 Listening...' : '🎤'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Input (Optional)
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter words, sentences, or facts to include in the shayari..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white h-24"
              />
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Language
              </label>
              <div className="flex gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-4 py-2 rounded-md ${language === lang 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Lines
                </label>
                <div className="flex flex-wrap gap-2">
                  {LINE_COUNTS.map((count) => (
                    <button
                      key={count}
                      onClick={() => setLineCount(count)}
                      className={`px-3 py-1 text-sm rounded-full ${lineCount === count 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <button
              onClick={generateShayari}
              disabled={isGenerating}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md font-medium shadow-md hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-70"
            >
              {isGenerating ? 'Generating...' : 'Generate Shayari'}
            </button>
          </div>

          <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg relative min-h-[200px]">
            {error ? (
              <div className="text-red-500 dark:text-red-400">{error}</div>
            ) : shayari ? (
              <>
                <div className="text-gray-800 dark:text-gray-200 whitespace-pre-line text-lg font-medium">
                  {shayari}
                </div>
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500"
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                  <button
                    onClick={saveToFavorites}
                    className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500"
                    title="Save to favorites"
                  >
                    ❤️
                  </button>
                  <button
                    onClick={downloadShayari}
                    className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500"
                    title="Download as text"
                  >
                    💾
                  </button>
                  <button
                    onClick={isSpeaking ? stopSpeaking : speakShayari}
                    className={`p-2 rounded-full ${isSpeaking 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'}`}
                    title={isSpeaking ? 'Stop speaking' : 'Speak shayari'}
                  >
                    {isSpeaking ? '🔇' : '🔊'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 flex items-center justify-center h-full">
                Generated shayari will appear here
              </div>
            )}
          </div>
        </div>

        {favorites.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Favorites</h2>
            <div className="space-y-4">
              {favorites.map((fav, index) => (
                <div key={index} className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg relative">
                  <div className="text-gray-800 dark:text-gray-200 whitespace-pre-line pr-8">{fav}</div>
                  <button
                    onClick={() => removeFromFavorites(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    title="Remove from favorites"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className={`footer ${theme}`}>© 2025 AI Shayari Generator</footer>
    </div>
  );
}
