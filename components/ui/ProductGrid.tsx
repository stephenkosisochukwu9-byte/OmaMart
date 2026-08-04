import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: any[];
}

export default function ProductGrid({
  products,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}