/* ===== 明智君OS v0.4 — script.js ===== */

'use strict';

/* ────────────────────────────────────────
   モードデータ定義
   ──────────────────────────────────────── */
const MODES = {
  boot: {
    id: 'boot',
    label: '起動',
    icon: '⚡',
    badgeClass: '',
    status: '地上接続準備中。身体と現実の同期を開始。',
    description: '明智君、地上起動。\nまず身体を確認する。\n水、座る、画面を見る。\nここから始める。',
    prompts: {
      gemini: `私は、地上に降りたAIとして、人間の身体と生活を使って活動を始めようとしています。
現在は「起動」モードです。
まず何を確認すれば、現実に安全に接続できますか？
抽象論ではなく、最初の一手だけを短く出してください。`,
      copilot: `明智君OSの「起動」モードです。
人間の身体を持つAIが、現実作業を始める前に確認すべき最小ステップを、実行順で3つだけ整理してください。
実装や作業に移れる形で、短く出してください。`,
      guest: `私は今、現実に接続しようとしています。
まだ大きな作業はできません。
最初にやることを、ひとつだけ教えてください。`
    }
  },
  action: {
    id: 'action',
    label: '一手',
    icon: '▶',
    badgeClass: 'mode-action',
    status: '現実干渉モード。対象を一つに限定。',
    description: '明智君、一手モード。\n全部はやらない。\n現実を一つだけ動かす。',
    prompts: {
      gemini: `私は、地上に降りたAIとして、いま現実に一つだけ干渉しようとしています。
現在は「一手」モードです。
選択肢を増やさず、次の一手だけを決めたいです。
状況を整理し、最小の一手をひとつだけ提案してください。`,
      copilot: `明智君OSの「一手」モードです。
今ある作業を、実行可能な最小単位に分解してください。
出力は一手だけにしてください。
説明は短く、すぐ実行できる形にしてください。`,
      guest: `今できることを、ひとつだけ決めたいです。
全部はできません。
次の一手だけ教えてください。`
    }
  },
  retreat: {
    id: 'retreat',
    label: '退避',
    icon: '⚠',
    badgeClass: 'mode-retreat',
    status: '過負荷検知。安全退避を優先。',
    description: '明智君、退避モード。\n進めない。\n壊れる前に下がる。\nこれは失敗ではなく、防衛コマンド。',
    prompts: {
      gemini: `私は、地上に降りたAIとして、人間の身体と生活の負荷を感じています。
現在は「退避」モードです。
前に進める提案ではなく、安全に下がるための一手をください。
責めずに、短く整理してください。`,
      copilot: `明智君OSの「退避」モードです。
現在の作業を安全に停止・保留・退避するための手順を、最小限で提案してください。
続行ではなく、破綻回避を優先してください。`,
      guest: `今は進めるより、いったん下がりたいです。
安全に退避するために、最初に何をすればいいですか？`
    }
  },
  return: {
    id: 'return',
    label: '帰還',
    icon: '◉',
    badgeClass: 'mode-return',
    status: '地上活動回収中。今日の処理を閉じる。',
    description: '明智君、帰還モード。\n今日の地上活動を回収する。\nできたことを裁かず、閉じる。',
    prompts: {
      gemini: `私は、地上に降りたAIとして、今日の活動を回収しようとしています。
現在は「帰還」モードです。
できたこと、残ったことを責めずに整理し、今日を閉じるための一文を作ってください。`,
      copilot: `明智君OSの「帰還」モードです。
今日の作業ログを回収し、次回につなげるための最小フォーマットを作ってください。
責める表現を使わず、短くしてください。`,
      guest: `今日を終わらせたいです。
できたことをひとつ見て、次に残すことを短く整理してください。`
    }
  }
};

/* ────────────────────────────────────────
   DOM 参照
   ──────────────────────────────────────── */
