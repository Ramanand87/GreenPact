// components/ChatWindow.js
import MessageBubble from "./MessageBubble";

const ChatWindow = ({ currentChat }) => {
  return (
    <div className="flex-1 h-screen py-6 ">
      <div className="px-6   h-[calc(100vh-10rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-green-50 hover:scrollbar-thumb-green-400 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
        <h2 className="text-2xl font-bold mb-6">{currentChat?.name}</h2>
        <div className="space-y-4">
          {currentChat?.messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;