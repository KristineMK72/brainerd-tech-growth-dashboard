"use client";

export default function DataDisclaimer() {
  return (
    <div className="mt-8 text-center text-xs text-gray-500">
      <p>
        This dashboard mixes <span className="font-semibold">published datasets</span>{" "}
        (BLS OEWS, Census LEHD) with <span className="font-semibold">modeled estimates</span>{" "}
        (commuting costs). Modeled values are labeled and based on transparent assumptions.
      </p>
    </div>
  );
}
