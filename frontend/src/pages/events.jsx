import { Link } from "react-router-dom";

const events = [
  {
    id: 1,
    title: "Tech & Gaming Week",
    description:
      "Discover the latest gadgets, gaming gear and smart technology from our sellers.",
    date: "August 20 – 27, 2026",
    category: "Technology",
    icon: "🎮",
  },
  {
    id: 2,
    title: "Style & Fashion Fest",
    description:
      "Explore new arrivals in men's and women's fashion, shoes and accessories.",
    date: "September 2 – 9, 2026",
    category: "Fashion",
    icon: "👗",
  },
  {
    id: 3,
    title: "Home & Living Week",
    description:
      "Refresh your space with furniture, home decor and everyday essentials.",
    date: "September 15 – 22, 2026",
    category: "Home",
    icon: "🏠",
  },
  {
    id: 4,
    title: "Kids & Family Picks",
    description:
      "Fun products, accessories and useful everyday finds for little ones.",
    date: "October 1 – 7, 2026",
    category: "Kids",
    icon: "🧸",
  },
];

function Events() {
  return (
    <main className="events-page">

      {/* HEADER */}

      <section className="events-hero">

        <p className="section-eyebrow">
          VENDORVERSE EVENTS
        </p>

        <h1>
          Discover what's
          <span> happening.</span>
        </h1>

        <p>
          Special collections, seasonal campaigns,
          shopping events and exclusive marketplace moments.
        </p>

      </section>


      {/* EVENTS */}

      <section className="events-section">

        <div className="events-grid">

          {events.map((event) => (

            <article
              className="event-card"
              key={event.id}
            >

              <div className="event-card-top">

                <div className="event-icon">
                  {event.icon}
                </div>

                <span className="event-category">
                  {event.category}
                </span>

              </div>


              <div className="event-content">

                <p className="event-date">
                  {event.date}
                </p>

                <h2>
                  {event.title}
                </h2>

                <p>
                  {event.description}
                </p>

                <Link
                  to="/products"
                  className="event-button"
                >
                  Explore Collection →
                </Link>

              </div>

            </article>

          ))}

        </div>

      </section>


      {/* CTA */}

      <section className="events-cta">

        <p className="section-eyebrow">
          NEVER MISS A DEAL
        </p>

        <h2>
          Something new is always
          around the corner.
        </h2>

        <Link
          to="/products"
          className="hero-primary-button"
        >
          Start Shopping →
        </Link>

      </section>

    </main>
  );
}

export default Events;