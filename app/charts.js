// NusaData chart helpers — plain canvas 2D, no library, no network.
// Every chart draws from the figures in data.js and labels its axes,
// so a reader can check each value without hovering.

export const PALETTE = [
  "#0e7c7b", "#e8a13a", "#0e2a47", "#3a9e8f", "#c96a3b", "#7a5fb0", "#5b8dbf", "#8aa84f",
];

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, Math.round(rect.width));
  const height = Math.max(160, Math.round(rect.height));
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.font = "12px -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
  return { ctx, width, height };
}

function niceTicks(min, max, count) {
  if (min === max) { min -= 1; max += 1; }
  const span = max - min;
  const stepRaw = span / count;
  const magnitude = Math.pow(10, Math.floor(Math.log10(stepRaw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude)
    .find((s) => span / s <= count) || 10 * magnitude;
  const start = Math.ceil(min / step) * step;
  const ticks = [];
  for (let v = start; v <= max + step * 0.001; v += step) ticks.push(v);
  return { ticks, step };
}

function formatTick(v) {
  if (Math.abs(v) >= 100) return String(Math.round(v));
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(1);
}

// Line chart for a yearly series: [{year, value}, ...].
export function drawLineChart(canvas, series, options) {
  const opts = options || {};
  const { ctx, width, height } = setupCanvas(canvas);
  const pad = { left: 52, right: 16, top: 14, bottom: 28 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const values = series.values.map((p) => p.value);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (opts.zeroBaseline !== false && min > 0) min = 0;
  const { ticks } = niceTicks(min, max, 4);
  min = Math.min(min, ticks[0]);
  max = Math.max(max, ticks[ticks.length - 1]);

  const x = (i) => pad.left + (i / (series.values.length - 1)) * plotW;
  const y = (v) => pad.top + (1 - (v - min) / (max - min)) * plotH;

  // Gridlines and y labels.
  ctx.strokeStyle = "#e3e8ec";
  ctx.fillStyle = "#5b6b7d";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (const t of ticks) {
    ctx.beginPath();
    ctx.moveTo(pad.left, y(t));
    ctx.lineTo(width - pad.right, y(t));
    ctx.stroke();
    ctx.fillText(formatTick(t), pad.left - 8, y(t));
  }
  // Zero line, bolder when the series crosses it.
  if (min < 0 && max > 0) {
    ctx.strokeStyle = "#94a3b1";
    ctx.beginPath();
    ctx.moveTo(pad.left, y(0));
    ctx.lineTo(width - pad.right, y(0));
    ctx.stroke();
  }
  // Area fill.
  const color = opts.color || "#0e7c7b";
  ctx.beginPath();
  ctx.moveTo(x(0), y(series.values[0].value));
  series.values.forEach((p, i) => ctx.lineTo(x(i), y(p.value)));
  ctx.lineTo(x(series.values.length - 1), y(min));
  ctx.lineTo(x(0), y(min));
  ctx.closePath();
  ctx.fillStyle = color + "22";
  ctx.fill();
  // Line.
  ctx.beginPath();
  series.values.forEach((p, i) => (i === 0 ? ctx.moveTo(x(i), y(p.value)) : ctx.lineTo(x(i), y(p.value))));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.stroke();
  // Points and value labels. A label that would clip at the top of the
  // canvas is drawn below its point instead.
  ctx.textAlign = "center";
  series.values.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(x(i), y(p.value), 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#1c2733";
    ctx.font = "bold 12px -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
    if (y(p.value) - 8 < 14) {
      ctx.textBaseline = "top";
      ctx.fillText(formatTick(p.value), x(i), y(p.value) + 8);
      ctx.textBaseline = "bottom";
    } else {
      ctx.textBaseline = "bottom";
      ctx.fillText(formatTick(p.value), x(i), y(p.value) - 8);
    }
    ctx.font = "12px -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
  });
  // Year labels.
  ctx.fillStyle = "#5b6b7d";
  ctx.textBaseline = "top";
  series.values.forEach((p, i) => ctx.fillText(String(p.year), x(i), height - pad.bottom + 8));
}

// Horizontal bar chart for labelled shares: [{label, value}, ...].
export function drawBarChart(canvas, rows, options) {
  const opts = options || {};
  const { ctx, width, height } = setupCanvas(canvas);
  const pad = { left: 8, right: 52, top: 8, bottom: 8 };
  const rowH = (height - pad.top - pad.bottom) / rows.length;
  const barH = Math.min(22, rowH * 0.42);
  const labelW = Math.min(210, width * 0.34);
  const trackX = pad.left + labelW;
  const trackW = width - trackX - pad.right;
  const max = Math.max(...rows.map((r) => r.value));
  rows.forEach((row, i) => {
    const cy = pad.top + rowH * i + rowH / 2;
    const color = PALETTE[i % PALETTE.length];
    ctx.fillStyle = "#1c2733";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.font = "13px -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
    const label = row.label.length > 26 ? row.label.slice(0, 25) + "…" : row.label;
    ctx.fillText(label, pad.left + labelW - 10, cy);
    ctx.fillStyle = "#e3f2f1";
    ctx.beginPath();
    ctx.roundRect(trackX, cy - barH / 2, trackW, barH, 5);
    ctx.fill();
    const fillW = Math.max(4, (row.value / max) * trackW);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(trackX, cy - barH / 2, fillW, barH, 5);
    ctx.fill();
    ctx.fillStyle = "#1c2733";
    ctx.textAlign = "left";
    ctx.font = "bold 12.5px -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
    ctx.fillText(opts.suffix === "%" ? row.value.toFixed(1) + "%" : String(row.value), trackX + fillW + 7, cy);
  });
}

// Donut chart for shares that sum to 100: [{label, value}, ...].
export function drawDonut(canvas, rows) {
  const { ctx, width, height } = setupCanvas(canvas);
  const cx = Math.min(150, width * 0.28);
  const cy = height / 2;
  const radius = Math.min(95, height / 2 - 14);
  const inner = radius * 0.58;
  const total = rows.reduce((s, r) => s + r.value, 0);
  let angle = -Math.PI / 2;
  rows.forEach((row, i) => {
    const sweep = (row.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = PALETTE[i % PALETTE.length];
    ctx.fill();
    angle += sweep;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.fillStyle = "#0e2a47";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 17px -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
  ctx.fillText("100%", cx, cy - 9);
  ctx.font = "12px -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
  ctx.fillStyle = "#5b6b7d";
  ctx.fillText("of GDP", cx, cy + 11);
  // Legend on the right.
  const lx = cx + radius + 26;
  let ly = Math.max(18, cy - (rows.length * 24) / 2);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  rows.forEach((row, i) => {
    ctx.fillStyle = PALETTE[i % PALETTE.length];
    ctx.beginPath();
    ctx.roundRect(lx, ly - 6, 12, 12, 3);
    ctx.fill();
    ctx.fillStyle = "#1c2733";
    ctx.font = "13px -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
    ctx.fillText(row.label + " — " + row.value.toFixed(1) + "%", lx + 20, ly);
    ly += 24;
  });
}
