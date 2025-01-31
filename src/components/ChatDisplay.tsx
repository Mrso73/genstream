import React from 'react';

export interface ChatMessage {
    id: string;
    username: string;
    message: string;
    timestamp: Date;
}

interface ChatDisplayProps {
    messages: ChatMessage[];
}

const ChatDisplay: React.FC<ChatDisplayProps> = ({ messages }) => {
    const chatRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div 
        ref={chatRef}
        className="absolute right-0 top-0 bottom-0 w-80 bg-black/50 overflow-y-auto"
        style={{ 
            maxHeight: '100%',
            maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent 100%)'
        }}
        >
        <div className="p-4 space-y-2">
            {messages.map((msg) => (
            <div
                key={msg.id}
                className="text-sm animate-slide-in"
            >
                <span className="font-bold text-red-400">{msg.username}</span>
                <span className="text-white ml-2">{msg.message}</span>
            </div>
            ))}
        </div>
        </div>
    );
};

export default ChatDisplay;