import React, { useState } from 'react';
import { Send, Star, Trash2, Eye, MessageSquare } from 'react-feather';

const ChatPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'assistant' },
    { id: 2, text: 'I have a question about photosynthesis.', sender: 'user' },
  ]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    setChatMessages([...chatMessages, { id: Date.now(), text: message, sender: 'user' }]);
    setMessage('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-light-background dark:bg-dark-background min-h-screen">
      <header className="bg-light-surface dark:bg-dark-surface p-4 rounded-t-2xl border-b border-light-border dark:border-dark-border">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">Chat</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('new')} 
              className={`px-4 py-2 rounded-full text-sm font-semibold ${activeTab === 'new' ? 'bg-light-accent text-white' : 'bg-transparent text-light-textSecondary dark:text-dark-textSecondary'}`}>
              New Chat
            </button>
            <button 
              onClick={() => setActiveTab('history')} 
              className={`px-4 py-2 rounded-full text-sm font-semibold ${activeTab === 'history' ? 'bg-light-accent text-white' : 'bg-transparent text-light-textSecondary dark:text-dark-textSecondary'}`}>
              History
            </button>
            <button 
              onClick={() => setActiveTab('bookmarks')} 
              className={`px-4 py-2 rounded-full text-sm font-semibold ${activeTab === 'bookmarks' ? 'bg-light-accent text-white' : 'bg-transparent text-light-textSecondary dark:text-dark-textSecondary'}`}>
              Bookmarks
            </button>
          </div>
        </div>
      </header>

      <div className="bg-light-surface/30 dark:bg-dark-surface/30 backdrop-blur-xl rounded-b-2xl shadow-md">
        {activeTab === 'new' && (
          <div className="p-4">
            <div className="flex flex-col h-[60vh] overflow-y-auto p-4 space-y-4">
              {chatMessages.map((chat) => (
                <div key={chat.id} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-lg ${chat.sender === 'user' ? 'bg-light-accent text-white' : 'bg-light-surface dark:bg-dark-surface'}`}>
                    {chat.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-3 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-full focus:outline-none focus:ring-2 focus:ring-light-accent"
              />
              <button onClick={handleSendMessage} className="p-3 bg-light-accent text-white rounded-full">
                <Send size={20} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">History</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-light-surface dark:bg-dark-surface rounded-lg">
                <p>Photosynthesis discussion</p>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-light-border dark:hover:bg-dark-border rounded-full"><Eye size={16} /></button>
                  <button className="p-1 hover:bg-light-border dark:hover:bg-dark-border rounded-full"><Star size={16} /></button>
                  <button className="p-1 hover:bg-light-border dark:hover:bg-dark-border rounded-full"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Bookmarks</h2>
            {/* Placeholder for bookmarked chats */}
            <p className="text-light-textSecondary dark:text-dark-textSecondary">No bookmarked chats yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;