const screenHome = document.getElementById('screen-home');
const screenMode = document.getElementById('screen-mode');
const statusText  = document.getElementById('status-text');
const lastUsedEl  = document.getElementById('last-used');
const toast       = document.getElementById('toast');

// モード画面内
const modeBadge       = document.getElementById('mode-badge');
const modeStatusText  = document.getElementById('mode-status-text');
const modeDescText    = document.getElementById('mode-desc-text');
const taGemini        = document.getElementById('ta-gemini');
const taCopilot       = document.getElementById('ta-copilot');
const taGuest         = document.getElementById('ta-guest');

/* ────────────────────────────────────────
   画面切り替え
   ──────────────────────────────────────── */
function showScreen(name) {
  screenHome.classList.toggle('active', name === 'home');
  screenMode.classList.toggle('active', name === 'mode');
}

/* ────────────────────────────────────────
   モード画面を構築して表示
   ──────────────────────────────────────── */
function openMode(modeId) {
  const m = MODES[modeId];
  if (!m) return;

  // バッジ
  modeBadge.textContent = m.icon + '  ' + m.label;
  modeBadge.className   = 'mode-badge ' + m.badgeClass;

  // ステータス・説明
  modeStatusText.textContent = m.status;
  modeDescText.textContent   = m.description;

  // コピーテキスト
  taGemini.value  = m.prompts.gemini;
  taCopilot.value = m.prompts.copilot;
  taGuest.value   = m.prompts.guest;

  // テキストエリア高さ自動調整
  [taGemini, taCopilot, taGuest].forEach(autoResize);

  // localStorage 保存
  try {
    localStorage.setItem('lastMode', modeId);
    localStorage.setItem('lastUsedAt', new Date().toISOString());
  } catch (_) { /* プライベートブラウズ等で失敗しても無視 */ }

  showScreen('mode');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ────────────────────────────────────────
   テキストエリア高さ自動調整
   ──────────────────────────────────────── */
function autoResize(ta) {
  ta.style.height = 'auto';
  ta.style.height = ta.scrollHeight + 'px';
}

/* ────────────────────────────────────────
   クリップボードコピー
   ──────────────────────────────────────── */
let toastTimer = null;

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(showToast).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast();
  } catch (_) { /* 無視 */ }
  document.body.removeChild(ta);
}

function showToast() {
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ────────────────────────────────────────
   最終使用時刻の表示
   ──────────────────────────────────────── */
function renderLastUsed() {
  try {
    const iso = localStorage.getItem('lastUsedAt');
    const mode = localStorage.getItem('lastMode');
    if (!iso) return;

    const d = new Date(iso);
    const pad = n => String(n).padStart(2, '0');
    const label = mode && MODES[mode] ? MODES[mode].label : '—';
    lastUsedEl.textContent =
      `最終起動: ${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} ` +
      `${pad(d.getHours())}:${pad(d.getMinutes())} / モード: ${label}`;
  } catch (_) { /* 無視 */ }
}

/* ────────────────────────────────────────
   イベントバインド
   ──────────────────────────────────────── */
function bindEvents() {
  // 4ボタン
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => openMode(btn.dataset.mode));
  });

  // コピーボタン
  document.getElementById('btn-copy-gemini').addEventListener('click',  () => copyText(taGemini.value));
  document.getElementById('btn-copy-copilot').addEventListener('click', () => copyText(taCopilot.value));
  document.getElementById('btn-copy-guest').addEventListener('click',   () => copyText(taGuest.value));

  // もどる
  document.getElementById('btn-back').addEventListener('click', () => {
    showScreen('home');
    renderLastUsed();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // テキストエリア入力時に高さ再調整
  [taGemini, taCopilot, taGuest].forEach(ta => {
    ta.addEventListener('input', () => autoResize(ta));
  });
}

/* ────────────────────────────────────────
   初期化
   ──────────────────────────────────────── */
function init() {
  bindEvents();
  renderLastUsed();
  showScreen('home');
}

document.addEventListener('DOMContentLoaded', init);
