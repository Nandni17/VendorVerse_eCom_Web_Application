import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  Mail,
  Trash2,
  Check,
  Eye,
  EyeOff,
} from "../icons";

import API from "../api/axios";

function AdminContacts() {
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH CONTACT MESSAGES
  // ==========================================

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/api/admin/contacts"
      );

      setMessages(response.data || []);
    } catch (err) {
      console.error(
        "Admin contact messages error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load contact messages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ==========================================
  // TOGGLE READ / UNREAD
  // ==========================================

  const handleStatusChange = async (
    messageId,
    currentStatus
  ) => {
    try {
      const newStatus =
        currentStatus === "unread"
          ? "read"
          : "unread";

      const response = await API.put(
        `/api/admin/contacts/${messageId}/status`,
        {
          status: newStatus,
        }
      );

      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message._id === messageId
            ? response.data
            : message
        )
      );
    } catch (err) {
      console.error(
        "Contact status error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update message status."
      );
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (messageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await API.delete(
        `/api/admin/contacts/${messageId}`
      );

      setMessages((prevMessages) =>
        prevMessages.filter(
          (message) =>
            message._id !== messageId
        )
      );
    } catch (err) {
      console.error(
        "Delete contact message error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete message."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="admin-page">

        <div className="admin-status">

          <div className="loader"></div>

          <p>
            Loading contact messages...
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="admin-page">

      {/* ==========================================
          HEADER
      ========================================== */}

      <section className="admin-header">

        <div>

          <Link
            to="/admin"
            className="admin-back-link"
          >
            <ArrowLeft
              size={17}
              strokeWidth={1.8}
            />

            <span>
              Admin Dashboard
            </span>
          </Link>


          <p className="section-eyebrow">
            ADMIN • CONTACT
          </p>


          <h1>
            Contact Messages
          </h1>


          <p>
            Review messages sent by VendorVerse
            customers.
          </p>

        </div>

      </section>


      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}


      {/* ==========================================
          CONTENT
      ========================================== */}

      <section className="admin-contact-list">

        {messages.length === 0 ? (

          /* ======================================
             EMPTY STATE
          ====================================== */

          <div className="admin-empty">

            <div className="admin-contact-empty-icon">

              <Mail
                size={32}
                strokeWidth={1.5}
              />

            </div>


            <h2>
              No messages yet
            </h2>


            <p>
              Customer contact messages will
              appear here.
            </p>

          </div>

        ) : (

          /* ======================================
             MESSAGES
          ====================================== */

          messages.map((message) => (

            <article
              key={message._id}
              className={`admin-contact-card ${
                message.status === "unread"
                  ? "unread"
                  : ""
              }`}
            >

              {/* ==================================
                  TOP
              ================================== */}

              <div className="admin-contact-top">

                <div>

                  <div className="admin-contact-name">
                    {message.name}
                  </div>


                  <a
                    href={`mailto:${message.email}`}
                    className="admin-contact-email"
                  >
                    <Mail
                      size={14}
                      strokeWidth={1.8}
                    />

                    <span>
                      {message.email}
                    </span>
                  </a>

                </div>


                <div className="admin-contact-date">

                  {message.createdAt
                    ? new Date(
                        message.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : ""}

                </div>

              </div>


              {/* ==================================
                  SUBJECT
              ================================== */}

              <div className="admin-contact-subject">

                <span>
                  Subject
                </span>

                <strong>
                  {message.subject}
                </strong>

              </div>


              {/* ==================================
                  MESSAGE
              ================================== */}

              <div className="admin-contact-message">

                <p>
                  {message.message}
                </p>

              </div>


              {/* ==================================
                  ACTIONS
              ================================== */}

              <div className="admin-contact-footer">

                <span
                  className={`admin-contact-status ${
                    message.status
                  }`}
                >
                  {message.status}
                </span>


                <div className="admin-contact-actions">

                  {/* READ / UNREAD */}

                  <button
                    type="button"
                    className="admin-contact-read-button"
                    onClick={() =>
                      handleStatusChange(
                        message._id,
                        message.status
                      )
                    }
                  >

                    {message.status ===
                    "unread" ? (
                      <>
                        <Eye
                          size={16}
                          strokeWidth={1.8}
                        />

                        <span>
                          Mark as Read
                        </span>
                      </>
                    ) : (
                      <>
                        <EyeOff
                          size={16}
                          strokeWidth={1.8}
                        />

                        <span>
                          Mark as Unread
                        </span>
                      </>
                    )}

                  </button>


                  {/* DELETE */}

                  <button
                    type="button"
                    className="admin-delete-button"
                    onClick={() =>
                      handleDelete(
                        message._id
                      )
                    }
                  >

                    <Trash2
                      size={16}
                      strokeWidth={1.8}
                    />

                    <span>
                      Delete
                    </span>

                  </button>

                </div>

              </div>

            </article>

          ))

        )}

      </section>

    </main>
  );
}

export default AdminContacts;