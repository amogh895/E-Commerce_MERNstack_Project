import React from "react";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">About Electronify</h1>
        <p className="text-lg text-gray-600 mb-6 text-center leading-relaxed">
          Welcome to <strong>Electronify</strong>, your premier destination for high-quality, high-performance electronics. We specialize in bringing you state-of-the-art tech, including Laptops, Mobiles, Audio systems, and essential tech accessories.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-100">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Our Goal</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We focus strictly on premium electronic equipment. By cutting out unrelated consumer goods, we guarantee optimized distribution, higher stock availability, and dedicated support for technology enthusiasts.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Convenience & Tracking</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              With Cash on Delivery (COD) payment systems, customer order tracking history, and live support messaging portals, we make ordering tech hassle-free and reliable.
            </p>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 text-center text-xs text-gray-500 font-semibold">
          © {new Date().getFullYear()} Electronify Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default About;
