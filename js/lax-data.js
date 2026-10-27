(() => {
  const app = window.LAX;
  const parseMonth = d3.utcParse('%Y-%m');
  app.loadData = async () => {
    const source = await d3.csv(app.config.source);
    const unique = new Map();
    let invalid = 0, duplicates = 0;
    for (const row of source) {
      const date = parseMonth(row.reportperiod.slice(0,7));
      const value = row.passenger_count.trim() === '' ? NaN : Number(row.passenger_count);
      if (!date || !Number.isFinite(value) || value < 0 || !row.terminal || !['Arrival','Departure'].includes(row.arrival_departure) || !['Domestic','International'].includes(row.domestic_international)) { invalid++; continue; }
      const key = [row.reportperiod.slice(0,7),row.terminal,row.arrival_departure,row.domestic_international].join('|');
      const record = {date, terminal:row.terminal, direction:row.arrival_departure, traffic:row.domestic_international, value, extracted:row.dataextractdate};
      if (unique.has(key)) duplicates++;
      // For future snapshots, retain the most recently extracted version of a reporting cell.
      if (!unique.has(key) || record.extracted > unique.get(key).extracted) unique.set(key,record);
    }
    const rows = [...unique.values()].sort((a,b)=>a.date-b.date);
    if (!rows.length) throw new Error('No valid records were found in the snapshot.');
    const extent = d3.extent(rows,d=>d.date);
    const months = d3.utcMonth.range(extent[0],d3.utcMonth.offset(extent[1],1));
    const years = [...new Set(rows.map(d=>d.date.getUTCFullYear()))].sort(d3.ascending);
    const yearMonths = d3.rollup(rows,v=>new Set(v.map(d=>+d.date)).size,d=>d.date.getUTCFullYear());
    const completeYears = years.filter(y=>yearMonths.get(y)===12);
    const terminals = [...new Set(rows.map(d=>d.terminal))].sort((a,b)=>{
      const ia=app.config.order.indexOf(a), ib=app.config.order.indexOf(b);
      return (ia<0?999:ia)-(ib<0?999:ib)||a.localeCompare(b);
    });
    return {rows,extent,months,years,completeYears,terminals,sourceCount:source.length,invalid,duplicates};
  };
  app.aggregate = (data,state) => {
    const months = data.months.filter(d=>d.getUTCFullYear()>=state.start && d.getUTCFullYear()<=state.end);
    const rows = data.rows.filter(d=>d.date.getUTCFullYear()>=state.start && d.date.getUTCFullYear()<=state.end && (state.direction==='All'||d.direction===state.direction));
    const grouped = d3.group(rows,d=>d.terminal,d=>+d.date,d=>d.traffic);
    const expected = state.direction==='All'?2:1;
    const series = state.traffic==='Both'?['Domestic','International']:[state.traffic];
    const panels = data.terminals.map(terminal=>{
      const values = months.map(date=>{
        const cell = grouped.get(terminal)?.get(+date);
        const point={date};
        for(const type of ['Domestic','International']) {
          const records=cell?.get(type)||[];
          point[type]={value:records.length?d3.sum(records,d=>d.value):null,count:records.length,expected};
        }
        const count=point.Domestic.count+point.International.count;
        point.Total={value:count?(point.Domestic.value||0)+(point.International.value||0):null,count,expected:expected*2};
        return point;
      });
      const reported = values.reduce((sum,p)=>sum+series.reduce((s,k)=>s+(p[k].value||0),0),0);
      const hasData = values.some(p=>series.some(k=>p[k].value!==null));
      const coverage=values.filter(p=>series.every(k=>p[k].count===p[k].expected)).length;
      return {terminal,values,reported,hasData,coverage};
    });
    if(state.sort==='volume') panels.sort((a,b)=>b.reported-a.reported);
    return {months,panels,series,expected};
  };
})();
