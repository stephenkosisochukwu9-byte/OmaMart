
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import AddToCartButton from "@/components/products/AddToCartButton";


interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold">
          Product Not Found
        </h1>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">

      <div className="grid md:grid-cols-2 gap-12">

        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            className="rounded-xl w-full"
          />
        </div>

        <div>

          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <p className="text-3xl text-orange-600 font-bold mt-6">
            ₦{product.price}
          </p>

          <p className="text-gray-600 mt-8">
            {product.description}
          </p>
          <AddToCartButton product={product} />
         

        </div>

      </div>

    </main>
  );
}
