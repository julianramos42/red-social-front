import React, { useRef } from 'react'
import './chats.css'
import NavBar from '../../components/NavBar/NavBar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LoadStart, LoadRemove } from '../../components/Loading'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

export default function Chats() {
    const navigate = useNavigate()
    const userData = JSON.parse(localStorage.getItem('user')) || {}
    const [conections, setConections] = useState([])
    const [selectedChat, setSelectedChat] = useState('')
    const modalState = useSelector(store => store.modalReducer.state)
    const [messageText, setMessageText] = useState('')
    const [messages, setMessages] = useState([])
    const messageInput = useRef()
    const connectionSearch = useRef()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/auth')
        } else {
            getConections()
        }
    }, [])

    useEffect(() => {
        if (selectedChat) {
            getMessages()
        }
    }, [selectedChat])

    async function getConections() {
        const url = 'http://localhost:8080/conections?name=' + connectionSearch.current.value
        const token = localStorage.getItem('token');
        const headers = { headers: { Authorization: `Bearer ${token}` } };
        try {
            const res = await axios.get(url, headers)
            setConections(res.data.conections)
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                toast.error("Network Error");
            } else {
                if (typeof error.response.data.message === "string") {
                    toast.error(error.response.data.message);
                } else {
                    error.response.data.message.forEach((err) => toast.error(err));
                }
            }
        }
    }

    async function getMessages() {
        const url = 'http://localhost:8080/messages/' + selectedChat.user_id1._id
        const token = localStorage.getItem('token');
        const headers = { headers: { Authorization: `Bearer ${token}` } };
        try {
            const res = await axios.get(url, headers)
            setMessages(res.data.messages)
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                toast.error("Network Error");
            } else {
                if (typeof error.response.data.message === "string") {
                    toast.error(error.response.data.message);
                } else {
                    error.response.data.message.forEach((err) => toast.error(err));
                }
            }
        }
    }

    function selectChat(e) {
        setSelectedChat(conections.find(conection => conection._id === e.target.id))
    }

    function textMessage(e) {
        setMessageText(e.target.value)
    }

    async function sendMessage(e) {
        const url = 'http://localhost:8080/messages'
        const token = localStorage.getItem('token');
        const headers = { headers: { Authorization: `Bearer ${token}` } };
        try {
            if ((e.key === 'Enter' || e.target.id === 'send') && messageText) {
                const data = {
                    text: messageText,
                    receiver: selectedChat.user_id1._id,
                    sender: userData.user_id
                }
                await axios.post(url, data, headers)
                messageInput.current.value = ''
                setTimeout(() => {
                    getMessages()
                }, 200)
            }
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                toast.error("Network Error");
            } else {
                if (typeof error.response.data.message === "string") {
                    toast.error(error.response.data.message);
                } else {
                    error.response.data.message.forEach((err) => toast.error(err));
                }
            }
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    const QuestionToast = () => (
        <div className='toast'>
            <h4>¿Are you sure?</h4>
            <div className='toast-btns'>
                <button className='yes-btn' onClick={handleYesClick}>Sí</button>
                <button className='no-btn' onClick={handleNoClick}>No</button>
            </div>
        </div>
    );

    const handleYesClick = async() => {
        const url = 'http://localhost:8080/conections/' + selectedChat.user_id1._id
        const token = localStorage.getItem('token');
        const headers = { headers: { Authorization: `Bearer ${token}` } };
        try {
            const res = await axios.delete(url, headers)
            setTimeout(() => {
                toast.success(res.data.message)
            }, 500)
            setSelectedChat('')
            getConections()
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                toast.error("Network Error");
            } else {
                if (typeof error.response.data.message === "string") {
                    toast.error(error.response.data.message);
                } else {
                    error.response.data.message.forEach((err) => toast.error(err));
                }
            }
        }
        toast.dismiss();
    };

    const handleNoClick = () => {
        toast.dismiss();
    };

    async function deleteFriend() {
        toast(<QuestionToast />, {
            duration: Infinity
        });
    }

    useEffect(() => {
        getConections()
        if (selectedChat) {
            getMessages()
        }
    }, [modalState])

    return (
        <div className='chats-container'>
            <NavBar />
            <div className='chats'>
                <div className='search-bar'>
                    <label htmlFor='search-bar'>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </label>
                    <input type='text' name='search-bar' id='search-bar' placeholder='Find Chats' onChange={getConections} ref={connectionSearch} />
                </div>
                <div className='chats-bars'>
                    {
                        conections.length ? conections.map((conection, i) => {
                            let card = <div className={selectedChat === conection ? 'social-chat selected-chat' : 'social-chat'} key={i} id={conection._id} onClick={selectChat}>
                                <img src={conection.user_id1.photo} alt='profile' className="chat-photo" id={conection._id} />
                                <div className="chat-content" id={conection._id}>
                                    <h3 className="chat-name" id={conection._id}>{conection.user_id1.name}</h3>
                                </div>
                            </div>
                            return card;
                        }) : <div>
                            <p>No conections yet</p>
                        </div>
                    }
                </div>
            </div>
            <div className='displayed-chat'>
                {
                    selectedChat ?
                        <>
                            <div className='chat-header'>
                                <div className="chat-header-info" >
                                    <img src={selectedChat.user_id1.photo} alt='profile' className="chat-photo" />
                                    <h3 className="chat-name">{selectedChat.user_id1.name}</h3>
                                </div>
                                <button className='delete-friend' onClick={deleteFriend}>Delete Friend</button>
                            </div>
                            <div className='chat-messages'>
                                {
                                    messages.length ? messages.map((message, i) => {
                                        let receiver = userData.user_id === message.receiver
                                        let sender = userData.user_id === message.sender
                                        let card = <>
                                            {
                                                receiver && !sender && <>
                                                    <div className='message1' key={i}>
                                                        <h4>{message.text}</h4>
                                                    </div>
                                                    <span className="message1-date">{formatDate(message.createdAt)}</span>
                                                </>
                                            }
                                            {
                                                sender && !receiver && <>
                                                    <div className='message2' key={i}>
                                                        <h4>{message.text}</h4>
                                                    </div>
                                                    <span className="message2-date">{formatDate(message.createdAt)}</span>
                                                </>
                                            }
                                        </>
                                        return card
                                    }) : <div className='no-conversation'>
                                        <h3>Write something!</h3>
                                    </div>
                                }
                            </div>
                            <div className='send-message'>
                                <div className='message-bar'>
                                    <input type='text' name='message-input' id='message-input' onKeyUp={sendMessage} onChange={textMessage} placeholder='Type your message' ref={messageInput} />
                                    <label htmlFor='message-input'>
                                        <i className="fa-solid fa-paper-plane" id='send' onClick={sendMessage}></i>
                                    </label>
                                </div>
                            </div>
                        </>
                        :
                        <div className='no-conversation'>
                            <h3>Chat to someone!</h3>
                        </div>
                }
            </div>
        </div>
    )
}
