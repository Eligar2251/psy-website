"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { faqItems } from "@/lib/data";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section-padding bg-white" aria-label="Частые вопросы">
      <Container narrow>
        <SectionHeading
          title="Частые вопросы"
          subtitle="Ответы на вопросы, которые чаще всего задают перед первой консультацией"
        />

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-stone-200 overflow-hidden transition-colors hover:border-primary-200"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-heading font-semibold text-stone-900 pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  className={clsx(
                    "w-5 h-5 text-stone-400 flex-shrink-0 transition-transform duration-200",
                    openIndex === index && "rotate-180 text-primary-600"
                  )}
                />
              </button>

              <div
                id={`faq-answer-${index}`}
                role="region"
                className={clsx(
                  "overflow-hidden transition-all duration-300 ease-out",
                  openIndex === index ? "max-h-96 pb-5 md:pb-6" : "max-h-0"
                )}
              >
                <p className="px-5 md:px-6 text-stone-600 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Schema.org FAQPage разметка */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            }),
          }}
        />
      </Container>
    </section>
  );
}