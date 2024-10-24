import React, { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import PatientSidebar from '../components/PatientSidebar';
import './css/ChatPage.css';
import { Helmet } from "react-helmet-async";
import { LuSend } from "react-icons/lu";
import { sendChatMessage, fetchReminders } from '../api';
import patientBubble from '../assets/patient_bubble.png';
import robotBubble from '../assets/robot_bubble.png';
import Swal from 'sweetalert2';

const ChatPage = () => {

    const [inputMessage, setInputMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const chatContentRef = useRef(null);
    const shouldScrollRef = useRef(true);


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const scrollToBottom = (smooth = true) => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTo({
                top: chatContentRef.current.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }
    };

    const handleScroll = () => {
        if (chatContentRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContentRef.current;
            const isScrolledNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
            shouldScrollRef.current = isScrolledNearBottom;
        }
    };

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = { type: 'user', content: inputMessage };
        setChatHistory(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);
        shouldScrollRef.current = true;

        try {
            const botResponse = await sendChatMessage(inputMessage);
            const botMessage = { type: 'bot', content: botResponse };
            setChatHistory(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Failed to get bot response:', error);
            const errorMessage = { type: 'error', content: 'Sorry, I encountered an error. Please try again.' };
            setChatHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
  
    useEffect(() => {
      const pollReminders = async () => {
          try {
              const reminderResponse = await fetchReminders();
              console.log("Response from fetchReminders: ", reminderResponse);
  
    
              if (Array.isArray(reminderResponse) && reminderResponse.length > 0) {
                  Swal.fire({
                      title: 'Medicine Reminder',
                      text: reminderResponse.join(', '),
                      icon: 'info',
                      confirmButtonText: 'Got it!',
                  });
              } else {
                  console.log("No reminders to display.");
              }
          } catch (error) {
              console.error('Failed to fetch reminders:', error);
          }
      };
  
      const intervalId = setInterval(pollReminders, 30000);
      return () => clearInterval(intervalId);
  }, [chatHistory]);
  
  
    useEffect(() => {
      if (chatContentRef.current) {
        chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
      }
    }, [chatHistory]);

    useEffect(() => {
        const chatContent = chatContentRef.current;
        if (chatContent) {
            chatContent.addEventListener('scroll', handleScroll);
            return () => chatContent.removeEventListener('scroll', handleScroll);
        }
    }, []);

    useEffect(() => {
        if (shouldScrollRef.current) {
            scrollToBottom(true);
        }
    }, [chatHistory]);


    

    return (
        <div className="chat-page-container">
            <Helmet>
                <title>Chat | AI HealthCare</title>
            </Helmet>
            <button 
                className="hamburger-menu"
                onClick={toggleSidebar}
                aria-label="Toggle menu"
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar with mobile responsiveness */}
            <div className={`sidebar-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <PatientSidebar />
            </div>
            <div className="chat-content">
                <div className="card card-bordered">
                    <div className="card-header" style={{ borderBottom: "1px solid #9b9b9b" }}>
                        <h4 className="card-title"><strong>AI HealthCare ChatBot</strong></h4>
                    </div>

                    <div 
                        className="ps-container ps-theme-default ps-active-y" 
                        id="chat-content" 
                        style={{ 
                            height: '400px', 
                            overflowY: 'auto',
                            scrollBehavior: 'smooth',
                            WebkitOverflowScrolling: 'touch',
                        }} 
                        ref={chatContentRef}
                    >
                        {chatHistory.map((message, index) => (
                            <div key={index} className={`media media-chat ${message.type === 'user' ? 'media-chat-reverse' : ''}`}>
                                <img 
                                    className="chat-avatar"
                                    src={message.type === 'user' ? patientBubble : robotBubble}
                                    alt={message.type === 'user' ? "User Avatar" : "Bot Avatar"}
                                />
                                <div className="media-body">
                                    <div className={`chat-bubble ${message.type === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                                        <p><strong>{message.content}</strong></p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="media media-chat">
                                <img 
                                    className="chat-avatar"
                                    src={robotBubble}
                                    alt="Bot Avatar"
                                />
                                <div className="media-body">
                                    <div className="chat-bubble bot-bubble">
                                        <p><strong>Typing...</strong></p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="publisher border-light" style={{ borderTop: "1px solid #9b9b9b" }}>
                        <img className="avatar avatar-xs" src={patientBubble} alt="User" />
                        <input
                            className="publisher-input"
                            type="text"
                            placeholder="Write something"
                            value={inputMessage}
                            onChange={handleInputChange}
                        />
                        <button type="submit" className="publisher-btn text-info" data-abc="true" disabled={isLoading}>
                            <LuSend />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;


