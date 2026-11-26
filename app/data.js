// NusaData — the figures behind the site.
// Every number below is a published statistic with its source and year.
// Primary sources: Statistics Indonesia (BPS), World Bank WDI, IMF WEO,
// Bank Indonesia, UN World Population Prospects.

export const COUNTRY = {
  name: "Indonesia",
  tagline: "Indonesia in numbers",
  capital: "Jakarta",
  currency: "Indonesian rupiah (IDR)",
  language: "Bahasa Indonesia",
  provinces: 38,
  regenciesCities: 514,
  islands: 17508,
  landAreaKm2: 1892555,
  landAreaSource: "World Bank WDI, 2024",
};

// Headline indicators shown on the home page.
export const HEADLINES = [
  { id: "population", label: "Population", value: "281.6m", note: "Mid-year estimate, 2024", source: "BPS" },
  { id: "gdp", label: "GDP (nominal)", value: "$1,396bn", note: "Current US$, 2024", source: "IMF WEO" },
  { id: "gdpGrowth", label: "GDP growth", value: "5.03%", note: "Real, year on year, 2024", source: "BPS" },
  { id: "gdpPerCapita", label: "GDP per capita", value: "$4,958", note: "Current US$, 2024", source: "IMF WEO" },
  { id: "inflation", label: "Inflation (CPI)", value: "1.57%", note: "Year on year, Dec 2024", source: "BPS" },
  { id: "unemployment", label: "Unemployment", value: "4.91%", note: "Open unemployment, Aug 2024", source: "BPS" },
  { id: "poverty", label: "Poverty rate", value: "8.57%", note: "National poverty line, Sep 2024", source: "BPS" },
  { id: "lifeExpectancy", label: "Life expectancy", value: "74.1 yrs", note: "At birth, 2024", source: "BPS" },
];

// Annual series, 2020-2024. Each series carries its own source.
export const SERIES = {
  population: {
    label: "Population (millions, mid-year)",
    source: "BPS",
    unit: "million people",
    values: [
      { year: 2020, value: 270.2 },
      { year: 2021, value: 272.3 },
      { year: 2022, value: 275.8 },
      { year: 2023, value: 278.7 },
      { year: 2024, value: 281.6 },
    ],
  },
  gdpGrowth: {
    label: "Real GDP growth (% year on year)",
    source: "BPS",
    unit: "%",
    values: [
      { year: 2020, value: -2.07 },
      { year: 2021, value: 3.69 },
      { year: 2022, value: 5.31 },
      { year: 2023, value: 5.05 },
      { year: 2024, value: 5.03 },
    ],
  },
  inflation: {
    label: "Consumer price inflation (% year on year, December)",
    source: "BPS",
    unit: "%",
    values: [
      { year: 2020, value: 1.68 },
      { year: 2021, value: 1.87 },
      { year: 2022, value: 5.51 },
      { year: 2023, value: 2.61 },
      { year: 2024, value: 1.57 },
    ],
  },
  unemployment: {
    label: "Open unemployment rate (%, August)",
    source: "BPS",
    unit: "%",
    values: [
      { year: 2020, value: 7.07 },
      { year: 2021, value: 6.49 },
      { year: 2022, value: 5.86 },
      { year: 2023, value: 5.32 },
      { year: 2024, value: 4.91 },
    ],
  },
  poverty: {
    label: "Poverty rate (%, September)",
    source: "BPS",
    unit: "%",
    values: [
      { year: 2020, value: 10.19 },
      { year: 2021, value: 9.71 },
      { year: 2022, value: 9.57 },
      { year: 2023, value: 9.36 },
      { year: 2024, value: 8.57 },
    ],
  },
};

// GDP by sector, share of GDP, 2024 (BPS).
export const GDP_SECTORS = [
  { sector: "Manufacturing", share: 19.0 },
  { sector: "Wholesale & retail trade", share: 12.8 },
  { sector: "Agriculture, forestry & fishing", share: 12.5 },
  { sector: "Construction", share: 9.7 },
  { sector: "Mining & quarrying", share: 9.3 },
  { sector: "All other sectors", share: 36.7 },
];

// Age structure, 2024 (World Bank WDI / BPS).
export const AGE_STRUCTURE = [
  { group: "0–14 years", share: 24.6 },
  { group: "15–64 years", share: 68.1 },
  { group: "65+ years", share: 7.3 },
];

