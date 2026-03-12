import { Truck, RefreshCcw, Headphones, CreditCard } from "lucide-react";

export default function Features() {
  const features = [
    { icon: Truck, title: "Free Shipping" },
    { icon: RefreshCcw, title: "Easy Returns" },
    { icon: Headphones, title: "24/7 Support" },
    { icon: CreditCard, title: "Secure Payment" },
  ];

  return (
    <section className="py-16 bg-biscuit-light">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 text-center">
        {features.map((f, i) => (
          <div key={i}>
            <f.icon size={32} className="mx-auto text-biscuit mb-3" />

            <h3 className="font-semibold">{f.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
