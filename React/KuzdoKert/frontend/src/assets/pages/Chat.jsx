import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('current_user'); // Dinamikus user_id később

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', { user_id: userId, message });
      setMessage('');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Chat</h1>
      <div className="h-64 overflow-y-scroll border p-2">
        {messages.map((msg, index) => (
          <p key={index}>{msg.user_id}: {msg.message} ({new Date(msg.timestamp).toLocaleTimeString()})</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 w-full"
      />
      <button onClick={sendMessage} className="p-2 bg-green-500 text-white mt-2">
        Küldés
      </button>
    </div>
  );
}

export default Chat;