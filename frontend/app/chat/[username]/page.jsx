"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Mic, ChevronDown, MessageSquare } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { useGetRoomsQuery } from "@/redux/Service/chatApi"
import ChatSidebar from "@/components/Chat/ChatSidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const ChatPage = () => {
  const [message, setMessage] = useState("")
  const [receiveMessages, setReceiveMessages] = useState([])
  const { data: rooms, isLoading, isError } = useGetRoomsQuery()
  const userInfo = useSelector((state) => state.auth.userInfo)
  const currentUser = userInfo?.data.username
  const [socket, setSocket] = useState(null)
  const [currentChat, setCurrentChat] = useState(null)
  const messagesEndRef = useRef(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setShowSidebar(!currentChat)
      } else {
        setShowSidebar(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [currentChat])

  // Bargaining suggestions for farmers
  const suggestions = [
    "Can we negotiate the price?",
    "I can offer ₹__ per kg",
    "Would you accept ₹__ for bulk purchase?",
    "Can we meet halfway at ₹__?",
    "Is there any discount for regular orders?",
  ]

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setMessage((prev) => (prev ? `${prev} ${transcript}` : transcript))
        }

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error)
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  // WebSocket connection
  // WebSocket connection
useEffect(() => {
  let ws;

  if (currentChat?.name) {
    console.log("Connecting to WebSocket for room:", currentChat.name);
    ws = new WebSocket(`ws://localhost:5000/ws/chat/${currentChat.name}/`);

    ws.onopen = () => console.log("WebSocket Connected!");
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log("Message received:", msg);
      setReceiveMessages((prev) => (Array.isArray(msg.messages) ? msg.messages : [...prev, msg]));
    };
    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = () => console.log("WebSocket Closed!");

    setSocket(ws);
  }

  return () => {
    if (ws) {
      console.log("Cleaning up WebSocket connection...");
      ws.close();
    }
  };
}, [currentChat]);


  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [receiveMessages])

  const toggleVoiceInput = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop()
      } else {
        recognitionRef.current.start()
      }
      setIsListening(!isListening)
    } else {
      alert("Speech recognition not supported in your browser")
    }
  }

  const handleSend = () => {
    if (message.trim() && socket) {
      const messageData = {
        message,
        username: currentUser,
        timestamp: new Date().toISOString(),
      }

      socket.send(JSON.stringify(messageData))
      setMessage("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (timestamp) => {
    const messageDate = new Date(timestamp).toDateString()
    const today = new Date().toDateString()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    if (messageDate === today) return "Today"
    if (messageDate === yesterday.toDateString()) return "Yesterday"
    return messageDate
  }

  const insertSuggestion = (suggestion) => {
    setMessage(suggestion.replace("__", ""))
    setShowSuggestions(false)
  }

  const handleChatSelect = (chat) => {
    setCurrentChat(chat)
    if (isMobile) {
      setShowSidebar(false)
    }
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-5rem)] bg-gray-50 rounded-lg">
    {/* Responsive Layout */}
    <div className="flex w-full h-full">
      {/* Sidebar - Hidden on mobile when chat is active */}
      {(showSidebar || !isMobile) && (
        <div className={`${isMobile ? "w-full" : "w-[320px]"} h-full border-r`}>
          <ChatSidebar rooms={rooms} currentChat={currentChat} setCurrentChat={handleChatSelect} />
        </div>
      )}

        {/* Chat Section - Full width on mobile */}
        {(!showSidebar || !isMobile) && (
        <div className={`${isMobile ? "w-full" : "flex-1"} flex flex-col h-full`}>
          <Card className="flex flex-col flex-1 h-full bg-white rounded-none shadow-none md:rounded-lg md:shadow-md overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-white border-b flex items-center justify-between">
                {currentChat ? (
                  <div className="flex items-center space-x-3">
                    {isMobile && (
                      <Button variant="ghost" size="sm" onClick={() => setShowSidebar(true)} className="mr-2 p-1">
                        <ChevronDown className="rotate-90 w-4 h-4" />
                      </Button>
                    )}
                    <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-green-200">
                      <img
                        src={currentChat.profile.image || "/placeholder.svg"}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-semibold text-green-800">{currentChat.profile.name}</span>
                      <p className="text-xs text-gray-500">@{currentChat.chat_user}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-500">Select a conversation</span>
                )}
              </div>

              {/* Messages Section */}
              {currentChat ? (
                <ScrollArea className="flex-1 p-4">
                  {receiveMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
                      <MessageSquare className="w-16 h-16 text-green-200 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700">No messages yet</h3>
                      <p className="text-sm max-w-xs">Start the conversation by sending a message below.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {receiveMessages.map((msg, index) => {
                        const messageDate = formatDate(msg.timestamp)
                        const showDate = index === 0 || formatDate(receiveMessages[index - 1].timestamp) !== messageDate

                        return (
                          <div key={index}>
                            {showDate && (
                              <div className="flex justify-center my-4">
                                <Badge variant="outline" className="bg-gray-100 text-gray-600 font-medium px-3 py-1">
                                  {messageDate}
                                </Badge>
                              </div>
                            )}
                            <div
                              className={`flex ${msg.username === currentUser ? "justify-end" : "justify-start"} mb-3`}
                            >
                              <div
                                className={`px-4 py-2 rounded-lg shadow-sm max-w-xs md:max-w-md ${
                                  msg.username === currentUser
                                    ? "bg-green-500 text-white rounded-tr-none"
                                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                                }`}
                              >
                                <p className="break-words whitespace-pre-wrap overflow-hidden">{msg.message}</p>
                                <p
                                  className={`text-xs mt-1 ${
                                    msg.username === currentUser ? "text-green-100" : "text-gray-500"
                                  }`}
                                >
                                  {formatTime(msg.timestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
                  <img
                    src="/chatIcon.png"
                    alt="Chat Illustration"
                    className="w-32 h-32 md:w-48 md:h-48 mb-4 opacity-80"
                  />
                  <h2 className="text-xl font-semibold text-gray-700">Welcome to your inbox!</h2>
                  <p className="text-md text-gray-500 max-w-sm">
                    Select a chat from the list to start messaging. Stay connected and enjoy seamless conversations. 🚀
                  </p>
                </div>
              )}

              {/* Input Section */}
              {currentChat && (
                <div className="p-3 md:p-4 border-t bg-white">
                  {/* Bargaining Suggestions */}
                  <div className="relative mb-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-green-700 border-green-200 hover:bg-green-50"
                            onClick={() => setShowSuggestions(!showSuggestions)}
                          >
                            Bargaining Tips{" "}
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${showSuggestions ? "rotate-180" : ""}`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Quick phrases to help with price negotiation</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {showSuggestions && (
                      <div className="absolute bottom-full left-0 mb-2 w-full md:w-72 bg-white border rounded-lg shadow-lg z-10">
                        {suggestions.map((suggestion, i) => (
                          <div
                            key={i}
                            className="p-2 hover:bg-green-50 cursor-pointer border-b text-sm"
                            onClick={() => insertSuggestion(suggestion)}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1 border-2 focus:border-green-500 focus:ring-green-200"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isListening ? "destructive" : "outline"}
                            onClick={toggleVoiceInput}
                            className={isListening ? "bg-red-500" : "border-green-200 hover:bg-green-50"}
                          >
                            <Mic className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{isListening ? "Stop recording" : "Voice input"}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Button
                      onClick={handleSend}
                      disabled={!socket || !message.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Send</span>
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage
