"use client";

import type { GeographyDataset, WageMode } from "../data/datasets";

type Props = {
  dataset: GeographyDataset;
  wageMode: WageMode;
  className?: string;
};

export default function SourcesMethodology({ dataset, wageMode, className }: Props) {
  return (
    <section className={className ?? ""}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900">Sources & Methodology</h3>

        <div className="mt-3 space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            <span className="font-semibold">Selected geography:</span> {dataset.name}
          </p>

          <p>
            <span className="font-semibold">Wage data:</span> BLS Occupational Employment and Wage Statistics (OEWS),
            released annually. This dashboard is currently showing{" "}
            <span className="font-semibold">{wageMode}</span> annual wages by occupational group.
          </p>

          <p>
            <span className="font-semibold">Commuting flows:</span> Recommended sources are the Census “County-to-County
            Commuting Flows” (ACS 5-year) or LEHD LODES / OnTheMap flows (better for mapping and origin–destination
            visualization).
          </p>

          <p>
            <span className="font-semibold">Map basemap:</span> OpenStreetMap.
          </p>
        </div>

        {dataset.notes?.length ? (
          <div className="mt-4 rounded-xl bg-gray-50 border border-gray-100 p-4">
            <div className="text-xs font-semibold text-gray-600 mb-2">Dataset notes</div>
            <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
              {dataset.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-4 text-xs text-gray-500">
          Tip: When you finalize your preferred geography + table extracts, you can replace assumptions with sourced
          counts for commuters and remote workers.
        </div>
      </div>
    </section>
  );
}
