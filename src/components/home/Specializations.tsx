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
  return (
    <section className="section-padding gradient-section" aria-label="Услуги">
      <Container>
        <SectionHeading
          title="Направления работы"
          subtitle="Каждая специализация — это отдельный подход, адаптированный под ваш запрос"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || User;
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="card group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-primary-500 transition-all group-hover:translate-x-1" />
                </div>

                <h3 className="text-lg font-heading font-semibold text-stone-900 mb-2 group-hover:text-primary-700 transition-colors">
                  {service.title}
                </h3>

                <p className="text-stone-500 text-sm leading-relaxed mb-4">
                  {service.shortDescription}
                </p>

                <div className="flex items-center gap-4 text-xs text-stone-400">
                  <span>{service.duration}</span>
                  <span>•</span>
                  <span>{service.price}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}