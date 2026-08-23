import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";

import API from "../api/axios";
import { AuthContext } from "../context/authContext";

function Conversations() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // GET MY CONVERSATIONS
  // ========================================

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          "/api/chat/conversations"
        );

        setConversations(response.data);
      } catch (err) {
        console.error(
          "Fetch conversations error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load conversations."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchConversations();
    }
  }, [user]);

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="conversations-page">

        <div className="conversations-status">
          Loading conversations...
        </div>

      </main>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <main className="conversations-page">

        <div className="conversations-status">

          <h2>
            Messages
          </h2>

          <p>
            {error}
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="conversations-page">

      <div className="conversations-container">

        {/* HEADER */}

        <div className="conversations-header">

          <Link
            to="/seller"
            className="seller-orders-back"
          >
            ← Seller Dashboard
          </Link>

          <p className="section-eyebrow">
            SELLER CENTER
          </p>

          <h1 className="conversations-title">

            <MessageCircle
              size={32}
              strokeWidth={1.8}
            />

            Messages

          </h1>

          <p>
            Your conversations with buyers and sellers
          </p>

        </div>


        {/* EMPTY */}

        {conversations.length === 0 ? (

          <div className="conversations-empty">

            <div className="empty-icon">

              <MessageCircle
                size={42}
                strokeWidth={1.5}
              />

            </div>

            <h2>
              No conversations yet
            </h2>

            <p>
              Your conversations will appear here.
            </p>

          </div>

        ) : (

          <div className="conversation-list">

            {conversations.map((conversation) => {

              // Find the other person

              const currentUserId =
                user?.id || user?._id;

              const otherUser =
                currentUserId ===
                conversation.buyer?._id
                  ? conversation.seller
                  : conversation.buyer;

              return (
                <div
                  key={conversation._id}
                  className="conversation-card"
                  onClick={() =>
                    navigate(
                      `/chat/${conversation._id}`
                    )
                  }
                >

                  {/* USER INFO */}

                  <div className="conversation-user">

                    <div className="conversation-avatar">

                      {otherUser?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}

                    </div>

                    <div className="conversation-info">

                      <h3>
                        {otherUser?.name ||
                          "User"}
                      </h3>

                      <span>
                        {otherUser?.role === "seller"
                          ? "Seller"
                          : "Buyer"}
                      </span>

                    </div>

                  </div>


                  {/* MESSAGE */}

                  <div className="conversation-message">

                    <p>
                      {conversation.lastMessage ||
                        "No messages yet."}
                    </p>

                    {conversation.lastMessageAt && (
                      <small>
                        {new Date(
                          conversation.lastMessageAt
                        ).toLocaleString([], {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </small>
                    )}

                  </div>


                  {/* ARROW */}

                  <div className="conversation-arrow">

                    <ArrowRight
                      size={20}
                      strokeWidth={1.8}
                    />

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </main>
  );
}

export default Conversations;