import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Webcam from 'react-webcam';
import { ollamaService } from '../services/ollamaService';
import type { ChatMessage } from '../components/ChatDisplay';

const CAPTURE_INTERVAL = 5000; // 5 seconds
const MIN_MESSAGE_DELAY = 2000; // 2 seconds
const MAX_MESSAGE_DELAY = 8000; // 8 seconds

export const useStreamController = (webcamRef: React.RefObject<Webcam>) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const frameProcessingRef = useRef<NodeJS.Timeout | null>(null);

  const generateRandomUsername = () => {
    const adjectives = ['Happy', 'Cool', 'Super', 'Epic', 'Pixel'];
    const nouns = ['Gamer', 'Viewer', 'Fan', 'Watcher', 'Player'];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 1000)}`;
  };

  const addMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      username: generateRandomUsername(),
      message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev.slice(-50), newMessage]); // Keep last 50 messages
  };

  const startStreaming = () => {
    setIsStreaming(true);
  };

  const stopStreaming = () => {
    setIsStreaming(false);
    if (frameProcessingRef.current) {
      clearInterval(frameProcessingRef.current);
    }
  };

  useEffect(() => {
    if (!isStreaming) return;

    const processFrame = async () => {
      if (!webcamRef.current) return;

      try {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        // In a real application, you'd want to process this image
        // For now, we'll just generate a generic comment
        const comment = await ollamaService.generateComment("Person talking to camera");
        
        // Add random delay for more natural feeling
        const delay = Math.random() * (MAX_MESSAGE_DELAY - MIN_MESSAGE_DELAY) + MIN_MESSAGE_DELAY;
        setTimeout(() => addMessage(comment), delay);
      } catch (error) {
        console.error('Error processing frame:', error);
      }
    };

    frameProcessingRef.current = setInterval(processFrame, CAPTURE_INTERVAL);

    return () => {
      if (frameProcessingRef.current) {
        clearInterval(frameProcessingRef.current);
      }
    };
  }, [isStreaming, webcamRef]);

  return {
    messages,
    isStreaming,
    startStreaming,
    stopStreaming
  };
};