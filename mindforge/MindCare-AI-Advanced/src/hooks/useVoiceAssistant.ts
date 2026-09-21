import { useState, useCallback, useRef } from 'react';

export interface VoiceCommand {
  patterns: string[];
  action: () => void;
  response: string;
}

export function useVoiceAssistant(commands: VoiceCommand[]) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'en-IN';
      utt.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utt);
    }
    setResponse(text);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as typeof window & { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition || (window as typeof window & { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    recognitionRef.current = rec;

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);

    rec.onresult = (e: SpeechRecognitionEvent) => {
      const heard = Array.from(e.results[0]).map(r => r.transcript.toLowerCase()).join(' ');
      setTranscript(heard);
      let matched = false;
      for (const cmd of commands) {
        if (cmd.patterns.some(p => heard.includes(p.toLowerCase()))) {
          cmd.action();
          speak(cmd.response);
          matched = true;
          break;
        }
      }
      if (!matched) {
        speak('I did not understand that. Please try again.');
      }
    };

    rec.start();
  }, [commands, speak]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { listening, transcript, response, supported, startListening, stopListening, speak };
}
