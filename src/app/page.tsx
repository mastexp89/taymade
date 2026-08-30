import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { Categories } from "@/components/home/categories";
import { BestSellers } from "@/components/home/best-sellers";
import { BusinessBand } from "@/components/home/business-band";
import { HowItWorks } from "@/components/home/how-it-works";
import { Reviews } from "@/components/home/reviews";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Categories />
      <BestSellers />
      <BusinessBand />
      <HowItWorks />
      <Reviews />
    </>
  );
}
