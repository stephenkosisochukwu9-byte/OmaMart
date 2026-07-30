import Image from "next/image";

export default function Banner() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl overflow-hidden">

        <div className="grid md:grid-cols-2 items-center">

          {/* Left Side */}
          <div className="p-10 text-white">
            <span className="bg-white text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
              Limited Time Offer
            </span>

            <h2 className="text-5xl font-bold mt-6 leading-tight">
              Weekend Mega Sale
            </h2>

            <p className="mt-5 text-xl">
              Save up to{" "}
              <span className="text-yellow-300 font-bold">
                50% OFF
              </span>{" "}
              on home appliances, kitchen essentials and household products.
            </p>

            <button className="mt-8 bg-white text-orange-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition">
              Shop Deals
            </button>
          </div>

          {/* Right Side */}
          <div className="flex justify-center p-6">
            <Image
              src="/images/banner/banner.png"
              alt="Weekend Mega Sale"
              width={700}
              height={350}
              className="w-full max-w-2xl object-contain"
            />
          </div>

        </div>

      </div>
    </section>
  );
}