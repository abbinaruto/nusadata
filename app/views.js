// NusaData page views — one function per route. Each view renders real
// figures from data.js and wires its own controls; nothing is a placeholder.

import {
  COUNTRY, HEADLINES, SERIES, GDP_SECTORS, AGE_STRUCTURE,
  PROVINCES, ECONOMY_EXTRA, SOCIETY, RELEASES, SOURCES,
} from "./data.js";
import { drawLineChart, drawBarChart, drawDonut } from "./charts.js";

function esc(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function statCards(list) {
  return '<div class="stat-grid">' + list.map((h, i) =>
    '<article class="stat-card' + (i === 0 ? " accent" : "") + '">' +
    '<div class="label">' + esc(h.label) + '</div>' +
    '<div class="value">' + esc(h.value) + '</div>' +
    '<div class="note">' + esc(h.note) + '</div>' +
    '<div class="src">Source: ' + esc(h.source) + '</div>' +
    '</article>').join("") + '</div>';
}

function chartPanel(id, title, sub, tall) {
  return '<section class="panel"><h3>' + esc(title) + '</h3>' +
    '<p class="panel-sub">' + esc(sub) + '</p>' +
    '<div class="chart-wrap"><canvas id="' + id + '" class="chart' + (tall ? " tall" : "") + '"></canvas></div></section>';
}

// ---------- Home ----------

export function renderHome() {
  return '' +
    '<div class="page-head"><h2>Indonesia in numbers</h2>' +
    '<p>The headline figures for the world’s fourth most populous country — ' +
    'population, the economy, prices, jobs and wellbeing — each with its source and year.</p></div>' +
    statCards(HEADLINES) +
    '<div class="split">' +
    chartPanel("home-gdp", "GDP growth, 2020–2024", "Real GDP growth, % year on year. Source: BPS.", false) +
    '<section class="panel"><h3>Latest releases</h3>' +
    '<p class="panel-sub">The newest numbers from Statistics Indonesia (BPS).</p>' +
    '<ul class="release-list">' + RELEASES.map((r) =>
      '<li><span class="date">' + esc(r.date) + '</span><span><strong>' + esc(r.title) + '</strong><br><span class="source-note">Source: ' + esc(r.source) + '</span></span></li>').join("") +
    '</ul></section></div>' +
    '<section class="panel"><h3>Indonesia at a glance</h3>' +
    '<p class="panel-sub">The facts a visitor usually looks up first.</p>' +
    '<dl class="fact-list">' +
    '<div><dt>Capital</dt><dd>' + esc(COUNTRY.capital) + '</dd></div>' +
    '<div><dt>Currency</dt><dd>' + esc(COUNTRY.currency) + '</dd></div>' +
    '<div><dt>Official language</dt><dd>' + esc(COUNTRY.language) + '</dd></div>' +
    '<div><dt>Provinces</dt><dd>' + COUNTRY.provinces + ' provinces, ' + COUNTRY.regenciesCities + ' regencies and cities</dd></div>' +
    '<div><dt>Islands</dt><dd>' + COUNTRY.islands.toLocaleString("en-US") + ' named islands</dd></div>' +
    '<div><dt>Land area</dt><dd>' + COUNTRY.landAreaKm2.toLocaleString("en-US") + ' km² — ' + esc(COUNTRY.landAreaSource) + '</dd></div>' +
    '</dl></section>';
}

export function mountHome() {
  drawLineChart(document.getElementById("home-gdp"), SERIES.gdpGrowth, { color: "#0e7c7b" });
}

// ---------- Population ----------

const SERIES_OPTIONS = [
  ["population", "Population"],
  ["gdpGrowth", "GDP growth"],
  ["inflation", "Inflation (CPI)"],
  ["unemployment", "Unemployment"],
  ["poverty", "Poverty rate"],
];

export function renderPopulation() {
  return '' +
    '<div class="page-head"><h2>Population</h2>' +
    '<p>How many people live in Indonesia, how the population is changing, and how old it is. ' +
    'Pick a series to chart it for 2020–2024.</p></div>' +
    '<section class="panel"><h3>Five-year series</h3>' +
    '<div class="controls"><label for="series-picker">Series</label>' +
    '<select id="series-picker">' + SERIES_OPTIONS.map(([key, label]) =>
      '<option value="' + key + '">' + esc(label) + '</option>').join("") +
    '</select><span class="pill" id="series-source">Source: BPS</span></div>' +
    '<div class="chart-wrap"><canvas id="pop-series" class="chart tall"></canvas></div>' +
    '<p class="source-note" id="series-label">Population (millions, mid-year) — BPS.</p></section>' +
    '<div class="split">' +
    chartPanel("age-chart", "Age structure, 2024", "Share of the population by age group. Source: World Bank WDI / BPS.", false) +
    '<section class="panel"><h3>What the numbers say</h3>' +
    '<p class="panel-sub">Reading the population figures.</p>' +
    '<dl class="fact-list">' +
    '<div><dt>Still growing</dt><dd>Population rose from 270.2m in 2020 to 281.6m in 2024 — about 2.8m people a year.</dd></div>' +
    '<div><dt>Working-age majority</dt><dd>68.1% of Indonesians are aged 15–64, a demographic dividend that lasts into the 2030s.</dd></div>' +
    '<div><dt>Young but ageing</dt><dd>Median age is 30.5 years; the 65+ share is 7.3% and rising.</dd></div>' +
    '<div><dt>Mostly urbanising</dt><dd>58.8% of people live in urban areas (World Bank, 2024).</dd></div>' +
    '</dl></section></div>';
}

export function mountPopulation() {
  const picker = document.getElementById("series-picker");
  const label = document.getElementById("series-label");
  const source = document.getElementById("series-source");
  const draw = () => {
    const series = SERIES[picker.value];
    drawLineChart(document.getElementById("pop-series"), series, { color: "#0e2a47" });
    label.textContent = series.label + " — " + series.source + ".";
    source.textContent = "Source: " + series.source;
  };
  picker.addEventListener("change", draw);
  draw();
  drawBarChart(document.getElementById("age-chart"),
    AGE_STRUCTURE.map((a) => ({ label: a.group, value: a.share })), { suffix: "%" });
}

// ---------- Economy ----------

export function renderEconomy() {
  return '' +
    '<div class="page-head"><h2>Economy</h2>' +
    '<p>Growth, prices, what Indonesia makes and what it trades. All figures are for 2024 unless stated otherwise.</p></div>' +
    '<div class="split">' +
    chartPanel("econ-gdp", "Real GDP growth, 2020–2024", "% year on year. Source: BPS.", false) +
    chartPanel("econ-inflation", "Inflation, 2020–2024", "Consumer prices, % year on year, December. Source: BPS.", false) +
    '</div>' +
    '<div class="split">' +
    '<section class="panel"><h3>What the economy makes</h3>' +
    '<p class="panel-sub">Share of GDP by sector, 2024. Source: BPS.</p>' +
    '<div class="chart-wrap"><canvas id="econ-sectors" class="chart"></canvas></div></section>' +
    '<section class="panel"><h3>Trade and money</h3>' +
    '<p class="panel-sub">The external position and the rupiah, 2024.</p>' +
    '<table class="kv-table"><tbody>' + ECONOMY_EXTRA.map((e) =>
      '<tr><td>' + esc(e.label) + '</td><td><strong>' + esc(e.value) + '</strong><br><span class="source-note">' + esc(e.source) + '</span></td></tr>').join("") +
    '</tbody></table></section></div>' +
    '<section class="panel"><h3>Reading the economy</h3>' +
    '<p class="panel-sub">Growth held above 5% in 2022–2024 after the 2020 contraction of 2.07%. ' +
    'Inflation spiked to 5.51% in December 2022, then fell back to 1.57% by December 2024. ' +
    'Manufacturing is the largest single sector at 19.0% of GDP, and the goods trade surplus reached $31.0bn in 2024.</p></section>';
}

export function mountEconomy() {
  drawLineChart(document.getElementById("econ-gdp"), SERIES.gdpGrowth, { color: "#0e7c7b" });
  drawLineChart(document.getElementById("econ-inflation"), SERIES.inflation, { color: "#e8a13a" });
  drawDonut(document.getElementById("econ-sectors"),
    GDP_SECTORS.map((s) => ({ label: s.sector, value: s.share })));
}

// ---------- Regions ----------

let regionSort = "population";
let regionQuery = "";

function regionRows() {
  const q = regionQuery.trim().toLowerCase();
  const rows = PROVINCES.filter((p) => !q || p.name.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q));
  const sorted = [...rows];
  if (regionSort === "population") sorted.sort((a, b) => b.population - a.population);
  if (regionSort === "density") sorted.sort((a, b) => b.density - a.density);
  if (regionSort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
  return sorted;
}

function regionTableHtml() {
  const rows = regionRows();
  if (rows.length === 0) {
    return '<p>No province matches that search. Try another name.</p>';
  }
  const maxPop = Math.max(...PROVINCES.map((p) => p.population));
  return '<table class="data"><thead><tr><th>Province</th><th>Capital</th>' +
    '<th class="num">Population (m)</th><th class="bar-cell">Share of largest</th>' +
    '<th class="num">Density /km²</th></tr></thead><tbody>' +
    rows.map((p) =>
      '<tr><td><strong>' + esc(p.name) + '</strong></td><td>' + esc(p.capital) + '</td>' +
      '<td class="num">' + p.population.toFixed(1) + '</td>' +
      '<td><div class="bar-track"><div class="bar-fill" style="width:' + Math.round((p.population / maxPop) * 100) + '%"></div></div></td>' +
      '<td class="num">' + p.density.toLocaleString("en-US") + '</td></tr>').join("") +
    '</tbody></table>' +
    '<p class="source-note">Showing ' + rows.length + ' of ' + PROVINCES.length + ' listed provinces. ' +
    'Population: BPS mid-year estimates, 2024. Density is approximate, computed from BPS land-area figures.</p>';
}

export function renderRegions() {
  return '' +
    '<div class="page-head"><h2>Regions</h2>' +
    '<p>Indonesia has 38 provinces. The twelve largest hold most of the population — ' +
    'West Java alone has 50.3 million people, more than most countries. Search the table or sort it.</p></div>' +
    '<section class="panel"><h3>Largest provinces, 2024</h3>' +
    '<div class="controls"><label for="region-search">Search</label>' +
    '<input type="search" id="region-search" placeholder="Province or capital…" value="' + esc(regionQuery) + '">' +
    '<span>Sort by:</span>' +
    '<button class="sort-btn" data-sort="population" aria-pressed="' + (regionSort === "population") + '">Population</button>' +
    '<button class="sort-btn" data-sort="density" aria-pressed="' + (regionSort === "density") + '">Density</button>' +
    '<button class="sort-btn" data-sort="name" aria-pressed="' + (regionSort === "name") + '">Name</button></div>' +
    '<div id="region-table">' + regionTableHtml() + '</div></section>' +
    chartPanel("region-bars", "Population of the largest provinces", "Millions of people, 2024. Source: BPS.", true);
}

export function mountRegions() {
  const search = document.getElementById("region-search");
  const table = document.getElementById("region-table");
  search.addEventListener("input", () => {
    regionQuery = search.value;
    table.innerHTML = regionTableHtml();
  });
  document.querySelectorAll(".sort-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      regionSort = btn.dataset.sort;
      document.querySelectorAll(".sort-btn").forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.sort === regionSort)));
      table.innerHTML = regionTableHtml();
    });
  });
  drawBarChart(document.getElementById("region-bars"),
    PROVINCES.slice(0, 10).map((p) => ({ label: p.name, value: p.population })));
}

