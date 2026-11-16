
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Loader2 } from "lucide-react";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ChatWindow = () => {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  const getOtherUser = (chat) => {
    if (String(chat.client?._id) === String(user?._id)) {
      return chat.freelancer;
    }

    return chat.client;
  };

  const fetchChat = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      setError("");

      const [conversationResponse, messageResponse] =
        await Promise.all([
          api.get("/messages/conversations"),
          api.get(`/messages/${conversationId}`),
        ]);

      const currentConversation =
        conversationResponse.data.find(
          (item) => item._id === conversationId
        );

      if (!currentConversation) {
        throw new Error("Conversation not found.");
      }

      setConversation(currentConversation);
      setMessages(messageResponse.data);

      // Mark messages from the other participant as read
      await api.put(`/messages/${conversationId}/read`);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load conversation."
      );
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchChat(true);

    const interval = setInterval(() => {
      fetchChat(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const text = newMessage.trim();

    if (!text || sending) return;

    try {
      setSending(true);
      setError("");

      const { data } = await api.post(
        `/messages/${conversationId}`,
        { text }
      );

      setMessages((prev) => [...prev, data]);
      setNewMessage("");

      setConversation((prev) => ({
        ...prev,
        lastMessage: data.text,
        lastMessageAt: data.createdAt,
      }));

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to send message."
      );
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  if (error && !conversation) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate("/messages")}
          className="text-brand-600 font-medium"
        >
          Back to Messages
        </button>
      </div>
    );
  }

  if (!conversation) return null;

  const otherUser = getOtherUser(conversation);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        {/* Chat Header */}
        <div className="flex items-center gap-4 p-5 border-b border-gray-100">

          <button
            onClick={() => navigate("/messages")}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>

          <img
            src={
              otherUser?.avatar ||
              `https://api.dicebear.com/7.x/notionists/svg?seed=${otherUser?.name || "User"}`
            }
            alt={otherUser?.name || "User"}
            className="w-11 h-11 rounded-full object-cover bg-gray-100"
          />

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900">
              {otherUser?.name || "Unknown User"}
            </h2>

            <p className="text-sm text-gray-500 truncate">
              {conversation.job?.title || "Project"}
            </p>
          </div>

        </div>

        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-5 bg-gray-50">

          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <h3 className="font-semibold text-gray-700">
                Start the conversation
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Send your first message to discuss the project.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {messages.map((message) => {
                const isMine =
                  String(message.sender?._id) === String(user?._id);

                return (
                  <div
                    key={message._id}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                        isMine
                          ? "bg-brand-600 text-white rounded-br-sm"
                          : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
                      }`}
                    >

                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.text}
                      </p>

                      <div
                        className={`flex justify-end items-center gap-2 mt-2 text-[11px] ${
                          isMine
                            ? "text-white/70"
                            : "text-gray-400"
                        }`}
                      >
                        <span>
                          {formatTime(message.createdAt)}
                        </span>

                        {isMine && (
                          <span>
                            {message.isRead ? "Read" : "Sent"}
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />

            </div>
          )}

        </div>

        {/* Error Message */}
        {error && (
          <p className="px-5 pt-3 text-sm text-red-500">
            {error}
          </p>
        )}

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-100 flex items-center gap-3"
        >

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write a message..."
            maxLength={5000}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500"
          />

          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {sending ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>

        </form>

      </div>
    </div>
  );
};

export default ChatWindow;
