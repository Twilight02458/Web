import React, { useState, useEffect, useContext } from "react";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Spinner } from "react-bootstrap";
import { MyUserContext } from "../configs/Contexts";

import "../styles/Chat.css";

export const Chat = ({ room: propRoom }) => {
  const { roomId } = useParams();
  const room = roomId || propRoom || "general";
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesRef = collection(db, "messages");
  const navigate = useNavigate();
  const user = useContext(MyUserContext);

  useEffect(() => {
    if (!user) {
      setError("Please login to use the chat");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Setting up chat for room:", room);
      console.log("Current user:", user);

    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
        orderBy("createdAt", "asc")
    );

      const unsubscribe = onSnapshot(
        queryMessages,
        (snapshot) => {
          console.log("Received snapshot with", snapshot.size, "messages");
      let messages = [];
      snapshot.forEach((doc) => {
            const data = doc.data();
            messages.push({
              id: doc.id,
              text: data.text,
              user: data.user,
              userId: data.userId,
              room: data.room,
              createdAt: data.createdAt?.toDate?.() || new Date(),
            });
      });
      setMessages(messages);
          setLoading(false);
        },
        (error) => {
          console.error("Firestore error details:", {
            code: error.code,
            message: error.message,
            stack: error.stack
          });
          setError(`Error loading messages: ${error.message}`);
          setLoading(false);
        }
      );

      return () => {
        console.log("Cleaning up chat listener");
        unsubscribe();
      };
    } catch (error) {
      console.error("Error setting up chat:", error);
      setError(`Error setting up chat: ${error.message}`);
      setLoading(false);
    }
  }, [room, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!user) {
      setError("Please login to send messages");
      return;
    }

    if (newMessage.trim() === "") return;

    try {
      console.log("Sending message to room:", room);
      const messageData = {
        text: newMessage.trim(),
      createdAt: serverTimestamp(),
        user: user.username || user.email,
        userId: user.id,
      room,
      };

      console.log("Message data:", messageData);
      await addDoc(messagesRef, messageData);
    setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      setError(`Failed to send message: ${error.message}`);
    }
  };

  if (!user) {
    return (
      <div className="chat-app">
        <Alert variant="warning">
          Please login to use the chat feature.
          <button 
            className="btn btn-primary ms-3"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="chat-app">
      <div className="header">
        <h1>Welcome to: {room.toUpperCase()}</h1>
      </div>
      
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
          <button 
            className="btn btn-outline-danger ms-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </Alert>
      )}
      
      {loading ? (
        <div className="text-center p-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
      <div className="messages">
          {messages.length === 0 ? (
            <div className="text-center p-3 text-muted">
              No messages yet. Be the first to send a message!
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.userId === user.id ? 'message-own' : ''}`}
              >
                <div className="message-header">
                  <span className="user">{message.user}</span>
                  {message.createdAt && (
                    <span className="timestamp">
                      {message.createdAt.toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <div className="message-content">{message.text}</div>
          </div>
            ))
          )}
      </div>
      )}

      <form onSubmit={handleSubmit} className="new-message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          className="new-message-input"
          placeholder="Type your message here..."
          disabled={loading}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={loading || !newMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};