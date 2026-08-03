import Image from "next/image";

export default function Banner() {
  return (
   <section className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-10">
     <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl overflow-hidden py-2">

        <div className="flex justify-center items-center p-2">
          {/* Left Side */}
          <div className="p-4 md:p-10 text-white">
            <span className="bg-white text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
              Limited Time Offer
            </span>

           <h2 className="text-2xl md:text-5xl font-bold mt-2 leading-tight">
              Weekend Mega Sale
            </h2>

            <p className="mt-2 text-sm md:text-xl leading-6">
              Save up to{" "}
              <span className="text-yellow-300 font-bold">
                50% OFF
              </span>{" "}
              on home appliances, kitchen essentials and household products.
            </p>

           <button className="mt-4 bg-white text-orange-600 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold hover:bg-gray-100 transition">
              Shop Deals
            </button>
          </div>

          {/* Right Side */}
          <div className="flex justify-center items-center w-2/5 md:w-auto">
            <Image
              src="/images/banner/banner.png"
              alt="Weekend Mega Sale"
              width={700}
              height={350}
              className="w-full max-w-[170px] md:max-w-sm h-auto object-contain"
            />
          </div>

        </div>

      </div>
    </section>
  );
}