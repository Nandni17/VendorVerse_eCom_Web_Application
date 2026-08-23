
             import { useEffect, useState, useContext } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  ArrowLeft,
  Pencil,
  Trash2,
} from "../icons";

import API from "../api/axios";
import { AuthContext } from "../context/authContext";

function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { conversationId } = useParams();

  const { productId } = location.state || {};
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // EDIT MESSAGE
  // =========================

  const [editingMessageId, setEditingMessageId] =
    useState(null);

  const [editingText, setEditingText] =
    useState("");

  const [editing, setEditing] =
    useState(false);


  // =========================
  // GET MESSAGES
  // =========================

  const fetchMessages = async () => {
    try {
      const response = await API.get(
        `/api/chat/conversation/${conversationId}/messages`
      );

      setMessages(response.data);

    } catch (err) {
      console.error(
        "Fetch messages error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load messages."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);


  // =========================
  // SEND MESSAGE
  // =========================

  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const response = await API.post(
        `/api/chat/conversation/${conversationId}/message`,
        {
          text: text.trim(),
        }
      );

      setMessages((prev) => [
        ...prev,
        response.data.data,
      ]);

      setText("");

    } catch (err) {
      console.error(
        "Send message error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to send message."
      );

    } finally {
      setSending(false);
    }
  };


  // =========================
  // START EDIT
  // =========================

  const handleStartEdit = (message) => {
    setEditingMessageId(message._id);
    setEditingText(message.text);
    setError("");
  };


  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText("");
  };


  // =========================
  // SAVE EDIT
  // =========================

  const handleSaveEdit = async (messageId) => {
    if (!editingText.trim()) {
      return;
    }

    try {
      setEditing(true);
      setError("");

      const response = await API.put(
        `/api/chat/message/${messageId}`,
        {
          text: editingText.trim(),
        }
      );

      const updatedMessage =
        response.data.data;

      setMessages((prev) =>
        prev.map((message) =>
          message._id === messageId
            ? updatedMessage
            : message
        )
      );

      setEditingMessageId(null);
      setEditingText("");

    } catch (err) {
      console.error(
        "Edit message error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to edit message."
      );

    } finally {
      setEditing(false);
    }
  };


  // =========================
  // DELETE MESSAGE
  // =========================

  const handleDelete = async (messageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await API.delete(
        `/api/chat/message/${messageId}`
      );

      setMessages((prev) =>
        prev.filter(
          (message) =>
            message._id !== messageId
        )
      );

    } catch (err) {
      console.error(
        "Delete message error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete message."
      );
    }
  };


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="chat-page">

        <div className="chat-status">
          Loading conversation...
        </div>

      </main>
    );
  }


  return (
    <main className="chat-page">

      <div className="chat-container">

        {/* =========================
            BACK BUTTON
        ========================= */}

        <button
          type="button"
          className="chat-back-button"
          onClick={() => {
            if (user?.role === "seller") {
              navigate("/conversations");
            } else {
              if (productId) {
                navigate(
                  `/products/${productId}`
                );
              } else {
                navigate("/products");
              }
            }
          }}
        >
          <ArrowLeft
            size={17}
            strokeWidth={1.8}
          />

          <span>
            {user?.role === "seller"
              ? "Back to Conversations"
              : "Back to Product"}
          </span>
        </button>


        {/* =========================
            HEADER
        ========================= */}

        <div className="chat-header">

          <h1>
            Chat
          </h1>

          <p>
            Buyer & Seller Conversation
          </p>

        </div>


        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}


        {/* =========================
            MESSAGES
        ========================= */}

        <div className="chat-messages">

          {messages.length === 0 ? (

            <div className="chat-empty">
              No messages yet.
            </div>

          ) : (

            messages.map((message) => {

              const isMine =
                message.sender?._id === user?.id;

              const isEditing =
                editingMessageId ===
                message._id;

              return (

                <div
                  key={message._id}
                  className={
                    isMine
                      ? "chat-message mine"
                      : "chat-message"
                  }
                >

                  <div className="chat-bubble">

                    {/* =========================
                        EDIT MODE
                    ========================= */}

                    {isEditing ? (

                      <div className="chat-edit-area">

                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) =>
                            setEditingText(
                              e.target.value
                            )
                          }
                          autoFocus
                        />


                        <div className="chat-edit-actions">

                          <button
                            type="button"
                            onClick={() =>
                              handleSaveEdit(
                                message._id
                              )
                            }
                            disabled={
                              editing ||
                              !editingText.trim()
                            }
                          >
                            {editing
                              ? "Saving..."
                              : "Save"}
                          </button>


                          <button
                            type="button"
                            onClick={
                              handleCancelEdit
                            }
                            disabled={editing}
                          >
                            Cancel
                          </button>

                        </div>

                      </div>

                    ) : (

                      <>

                        {/* MESSAGE TEXT */}

                        <p>
                          {message.text}
                        </p>


                        {/* TIME */}

                        <small>
                          {message.createdAt
                            ? new Date(
                                message.createdAt
                              ).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : ""}
                        </small>


                        {/* =========================
                            EDIT / DELETE
                            ONLY FOR MY MESSAGE
                        ========================= */}

                        {isMine && (

                          <div className="chat-message-actions">

                            <button
                              type="button"
                              onClick={() =>
                                handleStartEdit(
                                  message
                                )
                              }
                              aria-label="Edit message"
                            >
                              <Pencil
                                size={14}
                                strokeWidth={1.8}
                              />

                              <span>
                                Edit
                              </span>
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  message._id
                                )
                              }
                              aria-label="Delete message"
                            >
                              <Trash2
                                size={14}
                                strokeWidth={1.8}
                              />

                              <span>
                                Delete
                              </span>
                            </button>

                          </div>

                        )}

                      </>

                    )}

                  </div>

                </div>

              );

            })

          )}

        </div>


        {/* =========================
            SEND MESSAGE
        ========================= */}

        <form
          className="chat-input-area"
          onSubmit={handleSend}
        >

          <input
            type="text"
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
            placeholder="Type a message..."
          />


          <button
            type="submit"
            disabled={
              sending ||
              !text.trim()
            }
          >
            {sending
              ? "Sending..."
              : "Send"}
          </button>

        </form>

      </div>

    </main>
  );
}

export default Chat;

 