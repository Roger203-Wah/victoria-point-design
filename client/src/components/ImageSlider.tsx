import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ImageSlide = {
  src: string;
  alt: string;
};

type ImageSliderProps = {
  slides: ImageSlide[];
  /** Accessible name for this carousel, such as "Before". */
  label: string;
  /**
   * Fixed frame shared by every slide. object-fit: cover fills it, so mixed
   * aspect ratios do not change the layout. Override when another section
   * needs a different frame.
   */
  frameClassName?: string;
  className?: string;
};

const controlStyle = {
  background: "oklch(0.15 0.01 55 / 0.75)",
  color: "oklch(0.97 0.005 75)",
  backdropFilter: "blur(8px)",
  border: "none",
} as const;

/**
 * One-at-a-time image frame with arrows, dots, and swipe.
 * Other sections can reuse it by passing their own slides.
 */
export function ImageSlider({
  slides,
  label,
  frameClassName = "aspect-[3/4] w-full",
  className,
}: ImageSliderProps) {
  const [reduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    duration: reduceMotion ? 0 : 25,
  });
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(slides.length > 1);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelected(emblaApi.selectedScrollSnap());
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  if (slides.length === 0) return null;

  const multiple = slides.length > 1;

  return (
    <div
      className={cn("relative overflow-hidden select-none", className)}
      style={{ borderRadius: "2px" }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={event => {
        if (!multiple) return;
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          emblaApi?.scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          emblaApi?.scrollNext();
        }
      }}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={slide.src}
              className="min-w-0 shrink-0 grow-0 basis-full"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              aria-hidden={index === selected ? undefined : true}
            >
              <div
                className={cn("relative", frameClassName)}
                style={{ background: "oklch(0.92 0.008 75)" }}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  draggable={false}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  onDragStart={event => event.preventDefault()}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {multiple && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            disabled={!canPrev}
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full disabled:opacity-40"
            style={controlStyle}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            disabled={!canNext}
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full disabled:opacity-40"
            style={controlStyle}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
          <div
            className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2"
            style={{
              background: "oklch(0.15 0.01 55 / 0.72)",
              backdropFilter: "blur(8px)",
              borderRadius: "100px",
              padding: "4px 8px",
            }}
          >
            {slides.map((slide, index) => {
              const active = index === selected;
              return (
                <button
                  key={slide.src}
                  type="button"
                  aria-label={`Show photo ${index + 1} of ${slides.length}`}
                  aria-current={active ? "true" : undefined}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className="flex h-8 w-7 items-center justify-center"
                >
                  <span
                    aria-hidden="true"
                    className="block rounded-full"
                    style={{
                      width: active ? 18 : 7,
                      height: 7,
                      background: active
                        ? "oklch(0.97 0.005 75)"
                        : "oklch(0.97 0.005 75 / 0.45)",
                      transition: "width 0.2s ease, background 0.2s ease",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </>
      )}

      <span className="sr-only" aria-live="polite">
        {label}, photo {selected + 1} of {slides.length}
      </span>
    </div>
  );
}
