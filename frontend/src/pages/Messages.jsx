import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Loader2, Inbox } from "lucide-react";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/messages/conversations");

        setConversations(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load conversations.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const getOtherUser = (conversation) => {
    if (conversation.client?._id === user?._id) {
      return conversation.freelancer;
    }

    return conversation.client;
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>

        <p className="text-gray-500 mt-2">
          Communicate with clients and freelancers you're working with.
        </p>
      </div>

      {/* Conversations Container */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-brand-600" size={30} />
          </div>
        ) : error ? (
          <div className="text-center py-20 px-6">
            <p className="text-red-500">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-brand-600 font-medium"
            >
              Try again
            </button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mb-4">
              <Inbox size={30} className="text-brand-600" />
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              No conversations yet
            </h2>

            <p className="text-gray-500 text-sm mt-2 max-w-sm">
              Once a client accepts your proposal, you can start communicating
              here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {conversations.map((conversation) => {
              const otherUser = getOtherUser(conversation);

              return (
                <div
                  key={conversation._id}
                  onClick={() => navigate(`/messages/${conversation._id}`)}
                  className="flex items-center gap-4 p-5 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {/* Avatar */}
                  <img
                    src={
                      otherUser?.avatar ||
                      `https://api.dicebear.com/7.x/notionists/svg?seed=${otherUser?.name || "User"}`
                    }
                    alt={otherUser?.name || "User"}
                    className="w-12 h-12 rounded-full object-cover bg-gray-100"
                  />

                  {/* Conversation Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-3">
                      <h3
                        className={`font-semibold truncate ${
                          conversation.unreadCount > 0
                            ? "text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {otherUser?.name || "Unknown User"}
                      </h3>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {formatDate(conversation.lastMessageAt)}
                        </span>

                        {conversation.unreadCount > 0 && (
                          <span className="min-w-5 h-5 px-1 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-brand-600 font-medium mt-1">
                      {conversation.gig?.title ||
                        conversation.job?.title ||
                        "Project"}
                    </p>

                    <p
                      className={`text-sm truncate mt-1 ${
                        conversation.unreadCount > 0
                          ? "text-gray-900 font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      {conversation.lastMessage || "Start your conversation"}
                    </p>
                  </div>

                  <MessageCircle
                    size={18}
                    className="text-gray-400 flex-shrink-0"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
