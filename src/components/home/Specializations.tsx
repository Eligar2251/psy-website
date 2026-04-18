"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  User,
  Heart,
  Sparkles,
  Users,
  Shield,
  Battery,
} from "lucide-react";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { services } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  User,
  Heart,
  Sparkles,
  Users,
  Shield,
  Battery,
};

export default function Specializations() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-padding gradient-section relative overflow-hidden" aria-label="Услуги">
      {/* Decorative elements */}
      <div className="gradient-orb gradient-orb-accent w-80 h-80 -top-40 right-0" aria-hidden="true" />
      
      <Container className="relative z-10">
        <SectionHeading
          title="Направления работы"
          subtitle="Каждая специализация — это отдельный подход, адаптированный под ваш запрос"
        />

        <div 
          ref={gridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger"
        >
          {services.map((service) => {
            const Icon = iconMap[service.icon] || User;
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="card group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-primary-500 transition-all duration-300 group-hover:translate-x-1" />
                </div>

                <h3 className="text-lg font-heading font-semibold text-stone-900 mb-2 group-hover:text-primary-700 transition-colors">
                  {service.title}
                </h3>

                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  {service.shortDescription}
                </p>

                <div className="flex items-center gap-4 text-xs text-stone-500 pt-2 border-t border-stone-100">
                  <span>{service.duration}</span>
                  <span className="text-primary-300">•</span>
                  <span className="font-medium text-primary-600">{service.price}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
