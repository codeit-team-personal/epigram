"use client";

import React from "react";
import { useInView } from "@/hooks/useInView";

type SlideSectionProps = {
  children: React.ReactNode;
  direction?: "left" | "right" | "up";
};

export default function SlideSection({
  children,
  direction = "right",
}: SlideSectionProps) {
  const { ref, inView } = useInView(0.5);

  const base =
    "min-h-screen flex justify-center items-center text-3xl font-bold transition-all duration-700 ease-in-out";

  let hidden = "";
  if (direction === "left") hidden = "opacity-0 -translate-x-24";
  if (direction === "right") hidden = "opacity-0 translate-x-24";
  if (direction === "up") hidden = "opacity-0 translate-y-24";

  const visible = "opacity-100 translate-x-0 translate-y-0";

  return (
    <section ref={ref} className={`${base} ${inView ? visible : hidden}`}>
      {children}
    </section>
  );
}
