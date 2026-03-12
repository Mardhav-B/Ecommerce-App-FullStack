interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-xl p-4 hover:shadow-lg transition">
      <img src={product.imageUrl} className="h-40 w-full object-cover" />

      <h3 className="font-semibold mt-3">{product.name}</h3>

      <p className="text-gray-500">${product.price}</p>

      <button className="mt-3 bg-black text-white px-4 py-2 rounded">
        Add to Cart
      </button>
    </div>
  );
}
