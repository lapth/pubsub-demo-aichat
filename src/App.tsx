import { useState, useEffect } from 'react';
import { AIChatClient, IMessage } from 'iframe-pubsub';

const urlParams = new URLSearchParams(window.location.search);
const pageId = urlParams.get('acId') || (new Date().getTime().toString());

export default function App() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [targetPageId, setTargetPageId] = useState('');

  const [client] = useState(() => new AIChatClient(pageId));

  useEffect(() => {
    client.onMessage((message: IMessage) => {
      setMessages(prev => [...prev, message]);
    });
  }, [client]);

  const handleSendMessage = () => {
    if (!messageText || !targetPageId) return;
    
    client.sendMessage(targetPageId, messageText);
    
    setMessages(prev => [...prev, {
      from: pageId,
      to: targetPageId,
      payload: messageText
    }]);
    
    setMessageText('');
  };

  return (
    <div>
      <h2>AIChat [{pageId}]</h2>
      <div>
        <input
          placeholder="Target ID"
          value={targetPageId}
          onChange={(e) => setTargetPageId(e.target.value)}
        />
        <input
          placeholder="Message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div>
        <h3>Messages:</h3>
        {messages.map((msg, index) => (
          <div key={index}>
            [<b>{msg.from}</b>] sent to [<b>{msg.to}</b>]: <b>{JSON.stringify(msg.payload)}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
