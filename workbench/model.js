(function(scope){
'use strict';
function frontmatter(text){const result={};const match=text.match(/^---\r?\n([\s\S]*?)\r?\n---/);if(match)for(const line of match[1].split('\n')){const m=line.match(/^([\w-]+):\s*(.*)$/);if(m)result[m[1]]=m[2].replace(/^['"]|['"]$/g,'').trim();}return result;}
function section(text,title){const lines=text.split('\n');let active=false,out=[];for(const l of lines){if(l===`## ${title}`){active=true;continue;}if(active&&/^## /.test(l))break;if(active)out.push(l);}return out.join('\n').trim();}
function week(path,text){
 const f=frontmatter(text);
 const tasks=[...text.matchAll(/^- \[([ xX])\] (.+?) <!-- ([\w-]+) -->\s*$/gm)].map(m=>({id:m[3],done:m[1].toLowerCase()==='x',text:m[2]}));
 const entries=chapterLogs(path,text);
 const heads=[...text.matchAll(/^### D(\d+) · (.+)$/gm)];
 const days=heads.map((m,i)=>{
  const day=Number(m[1]);const key=`W${f.week}D${day}`;const entry=entries.find(e=>e.studyDay===key);
  const chunk=text.slice(m.index+m[0].length,i+1<heads.length?heads[i+1].index:text.length);
  const record=readSummary(chunk,key);
  const body=chunk.replace(/<!-- learning-summary:W\d+D[1-7]:[^\n]* -->\n?/g,'').replace(/^- \[[ xX]\] W\d+D\d+[^\n]*\n?/gm,'').trim();
  const row=text.split('\n').find(l=>l.startsWith(`| D${day} |`));
  return {key,day,week:Number(f.week),title:m[2].trim(),body,record,allocation:row?row.split('|')[3].trim():'约 2 小时',done:entry?.done||false,path,note:f.note,anchor:`D${day} · ${m[2].trim()}`};
 });
 return {path,week:Number(f.week),phase:Number(f.phase),title:f.title,chapter:f.chapter,note:f.note,tasks,days};
}
function readSummary(text,key){
 const match=text.match(new RegExp('<!-- learning-summary:'+key+':([^\\n]*) -->'));
 if(!match)return null;
 try{const r=JSON.parse(decodeURIComponent(match[1]));return typeof r.text==='string'?r:null;}catch{return null;}
}
function setSummary(text,key,record){
 if(!/^W\d+D[1-7]$/.test(key)||typeof record.text!=='string')throw Error('学习总结无效');
 const marker='<!-- learning-summary:'+key+':'+encodeURIComponent(JSON.stringify(record))+' -->';
 const old=new RegExp('<!-- learning-summary:'+key+':[^\\n]* -->');
 if(old.test(text))return text.replace(old,()=>marker);
 const day=new RegExp('^(- \\[)[ xX](\\] '+key+'\\s[^\\n]*)$','m');
 if(!day.test(text))throw Error('未找到对应学习日');
 return text.replace(day,line=>line+'\n'+marker);
}
function setDayCompletion(text,key,done){
 if(!/^W\d+D[1-7]$/.test(key))throw Error('学习日编号无效');
 const pattern=new RegExp(`^(- \\[)[ xX](\\] ${key}\\s[^\\n]*)$`,'m');
 if(!pattern.test(text))throw Error('未找到对应学习日');
 return text.replace(pattern,(_,a,b)=>a+(done?'x':' ')+b);
}
function chapterLogs(path,text){const f=frontmatter(text);return [...text.matchAll(/^- \[([ xX])\] (W(\d+)D(\d+))[^\n]*<!-- (?:study:(\d{4}-\d{2}-\d{2});minutes:(unknown|\d+)|day:w\d+-d\d+) -->/gm)].map(m=>({path,date:m[5]||'',minutes:m[6]&&m[6]!=='unknown'?Number(m[6]):0,timeKnown:!!m[6]&&m[6]!=='unknown',done:m[1].toLowerCase()==='x',studyDay:m[2],week:Number(m[3]),publish:f.publish==='true',summary:m[2]+(m[1].toLowerCase()==='x'?' · 已完成':' · 待完成'),understanding:'',blocker:'',next:''}));}
function localDate(date=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);}
function recentDates(today,count){const d=new Date(today+'T12:00:00Z');return Array.from({length:count},(_,i)=>{const x=new Date(d);x.setUTCDate(x.getUTCDate()-count+1+i);return x.toISOString().slice(0,10);});}
function stats(data,today=localDate()){
 const tasks=data.weeks.flatMap(w=>w.tasks);const done=tasks.filter(t=>t.done).length;
 const allDays=data.weeks.flatMap(w=>w.days||[]);const completedDays=allDays.filter(d=>d.done).length;
 const next=allDays.find(d=>!d.done)||allDays.at(-1);
 const active=data.weeks.find(w=>w.week===next?.week)||data.weeks[0];
 return {done,total:tasks.length,percent:allDays.length?Math.round(completedDays/allDays.length*100):0,
 completedWeeks:data.weeks.filter(w=>w.days?.length&&w.days.every(d=>d.done)).length,
 hours:(data.logs||[]).reduce((a,l)=>a+l.minutes,0)/60,weekHours:0,active,next,days:completedDays,totalDays:allDays.length};
}
const api={readSummary,setSummary,setDayCompletion,chapterLogs,frontmatter,section,week,localDate,recentDates,stats};if(typeof module!=='undefined'&&module.exports)module.exports=api;else scope.AgentModel=api;
})(typeof window!=='undefined'?window:globalThis);
