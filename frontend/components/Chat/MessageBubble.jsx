// components/MessageBubble.js
const MessageBubble = ({ message }) => {
    return (
      <div
        className={`flex ${
          message.sender === "me" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-xs p-4 rounded-lg ${
            message.sender === "me"
              ? "bg-green-500 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          <p>{message.text}</p>
          <p className="text-xs mt-1 text-right text-gray-400">
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  };
  
  export default MessageBubble;