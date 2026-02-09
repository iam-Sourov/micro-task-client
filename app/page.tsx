import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/home/HeroSlider";
import BestWorkers from "@/components/home/BestWorkers";
import Testimonials from "@/components/home/Testimonials";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CallToAction from "@/components/home/CallToAction";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-1">
        <HeroSlider />
        <BestWorkers />
        <HowItWorks />
        <Testimonials />
        <WhyChooseUs />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
