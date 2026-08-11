import React from 'react';
import { useParams } from 'react-router-dom';
import { ChatWindow } from '../components/chat/ChatWindow';

export const MessagesPage: React.FC = () => {
  const { conversationId } = useParams();

  return (
    <div className="w-full max-w-5xl mx-auto px-2">
      <ChatWindow conversationId={conversationId} />
    </div>
  );
};
