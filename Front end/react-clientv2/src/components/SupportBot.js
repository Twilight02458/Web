import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, serverTimestamp, onSnapshot, query, where, getDocs } from 'firebase/firestore';

const SupportBot = ({ room, user }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const processedMessages = useRef(new Set());
  const [initialized, setInitialized] = useState(false);

  // Enhanced support questions and their responses in Vietnamese
  const supportResponses = {
    'xin chào': 'Xin chào! 👋 Tôi là trợ lý hỗ trợ của bạn. Tôi có thể giúp gì cho bạn hôm nay? Bạn có thể hỏi tôi về:\n- Cài đặt tài khoản\n- Phương thức thanh toán\n- Quản lý tủ đồ\n- Tính năng chat\n- Tùy chỉnh hồ sơ',
    'chào': 'Chào bạn! 👋 Tôi ở đây để giúp bạn sử dụng nền tảng của chúng tôi. Bạn muốn biết thêm về điều gì?',
    'giúp': 'Tôi có thể giúp bạn với các tính năng sau:\n\n1. Quản lý tài khoản:\n   - Cài đặt hồ sơ: [Đến Hồ sơ](/profile)\n   - Cài đặt bảo mật: [Cài đặt Bảo mật](/security)\n\n2. Tính năng thanh toán:\n   - Phương thức thanh toán: [Cài đặt Thanh toán](/payments)\n   - Lịch sử giao dịch: [Xem Lịch sử](/transactions)\n\n3. Hệ thống tủ đồ:\n   - Truy cập tủ: [Tủ của tôi](/lockers)\n   - Đặt tủ: [Đặt Tủ](/lockers/book)\n\n4. Tính năng Chat:\n   - Tin nhắn riêng tư: [Bắt đầu Chat](/chat)\n   - Nhóm chat: [Tham gia Nhóm](/chat/groups)\n\nBạn muốn biết thêm về tính năng nào?',
    'thanh toán': 'Đây là cách quản lý thanh toán của bạn:\n\n1. Thêm Phương thức Thanh toán:\n   - Đến [Cài đặt Thanh toán](/payments)\n   - Nhấp "Thêm Phương thức Thanh toán Mới"\n   - Làm theo quy trình thiết lập thanh toán an toàn\n\n2. Xem Giao dịch:\n   - Truy cập [Lịch sử Giao dịch](/transactions)\n   - Lọc theo ngày, số tiền hoặc trạng thái\n\n3. Vấn đề Thanh toán:\n   - Kiểm tra [FAQ Thanh toán](/payments/faq)\n   - Liên hệ hỗ trợ cho các vấn đề chưa giải quyết\n\nCần hỗ trợ cụ thể về thanh toán?',
    'tủ': 'Đây là cách sử dụng hệ thống tủ đồ:\n\n1. Truy cập Tủ của Bạn:\n   - Đến [Tủ của tôi](/lockers)\n   - Chọn tủ được chỉ định\n   - Sử dụng khóa số để mở\n\n2. Đặt Tủ Mới:\n   - Truy cập [Đặt Tủ](/lockers/book)\n   - Chọn vị trí và kích thước\n   - Chọn thời gian\n   - Hoàn tất thanh toán\n\n3. Quản lý Đặt Tủ:\n   - Xem tất cả đặt tủ: [Đặt Tủ của tôi](/lockers/bookings)\n   - Gia hạn hoặc hủy đặt tủ\n\nCần giúp đỡ về tính năng tủ cụ thể?',
    'tài khoản': 'Đây là cách quản lý tài khoản của bạn:\n\n1. Cài đặt Hồ sơ:\n   - Cập nhật thông tin: [Chỉnh sửa Hồ sơ](/profile/edit)\n   - Đổi mật khẩu: [Cài đặt Bảo mật](/security)\n   - Quản lý thông báo: [Cài đặt Thông báo](/notifications)\n\n2. Bảo mật Tài khoản:\n   - Xác thực hai yếu tố: [Cài đặt Bảo mật](/security/2fa)\n   - Lịch sử đăng nhập: [Nhật ký Bảo mật](/security/logs)\n\n3. Vấn đề Tài khoản:\n   - Đặt lại mật khẩu: [Đặt lại Mật khẩu](/reset-password)\n   - Liên hệ hỗ trợ cho các vấn đề khác\n\nBạn cần hỗ trợ cụ thể nào về tài khoản?',
    'chat': 'Đây là cách sử dụng tính năng chat của chúng tôi:\n\n1. Tin nhắn Riêng tư:\n   - Bắt đầu chat: [Tin nhắn Mới](/chat/new)\n   - Xem cuộc trò chuyện: [Chat của tôi](/chat)\n\n2. Nhóm Chat:\n   - Tham gia nhóm: [Danh mục Nhóm](/chat/groups)\n   - Tạo nhóm: [Nhóm Mới](/chat/groups/new)\n\n3. Cài đặt Chat:\n   - Tùy chọn thông báo: [Cài đặt Chat](/chat/settings)\n   - Chặn người dùng: [Cài đặt Riêng tư](/privacy)\n\nCần giúp đỡ về tính năng chat cụ thể?',
    'default': 'Tôi ở đây để giúp bạn! Vui lòng cho tôi biết bạn cần hỗ trợ gì. Bạn có thể hỏi về:\n- Cài đặt tài khoản\n- Phương thức thanh toán\n- Quản lý tủ đồ\n- Tính năng chat\n- Tùy chỉnh hồ sơ\n\nHoặc gõ "giúp" để xem danh sách đầy đủ các tính năng.'
  };

  // Vietnamese keywords mapping
  const vietnameseKeywords = {
    'hello': 'xin chào',
    'hi': 'chào',
    'help': 'giúp',
    'payment': 'thanh toán',
    'locker': 'tủ',
    'account': 'tài khoản',
    'chat': 'chat'
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
    let bestMatch = '';
    let bestMatchLength = 0;

    // Check for Vietnamese keywords first
    for (const [key, value] of Object.entries(supportResponses)) {
      if (lowerMessage.includes(key) && key.length > bestMatchLength) {
        bestMatch = key;
        bestMatchLength = key.length;
      }
    }

    // If no Vietnamese match found, check English keywords
    if (!bestMatch) {
      for (const [engKey, vietKey] of Object.entries(vietnameseKeywords)) {
        if (lowerMessage.includes(engKey) && vietKey.length > bestMatchLength) {
          bestMatch = vietKey;
          bestMatchLength = vietKey.length;
        }
      }
    }

    if (bestMatch) {
      response = supportResponses[bestMatch];
    }

    // Add bot response to chat
    try {
      await addDoc(messagesRef, {
        text: response,
        createdAt: serverTimestamp(),
        user: 'Trợ lý Hỗ trợ',
        userId: 'bot',
        room: room,
        isBot: true,
        processedMessageId: messageId // Add reference to the processed message
      });
    } catch (error) {
      console.error('Error sending bot response:', error);
    }
    
    setIsProcessing(false);
  };

  // Initialize processed messages from existing bot responses
  const initializeProcessedMessages = async () => {
    if (initialized) return;

    try {
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
        where('room', '==', room),
        where('isBot', '==', true)
      );

      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.processedMessageId) {
          processedMessages.current.add(data.processedMessageId);
        }
      });

      setInitialized(true);
    } catch (error) {
      console.error('Error initializing processed messages:', error);
    }
  };

  // Listen for new messages in the private support room
  useEffect(() => {
    if (!room.startsWith('support_')) return;

    // Initialize processed messages when component mounts
    initializeProcessedMessages();

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
          if (message.userId !== 'bot' && !message.isBot) {
            processMessage(message.text, change.doc.id);
          }
        }
      });
    });

    return () => {
      unsubscribe();
      // Don't clear processedMessages on unmount to maintain state across reloads
    };
  }, [room]);

  return null;
};

export default SupportBot; 