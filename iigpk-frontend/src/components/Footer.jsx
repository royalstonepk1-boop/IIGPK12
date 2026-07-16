import { NavLink } from "react-router-dom";

const LOGO_URL =
  "https://ecomexpanding.com/iigpk/wp-content/uploads/2024/01/iigpk-logo.png";

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-ivory/90 mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid gap-10 sm:grid-cols-3">
        <div>
          <img src={LOGO_URL} alt="IIGPK logo" className="h-12 w-auto object-contain mb-4 bg-white rounded-md p-1" />
          <p className="text-sm text-ivory/60 leading-relaxed max-w-xs">
            Independent certificate verification for gemstones — check
            authenticity in seconds using your certificate number.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg text-gold-400 mb-4">Navigate</h4>
          <ul className="space-y-2 text-sm text-ivory/70">
            <li><NavLink to="/" className="hover:text-gold-400 transition-colors">Home</NavLink></li>
            <li><NavLink to="/about" className="hover:text-gold-400 transition-colors">About Us</NavLink></li>
            <li><NavLink to="/contact" className="hover:text-gold-400 transition-colors">Contact</NavLink></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-gold-400 mb-4">Get in touch</h4>
          <ul className="space-y-2 text-sm text-ivory/70">
            <li>Raj Royal jeweller, Nai Abadi Road, Chaki Stop, Barakhau, Islamabad, Pakistan</li>
            <li>                                <a href="mailto:royalstonepk1@gmail.com" className="text-gray-400 hover:text-gold-400 text-sm block mb-2">
              royalstonepk1@gmail.com
            </a></li>
            <li>                                <a href="tel:+923155066472" className="text-gray-400 hover:text-gold-400 text-sm block mb-2">
              <i className="bi bi-phone mr-2"></i>+92-315-5066472
            </a>
              <a href="https://wa.me/923155066472" className="text-gray-400 hover:text-gold-400 text-sm block">
                <i className="bi bi-whatsapp mr-2"></i>+92-315-5066472
              </a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <p className="max-w-6xl mx-auto px-5 sm:px-8 py-5 text-xs text-center text-ivory/50">
          © {new Date().getFullYear()} IIGPK. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
