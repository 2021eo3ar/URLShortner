import React from "react";
import HomeNavbar from "../components/HomeNavbar";
import ShortnerForm from "../components/ShortnerForm";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black">
      <HomeNavbar />
      <main className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Create Your <span className="text-green-500">Short URL</span>
          </h1>
          <ShortnerForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
