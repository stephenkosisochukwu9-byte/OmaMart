import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const categoryName = slug.replace(/-/g, " ");

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("category", categoryName);

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <h1 className="text-4xl font-bold capitalize mb-8">
        {categoryName}
      </h1>

      <p className="text-gray-500 mb-8">
        {products?.length || 0} Products Found
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
  {products?.map((product) => (
   <Link
  href={`/products/${product.id}`}
  key={product.id}
  className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden block"
>
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-56 object-cover"
      />

      <div className="p-5">
        <h2 className="font-semibold text-lg">
          {product.name}
        </h2>

        <p className="text-orange-600 font-bold text-xl mt-2">
          ₦{product.price}
        </p>

        <button className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg">
          Add to Cart
        </button>
      </div>
    </Link>
  ))}
</div>
    </div>
  );
}