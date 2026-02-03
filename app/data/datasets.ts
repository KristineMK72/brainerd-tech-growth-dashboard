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
  localTechWorkers: number;
  techCommutersOut: number;
  remoteOutOfArea: number;
  avgRoundTripMiles: number;
  avgRoundTripMinutes: number;
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
    name: "Crow Wing County (preferred civic geography)",
    wageRows: [
      { group: "Management", tech: false, median: 98420, mean: 107650 },
      { group: "Healthcare Practitioners & Technical", tech: false, median: 94710, mean: 103480 },
      { group: "Computer & Mathematical", tech: true, median: 82680, mean: 90140 },
      { group: "Architecture & Engineering", tech: true, median: 80610, mean: 88450 },
      { group: "Business & Financial Operations", tech: false, median: 73880, mean: 80720 },
      { group: "Construction & Extraction", tech: false, median: 67560, mean: 73840 },
      { group: "Educational Instruction & Library", tech: false, median: 58820, mean: 64320 },
      { group: "Sales & Related", tech: false, median: 36700, mean: 40150 },
      { group: "Food Preparation & Serving", tech: false, median: 30840, mean: 33730 },
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
      "Wages: BLS Occupational Employment & Wage Statistics (OEWS), May 2024 reference period (released April 2025).",
      "Commuting: use ACS county-to-county flows OR LEHD LODES/OnTheMap for origin-destination patterns.",
      "Tech = Computer & Mathematical + related engineering groups (adjustable).",
    ],
  },

  {
    key: "ne_mn_nonmetro",
    name: "Northeast MN nonmetropolitan area (OEWS nonmetro style)",
    wageRows: [
      { group: "Computer & Mathematical", tech: true,  median: 81000, mean: 89000 },
      { group: "Architecture & Engineering", tech: true, median: 79000, mean: 87500 },
      { group: "Business & Financial Operations", tech: false, median: 70000, mean: 78000 },
      { group: "Healthcare Practitioners & Technical", tech: false, median: 92000, mean: 101000 },
      { group: "Construction & Extraction", tech: false, median: 64000, mean: 71000 },
      { group: "Educational Instruction & Library", tech: false, median: 57000, mean: 63000 },
      { group: "Sales & Related", tech: false, median: 36000, mean: 39500 },
      { group: "Food Preparation & Serving", tech: false, median: 30000, mean: 33000 },
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
      "Use for ‘regional context’ comparisons in an OEWS-compatible way (broader than Brainerd/Crow Wing).",
      "Wages: BLS OEWS nonmetropolitan area definitions (May 2024 / released April 2025).",
      "Commuting: recommended via LEHD LODES / OnTheMap for flow-style visuals.",
    ],
  },

  {
    key: "brainerd_micropolitan",
    name: "Brainerd micropolitan (only keep if your source uses a stable definition)",
    wageRows: [
      { group: "Computer & Mathematical", tech: true,  median: 84000, mean: 92000 },
      { group: "Architecture & Engineering", tech: true, median: 82000, mean: 90000 },
      { group: "Business & Financial Operations", tech: false, median: 72000, mean: 80000 },
      { group: "Healthcare Practitioners & Technical", tech: false, median: 95000, mean: 104000 },
      { group: "Construction & Extraction", tech: false, median: 69000, mean: 75000 },
      { group: "Educational Instruction & Library", tech: false, median: 59000, mean: 65000 },
      { group: "Sales & Related", tech: false, median: 37000, mean: 40500 },
      { group: "Food Preparation & Serving", tech: false, median: 31000, mean: 34000 },
    ],
    commute: {
      label: "Brainerd micropolitan",
      localTechWorkers: 520,
      techCommutersOut: 260,
      remoteOutOfArea: 130,
      avgRoundTripMiles: 48,
      avgRoundTripMinutes: 68,
    },
    notes: [
      "If your primary audience is civic/local decision-makers, county is usually clearer than micropolitan.",
      "If you keep this: document the exact geography definition and the exact table/source used.",
    ],
  },
];