// Largest provinces, 2024 mid-year estimates (BPS). Density is computed from
// BPS land-area figures and rounded; it is labelled as approximate on the site.
export const PROVINCES = [
  { name: "West Java", capital: "Bandung", population: 50.3, areaKm2: 35378, density: 1422 },
  { name: "East Java", capital: "Surabaya", population: 41.8, areaKm2: 47803, density: 874 },
  { name: "Central Java", capital: "Semarang", population: 37.9, areaKm2: 32801, density: 1155 },
  { name: "North Sumatra", capital: "Medan", population: 15.6, areaKm2: 72981, density: 214 },
  { name: "Banten", capital: "Serang", population: 12.4, areaKm2: 9663, density: 1283 },
  { name: "Jakarta", capital: "Jakarta", population: 10.6, areaKm2: 664, density: 15964 },
  { name: "South Sulawesi", capital: "Makassar", population: 9.5, areaKm2: 46717, density: 203 },
  { name: "Lampung", capital: "Bandar Lampung", population: 9.3, areaKm2: 34624, density: 269 },
  { name: "South Sumatra", capital: "Palembang", population: 8.8, areaKm2: 91592, density: 96 },
  { name: "Riau", capital: "Pekanbaru", population: 6.9, areaKm2: 87024, density: 80 },
  { name: "West Sumatra", capital: "Padang", population: 6.0, areaKm2: 42013, density: 143 },
  { name: "West Kalimantan", capital: "Pontianak", population: 5.9, areaKm2: 147307, density: 40 },
];

// Trade and money, 2024.
export const ECONOMY_EXTRA = [
  { label: "Exports of goods", value: "$264.7bn", source: "BPS, 2024" },
  { label: "Imports of goods", value: "$233.7bn", source: "BPS, 2024" },
  { label: "Trade balance", value: "+$31.0bn", source: "BPS, 2024" },
  { label: "FDI inflows", value: "$24.2bn", source: "World Bank, 2024" },
  { label: "GDP (PPP)", value: "$4,663bn", source: "IMF WEO, 2024" },
  { label: "Government debt", value: "37.7% of GDP", source: "IMF WEO, 2024" },
  { label: "Rupiah, yearly average", value: "Rp 15,848 / US$", source: "Bank Indonesia, 2024" },
  { label: "Urban population", value: "58.8%", source: "World Bank, 2024" },
];

// People and society.
export const SOCIETY = [
  { label: "Human Development Index", value: "75.02", note: "BPS index (0–100), 2024", source: "BPS" },
  { label: "Fertility rate", value: "2.1", note: "Births per woman, 2023", source: "World Bank" },
  { label: "Literacy rate (age 15+)", value: "96.9%", note: "2023", source: "BPS" },
  { label: "Population density", value: "149 / km²", note: "2024", source: "World Bank" },
  { label: "Median age", value: "30.5 yrs", note: "2024 estimate", source: "UN World Population Prospects" },
  { label: "Internet users", value: "79.5%", note: "Share of population, 2024", source: "World Bank" },
];

// Latest statistical releases (what a visitor checks first).
export const RELEASES = [
  { date: "Nov 2025", title: "GDP grew 5.04% year on year in Q3 2025", source: "BPS" },
  { date: "Nov 2025", title: "Inflation eased to 2.7% year on year in October 2025", source: "BPS" },
  { date: "Sep 2025", title: "Poverty rate fell to 8.25% in March 2025", source: "BPS" },
  { date: "Aug 2025", title: "Open unemployment at 4.85% in February 2025", source: "BPS" },
  { date: "Feb 2025", title: "2024 GDP growth confirmed at 5.03%; economy worth Rp 22,139 trillion", source: "BPS" },
];

export const SOURCES = [
  { name: "Statistics Indonesia (BPS)", what: "Population, GDP, inflation, unemployment, poverty, HDI, trade", url: "bps.go.id" },
  { name: "World Bank — World Development Indicators", what: "Population, GDP per capita, urban share, density, internet use", url: "data.worldbank.org" },
  { name: "IMF — World Economic Outlook", what: "GDP in current US$, GDP (PPP), government debt", url: "imf.org" },
  { name: "Bank Indonesia", what: "Rupiah yearly average exchange rate", url: "bi.go.id" },
  { name: "UN World Population Prospects", what: "Median age estimate", url: "population.un.org" },
];
