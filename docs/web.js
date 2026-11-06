'use strict';
const repo='https://github.com/mia-003/GenAI-Agent-Learning',vault='AI-Agent学习';
const storageKey='agent-studio-daily-records-v1';
const uri=p=>'obsidian://open?vault='+encodeURIComponent(vault)+'&file='+encodeURIComponent(p);
function openURL(url){window.open(url,'_blank','noopener,noreferrer');}
function validate(value){
 if(!value||value.version!==1||!value.days||typeof value.days!=='object'||Array.isArray(value.days))throw Error('备份格式不正确');
 const out={version:1,days:{}};
 for(const [key,r]of Object.entries(value.days)){
  if(!/^W([1-9]|1[0-6])D[1-7]$/.test(key)||!r||typeof r!=='object')throw Error('备份中的学习日无效');
  const day={};if(Object.hasOwn(r,'done')){if(typeof r.done!=='boolean')throw Error('完成状态无效');day.done=r.done;}
  if(r.record){const x=r.record;if(typeof x.text!=='string'||typeof x.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||typeof x.updatedAt!=='string'||!Number.isFinite(Date.parse(x.updatedAt)))throw Error('学习总结格式无效');day.record={text:x.text,date:x.date,updatedAt:x.updatedAt};}out.days[key]=day;
 }return out;
}
function loadRecords(){const raw=localStorage.getItem(storageKey);return raw?validate(JSON.parse(raw)):{version:1,days:{}};}
fetch('data.json?v=37c90b61518b',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('读取进度失败');return r.json();}).then(data=>{
 let records;let storageError;try{records=loadRecords();}catch(e){storageError=e;records={version:1,days:{}};}
 const root=document.getElementById('workbench');
 const base=structuredClone(data);
 function apply(){for(const d of data.weeks.flatMap(w=>w.days)){const original=base.weeks.flatMap(w=>w.days).find(x=>x.key===d.key);const saved=records.days[d.key];d.done=saved?.done??original.done;d.record=saved?.record??original.record;}}
 function persist(key,patch){if(storageError)throw Error('浏览器记录无法读取，未覆盖原数据。请检查浏览器存储设置。');const next={version:1,days:{...records.days,[key]:{...records.days[key],...patch}}};try{localStorage.setItem(storageKey,JSON.stringify(next));}catch{throw Error('保存失败：浏览器存储不可用或空间不足。请导出已有记录后检查设置。');}records=next;apply();}
 function render(){apply();AgentDashboard.mount(root,data,api,{week:Number(root.dataset.selectedWeek),day:Number(root.dataset.selectedDay),tab:root.dataset.selectedTab});}
 const api={editable:false,canComplete:true,
  saveSummary:async(p,key,record,complete)=>persist(key,{record,...(complete?{done:true}:{})}),
  toggleDay:async(p,key,done)=>{persist(key,{done});render();},
  exportRecords:()=>{const days={};for(const d of data.weeks.flatMap(w=>w.days))if(d.record||Object.hasOwn(records.days[d.key]||{},'done'))days[d.key]={done:d.done,...(d.record?{record:d.record}:{})};const blob=new Blob([JSON.stringify({version:1,days},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Agent学习记录-'+AgentModel.localDate()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);},
  importRecords:()=>{const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.onchange=async()=>{try{const file=input.files[0];if(!file)return;const imported=validate(JSON.parse(await file.text()));if(!window.confirm('导入将合并学习记录；相同学习日以备份为准。继续？'))return;const next={version:1,days:{...records.days,...imported.days}};localStorage.setItem(storageKey,JSON.stringify(next));records=next;storageError=null;render();}catch(e){const error=root.querySelector('.aw-error');error.hidden=false;error.textContent='导入失败：'+e.message;}};input.click();},
  repo:()=>openURL(repo),open:p=>{p=p.split('#')[0];if(p.startsWith('01-学习计划/')||p.startsWith('04-章节笔记/')||p==='README.md')openURL(repo+'/blob/main/'+p.split('/').map(encodeURIComponent).join('/'));else location.href=uri(p);},
  book:w=>{const c=[1,2,2,4,3,3,5,7,9,6,10,8,8,5,7,9][w-1]||1;openURL('https://github.com/bojieli/ai-agent-book/blob/main/book/chapter'+c+'.md');}
 };
 window.addEventListener('storage',e=>{if(e.key!==storageKey)return;try{records=loadRecords();storageError=null;render();}catch(err){storageError=err;}});
 render();if(storageError){const error=root.querySelector('.aw-error');error.hidden=false;error.textContent='浏览器记录读取失败；请检查存储设置。原记录未被覆盖。';}
}).catch(e=>{document.getElementById('workbench').textContent='无法载入工作台：'+e.message+'。请刷新页面重试。';});
