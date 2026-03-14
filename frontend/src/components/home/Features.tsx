import { CreditCard, Headphones, RefreshCcw, Truck } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Truck,
      title: "Fast Dispatch",
      description: "Quick order processing with clear delivery timelines.",
    },
    {
      icon: RefreshCcw,
      title: "Easy Returns",
      description: "Simple return flows if the product is not the right fit.",
    },
    {
      icon: Headphones,
      title: "Human Support",
      description: "Direct support for order, shipping, and account questions.",
    },
    {
      icon: CreditCard,
      title: "Secure Checkout",
      description: "Protected checkout and authenticated account actions.",
    },
  ];

  return (
    <section className="px-3 py-12 sm:px-4 sm:py-16 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-[1.35rem] border border-biscuit-light bg-white p-4 shadow-sm sm:rounded-[1.75rem] sm:p-6"
          >
            <div className="flex size-11 items-center justify-center rounded-2xl bg-biscuit-light text-biscuit-dark sm:size-12">
              <feature.icon size={22} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900 sm:mt-5">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-5 text-slate-500 sm:leading-6">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
