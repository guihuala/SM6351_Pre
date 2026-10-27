// Copy these function bodies into exercise.js, replacing the TODO returns.
// This file is a reference; it is not loaded by the starter page.
function chooseScale(selected) {
  return selected;
}

function chooseTraffic(selected) {
  return selected;
}

// Why this works:
// 1. state.scale reaches the shared/independent domain branch in lax-charts.js.
// 2. state.traffic reaches the series selection in lax-data.js.
// 3. Each selector's change listener calls render(), so the charts and totals update.
