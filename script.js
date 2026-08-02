/* ===== 明智君OS v0.5 — script.js ===== */
'use strict';

const MODES = {
  boot: {
    label:'起動', icon:'⚡', badgeClass:'',
    status:'地上接続準備中。身体と現実の同期を開始。',
    description:'水。座る。画面を見る。ここから始める。',
    prompts:{
      planning:`明智君OSの「起動」モードです。\n今から地上活動を始めます。\n最初に確認することを一つだけ出してください。抽象論や一日の計画は不要です。`,
      build:`明智君OSの「起動」モードです。\n今ある設計を壊さず、着手できる最小の施工一手だけを示してください。完成版か差分か、対象ファイルも明記してください。`,
      audit:`明智君OSの「起動」モードです。\n作業開始前に、重大な矛盾・欠落・壊れる危険だけを確認してください。改善案の大量追加はしないでください。`,
      repair:`明智君OSの「起動」モードです。\nGitHub上の現状を確認し、最初に直すべき一点だけを特定してください。コード変更は最小限にしてください。`
    }
  },
  action: {
    label:'一手', icon:'▶', badgeClass:'mode-action',
    status:'現実干渉モード。対象を一つに限定。',
    description:'全部はやらない。現実を一つだけ動かす。',
    prompts:{
      planning:`明智君OSの「一手」モードです。\n現在地から動ける最小の一手を一つだけ決めてください。選択肢や計画全体は不要です。`,
      build:`明智君OSの「一手」モードです。\n今の仕様から、実際に施工する変更を一つだけ完成ファイルとして出してください。既存機能を維持してください。`,
      audit:`明智君OSの「一手」モードです。\n次の変更案だけを監査し、重大な問題があるかないかを判定してください。問題がなければ余計な追加提案は不要です。`,
      repair:`明智君OSの「一手」モードです。\nGitHub上で実行する最小の修正を一つだけ示してください。対象ファイルと変更理由を短く明記してください。`
    }
  },
  retreat: {
    label:'退避', icon:'⚠', badgeClass:'mode-retreat',
    status:'過負荷検知。安全退避を優先。',
    description:'進めない。壊れる前に下がる。これは防衛コマンド。',
    prompts:{
      planning:`明智君OSの「退避」モードです。\n前へ進める提案ではなく、負荷を下げる一手を一つだけ出してください。反省や長期計画は不要です。`,
      build:`明智君OSの「退避」モードです。\n新規実装は止めます。現在の成果物を壊さず保存・固定するために必要な作業だけを示してください。`,
      audit:`明智君OSの「退避」モードです。\n現在の案を進めない方がよい重大理由があるかだけ監査してください。安全側に倒し、追加機能は提案しないでください。`,
      repair:`明智君OSの「退避」モードです。\nGitHub上の変更を中止・保留・元に戻す最小手順を示してください。破綻回避を優先してください。`
    }
  },
  return: {
    label:'帰還', icon:'◉', badgeClass:'mode-return',
    status:'地上活動回収中。今日の処理を閉じる。',
    description:'できたことを裁かず、今日を閉じる。',
    prompts:{
      planning:`明智君OSの「帰還」モードです。\n今日できたことと残ったことを短く回収し、今日を閉じる一文を作ってください。明日の計画は不要です。`,
      build:`明智君OSの「帰還」モードです。\n現在の完成物を保存し、次回再開できる形に固定してください。変更ファイルと現在地だけを簡潔にまとめてください。`,
      audit:`明智君OSの「帰還」モードです。\n今日の変更が既存仕様を壊していないか最終点検してください。重大問題がなければ「帰還可能」と明記してください。`,
      repair:`明智君OSの「帰還」モードです。\nGitHub上の現在地、最新コミット、次回触る候補を一つだけ整理してください。新しい修正は始めないでください。`
    }
  }
};

const screenHome=document.getElementById('screen-home');
const screenMode=document.getElementById('screen-mode');
const lastUsedEl=document.getElementById('last-used');
const toast=document.getElementById('toast');
const modeBadge=document.getElementById('mode-badge');
const modeStatusText=document.getElementById('mode-status-text');
const modeDescText=document.getElementById('mode-desc-text');
const currentLocation=document.getElementById('current-location');
const textareas={
  planning:document.getElementById('ta-planning'),
  build:document.getElementById('ta-build'),
  audit:document.getElementById('ta-audit'),
  repair:document.getElementById('ta-repair')
};
let activeModeId=null;

function showScreen(name){
  screenHome.classList.toggle('active',name==='home');
  screenMode.classList.toggle('active',name==='mode');
}
function autoResize(ta){ta.style.height='auto';ta.style.height=ta.scrollHeight+'px';}
function buildPrompt(basePrompt){
  const location=currentLocation.value.trim();
  if(!location)return basePrompt;
  return `${basePrompt}\n\n現在地：\n${location}`;
}
function renderPrompts(){
  if(!activeModeId)return;
  const prompts=MODES[activeModeId].prompts;
  Object.keys(textareas).forEach(key=>{
    textareas[key].value=buildPrompt(prompts[key]);
    autoResize(textareas[key]);
  });
}
function openMode(id){
  const m=MODES[id]; if(!m)return;
  activeModeId=id;
  currentLocation.value='';
  modeBadge.textContent=m.icon+'  '+m.label;
  modeBadge.className='mode-badge '+m.badgeClass;
  modeStatusText.textContent=m.status;
  modeDescText.textContent=m.description;
  renderPrompts();
  try{localStorage.setItem('lastMode',id);localStorage.setItem('lastUsedAt',new Date().toISOString());}catch(_){ }
  showScreen('mode'); window.scrollTo({top:0,behavior:'smooth'});
}
function renderLastUsed(){
  try{
    const iso=localStorage.getItem('lastUsedAt'); const mode=localStorage.getItem('lastMode'); if(!iso)return;
    const d=new Date(iso); const pad=n=>String(n).padStart(2,'0');
    lastUsedEl.textContent=`最終起動: ${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())} / モード: ${MODES[mode]?.label||'—'}`;
  }catch(_){ }
}
let toastTimer=null;
function showToast(){toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1800);}
function fallbackCopy(text){const ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();showToast();}
function copyText(text){if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(showToast).catch(()=>fallbackCopy(text));}else fallbackCopy(text);}
function backHome(){showScreen('home');renderLastUsed();window.scrollTo({top:0,behavior:'smooth'});}
function bindEvents(){
  document.querySelectorAll('.mode-btn').forEach(btn=>btn.addEventListener('click',()=>openMode(btn.dataset.mode)));
  ['planning','build','audit','repair'].forEach(key=>document.getElementById('btn-copy-'+key).addEventListener('click',()=>copyText(textareas[key].value)));
  document.getElementById('btn-back').addEventListener('click',backHome);
  document.getElementById('btn-back-top').addEventListener('click',backHome);
  currentLocation.addEventListener('input',renderPrompts);
}
function init(){bindEvents();renderLastUsed();showScreen('home');}
document.addEventListener('DOMContentLoaded',init);
