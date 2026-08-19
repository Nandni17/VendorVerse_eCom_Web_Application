import { useState } from "react";

import API from "../api/axios";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setSubmitted(false);
      setError("");

      await API.post(
        "/api/contact",
        formData
      );

      // Only clear after successful DB save
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setSubmitted(true);

    } catch (err) {
      console.error(
        "Contact form error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to send your message."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">

      {/* HEADER */}

      <section className="contact-hero">

        <p className="section-eyebrow">
          GET IN TOUCH
        </p>

        <h1>
          We'd love to
          <span> hear from you.</span>
        </h1>

        <p>
          Have a question, suggestion, or need
          help with your VendorVerse experience?
        </p>

      </section>


      {/* CONTACT AREA */}

      <section className="contact-section">

        {/* LEFT */}

        <div className="contact-info">

          <div className="contact-info-card">

            <div className="contact-info-icon">
              ✉
            </div>

            <div>
              <h3>
                Email
              </h3>

              <p>
                support@vendorverse.com
              </p>
            </div>

          </div>


          <div className="contact-info-card">

            <div className="contact-info-icon">
              ☎
            </div>

            <div>
              <h3>
                Phone
              </h3>

              <p>
                +92 300 1234567
              </p>
            </div>

          </div>


          <div className="contact-info-card">

            <div className="contact-info-icon">
              📍
            </div>

            <div>
              <h3>
                Location
              </h3>

              <p>
                Karachi, Pakistan
              </p>
            </div>

          </div>


          <div className="contact-note">

            <h3>
              We're here to help.
            </h3>

            <p>
              Our support team is ready to help
              with orders, payments, sellers,
              returns and anything else you need.
            </p>

          </div>

        </div>


        {/* RIGHT */}

        <div className="contact-form-card">

          <h2>
            Send us a message
          </h2>


          {/* SUCCESS */}

          {submitted && (
            <div className="contact-success">
              ✓ Your message has been sent
              successfully.
            </div>
          )}


          {/* ERROR */}

          {error && (
            <div className="contact-error">
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            <div className="contact-form-row">

              <div className="contact-form-group">

                <label>
                  Your Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />

              </div>


              <div className="contact-form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />

              </div>

            </div>


            <div className="contact-form-group">

              <label>
                Subject
              </label>

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                required
              />

            </div>


            <div className="contact-form-group">

              <label>
                Message
              </label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                rows="6"
                required
              />

            </div>


            <button
              type="submit"
              className="contact-submit-button"
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send Message →"}
            </button>

          </form>

        </div>

      </section>

    </main>
  );
}

export default Contact;