"use client";

import { useState } from "react";

type Props = {
  className?: string;
};

export default function SourcesMethodology({ className = "" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section className={className}>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Sources & Methodology
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Transparent inputs, clear definitions, and labeled assumptions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {open ? "Hide details" : "Show details"}
          </button>
        </div>

        {/* Quick status row */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-xs text-gray-500">Wages</div>
            <div className="mt-1 text-sm font-semibold text-gray-900">
              BLS OEWS (annual)
            </div>
            <div className="mt-1 text-xs text-gray-600">
              Published by area definitions (metro/nonmetro).
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-xs text-gray-500">Commuting flows</div>
            <div className="mt-1 text-sm font-semibold text-gray-900">
              Census LEHD LODES
            </div>
            <div className="mt-1 text-xs text-gray-600">
              Accessed via OnTheMap / GIS services.
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="text-xs text-gray-500">Cost estimates</div>
            <div className="mt-1 text-sm font-semibold text-gray-900">
              Modeled (assumptions)
            </div>
            <div className="mt-1 text-xs text-gray-600">
              Labeled as “estimated” and adjustable.
            </div>
          </div>
        </div>

        {/* Expandable details */}
        {open && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
              <h3 className="text-lg font-semibold text-indigo-900">
                Definition of tech employment
              </h3>
              <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                Tech-related employment is defined as workers in:
              </p>
              <ul className="list-disc pl-6 mt-2 text-sm text-gray-700 space-y-1">
                <li>
                  <span className="font-medium">NAICS 51</span> — Information
                </li>
                <li>
                  <span className="font-medium">NAICS 54</span> — Professional,
                  Scientific, and Technical Services
                </li>
              </ul>
              <p className="text-xs text-gray-600 mt-3">
                This matches common workforce/economic development reporting and
                keeps the dashboard defensible.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Employment and wage estimates
              </h3>
              <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                Wage charts use the Bureau of Labor Statistics Occupational
                Employment and Wage Statistics (OEWS). OEWS is released annually
                and published by metro/nonmetro area definitions. Where the
                dashboard references county context, the closest published OEWS
                geography is used and explicitly labeled.
              </p>

              <div className="mt-3 text-sm">
                <a
                  className="text-indigo-700 underline hover:text-indigo-900"
                  href="https://www.bls.gov/oes/"
                  target="_blank"
                  rel="noreferrer"
                >
                  BLS OEWS overview
                </a>
                <span className="text-gray-400"> • </span>
                <a
                  className="text-indigo-700 underline hover:text-indigo-900"
                  href="https://www.bls.gov/oes/current/oessrcma.htm"
                  target="_blank"
                  rel="noreferrer"
                >
                  OEWS methods & definitions
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Commuting and workforce flows
              </h3>
              <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                Commuting patterns are derived from the U.S. Census Bureau’s
                Longitudinal Employer-Household Dynamics (LEHD) program using
                LODES Origin–Destination (OD) data. This is administrative
                employment data (not a survey) and is widely used for
                work–home flow analysis.
              </p>

              <div className="mt-3 text-sm">
                <a
                  className="text-indigo-700 underline hover:text-indigo-900"
                  href="https://onthemap.ces.census.gov/"
                  target="_blank"
                  rel="noreferrer"
                >
                  OnTheMap (LEHD) tool
                </a>
                <span className="text-gray-400"> • </span>
                <a
                  className="text-indigo-700 underline hover:text-indigo-900"
                  href="https://lehd.ces.census.gov/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LEHD program
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Cost estimates and assumptions
              </h3>
              <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                Commuting costs (time, mileage, and optional childcare/time
                poverty) are modeled estimates. Assumptions are shown alongside
                results to make calculations transparent and adjustable.
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Tip: When you plug in real commute counts + mean commute
                distance/time, these become powerful “leakage” indicators for
                grants and planning.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="text-lg font-semibold text-gray-900">Map data</h3>
              <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                Basemap tiles are provided by OpenStreetMap contributors.
                Workforce and activity markers are illustrative unless explicitly
                sourced and cited.
              </p>
              <div className="mt-3 text-sm">
                <a
                  className="text-indigo-700 underline hover:text-indigo-900"
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noreferrer"
                >
                  OpenStreetMap attribution
                </a>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-5">
          Last updated: auto-updated when charts/data are revised in the repo.
        </p>
      </div>
    </section>
  );
}