// ---------- People ----------

export function renderPeople() {
  return '' +
    '<div class="page-head"><h2>People</h2>' +
    '<p>Jobs, poverty, health and education — how Indonesians live, in the latest published figures.</p></div>' +
    statCards(SOCIETY.map((s) => ({ label: s.label, value: s.value, note: s.note, source: s.source }))) +
    '<div class="split">' +
    chartPanel("people-jobs", "Unemployment, 2020–2024", "Open unemployment rate, % (August). Source: BPS.", false) +
    chartPanel("people-poverty", "Poverty rate, 2020–2024", "% of population below the national poverty line (September). Source: BPS.", false) +
    '</div>' +
    '<section class="panel"><h3>Two trends worth knowing</h3>' +
    '<p class="panel-sub">Unemployment fell every year from its 2020 peak of 7.07% to 4.91% in August 2024. ' +
    'Poverty fell from 10.19% in 2020 to 8.57% in September 2024 — its lowest on record. ' +
    'Life expectancy reached 74.1 years and the Human Development Index 75.02 in 2024.</p></section>';
}

export function mountPeople() {
  drawLineChart(document.getElementById("people-jobs"), SERIES.unemployment, { color: "#0e7c7b" });
  drawLineChart(document.getElementById("people-poverty"), SERIES.poverty, { color: "#c96a3b" });
}

