import CartEmpty from "@/components/cart/CartEmpty";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";

function getCartTotals(items: Array<{ quantity: number; product: { price: number } }>) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? 0 : 0;
  return { subtotal, shipping, total: subtotal + shipping };
}

export default function CartPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    updateQuantity,
    removeItem,
    isUpdatingQuantity,
    isRemovingItem,
  } = useCart();

  const items = data?.items ?? [];
  const { subtotal, shipping, total } = getCartTotals(items);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fcf5ee_0%,#fff_24%)] px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-biscuit-dark">
            Cart
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Review your items before checkout.
          </h1>
        </div>

        {isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error instanceof Error ? error.message : "Unable to load cart."}
          </div>
        ) : null}

        {isLoading ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-xl border border-biscuit-light bg-white p-4">
                  <Skeleton className="h-32 w-full rounded-xl" />
                </div>
              ))}
            </div>
            <Skeleton className="h-72 rounded-xl" />
          </div>
        ) : items.length === 0 ? (
          <CartEmpty />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={(itemId, quantity) =>
                    updateQuantity({ itemId, quantity })
                  }
                  onRemove={removeItem}
                  disabled={isUpdatingQuantity || isRemovingItem}
                />
              ))}
            </section>

            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              itemCount={items.length}
            />
          </div>
        )}
      </div>
    </main>
  );
}
