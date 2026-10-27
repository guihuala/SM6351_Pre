// CLASS EXERCISES: edit only the two return statements below.
// Save, then reload exercises/index.html through a local web server.
function chooseScale(selected) {
  return 'shared'; // TODO 1: use the selected mode
}

function chooseTraffic(selected) {
  return 'Both'; // TODO 2: use the selected category
}

// WORKING SCAFFOLD: data loading, aggregation and drawing are already supplied.
(async () => {
  const app = window.LAX;
  app.config.source = '../data/lax-passengers.csv';
  const scale = document.getElementById('exercise-scale');
  const traffic = document.getElementById('exercise-traffic');
  const slider = document.getElementById('exercise-month');
  const status = document.getElementById('exercise-status');
  let view, monthIndex = 0;
  function selectMonth(index) {
    monthIndex = Math.max(0, Math.min(view.months.length - 1, Number(index)));
    slider.value = monthIndex;
    document.getElementById('exercise-month-label').textContent = app.formatMonth(view.months[monthIndex]);
    app.updateMonth(view, monthIndex);
  }
  try {
    const data = await app.loadData();
    const year = data.completeYears.at(-1);
    function render() {
      const state = {
        start: year, end: year, direction: 'All', sort: 'terminal',
        scale: chooseScale(scale.value),
        traffic: chooseTraffic(traffic.value)
      };
      if (!['shared','independent'].includes(state.scale) || !['Both','Domestic','International'].includes(state.traffic)) {
        status.textContent = 'Check your return values: scale must be shared or independent; traffic must be Both, Domestic or International. The last valid chart remains visible.';
        return;
      }
      view = app.aggregate(data, state);
      app.drawExplorer(view, state, selectMonth);
      slider.max = view.months.length - 1;
      selectMonth(monthIndex);
      status.textContent = `${year} · Arrivals + departures · ${view.panels.length} terminal categories. ${state.scale === 'shared' ? 'Equal heights represent equal reported counts.' : 'Each panel has its own upper limit: do not compare heights between panels.'}`;
      const reported = d3.sum(view.panels, panel => panel.reported);
      document.getElementById('exercise-state').textContent = `Applied state: ${state.scale} scale / ${state.traffic} traffic. Selected-series reported total: ${app.formatCount(reported)} movements (may include partial subtotals).`;
    }
    scale.disabled = traffic.disabled = slider.disabled = false;
    scale.addEventListener('change', render);
    traffic.addEventListener('change', render);
    slider.addEventListener('input', event => selectMonth(event.target.value));
    render();
  } catch (error) {
    status.textContent = 'Could not load the exercise. Use a local web server and keep the full project folder together. If you edited the scaffold, check the browser console for the error.';
    console.error(error);
  }
})();
