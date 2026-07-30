import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

        {/* Left Side */}
        <div>
          <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
            Trusted Home Shopping
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mt-6 leading-tight">
            Everything
            <br />
            Your <span className="text-orange-500">Home</span>
            <br />
            Needs
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Shop quality home electrical appliances, kitchen essentials,
            cookware, cleaning supplies and household products at affordable
            prices.
          </p>

          <div className="flex gap-4 mt-8">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold transition">
              Shop Now
            </button>

            <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition">
              Browse Categories
            </button>
          </div>

          <div className="flex gap-8 mt-10 text-gray-700">
            <div>
              <h3 className="font-bold text-xl">5000+</h3>
              <p>Happy Customers</p>
            </div>

            <div>
              <h3 className="font-bold text-xl">1000+</h3>
              <p>Products</p>
            </div>

            <div>
              <h3 className="font-bold text-xl">Fast</h3>
              <p>Delivery</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex justify-center">
          <Image
            src="/images/hero/hero.png"
            alt="OmaMart Hero"
            width={600}
            height={500}
            className="w-full max-w-xl object-contain"
            priority
          />
        </div>

      </div>
    </section>
  );
}