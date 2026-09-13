import Image from "next/image";

/**
 * Art direction for the personal portrait, per PRD §8:
 * - no card, no simple circle, no "image + white box + border"
 * - edge-to-edge / asymmetric crop, layered background, overlapping type
 * - mobile gets its own composition, not a shrunk desktop version
 */
export default function Portrait() {
  return (
    <div className="relative">
      {/* Desktop / tablet: large asymmetric bleed, right-anchored, cropped at the edges */}
      <div className="relative hidden aspect-[4/5] w-full overflow-hidden rounded-tl-[120px] md:block">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-accent/[0.06]" />
        <Image
          src="/images/atiq-portrait.png"
          alt="عتيق الجذوة"
          fill
          priority
          sizes="(min-width: 768px) 45vw, 100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-canvas via-canvas/40 to-transparent" />
      </div>

      {/* Mobile: separate composition — full-bleed band, not a shrunk crop */}
      <div className="relative aspect-[3/4] w-full overflow-hidden md:hidden">
        <Image
          src="/images/atiq-portrait.png"
          alt="عتيق الجذوة"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_15%]"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-canvas to-transparent" />
      </div>
    </div>
  );
}
