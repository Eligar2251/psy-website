import Hero from "@/components/home/Hero";
import Problems from "@/components/home/Problems";
import HowItWorks from "@/components/home/HowItWorks";
import AboutPreview from "@/components/home/AboutPreview";
import Specializations from "@/components/home/Specializations";
import ReviewsSlider from "@/components/home/ReviewsSlider";
import BlogPreview from "@/components/home/BlogPreview";
import CTABlock from "@/components/home/CTABlock";
import FAQ from "@/components/home/FAQ";
import { siteConfig } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problems />
      <HowItWorks />
      <AboutPreview />
      <Specializations />
      <ReviewsSlider />
      <BlogPreview />
      <CTABlock />
      <FAQ />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            name: siteConfig.name,
            description: siteConfig.description,
            telephone: siteConfig.phone,
            email: siteConfig.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: "ул. Примерная, д. 10, каб. 205",
              addressLocality: "Новосибирск",
              addressCountry: "RU",
            },
            openingHours: "Mo-Fr 09:00-20:00, Sa 10:00-16:00",
            priceRange: "₽₽",
            medicalSpecialty: "Psychiatric",
          }),
        }}
      />
    </>
  );
}