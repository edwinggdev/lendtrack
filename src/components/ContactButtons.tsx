"use client";

interface Props {
  contacto1: string;
  contacto2?: string;
}

function ContactRow({ numero }: { numero: string }) {
  const digits = numero.replace(/\D/g, "");
  return (
    <div className="flex gap-1">
      <button onClick={() => window.location.href = `tel:${numero}`} className="bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer w-8 h-8 flex items-center justify-center rounded-full" title="Llamar">
        <span className="material-symbols-outlined text-sm">phone</span>
      </button>
      {digits && (
        <button onClick={() => window.open(`https://wa.me/${digits}`, '_blank', 'noopener,noreferrer')} className="bg-green-600 text-white hover:bg-green-700 transition-colors cursor-pointer w-8 h-8 flex items-center justify-center rounded-full" title="WhatsApp">
          <span className="material-symbols-outlined text-sm">chat</span>
        </button>
      )}
    </div>
  );
}

export default function ContactButtons({ contacto1, contacto2 }: Props) {
  return (
    <div className="flex gap-1">
      {contacto1 && <ContactRow numero={contacto1} />}
      {contacto2 && <ContactRow numero={contacto2} />}
    </div>
  );
}
