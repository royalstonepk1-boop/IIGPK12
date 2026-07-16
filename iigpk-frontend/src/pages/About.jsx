export default function About() {
  return (
    <div>
      <section className="facet-bg text-ivory py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <p className="uppercase tracking-[0.3em] text-xl text-gold-400 mb-4">
            About Us
          </p>
          <h1 className="font-display text-4xl sm:text-5xl">
            Independent, careful, and precise
          </h1>
          <p className="mt-5 text-ivory/70 max-w-2xl mx-auto">
            IIGPK exists to give buyers, sellers, and collectors a clear,
            verifiable record for every gemstone that passes through our
            hands.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20 grid gap-12 md:grid-cols-2 md:items-start">
        <div>
          <h2 className="font-display text-3xl text-emerald-950 mb-4">
            What we do
          </h2>
          <p className="text-stone-700 leading-relaxed mb-4">
            We assess and document gemstones, issuing a numbered certificate
            for each one we examine. That number is the link between the
            physical stone in someone's hand and the record we keep on file —
            search it on our home page and you'll see the exact image tied to
            that certificate.
          </p>
          <p className="text-stone-700 leading-relaxed">
            Our process favours consistency over speed. Every certificate
            reflects a genuine examination, not a template, so the number on
            it means something when it's checked.
          </p>
        </div>
        <div>
          <h2 className="font-display text-3xl text-emerald-950 mb-4">
            Why it matters
          </h2>
          <p className="text-stone-700 leading-relaxed mb-4">
            Gemstones travel through many hands between the person who
            examines them and the person who eventually owns them. A
            certificate is only useful if it can be verified independently —
            so we built this lookup to make that a two-second task instead of
            a phone call.
          </p>
          <p className="text-stone-700 leading-relaxed">
            Whether you're a buyer confirming a purchase, a jeweller checking
            stock, or a collector cataloguing a collection, the same number
            works the same way, every time.
          </p>
        </div>
      </section>

      <section className="bg-transparent py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 grid gap-8 sm:grid-cols-3 text-center">
          {[
            { stat: "Certificate-first", label: "Every stone gets a unique, searchable number" },
            { stat: "Verified records", label: "Backed by real gemological assessment" },
            { stat: "Open lookup", label: "No account needed to verify a certificate" },
          ].map((s) => (
            <div key={s.stat} className="bg-ivory rounded-2xl p-7 shadow-card ring-1 ring-stone-900/5">
              <p className="font-display text-2xl text-gold-600 mb-2">{s.stat}</p>
              <p className="text-sm text-stone-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
