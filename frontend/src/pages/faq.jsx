import { useState } from "react";
import {
  X,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

const faqData = [
  {
    question: "What is VendorVerse?",
    answer:
      "VendorVerse is a multi-vendor marketplace where customers can discover products from different independent sellers in one place.",
  },
  {
    question: "How can I place an order?",
    answer:
      "Browse products, add your favorite items to the cart, continue to checkout and complete your payment securely through Stripe.",
  },
  {
    question: "How do I track my order?",
    answer:
      "After your order has been created, you can use the Orders section of your account to view its current status and tracking information.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Pending orders can be cancelled according to the marketplace cancellation policy. Orders that have already been shipped may not be cancellable.",
  },
  {
    question: "Is payment secure?",
    answer:
      "Yes. VendorVerse uses Stripe Checkout for payment processing, so your card details are handled securely by Stripe.",
  },
  {
    question: "Can I save products for later?",
    answer:
      "Yes. Click the wishlist heart on any product to save it. Your saved products are available from the wishlist section.",
  },
  {
    question: "How can I contact VendorVerse?",
    answer:
      "You can contact our support team through the Contact page and send us a message with your question.",
  },
  {
    question: "Can sellers join VendorVerse?",
    answer:
      "VendorVerse is designed as a multi-vendor marketplace. Seller functionality can be accessed through the seller onboarding process.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(
      openIndex === index ? null : index
    );
  };

  return (
    <main className="faq-page">

      {/* HEADER */}

      <section className="faq-hero">

        <p className="section-eyebrow">
          HELP CENTER
        </p>

        <h1>
          Frequently Asked
          <span> Questions.</span>
        </h1>

        <p>
          Everything you need to know about
          shopping on VendorVerse.
        </p>

      </section>


      {/* FAQ LIST */}

      <section className="faq-section">

        <div className="faq-list">

          {faqData.map((item, index) => {

            const isOpen =
              openIndex === index;

            return (
              <div
                className={`faq-item ${
                  isOpen ? "open" : ""
                }`}
                key={index}
              >

                <button
                  type="button"
                  className="faq-question"
                  onClick={() =>
                    toggleFAQ(index)
                  }
                >

                  <span>
                    {item.question}
                  </span>

                  <span className="faq-arrow">

                    {isOpen ? (
                      <X size={22} strokeWidth={1.8} />
                    ) : (
                      <ChevronRight
                        size={22}
                        strokeWidth={1.8}
                      />
                    )}

                  </span>

                </button>


                {isOpen && (
                  <div className="faq-answer">

                    <p>
                      {item.answer}
                    </p>

                  </div>
                )}

              </div>
            );
          })}

        </div>

      </section>


      {/* CONTACT CTA */}

      <section className="faq-contact">

        <h2>
          Still have questions?
        </h2>

        <p>
          Our team would be happy to help.
        </p>

        <a
          href="/contact"
          className="hero-primary-button"
        >
          Contact Us
          <ArrowRight
            size={18}
            strokeWidth={1.8}
          />
        </a>

      </section>

    </main>
  );
}

export default FAQ;