
import React, { useState, useRef, useEffect } from 'react';
import PatientSidebar from '../components/PatientSidebar';
import './css/ChatPage.css';
import { Helmet } from "react-helmet-async";
import { LuSend } from "react-icons/lu";
import { sendChatMessage, fetchReminders } from '../api';
import Swal from 'sweetalert2';


const ChatPage = () => {

    const [inputMessage, setInputMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatContentRef = useRef(null);
  
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
  

    return (
        <div className="chat-page-container">
            <Helmet>
                <title>Chat | AI HealthCare</title>
            </Helmet>
            <PatientSidebar />
            <div className="chat-content">

                <div className="card card-bordered">
                    <div className="card-header" style={{ borderBottom: "1px solid #9b9b9b" }}>
                    <h4 className="card-title"><strong>AI HealthCare ChatBot</strong></h4>
                    </div>

                    <div className="ps-container ps-theme-default ps-active-y" id="chat-content" style={{ height: '400px', overflowY: 'auto' }} ref={chatContentRef}>
                    {chatHistory.map((message, index) => (
                        <div key={index} className={`media media-chat ${message.type === 'user' ? 'media-chat-reverse' : ''}`}>
                        <div className="media-body">
                            <p><strong>{message.content}</strong></p>
                        </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="media media-chat">
                        <div className="media-body">
                            <p>Typing...</p>
                        </div>
                        </div>
                    )}
                    </div>

                    <form onSubmit={handleSubmit} className="publisher border-light" style={{ borderTop: "1px solid #9b9b9b" }}>
                    <img className="avatar avatar-xs" src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="..." />
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


