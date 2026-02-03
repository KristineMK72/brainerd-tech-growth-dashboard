export type GeographyKey = "crow_wing_county" | "ne_mn_nonmetro" | "brainerd_micropolitan";

export type WageMode = "median" | "mean";

export type WageRow = {
  group: string;
  tech: boolean;
  median: number; // dollars
  mean: number;   // dollars
};

export type CommuteRow = {
  label: string;
  localTechWorkers: number;     // people working in-area (or working local)
  techCommutersOut: number;     // residents who work outside area (tech-ish)
  remoteOutOfArea: number;      // residents working remote for out-of-area employers (optional bucket)
  avgRoundTripMiles: number;    // assumptions used for cost calc
  avgRoundTripMinutes: number;  // assumptions used for cost calc
};

export type GeographyDataset = {
  key: GeographyKey;
  name: string;
  wageRows: WageRow[];
  commute: CommuteRow;
  notes: string[];
};

export const DATASETS: GeographyDataset[] = [
  {
    key: "crow_wing_county",
    name: "Crow Wing County (preferred)",
    wageRows: [
      // Replace these with verified values for your chosen source/geography.
      { group: "Computer & Mathematical", tech: true,  median: 82680, mean: 90140 },
      { group: "Architecture & Engineering", tech: true, median: 80610, mean: 88450 },
      { group: "Business & Financial Ops", tech: false, median: 73880, mean: 80720 },
      { group: "Health Practitioners (Clinical)", tech: false, median: 94710, mean: 103480 },
      { group: "Construction & Extraction", tech: false, median: 67560, mean: 73840 },
      { group: "Education (Instruction & Library)", tech: false, median: 58820, mean: 64320 },
      { group: "Sales & Related", tech: false, median: 36700, mean: 40150 },
      { group: "Food Prep & Serving", tech: false, median: 30840, mean: 33730 },
    ],
    commute: {
      label: "Crow Wing County",
      localTechWorkers: 420,
      techCommutersOut: 180,
      remoteOutOfArea: 90,
      avgRoundTripMiles: 44,
      avgRoundTripMinutes: 62,
    },
    notes: [
      "Swap in county-verified wage rows + commute counts from ACS/LEHD.",
      "This dataset is wired for visuals + cost estimates; numbers can be updated anytime.",
    ],
  },

  {
    key: "ne_mn_nonmetro",
    name: "Northeast MN nonmetropolitan area (BLS OEWS style)",
    wageRows: [
      // Placeholders — you can copy values from the specific BLS area page once you decide to use this geography.
      { group: "Computer & Mathematical", tech: true,  median: 81000, mean: 89000 },
      { group: "Architecture & Engineering", tech: true, median: 79000, mean: 87500 },
      { group: "Business & Financial Ops", tech: false, median: 70000, mean: 78000 },
      { group: "Health Practitioners (Clinical)", tech: false, median: 92000, mean: 101000 },
      { group: "Construction & Extraction", tech: false, median: 64000, mean: 71000 },
      { group: "Education (Instruction & Library)", tech: false, median: 57000, mean: 63000 },
      { group: "Sales & Related", tech: false, median: 36000, mean: 39500 },
      { group: "Food Prep & Serving", tech: false, median: 30000, mean: 33000 },
    ],
    commute: {
      label: "NE MN nonmetro",
      localTechWorkers: 1800,
      techCommutersOut: 950,
      remoteOutOfArea: 400,
      avgRoundTripMiles: 52,
      avgRoundTripMinutes: 72,
    },
    notes: [
      "Matches how OEWS publishes nonmetropolitan areas.",
      "Use if you want ‘BLS-ready’ comparability, but it’s broader than Brainerd/Crow Wing.",
    ],
  },

  {
    key: "brainerd_micropolitan",
    name: "Brainerd micropolitan (custom/placeholder)",
    wageRows: [
      { group: "Computer & Mathematical", tech: true,  median: 84000, mean: 92000 },
      { group: "Architecture & Engineering", tech: true, median: 82000, mean: 90000 },
      { group: "Business & Financial Ops", tech: false, median: 72000, mean: 80000 },
      { group: "Health Practitioners (Clinical)", tech: false, median: 95000, mean: 104000 },
      { group: "Construction & Extraction", tech: false, median: 69000, mean: 75000 },
      { group: "Education (Instruction & Library)", tech: false, median: 59000, mean: 65000 },
      { group: "Sales & Related", tech: false, median: 37000, mean: 40500 },
      { group: "Food Prep & Serving", tech: false, median: 31000, mean: 34000 },
    ],
    commute: {
      label: "Brainerd micro (custom)",
      localTechWorkers: 520,
      techCommutersOut: 260,
      remoteOutOfArea: 130,
      avgRoundTripMiles: 48,
      avgRoundTripMinutes: 68,
    },
    notes: [
      "Only keep this if you have a consistent definition + sourced table.",
      "Otherwise, county is usually the cleanest civic dashboard geography.",
    ],
  },
];
