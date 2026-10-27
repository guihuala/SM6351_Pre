(async () => {
  const app=window.LAX, $=id=>document.getElementById(id);
  let data, view, state, monthIndex=0, layout='multiples';
  const presetButtons=[...document.querySelectorAll('[data-preset]')];
  const dataButtons=[...document.querySelectorAll('[data-preset],[data-task],.layout-button,#reset')];
  dataButtons.forEach(b=>b.disabled=true);
  function defaults() {
    const end=data.completeYears.at(-1)||data.years.at(-1);
    return {start:Math.max(data.years[0],end-4),end,direction:'All',traffic:'Both',scale:'shared',sort:'terminal'};
  }
  function clearPreset() {presetButtons.forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false');});}
  function syncControls() {
    $('start-year').value=state.start;$('end-year').value=state.end;
    for(const id of ['direction','sort']) $(id).value=state[id];
    for(const id of ['traffic','scale']) document.querySelectorAll(`input[name="${id}"]`).forEach(input=>input.checked=input.value===state[id]);
  }
  function selectMonth(index) {
    monthIndex=Math.max(0,Math.min(view.months.length-1,Number(index)));
    $('month').value=monthIndex;
    $('month-label').textContent=app.formatMonth(view.months[monthIndex]);
    app.updateMonth(view,monthIndex);
  }
  function render() {
    const priorDate=view?.months[monthIndex];
    view=app.aggregate(data,state);
    $('month').max=view.months.length-1;
    const previous=priorDate?view.months.findIndex(d=>+d===+priorDate):-1;
    monthIndex=previous>=0?previous:view.months.length-1;
    app.drawExplorer(view,state,selectMonth);
    $('range-label').textContent=`${app.formatMonth(view.months[0])} – ${app.formatMonth(view.months.at(-1))} · ${view.months.length} months · ${state.direction==='All'?'Arrivals + departures':state.direction+'s'}`;
    const legend=d3.select('#legend');legend.selectAll('*').remove();
    view.series.forEach(k=>legend.append('span').attr('class',k.toLowerCase()).text(k==='Total'?'Combined total':k));
    $('scale-note').className=`scale-note${state.scale==='independent'?' warning':''}`;
    $('scale-note').textContent=state.scale==='independent'?'Independent axes · compare shapes, not heights':'Shared axes · equal height = equal count';
    const active=view.panels.filter(p=>p.hasData);
    const missing=view.panels.length-active.length;
    $('status').textContent=`${active.length} terminals with records${missing?` · ${missing} without records`:''}`;
    const ranked=[...active].sort((a,b)=>b.reported-a.reported);
    if(ranked.length) {
      const top=ranked[0];
      $('finding-title').textContent=`${app.config.names[top.terminal]||top.terminal} leads this view.`;
      $('finding-body').textContent=`It has ${app.formatCount(top.reported)} reported passenger movements across the selected ${view.months.length} months and traffic categories. ${top.coverage} of those months have every expected component category present. This is a ranking of reported volume, not a ranking of capacity or unique travelers. Change the traffic filter and see whether the leader changes.`;
    } else {
      $('finding-title').textContent='No records match this view.';
      $('finding-body').textContent='Choose a different period or traffic category. Missing records do not establish zero traffic.';
    }
    selectMonth(monthIndex);
  }
  function preset(name) {
    state=defaults();
    if(name==='scale'){state.traffic='Total';state.sort='volume';}
    if(name==='season'){state.start=state.end;state.scale='independent';state.traffic='Total';}
    if(name==='mix'){state.start=state.end;state.traffic='Both';}
    const notes={scale:'Compare reported volume. All panels share a vertical scale and are ordered by the selected period’s total.',season:'Follow the latest full year, month by month. Independent vertical scales reveal shapes; panel heights no longer compare volumes.',mix:'Compare domestic and international traffic in the latest full year. The dashed orange line denotes international traffic.'};
    $('scene-note').textContent=notes[name];clearPreset();
    const button=presetButtons.find(b=>b.dataset.preset===name);
    button.classList.add('active');button.setAttribute('aria-pressed','true');
    syncControls();render();
  }
  try {
    data=await app.loadData();state=defaults();
    data.years.forEach(year=>{
      for(const id of ['start-year','end-year']) {
        const option=document.createElement('option');option.value=year;
        option.textContent=`${year}${data.completeYears.includes(year)?'':' · partial year'}`;$(id).append(option);
      }
    });
    const facts=d3.select('#facts');facts.selectAll('*').remove();
    const items=[['2006–2023','Reporting years · ends Oct 2023'],[String(data.terminals.length),'Terminal categories'],[app.formatCount(data.sourceCount),'Source records'],['Monthly','Passenger movements']];
    // Derive the range from the snapshot rather than assuming it updates live.
    items[0][0]=`${data.years[0]}–${data.years.at(-1)}`;
    items[0][1]=`Reporting years · ends ${app.formatMonth(data.extent[1])}`;
    items.forEach(([value,label])=>{const f=facts.append('div').attr('class','fact');f.append('strong').text(value);f.append('span').text(label);});
    $('data-notes').textContent=`Local snapshot retrieved 27 October 2026 through the City of Los Angeles Socrata API (dataset g3qu-7q2u). Reporting coverage: ${app.formatMonth(data.extent[0])}–${app.formatMonth(data.extent[1])}. ${app.formatCount(data.sourceCount)} source records; ${data.invalid} invalid records excluded; ${data.duplicates} repeated reporting cells resolved using the latest extraction timestamp. Terminal labels are preserved; TBIT and TBIT West Gates are separate source categories. The default view ends in ${state.end}, the latest year with 12 reporting months. This snapshot is not a live feed.`;
    $('controls').disabled=false;$('month').disabled=false;dataButtons.forEach(b=>b.disabled=false);
    syncControls();render();
    const designYear=data.completeYears.includes(2019)?2019:data.completeYears.at(-1)||data.years[0];
    app.drawDesign(data,layout,designYear);
    document.querySelectorAll('.layout-button').forEach(button=>button.addEventListener('click',()=>{
      layout=button.dataset.layout;
      document.querySelectorAll('.layout-button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      app.drawDesign(data,layout,designYear);
    }));
    presetButtons.forEach(b=>b.addEventListener('click',()=>preset(b.dataset.preset)));
    for(const id of ['start-year','end-year','direction','sort']) $(id).addEventListener('change',()=>{
      if(id==='start-year'){state.start=Number($(id).value);if(state.start>state.end) state.end=state.start;}
      else if(id==='end-year'){state.end=Number($(id).value);if(state.end<state.start) state.start=state.end;}
      else state[id]=$(id).value;
      clearPreset();$('scene-note').textContent='Custom view. Change one variable at a time and compare what changes.';
      syncControls();render();
    });
    for(const id of ['traffic','scale']) $(id).addEventListener('change', event => {
      state[id] = event.target.value;
      clearPreset();
      $('scene-note').textContent='Custom view. Change one variable at a time.';
      syncControls(); render();
    });
    $('lab-controls').disabled=false;
    const drawLab=()=>app.drawInteractionLab(data,document.querySelector('input[name="lab-scale"]:checked').value,document.querySelector('input[name="lab-traffic"]:checked').value);
    $('lab-controls').addEventListener('change',drawLab); drawLab();
    $('month').addEventListener('input',event=>selectMonth(event.target.value));
    $('reset').addEventListener('click',()=>{
      state=defaults();clearPreset();syncControls();render();
      $('scene-note').textContent='Compare terminal volumes with a shared vertical scale.';
    });
    document.querySelectorAll('[data-task]').forEach(button=>button.addEventListener('click',()=>{
      preset('scale');state.start=state.end;syncControls();render();
      $('scene-note').textContent=button.dataset.task==='scale'?'Task 01: predict what will happen, then change Vertical scale to Independent. Can you still compare heights?':'Task 02: note the current leader, then change Traffic to International only. Does the ranking change?';
      window.LaxTabs.show('demo');
      document.querySelector(`input[name="${button.dataset.task==='scale'?'scale':'traffic'}"]:checked`).focus({preventScroll:true});
    }));
  } catch(error) {
    $('status').classList.add('error');
    $('status').textContent='The local dataset could not be loaded. Open this page through a local web server (for example, VS Code Live Server), and make sure data/lax-passengers.csv and vendor/d3.v7.min.js are available. Reload the page to try again.';
    $('facts').textContent='Data unavailable — see the message in the explorer.';
    $('finding-title').textContent='Data unavailable';
    $('finding-body').textContent='No findings are shown until the actual data is loaded.';
    console.error(error);
  }
})();
