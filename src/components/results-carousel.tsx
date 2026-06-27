"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { src: "/after.webp", alt: "Gedi search growth results" },
  { src: "/after2.webp", alt: "Gedi search growth results after continued use" },
];

export function ResultsCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  function go(offset: number) {
    setActive((current) => (current + offset + slides.length) % slides.length);
  }

  return (
    <div className="relative mx-auto mb-12 w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-surface">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {slides.map((slide) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className="aspect-[2.55/1] w-full shrink-0 object-cover"
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous result"
        onClick={() => go(-1)}
        className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-bg/80 text-grad-subtle backdrop-blur transition hover:border-muted hover:text-grad-light"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        aria-label="Next result"
        onClick={() => go(1)}
        className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-bg/80 text-grad-subtle backdrop-blur transition hover:border-muted hover:text-grad-light"
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show result ${index + 1}`}
            onClick={() => setActive(index)}
            className={`h-1.5 rounded-full transition-all ${active === index ? "w-6 bg-highlight" : "w-1.5 bg-muted/60"}`}
          />
        ))}
      </div>
    </div>
  );
}
