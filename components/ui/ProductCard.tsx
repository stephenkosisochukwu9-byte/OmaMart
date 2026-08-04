import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  product: any;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
  href={`/products/${product.id}`}
  key={product.id}
 className="block w-full max-w-[170px] mx-auto bg-white rounded-xl shadow hover:shadow-lg transition"
>
    <div className="relative bg-gray-100 h-32 flex items-center justify-center">

   <Image
  src={product.image}
  alt={product.name}
  fill
  sizes="(max-width:768px) 100vw, 25vw"
  className="object-contain p-3 group-hover:scale-105 transition duration-300"
  unoptimized
/>
     

    </div>

    <div className="p-2 text-gray-900">

     <span
  style={{ color: "#c2410c" }}
  className="text-xs font-semibold bg-orange-100 px-2 py-0.5 rounded-full"
>
  {product.category
  ?.split(" ")
  .map((word: string) =>
    word.charAt(0).toUpperCase() +
    word.slice(1).toLowerCase()
  )
  .join(" ")}
</span>
     <h3
 className="text-gray-900 text-base font-semibold mt-1 leading-tight h-10 overflow-hidden"
>
  {product.name.length > 16
  ? `${product.name.substring(0, 16)}...`
  : product.name}
</h3>

      <div className="flex items-center gap-1 mt-0">

        <span className="text-base font-extrabold text-orange-500">
          ₦{Number(product.price).toLocaleString()}
        </span>

        <span className="line-through text-gray-400 text-xs">
          ₦{Number(product.old_price).toLocaleString()}
        </span>

      </div>

     

     
    </div>

  </Link>
  );
}