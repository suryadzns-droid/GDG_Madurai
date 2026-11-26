import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { SpeakersCarouselSection } from "@/components/SpeakersCarouselSection";
import { ScrollTypographySection } from "@/components/ScrollTypographySection";
import { TeamIdCardsSection } from "@/components/TeamIdCardsSection";
import { FooterSection } from "@/components/FooterSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#202124] font-sans antialiased selection:bg-[#4285F4]/20 selection:text-[#202124]">
      <Navbar />
      <main>
        <HeroSection />
        <SpeakersCarouselSection />
        <ScrollTypographySection />
        <TeamIdCardsSection />
      </main>
      <FooterSection />
    </div>
  );
}
