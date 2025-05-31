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
  or,
  and,
  deleteDoc,
  doc
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Spinner, Button } from "react-bootstrap";
import { MyUserContext } from "../configs/Contexts";
import SupportBot from "./SupportBot";
import { FaTrash } from 'react-icons/fa';

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

      let queryMessages;
      if (room === "support") {
        // For support room, only show messages between the current user and the bot
        queryMessages = query(
          messagesRef,
          and(
            or(
              where("userId", "==", user.id),
              where("userId", "==", "bot")
            ),
            where("room", "==", `support_${user.id}`)
          ),
          orderBy("createdAt", "asc")
        );
      } else {
        // For other rooms, show all messages in the room
        queryMessages = query(
      messagesRef,
      where("room", "==", room),
        orderBy("createdAt", "asc")
    );
      }

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
        room: room === "support" ? `support_${user.id}` : room,
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

  const handleDeleteMessage = async (messageId, userId) => {
    // Only allow users to delete their own messages
    if (!user || userId !== user.id) {
      setError("Bạn chỉ có thể xóa tin nhắn của chính mình");
      return;
    }

    try {
      const messageRef = doc(db, "messages", messageId);
      await deleteDoc(messageRef);
    } catch (error) {
      console.error("Error deleting message:", error);
      setError(`Không thể xóa tin nhắn: ${error.message}`);
    }
  };

  if (!user) {
    return (
      <div className="chat-app">
        <Alert variant="warning">
          Vui lòng đăng nhập để sử dụng tính năng chat.
          <button 
            className="btn btn-primary ms-3"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="chat-app">
      {room === "support" && <SupportBot room={`support_${user.id}`} user={user} />}
      <div className="header">
        <h1>Chào mừng đến với: {room === "support" ? "Chat Hỗ trợ Riêng tư" : room.toUpperCase()}</h1>
      </div>
      
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
          <button 
            className="btn btn-outline-danger ms-3"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </Alert>
      )}
      
      {loading ? (
        <div className="text-center p-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
        </div>
      ) : (
      <div className="messages">
          {messages.length === 0 ? (
            <div className="text-center p-3 text-muted">
              {room === "support" 
                ? "Bắt đầu trò chuyện với trợ lý hỗ trợ của chúng tôi. Chúng tôi có thể giúp gì cho bạn hôm nay?"
                : "Chưa có tin nhắn nào. Hãy là người đầu tiên gửi tin nhắn!"}
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
                      {message.createdAt.toLocaleTimeString('vi-VN')}
                    </span>
                  )}
                  {message.userId === user.id && !message.isBot && (
                    <Button
                      variant="link"
                      className="delete-button"
                      onClick={() => handleDeleteMessage(message.id, message.userId)}
                      title="Xóa tin nhắn"
                    >
                      <FaTrash />
                    </Button>
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
          placeholder={room === "support" ? "Nhập câu hỏi hỗ trợ của bạn..." : "Nhập tin nhắn..."}
          disabled={loading}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={loading || !newMessage.trim()}
        >
          Gửi
        </button>
      </form>
    </div>
  );
};