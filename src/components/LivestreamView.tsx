import React, { useState } from 'react';
import Webcam from 'react-webcam';
import ChatDisplay, { ChatMessage } from './ChatDisplay';

const LivestreamView = () => {
  const webcamRef = React.useRef<Webcam>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  // Add some test messages
  React.useEffect(() => {
    const testMessages: ChatMessage[] = [];
    setMessages(testMessages);
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <Webcam
          ref={webcamRef}
          audio={false}
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover"
        />
        <ChatDisplay messages={messages} />
      </div>
    </div>
  );
};

export default LivestreamView;