// ---------- Methods ----------

export function renderMethods() {
  return '' +
    '<div class="page-head"><h2>Methods &amp; sources</h2>' +
    '<p>Where every number on this site comes from, how it was compiled, and how to cite it.</p></div>' +
    '<section class="panel"><h3>Sources</h3>' +
    '<p class="panel-sub">Each figure on the site names its source and year where it appears.</p>' +
    '<table class="data"><thead><tr><th>Source</th><th>What it supplies</th><th>Site</th></tr></thead><tbody>' +
    SOURCES.map((s) =>
      '<tr><td><strong>' + esc(s.name) + '</strong></td><td>' + esc(s.what) + '</td><td>' + esc(s.url) + '</td></tr>').join("") +
    '</tbody></table></section>' +
    '<section class="panel"><h3>How the figures were compiled</h3>' +
    '<p class="panel-sub">Notes a careful reader should know.</p>' +
    '<dl class="fact-list">' +
    '<div><dt>Population</dt><dd>Mid-year estimates from BPS; the World Bank series (283.5m for 2024) differs slightly because it uses a different estimation method.</dd></div>' +
    '<div><dt>GDP</dt><dd>Nominal GDP and PPP from the IMF World Economic Outlook; growth rates and sector shares from BPS national accounts.</dd></div>' +
    '<div><dt>Inflation</dt><dd>Consumer price index, year-on-year change in December, from BPS.</dd></div>' +
    '<div><dt>Unemployment and poverty</dt><dd>Measured in August and September respectively, the months BPS publishes them; rates are national.</dd></div>' +
    '<div><dt>Provincial density</dt><dd>Computed from BPS population and land-area figures and rounded; labelled approximate on the Regions page.</dd></div>' +
    '<div><dt>Currency</dt><dd>The rupiah average is Bank Indonesia’s yearly average middle rate for 2024.</dd></div>' +
    '</dl></section>' +
    '<section class="panel"><h3>How to cite this site</h3>' +
    '<p class="panel-sub">NusaData — Indonesia in numbers. Figures as published by BPS, the World Bank, the IMF and Bank Indonesia; ' +
    'see the source named beside each figure for the exact release. This site is a static snapshot compiled in November 2026; ' +
    'for the newest release, check the source’s own publication.</p></section>';
}

export function mountMethods() {
  // No charts on this page; nothing to wire up.
}
