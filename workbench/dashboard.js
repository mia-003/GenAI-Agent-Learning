(function(scope){
'use strict';
const M=typeof module!=='undefined'&&module.exports?require('./model.js'):scope.AgentModel;
const phaseNames=['基础构建','知识与评估','能力进阶','项目交付'];
function el(tag,cls,text){const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x;}
function button(label,action,cls='aw-button'){
 const b=el('button',cls,label);b.type='button';
 b.addEventListener('click',async()=>{if(b.disabled)return;b.disabled=true;try{await action();}catch(e){const error=b.closest('.agent-workbench')?.querySelector('.aw-error');if(error){error.textContent=e.message||String(e);error.hidden=false;}}finally{if(b.isConnected)b.disabled=false;}});return b;
}
function plain(s){return s.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g,'$2').replace(/\[\[([^\]]+)\]\]/g,'$1').replace(/`([^`]+)`/g,'$1');}
function progress(n,total,cls='aw-track'){const bar=el('div',cls);const fill=el('i');fill.style.width=`${total?n/total*100:0}%`;bar.append(fill);return bar;}
function mount(root,data,api,selection={}){
 const s=M.stats(data);if(!s.active){root.textContent='尚未找到学习安排。';return;}
 const week=data.weeks.find(w=>w.week===selection.week)||s.active;
 const day=week.days.find(d=>d.day===selection.day)||week.days.find(d=>!d.done)||week.days[0];
 const tab=selection.tab||'day';root.replaceChildren();root.classList.add('agent-workbench');
 root.dataset.selectedWeek=week.week;root.dataset.selectedDay=day.day;root.dataset.selectedTab=tab;
 const select=(w,d,t=tab)=>mount(root,data,api,{week:w,day:d,tab:t});
 const shell=el('div','aw-shell');root.append(shell);
 const top=el('header','aw-top');const brand=el('div','aw-brand');brand.append(el('span','aw-logo','a.'),el('span','aw-brand-text','AGENT STUDIO'));
 const topActions=el('div','aw-top-actions');topActions.append(button('知识地图 ↗',()=>api.open('03-学习笔记/知识地图.canvas'),'aw-quiet'),button(api.editable?'同步 GitHub ↗':'GitHub ↗',()=>api.editable?api.sync():api.repo(),'aw-quiet'));
 top.append(brand,topActions);shell.append(top);
 const heading=el('section','aw-heading');const h=el('div');h.append(el('p','aw-kicker','YOUR PERSONAL LEARNING SPACE'),el('h1',null,'学习工作台'));
 const date=el('div','aw-date');date.append(el('span',null,M.localDate()),el('small',null,api.editable?'本地学习空间':'公开学习进度'));
 heading.append(h,date);shell.append(heading);
 const error=el('p','aw-error');error.setAttribute('role','alert');error.hidden=true;shell.append(error);
 const overview=el('section','aw-overview');
 for(const [v,l]of [[`${s.days}`,'已完成学习日'],[`${s.totalDays-s.days}`,'待学习日'],[`${s.completedWeeks} / ${data.weeks.length}`,'完成学习周']]){const a=el('div','aw-stat');a.append(el('strong',null,v),el('span',null,l));overview.append(a);}
 const overall=el('div','aw-overall');const ohead=el('div','aw-inline');ohead.append(el('span',null,'总进度'),el('strong',null,`${s.percent}%`));overall.append(ohead,progress(s.days,s.totalDays),el('small',null,`${s.days} / ${s.totalDays} 天 · 按每日勾选计算`));overview.append(overall);shell.append(overview);
 const layout=el('div','aw-layout');const main=el('div','aw-main');const aside=el('aside','aw-aside');layout.append(main,aside);shell.append(layout);
 const hero=el('section','aw-focus');const heroText=el('div','aw-focus-text');
 heroText.append(el('div','aw-focus-top',`${day.done?'已完成':'当前查看'}  /  W${week.week} · DAY ${day.day}`),el('h2',null,day.title),el('p','aw-focus-sub',`${week.chapter}  ·  ${day.allocation}`));
 const heroActions=el('div','aw-focus-actions');
 if(api.editable){const done=button(day.done?'✓ 已完成 · 撤销':'标记这一天完成',()=>api.toggleDay(week.path,day.key,!day.done),'aw-button aw-primary'+(day.done?' is-done':''));done.setAttribute('aria-pressed',String(day.done));heroActions.append(done);}
 else heroActions.append(button('在 Obsidian 中学习 ↗',()=>api.openVault(),'aw-button aw-primary'));
 heroActions.append(button('打开章节笔记 ↗',()=>api.open(week.note),'aw-focus-link'));heroText.append(heroActions);hero.append(heroText);
 const dial=el('div','aw-dial');dial.style.setProperty('--angle',`${week.days.filter(d=>d.done).length/7*360}deg`);const dialInside=el('div');dialInside.append(el('strong',null,`${week.days.filter(d=>d.done).length}`),el('span',null,'/ 7 天'));dial.append(dialInside);hero.append(dial);main.append(hero);
 const content=el('section','aw-card aw-detail');const detailTop=el('div','aw-detail-top');const tabs=el('div','aw-tabs');
 for(const[key,label]of[['day','每日内容'],['week','每周目标']]){const b=button(label,()=>select(week.week,day.day,key),'aw-tab'+(tab===key?' is-active':''));b.setAttribute('aria-pressed',String(tab===key));tabs.append(b);}
 detailTop.append(tabs,button('打开原文 ↗',()=>api.open(tab==='day'?week.path+'#'+day.anchor:week.path),'aw-quiet'));content.append(detailTop);
 if(tab==='day'){
  const body=el('div','aw-body');body.append(el('p','aw-detail-label',`W${week.week}D${day.day} · ${day.done?'已完成':'阅读与实践'}`));
  for(const paragraph of day.body.split(/\n\s*\n/).filter(Boolean)){
   if(/^[-\d]/.test(paragraph)){const group=el('div','aw-paragraph-list');for(const line of paragraph.split('\n'))group.append(el('p',null,plain(line)));body.append(group);}else body.append(el('p',null,plain(paragraph)));
  }
  const resources=el('div','aw-resources');resources.append(button('阅读教材 ↗',()=>api.book(week.week),'aw-resource'),button('本周完整安排 ↗',()=>api.open(week.path),'aw-resource'));body.append(resources);content.append(body);
 }else{
  const list=el('div','aw-goals');for(const t of week.tasks){const label=el('label','aw-task');const cb=document.createElement('input');cb.type='checkbox';cb.checked=t.done;cb.disabled=!api.editable;cb.setAttribute('aria-label',t.text);cb.addEventListener('change',async()=>{cb.disabled=true;try{await api.toggle(week.path,t.id,cb.checked);}catch(e){cb.checked=!cb.checked;error.hidden=false;error.textContent=e.message;}finally{cb.disabled=!api.editable;}});label.append(cb,el('span',null,t.text));list.append(label);}content.append(list);
 }
 main.append(content);
 const seven=el('section','aw-card aw-seven');const sevenHead=el('div','aw-seven-head');sevenHead.append(el('div','aw-inline',`W${String(week.week).padStart(2,'0')} / 本周七天`),el('p',null,week.title));seven.append(sevenHead);
 const weekSelect=el('select','aw-week-select');weekSelect.setAttribute('aria-label','选择学习周');for(const w of data.weeks){const op=el('option',null,`W${w.week} · ${w.title}`);op.value=w.week;op.selected=w.week===week.week;weekSelect.append(op);}weekSelect.onchange=()=>select(Number(weekSelect.value));seven.append(weekSelect);
 const dayList=el('div','aw-day-list');for(const d of week.days){
  const row=el('div','aw-day-row'+(d.day===day.day?' is-selected':'')+(d.done?' is-complete':''));
  const check=document.createElement('input');check.type='checkbox';check.checked=d.done;check.disabled=!api.editable;check.setAttribute('aria-label',`${d.key} ${d.title} 完成`);check.onchange=async()=>{check.disabled=true;try{await api.toggleDay(week.path,d.key,check.checked);}catch(e){check.checked=!check.checked;error.hidden=false;error.textContent=e.message;}finally{check.disabled=!api.editable;}};
  const pick=button('',()=>select(week.week,d.day),'aw-day-pick');const num=el('span','aw-day-number',`D${d.day}`);const text=el('span','aw-day-title',d.title);pick.append(num,text);pick.title=d.title;pick.setAttribute('aria-label',`查看 ${d.key} ${d.title}`);row.append(check,pick,el('span','aw-day-arrow',d.day===day.day?'↗':''));dayList.append(row);
 }seven.append(dayList);aside.append(seven);
 const resume=el('section','aw-resume');resume.append(el('p','aw-kicker','NEXT IN YOUR JOURNEY'),el('strong',null,s.days===s.totalDays?'本轮学习已完成':`W${s.next.week}D${s.next.day} · ${s.next.title}`),el('p',null,s.days===s.totalDays?'整理笔记，开始下一轮探索。':'第一个尚未勾选的学习日。按自己的节奏继续。'),button('前往下一学习日 →',()=>select(s.next.week,s.next.day),'aw-quiet'));aside.append(resume);
 const route=el('section','aw-route');const routeHead=el('div','aw-route-head');routeHead.append(el('h2',null,'16 周路线'),el('span',null,'每一小格，都是一个学习日'));route.append(routeHead);const phases=el('div','aw-phases');
 phaseNames.forEach((name,i)=>{const group=el('div','aw-phase');group.append(el('p','aw-phase-label',`0${i+1}  ${name}`));const grid=el('div','aw-route-weeks');for(const w of data.weeks.filter(w=>w.phase===i+1)){
  const b=button('',()=>select(w.week), 'aw-route-week'+(week.week===w.week?' is-selected':''));b.title=`W${w.week} · ${w.title}`;b.setAttribute('aria-label',`查看第${w.week}周 ${w.title}`);b.append(el('span',null,`W${String(w.week).padStart(2,'0')}`));const cells=el('span','aw-cells');for(const d of w.days)cells.append(el('i',d.done?'is-done':(s.next?.key===d.key?'is-next':'')));b.append(cells);grid.append(b);
 }group.append(grid);phases.append(group);});route.append(phases);shell.append(route);
 const foot=el('footer','aw-footer');foot.append(el('span',null,api.editable?'按天推进 · 完成状态自动保存在周安排':'公开快照 · '+(data.updated||'')),button('完整学习路线 ↗',()=>api.open('01-学习计划/16周学习路线.md'),'aw-quiet'));shell.append(foot);
 return {week:week.week,day:day.day,tab};
}
if(typeof module!=='undefined'&&module.exports)module.exports={mount};else scope.AgentDashboard={mount};
})(typeof window!=='undefined'?window:globalThis);
