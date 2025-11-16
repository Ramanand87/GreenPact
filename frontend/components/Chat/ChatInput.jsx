"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCreateRoomMutation } from "@/redux/Service/chatApi";

const ChatInput = ({ onSend, currentChat }) => {
  const [message, setMessage] = useState("");
  const [reciveMessage, setReciveMessage] = useState({});

  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState("65921b37-141f-40f5-9f44-3de73908a105");
  const [createRoom] = useCreateRoomMutation();
  const roomCreated = useRef(false);

  // useEffect(() => {
  //   const createRoomHandler = async () => {
  //     if (roomCreated.current) return;
  //     roomCreated.current = true;

  //     try {
  //       const response = await createRoom("23sda4334");
  //       console.log("Room created:", response);
  //       setRoomId(response?.data?.name);
  //     } catch (error) {
  //       console.error("Error creating room:", error);
  //     }
  //   };

  //   createRoomHandler();
  // }, [createRoom, currentChat]);

  useEffect(() => {
    if (roomId) {
      console.log("Establishing WebSocket for room:", roomId);
      const ws = new WebSocket(`ws://localhost:5000/ws/chat/${roomId}/`);

      ws.onopen = () => console.log("WebSocket Connected!");

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setReciveMessage(data)
        console.log("Message received:", data);
        // Do not call onSend here; handle it in the parent component
      };

      ws.onerror = (error) => console.error("WebSocket Error:", error);

      ws.onclose = () => console.log("WebSocket Closed!");

      setSocket(ws);

      return () => {
        ws.close();
      };
    }
  }, [roomId]);

  const handleSend = () => {
    if (message.trim() && socket) {
      const messageData = {
        message: message,
        username: "23sda4334", // Replace with actual username
      };

      socket.send(JSON.stringify(messageData));
      onSend(messageData); // Pass message to parent
      setMessage("");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
      <div className="max-w-2xl mx-auto flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={!socket}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;