import { useState } from "react";

export default function Contact() {


  return (
    <div>
      <section className="facet-bg text-ivory py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <p className="uppercase tracking-[0.3em] text-xl text-gold-400 mb-4">
            Contact
          </p>
          <h1 className="font-display text-4xl sm:text-5xl">
            We're happy to help
          </h1>
          <p className="mt-5 text-ivory/70 max-w-xl mx-auto">
            Questions about a certificate, or want to talk to someone
            directly? Reach out below.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20 grid gap-10 md:grid-cols-1">
        <div className="space-y-6">
          <div className="bg-ivory rounded-2xl p-6 shadow-card ring-1 ring-stone-900/5">
            <h3 className="font-display text-xl text-emerald-900 mb-1">Address</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Raj Royal jeweller, Nai Abadi Road, Chaki Stop, Barakhau, Islamabad, Pakistan
            </p>
          </div>
          <div className="bg-ivory rounded-2xl p-6 shadow-card ring-1 ring-stone-900/5">
            <h3 className="font-display text-xl text-emerald-900 mb-1">Phone</h3>
            <p className="text-stone-600 text-sm leading-relaxed">                                <a href="tel:+923155066472" className="text-sm block mb-2">
              <i className="bi bi-phone mr-2"></i>+92-315-5066472
            </a>
              <a href="https://wa.me/923155066472" className="text-sm block">
                <i className="bi bi-whatsapp mr-2"></i>+92-315-5066472
              </a></p>
          </div>
          <div className="bg-ivory rounded-2xl p-6 shadow-card ring-1 ring-stone-900/5">
            <h3 className="font-display text-xl text-emerald-900 mb-1">Email</h3>
            <p className="text-stone-600 text-sm leading-relaxed">                                <a href="mailto:royalstonepk1@gmail.com" className="text-sm block mb-2">
              royalstonepk1@gmail.com
            </a></p>
          </div>

        </div>

      </section>
    </div>
  );
}
