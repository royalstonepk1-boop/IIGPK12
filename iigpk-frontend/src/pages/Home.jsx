import CertificateSearch from "../components/CertificateSearch";

const LOGO_URL =
  "https://ecomexpanding.com/iigpk/wp-content/uploads/2024/01/iigpk-logo.png";
const VIDEO_ID = "E4kKLVm5XIA";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://res.cloudinary.com/dox58sidi/image/upload/v1784237106/istockphoto-1222335712-612x612_gcfkv6.jpg)`,
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-20 flex flex-col items-center text-center">
          <img
            src={LOGO_URL}
            alt="IIGPK logo"
            className="h-20 sm:h-24 w-auto object-contain mb-8 bg-white rounded-2xl p-3 shadow-card"
          />
          <p className="uppercase tracking-[0.3em] text-xs font-bold sm:text-sm text-gold-400 mb-4">
            International Institute of Gemology (IIG)
          </p>
          <h1 className="font-display text-white  text-4xl sm:text-6xl leading-tight text-balance max-w-3xl">
            Confirm your gemstone's certificate in seconds
          </h1>
          <p className="mt-5 text-ivory/70 max-w-xl text-base sm:text-lg">
            Enter the number printed on your certificate below and we'll pull
            up the matching record instantly.
          </p>

          <div className="mt-10 w-full">
            <CertificateSearch />
          </div>
        </div>
      </section>

      {/* Video section */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.3em] text-xl text-gold-600 mb-3">
            Watch
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-emerald-950">
            See how certification works
          </h2>
        </div>
        <div className="relative w-full pt-[56.25%] rounded-2xl overflow-hidden shadow-card ring-1 ring-stone-900/10">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${VIDEO_ID}`}
            title="IIGPK introduction video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </section>

      {/* Feature strip */}
      <section className="bg-transparent py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid gap-8 sm:grid-cols-3">
          {[
            {
              title: "Instant lookup",
              copy: "Type in a certificate number and get a real-time match against our records.",
            },
            {
              title: "Trusted records",
              copy: "Every certificate on file is tied to a verified gemological assessment.",
            },
            {
              title: "Simple by design",
              copy: "No account, no downloads — just the number from your certificate.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-ivory rounded-2xl p-7 shadow-card ring-1 ring-stone-900/5">
              <h3 className="font-display text-2xl text-emerald-900 mb-2">{f.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{f.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
