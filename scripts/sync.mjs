import fs from 'node:fs';import path from 'node:path';import {fileURLToPath}from'node:url';import{execFileSync}from'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const lock=path.join(root,'.sync-lock');try{fs.mkdirSync(lock);}catch{throw Error('已有同步在进行；若上次异常退出，请先确认进程已结束再移除.sync-lock目录。');}
const run=(cmd,args)=>execFileSync(cmd,args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe'],timeout:120000});
try{run(process.execPath,[path.join(root,'scripts/build.mjs')]);const expected='https://github.com/mia-003/GenAI-Agent-Learning.git';const remote=run('git',['remote','get-url','origin']).trim();if(remote!==expected)throw Error('远端与学习仓库不一致，已停止同步。');
run('git',['add','--','.gitignore','README.md','00-学习工作台.md','使用指南.md','知识地图.canvas','学习计划','workbench','scripts','docs','public-notes','打开学习工作台.command']);
const files=run('git',['diff','--cached','--name-only']).trim().split('\n').filter(Boolean);for(const f of files){if(/(^|\/)(\.env|\.obsidian|\.materials|每日记录)(\/|$)/.test(f))throw Error('意外包含本地文件：'+f);}
if(files.length)run('git',['commit','-m','Update learning progress and public notes']);run('git',['push','origin','main']);fs.writeFileSync(path.join(root,'.sync-status.json'),JSON.stringify({success:true,at:new Date().toISOString()}));console.log('GitHub learning materials synchronized.');}finally{fs.rmdirSync(lock);}
