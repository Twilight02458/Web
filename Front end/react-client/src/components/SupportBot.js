import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, serverTimestamp, onSnapshot, query, where } from 'firebase/firestore';

const SupportBot = ({ room, user }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const processedMessages = useRef(new Set());

  // Common support questions and their responses
  const supportResponses = {
    'hello': 'Hello! How can I help you today?',
    'hi': 'Hi there! How can I assist you?',
    'help': 'I can help you with:\n- Account issues\n- Payment questions\n- Locker access\n- General inquiries\nWhat would you like to know?',
    'payment': 'For payment-related questions, please visit the payment section in your dashboard or contact our finance department.',
    'locker': 'To access your locker, please go to the Locker section in your dashboard. You can view your assigned locker and its contents there.',
    'account': 'For account-related issues, please check your profile settings or contact the administrator.',
    'default': 'I\'m here to help! Please let me know what you need assistance with.'
  };

  const processMessage = async (message, messageId) => {
    if (!message || isProcessing || processedMessages.current.has(messageId)) return;
    
    setIsProcessing(true);
    processedMessages.current.add(messageId);
    const messagesRef = collection(db, 'messages');
    
    // Convert message to lowercase for better matching
    const lowerMessage = message.toLowerCase();
    
    // Find the best matching response
    let response = supportResponses.default;
    for (const [key, value] of Object.entries(supportResponses)) {
      if (lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }

    // Add bot response to chat
    try {
      await addDoc(messagesRef, {
        text: response,
        createdAt: serverTimestamp(),
        user: 'Support Bot',
        userId: 'bot',
        room: room // This will be the private room ID (support_userId)
      });
    } catch (error) {
      console.error('Error sending bot response:', error);
    }
    
    setIsProcessing(false);
  };

  // Listen for new messages in the private support room
  useEffect(() => {
    if (!room.startsWith('support_')) return;

    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('room', '==', room)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const message = change.doc.data();
          // Only process messages from users (not from the bot itself)
          if (message.userId !== 'bot') {
            processMessage(message.text, change.doc.id);
          }
        }
      });
    });

    return () => {
      unsubscribe();
      processedMessages.current.clear(); // Clear processed messages when component unmounts
    };
  }, [room]);

  return null; // This component doesn't render anything visible
};

export default SupportBot; 