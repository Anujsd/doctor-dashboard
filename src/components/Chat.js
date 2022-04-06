import { async } from '@firebase/util';
import { Button, Input, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { addDoc, collection, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import db from '../firebase';
import './Chat.css';

const Chat = ({ id }) => {
  const [messages, setMessages] = useState([]);
  const [inputArea, setInputArea] = useState('');
  const chatArea = useRef(null);
  const [count, setCount] = useState(0);

  const getAllMessages = async () => {
    const docRef = doc(db, 'Users', id);
    const messagesList = [];
    const querySnapshot = await getDocs(collection(docRef, 'messages'));
    querySnapshot.forEach((doc) => {
      messagesList.push({
        id: doc.id,
        content: doc.data().content,
        sender: doc.data().sender,
        time: new Date(doc.data().time.seconds),
      });
      console.log(doc);
    });
    function custom_sort(a, b) {
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    }
    messagesList.sort(custom_sort);
    console.log(messagesList);
    setMessages(messagesList);
  };

  const handleSend = async () => {
    const docRef = doc(db, 'Users', id);
    await addDoc(collection(docRef, 'messages'), {
      sender: 'doctor',
      content: inputArea,
      time: new Date(),
    });
    console.log(inputArea);
    setCount(count + 1);
    setInputArea('');
  };

  useEffect(async () => {
    await getAllMessages();
    chatArea.current.scrollTop = chatArea.current.scrollHeight;
  }, [count]);

  return (
    <Box sx={{ border: '1px solid black', maxWidth: '50%' }}>
      <Box className='chat-box' ref={chatArea}>
        {messages.map((msg) => {
          return (
            <Box
              key={msg.id}
              className={
                msg.sender === 'doctor'
                  ? 'chat-item chat-right'
                  : 'chat-item chat-left'
              }
            >
              {msg.content}
            </Box>
          );
        })}
      </Box>
      <Box sx={{ width: '100%', height: '55px' }}>
        <TextField
          placeholder='Type a message'
          className='input-area'
          value={inputArea}
          onChange={(e) => setInputArea(e.target.value)}
        />
        <Button className='send-btn' onClick={handleSend}>
          send
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
