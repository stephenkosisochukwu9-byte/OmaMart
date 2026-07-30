import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="bg-gray-50 min-h-screen">

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">

            <h1 className="text-3xl font-extrabold">
              Contact OmaMart
            </h1>

            <p className="mt-5 text-lg text-blue-100 max-w-2xl mx-auto">
              We're always happy to help. Reach out to us for product enquiries,
              order updates, deliveries or general support.
            </p>

          </div>
        </section>

        {/* Contact Cards */}
        <section className="max-w-7xl mx-auto px-6 py-16">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition">
              <Phone
                className="mx-auto text-orange-500"
                size={40}
              />

              <h2 className="text-xl font-bold mt-5 text-gray-900">
                Phone
              </h2>

              <a
                href="tel:+2348000000000"
                className="text-gray-900 mt-3 block hover:text-orange-500"
              >
                +234 800 000 0000
              </a>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition">
              <Mail
                className="mx-auto text-orange-500"
                size={40}
              />

              <h2 className="text-xl font-bold mt-5 text-gray-900">
                Email
              </h2>

              <a
                href="mailto:support@omamart.com"
                className="text-gray-900 mt-3 block hover:text-orange-500"
              >
                support@omamart.com
              </a>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition">
              <MapPin
                className="mx-auto text-orange-500"
                size={40}
              />

              <h2 className="text-xl font-bold mt-5 text-gray-900">
                Address
              </h2>

              <p className="text-gray-900 mt-3">
                Anambra, Nigeria
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition">
              <Clock
                className="mx-auto text-orange-500 "
                size={40}
              />

              <h2 className="text-xl font-bold mt-5 text-gray-900">
                Business Hours
              </h2>

              <p className="text-gray-900 mt-3">
                Monday - Saturday
                <br />
                8:00 AM - 6:00 PM
              </p>
            </div>

          </div>

        </section>

        {/* Support Section */}

        <section className="max-w-5xl mx-auto px-6 pb-20">

          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

            <h2 className="text-3xl font-bold text-blue-600">
              Need Assistance?
            </h2>

            <p className="mt-6 text-gray-900 leading-8 text-lg">
              Our customer support team is available during business hours to
              assist you with product enquiries, order tracking, deliveries,
              returns and every other shopping-related question.
            </p>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}