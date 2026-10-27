(() => {
  const app=window.LAX, cfg=app.config;
  const count=d3.format(',');
  const short=n=>n>=1e6?`${+(n/1e6).toFixed(1)}m`:n>=1000?`${+(n/1000).toFixed(0)}k`:`${n}`;
  const monthLabel=d3.utcFormat('%b %Y');
  app.formatCount=count;
  app.formatMonth=monthLabel;
  const cellText=c=>c.value===null?'No record':`${count(c.value)}${c.count<c.expected?'*':''}`;
  const maxFor=(panel,series)=>d3.max(panel.values,p=>d3.max(series,k=>p[k].value))||1;
  function axes(svg,x,y,width,height,m) {
    svg.append('g').attr('transform',`translate(${m.l},0)`).call(d3.axisLeft(y).ticks(3).tickSize(-(width-m.l-m.r)).tickFormat(short)).call(g=>g.select('.domain').remove());
    svg.append('g').attr('transform',`translate(0,${height-m.b})`).call(d3.axisBottom(x).ticks(3).tickSizeOuter(0).tickFormat(d3.utcFormat(x.domain()[1]-x.domain()[0]<370*864e5?'%b':'%Y')));
  }
  app.drawExplorer=(view,state,onMonth)=>{
    const width=380,height=215,m={l:46,r:12,t:18,b:30};
    const x=d3.scaleUtc().domain(d3.extent(view.months)).range([m.l,width-m.r]);
    const globalMax=d3.max(view.panels,p=>maxFor(p,view.series))||1;
    const grid=d3.select('#charts');grid.selectAll('*').remove();
    app.chartRefs=[];
    for(const panel of view.panels) {
      const y=d3.scaleLinear().domain([0,state.scale==='shared'?globalMax:maxFor(panel,view.series)]).nice().range([height-m.b,m.t]);
      const card=grid.append('article').attr('class','chart-card');
      const heading=card.append('div').attr('class','card-top');
      const identity = heading.append('div').attr('class','terminal-identity');
      identity.append('span').attr('class','terminal-code').text(cfg.badges[panel.terminal] || panel.terminal);
      identity.append('h3').text(cfg.names[panel.terminal] || panel.terminal);
      heading.append('span').attr('class','panel-scale').text(state.scale==='shared'?'SHARED':`MAX ${short(y.domain()[1])}`);
      const svg=card.append('svg').attr('viewBox',`0 0 ${width} ${height}`).attr('role','img').attr('aria-label',`${cfg.names[panel.terminal]||panel.terminal}: monthly passenger movements, ${state.scale} vertical scale. Selected-month values are available below and in the table.`);
      svg.append('title').text(`${cfg.names[panel.terminal]||panel.terminal} · ${state.start}–${state.end}`);
      axes(svg,x,y,width,height,m);
      for(const type of view.series) {
        const line=d3.line().defined(p=>p[type].value!==null).x(p=>x(p.date)).y(p=>y(p[type].value));
        svg.append('path').datum(panel.values).attr('d',line).attr('fill','none').attr('stroke',cfg.colors[type]).attr('stroke-width',2).attr('stroke-dasharray',type==='International'?'5 3':null);
        // Dots preserve isolated months that a line alone would not make visible.
        svg.append('g').selectAll('circle').data(panel.values.filter(p=>p[type].value!==null)).join('circle').attr('cx',p=>x(p.date)).attr('cy',p=>y(p[type].value)).attr('r',1.6).attr('fill',cfg.colors[type]);
      }
      if(!panel.hasData) svg.append('text').attr('x',width/2).attr('y',height/2).attr('text-anchor','middle').text('No records in this view');
      const cursor=svg.append('line').attr('class','cursor-line').attr('y1',m.t).attr('y2',height-m.b);
      const markers=svg.append('g');
      svg.append('rect').attr('x',m.l).attr('y',m.t).attr('width',width-m.l-m.r).attr('height',height-m.t-m.b).attr('fill','transparent').on('pointermove click',function(event){
        const date=x.invert(d3.pointer(event,this)[0]);
        const index=d3.bisector(d=>+d).center(view.months,+date);
        onMonth(index);
      });
      const values=card.append('div').attr('class','chart-values');
      app.chartRefs.push({panel,cursor,markers,values,x,y});
    }
  };
  app.updateMonth=(view,index)=>{
    const date=view.months[index];
    for(const ref of app.chartRefs) {
      const point=ref.panel.values[index];
      ref.cursor.attr('x1',ref.x(date)).attr('x2',ref.x(date));
      ref.markers.selectAll('circle').data(view.series.filter(k=>point[k].value!==null)).join('circle').attr('cx',ref.x(date)).attr('cy',k=>ref.y(point[k].value)).attr('r',3.5).attr('fill',k=>cfg.colors[k]).attr('stroke','#fffcf5').attr('stroke-width',1.5);
      ref.values.selectAll('*').remove();
      for(const type of view.series) ref.values.append('div').text(`${type}: ${cellText(point[type])}`);
    }
    const table=d3.select('#month-table');table.selectAll('*').remove();
    for(const panel of view.panels) {
      const p=panel.values[index];
      const tr=table.append('tr');tr.append('th').attr('scope','row').text(cfg.names[panel.terminal]||panel.terminal);
      tr.append('td').text(cellText(p.Domestic));tr.append('td').text(cellText(p.International));
      const selected=stateCell(p,view.series);
      tr.append('td').text(cellText(selected));
    }
    document.querySelector('#table-caption').textContent=`${monthLabel(date)} · * Partial: some component categories have no record. Domestic/international columns provide context even when one is filtered out.`;
  };
  function stateCell(point,series) {
    const cells=series.map(k=>point[k]);
    return {value:cells.every(c=>c.value===null)?null:d3.sum(cells,c=>c.value||0),count:d3.sum(cells,c=>c.count),expected:d3.sum(cells,c=>c.expected)};
  }
  app.drawDesign=(data,layout,year)=>{
    const view=app.aggregate(data,{start:year,end:year,direction:'All',traffic:'Total',sort:'terminal'});
    const selected=view.panels.filter(p=>['T1','T2','T3','T4','T5','TBIT'].includes(p.terminal));
    const root=d3.select('#design-chart').attr('class',`design-chart ${layout==='overlay'?'overlay':''}`);root.selectAll('*').remove();
    const max=d3.max(selected,p=>maxFor(p,['Total']))||1;
    const palette=['#2463a0','#af501e','#387959','#865a96','#8b6b22','#34434e'];
    const groups=layout==='overlay'?[selected]:selected.map(p=>[p]);
    groups.forEach(panels=>{
      const w=layout==='overlay'?1100:380,h=layout==='overlay'?320:190,m={l:48,r:18,t:30,b:28};
      const x=d3.scaleUtc().domain(d3.extent(view.months)).range([m.l,w-m.r]);
      const y=d3.scaleLinear().domain([0,max]).nice().range([h-m.b,m.t]);
      const svg=root.append('svg').attr('viewBox',`0 0 ${w} ${h}`).attr('role','img').attr('aria-label',`${layout==='overlay'?'Overlaid terminal comparison':cfg.names[panels[0].terminal]}, ${year}, shared scale`);
      axes(svg,x,y,w,h,m);
      panels.forEach(p=>{
        const color=palette[selected.indexOf(p)];
        svg.append('path').datum(p.values).attr('d',d3.line().defined(d=>d.Total.value!==null).x(d=>x(d.date)).y(d=>y(d.Total.value))).attr('fill','none').attr('stroke',color).attr('stroke-width',2.4);
        const i=panels.indexOf(p);
        svg.append('text').attr('x',layout==='overlay'?m.l+i*170:m.l).attr('y',16).style('fill',color).style('font-weight',600).text(p.terminal==='TBIT'?'Tom Bradley':cfg.names[p.terminal]);
      });
    });
    document.querySelector('#design-caption').textContent=`${year} · 6 selected terminals · arrivals + departures · combined reported traffic · identical axes`;
  };
  app.drawInteractionLab = (data, scale, traffic) => {
    const year = data.completeYears.at(-1);
    const view = app.aggregate(data, {start:year,end:year,direction:'All',sort:'terminal',scale,traffic});
    const selected = view.panels.filter(p => ['T1','TBIT'].includes(p.terminal));
    const globalMax = d3.max(view.panels,p=>maxFor(p,view.series)) || 1;
    const root = d3.select('#lab-charts'); root.selectAll('*').remove();
    const w=450,h=175,m={l:48,r:12,t:15,b:27};
    const x=d3.scaleUtc().domain(d3.extent(view.months)).range([m.l,w-m.r]);
    for(const panel of selected) {
      const y=d3.scaleLinear().domain([0,scale==='shared'?globalMax:maxFor(panel,view.series)]).nice().range([h-m.b,m.t]);
      const card=root.append('article');
      card.append('h4').text(`${panel.terminal} / ${cfg.names[panel.terminal]}`);
      const svg=card.append('svg').attr('viewBox',`0 0 ${w} ${h}`).attr('role','img').attr('aria-label',`${cfg.names[panel.terminal]}, ${year}, ${traffic}, ${scale} scale`);
      axes(svg,x,y,w,h,m);
      for(const type of view.series) {
        svg.append('path').datum(panel.values).attr('d',d3.line().defined(p=>p[type].value!==null).x(p=>x(p.date)).y(p=>y(p[type].value))).attr('fill','none').attr('stroke',cfg.colors[type]).attr('stroke-width',2).attr('stroke-dasharray',type==='International'?'5 3':null);
      }
      if (!panel.hasData) svg.append('text').attr('x',w/2).attr('y',h/2).attr('text-anchor','middle').text('No records for this category');
      card.append('p').attr('class','muted').text(panel.hasData ? `Axis maximum: ${count(y.domain()[1])} movements` : 'No data · axis shown for orientation only');
    }
    document.getElementById('lab-choice').textContent = `${scale==='shared'?'Shared':'Independent'} / ${traffic}`;
    document.getElementById('lab-state').textContent = `scale: "${scale}"; traffic: "${traffic}"`;
    document.getElementById('lab-transform').textContent = `${view.series.length} series · ${scale==='shared'?'common':'per-panel'} y-domain`;
    document.getElementById('lab-result').textContent = `${year} · 2 panels updated`;
    document.getElementById('lab-note').textContent = `${year} · Arrivals + departures. Blue solid = Domestic; orange dashed = International. ${scale==='shared'?'Equal heights represent equal counts.':'Independent scales: compare shapes, not heights.'} Gaps mean no record; plotted values sum available movements.`;
  };

})();
