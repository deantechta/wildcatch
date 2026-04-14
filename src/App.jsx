import { useState, useEffect, useRef } from "react";

// ── Game Constants ─────────────────────────────────────────
const GW = 540, GH = 390;
const GROUND_Y = GH - 58;
const PLAYER_H = 50;
const BALL_R = 11;
const MON_R = 28;

const MONSTERS = [
  // ── common Lv 1 (10종) ──
  { level: 1, emoji: "🐛", name: "꼬물이",   rarity: "common" },
  { level: 1, emoji: "🐌", name: "달팽달팽", rarity: "common" },
  { level: 1, emoji: "🐞", name: "무당벌레", rarity: "common" },
  { level: 1, emoji: "🐜", name: "개미야",   rarity: "common" },
  { level: 1, emoji: "🦗", name: "귀뚜리",   rarity: "common" },
  { level: 1, emoji: "🪲", name: "딱정이",   rarity: "common" },
  { level: 1, emoji: "🪳", name: "바퀴롤",   rarity: "common" },
  { level: 1, emoji: "🦟", name: "모기야",   rarity: "common" },
  { level: 1, emoji: "🐢", name: "거북이",   rarity: "common" },
  { level: 1, emoji: "🐊", name: "악어꼬",   rarity: "common" },
  // ── common Lv 2 (10종) ──
  { level: 2, emoji: "🐝", name: "꿀벌이",   rarity: "common" },
  { level: 2, emoji: "🦋", name: "나비요",   rarity: "common" },
  { level: 2, emoji: "🐸", name: "개굴이",   rarity: "common" },
  { level: 2, emoji: "🐭", name: "쥐돌이",   rarity: "common" },
  { level: 2, emoji: "🐹", name: "햄찌",     rarity: "common" },
  { level: 2, emoji: "🐇", name: "토끼야",   rarity: "common" },
  { level: 2, emoji: "🦔", name: "고슴이",   rarity: "common" },
  { level: 2, emoji: "🐿",  name: "다람쥐",   rarity: "common" },
  { level: 2, emoji: "🦦", name: "수달이",   rarity: "common" },
  { level: 2, emoji: "🦫", name: "비버야",   rarity: "common" },
  // ── common Lv 3 (10종) ──
  { level: 3, emoji: "🦊", name: "여우린",   rarity: "common" },
  { level: 3, emoji: "🐧", name: "펭귄이",   rarity: "common" },
  { level: 3, emoji: "🐦", name: "참새야",   rarity: "common" },
  { level: 3, emoji: "🦜", name: "앵무새",   rarity: "common" },
  { level: 3, emoji: "🦢", name: "백조롤",   rarity: "common" },
  { level: 3, emoji: "🦩", name: "플라밍",   rarity: "common" },
  { level: 3, emoji: "🦚", name: "공작새",   rarity: "common" },
  { level: 3, emoji: "🦉", name: "부엉이",   rarity: "common" },
  { level: 3, emoji: "🐓", name: "닭돌이",   rarity: "common" },
  { level: 3, emoji: "🦤", name: "도도새",   rarity: "common" },
  // ── uncommon Lv 4 (10종) ──
  { level: 4, emoji: "🐰", name: "토실이",   rarity: "uncommon" },
  { level: 4, emoji: "🦆", name: "꽥꽥이",   rarity: "uncommon" },
  { level: 4, emoji: "🐨", name: "코알라",   rarity: "uncommon" },
  { level: 4, emoji: "🐼", name: "팬더곰",   rarity: "uncommon" },
  { level: 4, emoji: "🦝", name: "너구리",   rarity: "uncommon" },
  { level: 4, emoji: "🦙", name: "알파카",   rarity: "uncommon" },
  { level: 4, emoji: "🦘", name: "캥거루",   rarity: "uncommon" },
  { level: 4, emoji: "🦨", name: "스컹크",   rarity: "uncommon" },
  { level: 4, emoji: "🦡", name: "오소리",   rarity: "uncommon" },
  { level: 4, emoji: "🐻", name: "곰돌이",   rarity: "uncommon" },
  // ── uncommon Lv 5 (10종) ──
  { level: 5, emoji: "🐮", name: "무우",     rarity: "uncommon" },
  { level: 5, emoji: "🐷", name: "꿀꿀이",   rarity: "uncommon" },
  { level: 5, emoji: "🐸", name: "점프개굴", rarity: "uncommon" },
  { level: 5, emoji: "🦌", name: "사슴이",   rarity: "uncommon" },
  { level: 5, emoji: "🐑", name: "양양이",   rarity: "uncommon" },
  { level: 5, emoji: "🐐", name: "염소야",   rarity: "uncommon" },
  { level: 5, emoji: "🦙", name: "라마야",   rarity: "uncommon" },
  { level: 5, emoji: "🦏", name: "코뿔소",   rarity: "uncommon" },
  { level: 5, emoji: "🦛", name: "하마야",   rarity: "uncommon" },
  { level: 5, emoji: "🐃", name: "들소야",   rarity: "uncommon" },
  // ── rare Lv 6 (10종) ──
  { level: 6, emoji: "🐯", name: "호랑이",   rarity: "rare" },
  { level: 6, emoji: "🦁", name: "사자왕",   rarity: "rare" },
  { level: 6, emoji: "🐆", name: "치타야",   rarity: "rare" },
  { level: 6, emoji: "🐅", name: "백호",     rarity: "rare" },
  { level: 6, emoji: "🐻‍❄️", name: "북극곰",   rarity: "rare" },
  { level: 6, emoji: "🦊", name: "붉은여우", rarity: "rare" },
  { level: 6, emoji: "🐺", name: "늑대왕",   rarity: "rare" },
  { level: 6, emoji: "🦍", name: "고릴라",   rarity: "rare" },
  { level: 6, emoji: "🦧", name: "오랑우탄", rarity: "rare" },
  { level: 6, emoji: "🐘", name: "코끼리",   rarity: "rare" },
  // ── rare Lv 7 (10종) ──
  { level: 7, emoji: "🦄", name: "유니콘",   rarity: "rare" },
  { level: 7, emoji: "🐉", name: "동양룡",   rarity: "rare" },
  { level: 7, emoji: "🦅", name: "독수리",   rarity: "rare" },
  { level: 7, emoji: "🦋", name: "신비나비", rarity: "rare" },
  { level: 7, emoji: "🦈", name: "상어왕",   rarity: "rare" },
  { level: 7, emoji: "🐋", name: "고래신",   rarity: "rare" },
  { level: 7, emoji: "🦑", name: "오징어",   rarity: "rare" },
  { level: 7, emoji: "🦞", name: "바닷가재", rarity: "rare" },
  { level: 7, emoji: "🐊", name: "대악어",   rarity: "rare" },
  { level: 7, emoji: "🦎", name: "도마뱀",   rarity: "rare" },
  // ── epic Lv 8 (10종) ──
  { level: 8, emoji: "🐲", name: "드래곤",   rarity: "epic" },
  { level: 8, emoji: "🌊", name: "파도신",   rarity: "epic" },
  { level: 8, emoji: "🌋", name: "화산귀",   rarity: "epic" },
  { level: 8, emoji: "🌪", name: "폭풍신",   rarity: "epic" },
  { level: 8, emoji: "❄️",  name: "얼음왕",   rarity: "epic" },
  { level: 8, emoji: "🌩",  name: "천둥신",   rarity: "epic" },
  { level: 8, emoji: "☄️",  name: "혜성이",   rarity: "epic" },
  { level: 8, emoji: "🌑", name: "다크문",   rarity: "epic" },
  { level: 8, emoji: "🦂", name: "전갈왕",   rarity: "epic" },
  { level: 8, emoji: "🐙", name: "문어대왕", rarity: "epic" },
  // ── epic Lv 9 (10종) ──
  { level: 9, emoji: "⚡", name: "번개신",   rarity: "epic" },
  { level: 9, emoji: "🔥", name: "불꽃왕",   rarity: "epic" },
  { level: 9, emoji: "🌀", name: "회오리",   rarity: "epic" },
  { level: 9, emoji: "💀", name: "해골귀",   rarity: "epic" },
  { level: 9, emoji: "👁",  name: "눈의신",   rarity: "epic" },
  { level: 9, emoji: "🌙", name: "달의신",   rarity: "epic" },
  { level: 9, emoji: "☀️",  name: "태양신",   rarity: "epic" },
  { level: 9, emoji: "🌊", name: "심해왕",   rarity: "epic" },
  { level: 9, emoji: "🪐", name: "행성신",   rarity: "epic" },
  { level: 9, emoji: "🌌", name: "은하수",   rarity: "epic" },
  // ── legend Lv 10 (10종) ──
  { level: 10, emoji: "🌟", name: "별이",     rarity: "legend" },
  { level: 10, emoji: "🌈", name: "무지개신", rarity: "legend" },
  { level: 10, emoji: "🍀", name: "행운의신", rarity: "legend" },
  { level: 10, emoji: "💎", name: "다이아",   rarity: "legend" },
  { level: 10, emoji: "👑", name: "왕의신",   rarity: "legend" },
  { level: 10, emoji: "🔮", name: "예언자",   rarity: "legend" },
  { level: 10, emoji: "🌸", name: "봄의신",   rarity: "legend" },
  { level: 10, emoji: "🦋", name: "환생나비", rarity: "legend" },
  { level: 10, emoji: "✨", name: "빛의신",   rarity: "legend" },
  { level: 10, emoji: "🪄", name: "마법사",   rarity: "legend" },
];

// ── Boss Monster Definitions (이름만 — 픽셀아트는 drawBossSprite에서 개별 구현) ──
const BOSS_MONSTERS = [
  { name: "피카추" },              { name: "라이추" },   { name: "리자드" },              { name: "파이리" },
  { name: "꼬부기" },              { name: "거북왕", power: true },   { name: "팬텀" },     { name: "이상해씨" },
  { name: "리자몽", power: true }, { name: "잠만보" },
  { name: "이브이" },              { name: "뮤츠", power: true },     { name: "뮤", power: true },       { name: "푸린" },
  { name: "망나뇽", power: true }, { name: "이상해꽃", power: true }, { name: "후딘", power: true },     { name: "붐볼" },
  { name: "식스테일" },            { name: "가디" },
  { name: "이상해풀" },            { name: "어니부기" }, { name: "버터플" },              { name: "아보크" },
  { name: "나인테일", power: true }, { name: "윈디" },   { name: "수륙챙이" },            { name: "우츠보트" },
  { name: "독파리" },              { name: "질뻐기" },
];

const RARITY_COLOR = {
  common: "#78909C", uncommon: "#43A047",
  rare: "#1E88E5", epic: "#8E24AA", legend: "#FFD700",
};

const BALL_COLORS = [
  "#E53935","#F57C00","#FBC02D","#2E7D32","#00838F",
  "#1565C0","#6A1B9A","#AD1457","#4E342E","#F9A825",
];

const BALL_NAMES = [
  "WildBall","SuperBall","HyperBall","MegaBall","UltraBall",
  "MasterBall","DarkBall","StarBall","CosmoBall","OmegaBall",
];

// XP required to reach next ball level (index = ballLvl-1)
const XP_REQ = [4, 9, 16, 26, 40, 60, 88, 125, 175, Infinity];

// 캐릭터 XP — 레벨별 필요 경험치 (index = charLvl-1, 총 49개)
// lv1 몬스터(1XP) 기준 포획 수: Lv1-10≈10마리, Lv10-20≈20마리(lv5 기준), Lv20-30≈43마리(lv7 기준), ...
const CHAR_XP_REQ = [
  10,10,10,10,10,10,10,10,10,           // lv1→2 ~ lv9→10  (lv1 몬스터 약 10마리)
  100,100,100,100,100,100,100,100,100,100, // lv10→11 ~ lv19→20 (lv5 몬스터 약 20마리)
  300,300,300,300,300,300,300,300,300,300, // lv20→21 ~ lv29→30 (lv7 몬스터 약 43마리)
  600,600,600,600,600,600,600,600,600,600, // lv30→31 ~ lv39→40 (lv8 몬스터 약 75마리)
  900,900,900,900,900,900,900,900,900,900, // lv40→41 ~ lv49→50 (lv9 몬스터 약 100마리)
];

// 캐릭터 레벨 10단계마다 볼 발사 속도 보너스 (+10%씩)
function ballSpeedMult(charLvl) {
  return 1.0 + Math.floor(charLvl / 10) * 0.1; // lv10:1.1x, lv20:1.2x ... lv50:1.5x
}
// 볼 레벨 이펙트 단계마다 발사 속도 +5% (Lv1:1.0x ... Lv8+:1.35x)
function ballLvlSpeedMult(ballLvl) {
  // lv1: 1.0(100%) → lv8: 2.0(200%), 선형 증가
  return 1.0 + (Math.min(ballLvl, 8) - 1) * (1.0 / 7);
}

// 캐릭터 XP → 레벨 변환
function charLvlFromXp(xp) {
  let lvl = 1, remaining = xp;
  for (let i = 0; i < CHAR_XP_REQ.length && lvl < 50; i++) {
    if (remaining < CHAR_XP_REQ[i]) break;
    remaining -= CHAR_XP_REQ[i];
    lvl++;
  }
  return lvl;
}

// Character appearance themes by level tier
function getCharTheme(lvl) {
  if (lvl >= 50) return { body: "#FF8F00", legs: "#E65100", hat: "#BF360C", skin: "#FFE0B2", accent: "#FFD700" };
  if (lvl >= 41) return { body: "#263238", legs: "#1C313A", hat: "#102027", skin: "#FFCC80", accent: "#CE93D8" };
  if (lvl >= 31) return { body: "#F57F17", legs: "#E65100", hat: "#BF360C", skin: "#FFCC80", accent: "#FFCA28" };
  if (lvl >= 21) return { body: "#6A1B9A", legs: "#4A148C", hat: "#38006B", skin: "#FFCC80", accent: "#E040FB" };
  if (lvl >= 11) return { body: "#C62828", legs: "#B71C1C", hat: "#7F0000", skin: "#FFCC80", accent: "#FF5252" };
  return { body: "#3949AB", legs: "#1A237E", hat: "#0D47A1", skin: "#FFCC80", accent: null };
}

function catchRate(ballLvl, monLvl) {
  if (ballLvl >= monLvl + 2) return 0.97;
  if (ballLvl >= monLvl)     return 0.88;
  const gap = monLvl - ballLvl;
  return Math.max(0.06, 0.88 - gap * 0.15);
}

// 캐릭터 레벨별 miss 허용 횟수 (Lv1-9:20, 10-19:18, 20-29:16, 30-39:14, 40-49:12, 50:10)
function missLimit(charLvl) {
  if (charLvl >= 50) return 10;
  if (charLvl >= 40) return 12;
  if (charLvl >= 30) return 14;
  if (charLvl >= 20) return 16;
  if (charLvl >= 10) return 18;
  return 20;
}

// (구 charLevelFromCatches 제거 — CHAR_XP_REQ 기반 charLvlFromXp로 대체)

function spawnMonster(ballLvl, charLvl = 1, special = false, difficulty = "hard") {
  const min = Math.max(1, ballLvl - 1);
  const max = Math.min(10, ballLvl + 2);
  const lvl = special ? 10 : Math.floor(Math.random() * (max - min + 1)) + min;
  const baseSpeed = 0.9 + lvl * 0.22;
  const tier = Math.floor((charLvl - 1) / 5);
  const speedMult = Math.min(2.0, 1.0 + tier * 0.12);
  const easyMult = difficulty === "easy" ? 0.5 : 1.0;
  const speed = baseSpeed * speedMult * (special ? 1.3 : 1) * easyMult;
  const candidates = MONSTERS.filter(m => m.level === lvl);
  const template = candidates[Math.floor(Math.random() * candidates.length)];

  // 행동 패턴 결정 (special/boss는 normal 고정)
  let pattern = "normal";
  if (!special) {
    if (lvl <= 3 && Math.random() < 0.35) pattern = "sleepy";
    else if (lvl >= 3 && lvl <= 6 && Math.random() < 0.40) pattern = "jump";
    else if (lvl >= 7 && Math.random() < 0.40) pattern = "zigzag";
  }

  return {
    ...template,
    special,
    x: 70 + Math.random() * (GW - 140),
    y: 35 + Math.random() * (GROUND_Y * 0.50),
    vx: (Math.random() > 0.5 ? 1 : -1) * speed,
    vy: (Math.random() > 0.5 ? 0.5 : -0.5) * speed * 0.55,
    pattern,        // "normal" | "sleepy" | "jump" | "zigzag"
    sleepTimer: 0,  // sleepy: 누적 프레임
    sleeping: false,
    jumpPhase: 0,   // jump: 프레임 카운터
    zigzagTimer: 0, // zigzag: 방향 전환 카운터
    hp: 1,          // 보스는 나중에 2로 세팅
    boss: false,
  };
}

// ── Main Component ─────────────────────────────────────────
export default function WildCatch() {
  const canvasRef = useRef(null);
  const gs = useRef({
    player: { x: GW / 2 },
    ball:   { x: 0, y: 0, active: false },
    monster: null,
    ballLvl: 1, xp: 0,
    charLvl: 1, charXp: 0, levelUpTimer: 0,
    phase: "playing",   // playing | catching | escaping
    catchTimer: 0,
    keys: new Set(),
    raf: null,
    totalCaught: 0,
    collection: [],
    particles: [],
    shake: 0,
    stars: [],
    escapeAlpha: 1,
    msgTimer: 0,
    msgText: "",
    msgOk: true,
    item: null,   // { type, x, y, vx, vy, timer } — 300 frames ≈ 5s
    effect: null, // { type, timer }
    monTimer: 900, // 15s × 60fps — 몬스터 제한 시간
    combo: 0,
    maxCombo: 0,
    specialCaught: 0,
    specialBanner: 0,
    missStreak: 0,
    gameOver: false,
    goldenBall: false,
    paused: true,   // 난이도 선택 전까지 정지
    difficulty: null,
    dangerTimer: 0, // 시간 초과 탈출 후 10초 게임오버 카운트다운
    shield: false,        // 방패 아이템: 다음 miss 1회 무효
    flashTimer: 0,        // 포획 성공 화면 플래시
    comboPopTimer: 0,     // 콤보 팝업 타이머
    comboPopValue: 0,     // 팝업에 표시할 콤보 값
    goldenTime: false,    // 골든 타임 활성
    goldenTimeTimer: 0,   // 남은 프레임 (1800 = 30초)
    bossCatchBanner: 0,   // 보스 포획 배너 타이머
    totalScore: 0,        // 누적 획득 XP (점수)
    rewind: false,        // 되감기: 다음 miss 1회 볼 되돌림
    sniperTimer: 0,       // 조준경 남은 프레임 (300 = 5s)
    feverTimer: 0,        // 콤보 불꽃 남은 프레임 (600 = 10s)
    freezeTimer: 0,       // 냉동 남은 프레임 (180 = 3s)
    doubleNext: false,    // 더블: 다음 1회 포획 XP/점수 ×3
    playerHp: 5,          // 플레이어 HP (최대 5)
    playerMaxHp: 5,
    playerInvincible: 0,  // 피격 후 무적 프레임 (120 = 2초)
    bossAttackTimer: 0,    // 보스 공격 볼 발사 타이머
    bossPreAttack: null,  // { targetX, timer, impactR } — 발사 전 경고 단계
    bossProjectiles: [],  // [{ x, y, vx, vy, targetX, impactR }]
    bossLastHitX: -999,   // 직전 피격 시 보스 X 위치
    bossInvincible: 0,    // 순간이동 후 무적 프레임 (60 = 1초)
  });

  const [ui, setUi] = useState({
    ballLvl: 1, xp: 0, xpReq: XP_REQ[0],
    totalCaught: 0, message: "", msgOk: true,
    collection: [], ballName: BALL_NAMES[0],
    catchPct: 88, charLvl: 1,
    combo: 0, maxCombo: 0, specialCaught: 0,
    missStreak: 0, goldenBall: false, score: 0, ballSpeed: 100,
  });

  const [gameOver, setGameOver] = useState(false);
  const [quiz, setQuiz] = useState(null); // null | { a, b, op, answer, choices, wrong }
  const [playTime, setPlayTime] = useState(0); // seconds since session start
  const [showResult, setShowResult] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [difficulty, setDifficulty] = useState(null); // null | "easy" | "hard"

  useEffect(() => {
    if (gameOver || showRules || showResult || !difficulty) return;
    const id = setInterval(() => setPlayTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [gameOver, showRules, showResult, difficulty]);

  function syncUi(msg, ok) {
    const s = gs.current;
    const req = XP_REQ[s.ballLvl - 1] === Infinity ? 999 : XP_REQ[s.ballLvl - 1];
    const mon = s.monster;
    const pct = mon ? Math.round(catchRate(s.ballLvl, mon.level) * 100) : 0;
    setUi({
      ballLvl: s.ballLvl, xp: s.xp, xpReq: req,
      totalCaught: s.totalCaught,
      message: msg ?? "", msgOk: ok ?? true,
      collection: [...s.collection.slice(-30)],
      ballName: BALL_NAMES[s.ballLvl - 1],
      combo: s.combo, maxCombo: s.maxCombo, specialCaught: s.specialCaught,
      goldenBall: s.goldenBall, score: s.totalScore,
      ballSpeed: Math.min(200, Math.round(Math.min(2.0, ballSpeedMult(s.charLvl) * ballLvlSpeedMult(s.ballLvl)) * 100)),
      catchPct: pct,
      charLvl: s.charLvl,
    });
  }

  const bossImgs = useRef({});
  useEffect(() => {
    BOSS_MONSTERS.forEach(({ name }) => {
      const img = new window.Image();
      img.src = `/boss/${name}.png`;
      bossImgs.current[name] = img;
    });
  }, []);

  const msgTimeout = useRef(null);
  function showMsg(text, ok) {
    clearTimeout(msgTimeout.current);
    syncUi(text, ok);
    msgTimeout.current = setTimeout(() => {
      const s = gs.current;
      const req = XP_REQ[s.ballLvl - 1] === Infinity ? 999 : XP_REQ[s.ballLvl - 1];
      const mon = s.monster;
      const pct = mon ? Math.round(catchRate(s.ballLvl, mon.level) * 100) : 0;
      setUi(prev => ({ ...prev, message: "", xp: s.xp, xpReq: req, totalCaught: s.totalCaught, catchPct: pct, charLvl: s.charLvl, combo: s.combo, maxCombo: s.maxCombo, specialCaught: s.specialCaught, goldenBall: s.goldenBall, score: s.totalScore, ballSpeed: Math.min(200, Math.round(Math.min(2.0, ballSpeedMult(s.charLvl) * ballLvlSpeedMult(s.ballLvl)) * 100)) }));
    }, 2200);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const s = gs.current;

    s.monster = spawnMonster(1, s.charLvl, false, s.difficulty || "hard");
    s.stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * GW,
      y: Math.random() * GROUND_Y * 0.78,
      r: Math.random() * 1.5 + 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    // ── draw bg (day/night cycle) ──
    function drawBg(t) {
      const cycleDuration = 120000;
      const cyclePos = (t % cycleDuration) / cycleDuration;
      let dayBlend;
      if      (cyclePos < 0.45) dayBlend = 1;
      else if (cyclePos < 0.55) dayBlend = 1 - (cyclePos - 0.45) / 0.10;
      else if (cyclePos < 0.95) dayBlend = 0;
      else                      dayBlend = (cyclePos - 0.95) / 0.05;

      const lerp = (a, b, f) => Math.round(a + (b - a) * f);
      const lerpRGB = (c1, c2, f) =>
        `rgb(${lerp(c1[0],c2[0],f)},${lerp(c1[1],c2[1],f)},${lerp(c1[2],c2[2],f)})`;

      // 캐릭터 레벨 5단계마다 배경 테마 변경 (0~9)
      const tier = Math.min(9, Math.floor(s.charLvl / 5));
      // 우주(7)/심해(8): 항상 밤
      const db = (tier === 7 || tier === 8) ? 0 : dayBlend;

      // ── Sky ──
      const skyPalette = [
        [[4,9,22],[13,30,61],[65,130,195],[155,205,240]],       // 0 초원
        [[5,15,8],[10,28,12],[38,90,50],[90,145,80]],           // 1 숲
        [[60,30,10],[90,50,20],[190,130,60],[220,180,100]],     // 2 사막
        [[20,35,70],[40,60,100],[140,185,230],[200,230,255]],   // 3 설원
        [[10,30,50],[20,60,90],[80,180,220],[130,220,240]],     // 4 해변
        [[40,5,2],[20,2,0],[120,30,10],[80,20,5]],              // 5 화산
        [[15,5,30],[25,8,50],[60,20,100],[100,40,150]],         // 6 마법숲
        [[1,1,8],[2,3,15],[2,3,12],[8,10,25]],                  // 7 우주
        [[5,20,50],[10,40,80],[10,40,80],[20,70,120]],          // 8 심해
        [[200,180,80],[220,200,100],[240,220,150],[255,240,180]], // 9 천상
      ];
      const [tn, bn, td, bd2] = skyPalette[tier];
      const skyTop = lerpRGB(tn, td, db);
      const skyBot = lerpRGB(bn, bd2, db);
      const g = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      g.addColorStop(0, skyTop);
      g.addColorStop(1, skyBot);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, GW, GROUND_Y);

      // ── Stars ──
      const starAlpha = tier === 7 ? 1 : (1 - db);
      if (starAlpha > 0.05) {
        s.stars.forEach(st => {
          const a = starAlpha * (0.35 + 0.6 * Math.sin(t * 0.0015 + st.phase));
          if (tier === 7) {
            // 우주: 컬러풀한 별
            const r2 = Math.floor(180 + st.phase * 75);
            const g2 = Math.floor(160 + st.phase * 60);
            ctx.fillStyle = `rgba(${r2},${g2},255,${a.toFixed(2)})`;
          } else {
            ctx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
          }
          ctx.beginPath();
          ctx.arc(st.x, st.y, tier === 7 ? st.r + 0.5 : st.r, 0, Math.PI * 2);
          ctx.fill();
        });
        // 우주: 성운 글로우
        if (tier === 7) {
          ctx.globalAlpha = 0.06 + 0.04 * Math.sin(t * 0.0005);
          const ng = ctx.createRadialGradient(GW*0.6, GROUND_Y*0.35, 10, GW*0.6, GROUND_Y*0.35, 130);
          ng.addColorStop(0, "rgba(180,80,255,1)");
          ng.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = ng;
          ctx.fillRect(0, 0, GW, GROUND_Y);
          ctx.globalAlpha = 1;
        }
      }

      // ── Moon ──
      if (db < 0.7 && tier !== 5 && tier !== 7 && tier !== 8 && tier !== 9) {
        const moonA = Math.min(1, (1 - db) * 1.5);
        ctx.globalAlpha = moonA;
        ctx.shadowColor = "#FFF9C4"; ctx.shadowBlur = 28;
        ctx.fillStyle = "#FFFFF0";
        ctx.beginPath(); ctx.arc(GW - 58, 42, 24, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = lerpRGB(tn, td, db);
        ctx.beginPath(); ctx.arc(GW - 48, 37, 19, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }

      // ── Sun ──
      if (db > 0.15 && tier !== 5 && tier !== 7 && tier !== 8) {
        const sunA = Math.min(1, (db - 0.15) / 0.35);
        ctx.globalAlpha = sunA;
        const sunCol = tier === 9 ? "#FFD700" : "#FFE566";
        const sunR   = tier === 9 ? 34 : 26;
        ctx.shadowColor = sunCol; ctx.shadowBlur = tier === 9 ? 60 : 40;
        ctx.fillStyle = sunCol;
        ctx.beginPath(); ctx.arc(80, 55, sunR, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = sunCol + "aa"; ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
          const ang = (i * Math.PI) / 4 + t * 0.0003;
          ctx.beginPath();
          ctx.moveTo(80 + Math.cos(ang) * (sunR + 6), 55 + Math.sin(ang) * (sunR + 6));
          ctx.lineTo(80 + Math.cos(ang) * (sunR + 18), 55 + Math.sin(ang) * (sunR + 18));
          ctx.stroke();
        }
        ctx.lineWidth = 1; ctx.globalAlpha = 1;
      }

      // ── 화산 불씨 ──
      if (tier === 5) {
        s.stars.slice(0, 18).forEach(st => {
          const fy = ((GROUND_Y - st.y - (t * 0.025 + st.phase * 80)) % GROUND_Y + GROUND_Y) % GROUND_Y;
          const flicker = 0.4 + 0.6 * Math.sin(t * 0.004 + st.phase);
          ctx.globalAlpha = flicker * 0.55;
          ctx.fillStyle = `rgb(255,${Math.floor(60 + flicker * 100)},0)`;
          ctx.beginPath(); ctx.arc(st.x, fy, 2 + st.r, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
        });
      }

      // ── 심해 버블 ──
      if (tier === 8) {
        s.stars.slice(0, 25).forEach(st => {
          const bY = ((GROUND_Y - (t * 0.018 + st.phase * 180)) % GROUND_Y + GROUND_Y) % GROUND_Y;
          ctx.globalAlpha = 0.18 + 0.25 * Math.sin(t * 0.002 + st.phase);
          ctx.strokeStyle = "rgba(100,220,255,0.7)";
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(st.x, bY, 3 + st.r * 2, 0, Math.PI * 2); ctx.stroke();
          ctx.globalAlpha = 1; ctx.lineWidth = 1;
        });
      }

      // ── 천상 빛기둥 ──
      if (tier === 9) {
        for (let i = 0; i < 6; i++) {
          const bx = (GW / 6) * i + GW / 12;
          const pulse = 0.04 + 0.07 * Math.sin(t * 0.001 + i * 1.1);
          ctx.globalAlpha = pulse;
          const lg = ctx.createLinearGradient(bx, 0, bx, GROUND_Y);
          lg.addColorStop(0, "rgba(255,240,150,0)");
          lg.addColorStop(0.5, "rgba(255,240,150,1)");
          lg.addColorStop(1, "rgba(255,240,150,0)");
          ctx.fillStyle = lg;
          ctx.fillRect(bx - 12, 0, 24, GROUND_Y);
          ctx.globalAlpha = 1;
        }
      }

      // ── Ground ──
      const gPalette = [
        [() => db>0.5?"#1E5C14":"#132A0C", () => db>0.5?"#2E8020":"#1E4A12", () => db>0.5?"#3A9E28":"#295E18"],
        [() => "#0E3A0A", () => "#185210", () => "#1E6A14"],
        [() => "#B89050", () => "#D4A860", () => "#C09858"],
        [() => "#C8DCF0", () => "#DFF0FF", () => "#FFFFFF"],
        [() => "#C8A870", () => "#D8B880", () => "#DCAC68"],
        [() => "#1A0A02", () => "#2D0E04", () => "#FF4400"],
        [() => "#1A0A30", () => "#2D1050", () => "#9B00FF"],
        [() => "#0A0A14", () => "#14141E", () => "#2A2A40"],
        [() => "#083050", () => "#0A4070", () => "#1060A0"],
        [() => "#D4B840", () => "#F0D060", () => "#FFD700"],
      ];
      const [gBaseFn, gTopFn, gDetFn] = gPalette[tier];
      ctx.fillStyle = gBaseFn();
      ctx.fillRect(0, GROUND_Y, GW, GH - GROUND_Y);
      ctx.fillStyle = gTopFn();
      ctx.fillRect(0, GROUND_Y, GW, 10);
      ctx.fillStyle = gDetFn();

      if (tier === 3) {
        // 설원: 눈 덩어리
        for (let i = 3; i < GW; i += 22) {
          ctx.beginPath();
          ctx.arc(i + 5, GROUND_Y + 3, 6 + (i % 5), Math.PI, Math.PI * 2);
          ctx.fill();
        }
      } else if (tier === 5) {
        // 화산: 용암 균열
        for (let i = 4; i < GW; i += 28) ctx.fillRect(i, GROUND_Y - 3, 2 + (i % 5), 8);
        const lv = 0.28 + 0.28 * Math.sin(t * 0.002);
        ctx.globalAlpha = lv;
        ctx.fillStyle = "#FF5500";
        for (let i = 10; i < GW; i += 38) ctx.fillRect(i, GROUND_Y, 4, 5);
        ctx.globalAlpha = 1;
      } else if (tier === 7) {
        // 우주: 암석
        for (let i = 3; i < GW; i += 19) {
          const h = 4 + (i % 9);
          ctx.fillRect(i, GROUND_Y - h + 5, 3, h);
        }
      } else if (tier === 8) {
        // 심해: 물결
        for (let x = 0; x < GW; x += 4) {
          const wy = Math.sin(x * 0.05 + t * 0.002) * 5;
          ctx.fillRect(x, GROUND_Y - 3 + wy, 4, 7);
        }
      } else {
        for (let i = 3; i < GW; i += 19) {
          const h = 4 + (i % 7);
          ctx.fillRect(i, GROUND_Y - h + 5, 2, h);
          ctx.fillRect(i + 7, GROUND_Y - h + 2, 2, h + 2);
          ctx.fillRect(i + 13, GROUND_Y - h + 6, 2, h - 2);
        }
      }

      // ── Horizon decorations ──
      if (tier === 1) {
        // 숲: 나무 실루엣
        const treeCol = db > 0.5 ? "#0A2A06" : "#060E04";
        ctx.fillStyle = treeCol;
        [30,80,140,200,260,320,380,430].forEach(tx => {
          const h = 45 + (tx % 25);
          ctx.beginPath();
          ctx.moveTo(tx, GROUND_Y);
          ctx.lineTo(tx-22, GROUND_Y-h*0.5); ctx.lineTo(tx-14, GROUND_Y-h*0.5);
          ctx.lineTo(tx-18, GROUND_Y-h*0.7); ctx.lineTo(tx-8,  GROUND_Y-h*0.7);
          ctx.lineTo(tx,    GROUND_Y-h);
          ctx.lineTo(tx+8,  GROUND_Y-h*0.7); ctx.lineTo(tx+18, GROUND_Y-h*0.7);
          ctx.lineTo(tx+14, GROUND_Y-h*0.5); ctx.lineTo(tx+22, GROUND_Y-h*0.5);
          ctx.closePath(); ctx.fill();
        });
      }
      if (tier === 2) {
        // 사막: 선인장
        ctx.fillStyle = "#5A8C30";
        [60,160,280,380].forEach(tx => {
          const h = 35 + (tx % 20);
          ctx.fillRect(tx-4, GROUND_Y-h, 8, h);
          ctx.fillRect(tx-16, GROUND_Y-Math.floor(h*0.6), 12, 6);
          ctx.fillRect(tx+4,  GROUND_Y-Math.floor(h*0.7), 12, 6);
          ctx.fillRect(tx-16, GROUND_Y-Math.floor(h*0.6)-12, 6, 12);
          ctx.fillRect(tx+16, GROUND_Y-Math.floor(h*0.7)-12, 6, 12);
        });
      }
      if (tier === 3) {
        // 설원: 눈 내림
        s.stars.slice(0, 35).forEach(st => {
          const sY = ((st.y + t * 0.03 + st.phase * 100) % GROUND_Y + GROUND_Y) % GROUND_Y;
          const sx = (st.x + Math.sin(t * 0.001 + st.phase) * 18 + GW) % GW;
          ctx.globalAlpha = 0.5 + 0.4 * st.r;
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath(); ctx.arc(sx, sY, st.r + 1.5, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
        });
      }
      if (tier === 4) {
        // 해변: 바다 띠
        const wo = Math.sin(t * 0.001) * 5;
        ctx.globalAlpha = 0.5;
        const sg = ctx.createLinearGradient(0, GROUND_Y-30+wo, 0, GROUND_Y+5);
        sg.addColorStop(0, "rgba(0,120,200,0)");
        sg.addColorStop(1, "rgba(0,100,180,0.7)");
        ctx.fillStyle = sg; ctx.fillRect(0, GROUND_Y-30+wo, GW, 35);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "rgba(100,200,255,0.4)"; ctx.lineWidth = 2;
        for (let w = 0; w < 3; w++) {
          ctx.beginPath();
          for (let x = 0; x < GW; x += 4) {
            const y = GROUND_Y - 18 + w*8 + Math.sin(x*0.05 + t*0.002 + w)*4 + wo;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.lineWidth = 1;
      }
      if (tier === 6) {
        // 마법숲: 빛나는 나무
        [[50,0.8],[130,1.2],[210,0.9],[300,1.1],[390,0.7]].forEach(([tx, sp]) => {
          const gw2 = 0.3 + 0.4 * Math.sin(t * 0.002 * sp);
          ctx.shadowColor = "#CC00FF"; ctx.shadowBlur = 20 * gw2;
          ctx.fillStyle = `rgba(100,0,180,${(0.55 + gw2 * 0.35).toFixed(2)})`;
          const h = 50 + (tx % 22);
          ctx.beginPath();
          ctx.moveTo(tx, GROUND_Y-h); ctx.lineTo(tx-20, GROUND_Y); ctx.lineTo(tx+20, GROUND_Y);
          ctx.closePath(); ctx.fill();
          ctx.shadowBlur = 0;
        });
      }
    }

    // ── draw player ──
    function drawPlayer(px, shake) {
      const ox = shake > 0 ? (Math.random() - 0.5) * 5 : 0;
      const x = px + ox;
      const by = GROUND_Y - PLAYER_H;
      const theme = getCharTheme(s.charLvl);
      ctx.save();
      // 피격 후 빨간 깜빡임: 5프레임마다 교대
      if (s.playerInvincible > 0) {
        const blink = Math.floor(s.playerInvincible / 5) % 2 === 0;
        ctx.globalAlpha = blink ? 0.2 : 1;
      }

      // Level-up aura glow
      if (s.levelUpTimer > 0) {
        const auraA = Math.min(1, s.levelUpTimer / 40);
        const aCol = theme.accent || "#FFD700";
        const hex = Math.round(auraA * 200).toString(16).padStart(2, "0");
        ctx.shadowColor = aCol; ctx.shadowBlur = 26;
        ctx.strokeStyle = aCol + hex; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(x, by + PLAYER_H / 2 + 2, 26, PLAYER_H / 2 + 8, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0; ctx.lineWidth = 1;
      }

      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.beginPath(); ctx.ellipse(x, GROUND_Y + 2, 17, 5, 0, 0, Math.PI * 2); ctx.fill();

      // Legs
      ctx.fillStyle = theme.legs;
      ctx.fillRect(x - 12, by + 33, 10, 17);
      ctx.fillRect(x + 2,  by + 33, 10, 17);
      // Shoes
      ctx.fillStyle = "#111";
      ctx.fillRect(x - 14, by + 46, 13, 6);
      ctx.fillRect(x + 1,  by + 46, 13, 6);

      // Body
      ctx.fillStyle = theme.body;
      ctx.fillRect(x - 14, by + 17, 28, 18);
      // Collar
      ctx.fillStyle = theme.legs;
      ctx.fillRect(x - 6, by + 17, 12, 6);

      // ── Left arm (free) ──
      ctx.fillStyle = theme.body;
      ctx.fillRect(x - 22, by + 18, 9, 5);   // upper arm
      ctx.fillRect(x - 25, by + 23, 7, 5);   // forearm
      ctx.fillStyle = theme.skin;
      ctx.fillRect(x - 26, by + 28, 9, 6);   // fist/hand

      // ── Right arm (holding ball) ──
      ctx.fillStyle = theme.body;
      ctx.fillRect(x + 13, by + 18, 9, 5);   // upper arm
      ctx.fillRect(x + 18, by + 23, 7, 5);   // forearm
      ctx.fillStyle = theme.skin;
      ctx.fillRect(x + 17, by + 28, 9, 6);   // fist/hand

      // Head
      ctx.fillStyle = theme.skin;
      ctx.beginPath(); ctx.arc(x, by + 10, 14, 0, Math.PI * 2); ctx.fill();

      // Hat — 10레벨 구간마다 모양 변경
      const hatTier = Math.min(4, Math.floor((s.charLvl - 1) / 10));
      ctx.fillStyle = theme.hat;

      if (hatTier === 0) {
        // Lv 1-10: 기본 캡
        ctx.fillRect(x - 18, by + 2, 36, 8);
        ctx.fillRect(x - 12, by - 11, 24, 14);

      } else if (hatTier === 1) {
        // Lv 11-20: 탐험가 모자 (넓은 챙 + 컬러 밴드)
        ctx.fillRect(x - 22, by + 2, 44, 6);
        ctx.fillRect(x - 12, by - 14, 24, 17);
        ctx.fillStyle = theme.accent || "#FFD700";
        ctx.fillRect(x - 12, by, 24, 4);

      } else if (hatTier === 2) {
        // Lv 21-30: 마법사 고깔모자
        ctx.fillRect(x - 20, by + 2, 40, 6);
        ctx.beginPath();
        ctx.moveTo(x, by - 26);
        ctx.lineTo(x - 13, by + 2);
        ctx.lineTo(x + 13, by + 2);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = theme.accent || "#C084FC";
        ctx.font = "9px serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("✦", x, by - 18);

      } else if (hatTier === 3) {
        // Lv 31-40: 3포인트 왕관
        ctx.fillRect(x - 16, by + 1, 32, 9);
        [[x - 16, x - 11, x - 6], [x - 4, x, x + 4], [x + 6, x + 11, x + 16]].forEach(([l, c, r], i) => {
          const tipY = i === 1 ? by - 20 : by - 15;
          ctx.beginPath(); ctx.moveTo(l, by + 1); ctx.lineTo(c, tipY); ctx.lineTo(r, by + 1); ctx.closePath(); ctx.fill();
        });
        ctx.fillStyle = theme.accent || "#FFCA28";
        [[x - 11, by - 8], [x, by - 10], [x + 11, by - 8]].forEach(([gx, gy]) => {
          ctx.beginPath(); ctx.arc(gx, gy, 2.5, 0, Math.PI * 2); ctx.fill();
        });

      } else {
        // Lv 41-50: 에픽 5포인트 황금 왕관
        ctx.fillRect(x - 18, by + 2, 36, 9);
        [[x - 18, x - 13, x - 8, by - 16],
         [x - 9,  x - 5,  x - 1, by - 12],
         [x - 4,  x,      x + 4, by - 24],
         [x + 1,  x + 5,  x + 9, by - 12],
         [x + 8,  x + 13, x + 18, by - 16]].forEach(([l, c, r, tipY]) => {
          ctx.beginPath(); ctx.moveTo(l, by + 2); ctx.lineTo(c, tipY); ctx.lineTo(r, by + 2); ctx.closePath(); ctx.fill();
        });
        ctx.fillStyle = theme.accent || "#CE93D8";
        [x - 13, x, x + 13].forEach(gx => {
          ctx.beginPath(); ctx.arc(gx, by + 7, 3, 0, Math.PI * 2); ctx.fill();
        });
        if (s.charLvl >= 50) {
          ctx.fillStyle = "#FFD700";
          ctx.font = "9px serif";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText("★", x, by - 22);
        }
      }

      // Eyes
      ctx.fillStyle = "#1A1A2E";
      ctx.beginPath();
      ctx.arc(x - 4, by + 9, 2.5, 0, Math.PI * 2);
      ctx.arc(x + 4, by + 9, 2.5, 0, Math.PI * 2);
      ctx.fill();
      // Eye shine
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(x - 3, by + 8, 1, 0, Math.PI * 2);
      ctx.arc(x + 5, by + 8, 1, 0, Math.PI * 2);
      ctx.fill();

      // Ball in right hand
      const bc = BALL_COLORS[s.ballLvl - 1];
      ctx.fillStyle = bc;
      ctx.beginPath(); ctx.arc(x + 22, by + 30, 9, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 13, by + 30); ctx.lineTo(x + 31, by + 30);
      ctx.stroke(); ctx.lineWidth = 1;
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath(); ctx.arc(x + 19, by + 26, 3.5, 0, Math.PI * 2); ctx.fill();

      // 피격 시 빨간 오버레이 (불투명 프레임에만)
      if (s.playerInvincible > 0 && Math.floor(s.playerInvincible / 5) % 2 !== 0) {
        ctx.globalAlpha = 0.45;
        ctx.fillStyle = "#FF1744";
        ctx.fillRect(x - 28, by - 15, 56, PLAYER_H + 10);
      }
      ctx.restore();
    }

    // ── draw flying ball ──
    function drawBall(bx, by) {
      const isGolden = s.ball.golden;
      const c = isGolden ? "#FFD700" : BALL_COLORS[s.ballLvl - 1];
      const blvl = s.ballLvl;

      // ── 8-tier level effects ──
      if (!isGolden && blvl >= 2 && s.ball.trail && s.ball.trail.length > 0) {
        s.ball.trail.forEach((pt, i) => {
          const ratio = i / s.ball.trail.length;
          if (blvl >= 8) {
            // Tier 8: rainbow trail
            ctx.globalAlpha = ratio * 0.60;
            ctx.fillStyle = `hsl(${(Date.now() * 0.4 + i * 28) % 360},100%,65%)`;
          } else if (blvl === 7) {
            // Tier 7: double-layer trail (outer glow + inner color)
            ctx.globalAlpha = ratio * 0.25;
            ctx.fillStyle = "#fff";
            ctx.beginPath(); ctx.arc(pt.x, pt.y, BALL_R * (0.35 + ratio * 0.65), 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = ratio * 0.50;
            ctx.fillStyle = c;
          } else if (blvl === 6) {
            // Tier 6: pulsing glow trail
            ctx.globalAlpha = ratio * 0.55;
            ctx.fillStyle = c;
            ctx.shadowColor = c; ctx.shadowBlur = 8;
          } else if (blvl === 5) {
            // Tier 5: bright colored trail
            ctx.globalAlpha = ratio * 0.48;
            ctx.fillStyle = c;
          } else if (blvl === 4) {
            // Tier 4: colored trail
            ctx.globalAlpha = ratio * 0.38;
            ctx.fillStyle = c;
          } else if (blvl === 3) {
            // Tier 3: fade trail (slightly colored)
            ctx.globalAlpha = ratio * 0.28;
            ctx.fillStyle = c;
          } else {
            // Tier 2 (Lv2): subtle white fade
            ctx.globalAlpha = ratio * 0.18;
            ctx.fillStyle = "#fff";
          }
          const r = BALL_R * (0.22 + ratio * 0.55);
          ctx.beginPath(); ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
        });
        ctx.globalAlpha = 1;
      }

      // sparkle particles: Tier 5(Lv5)=3개, Tier 6(Lv6)=4개, Tier 7(Lv7)=5개, Tier 8(Lv8+)=6개+shadow
      if (!isGolden && blvl >= 5) {
        const sparkCount = blvl >= 8 ? 6 : blvl >= 7 ? 5 : blvl >= 6 ? 4 : 3;
        ctx.shadowColor = c; ctx.shadowBlur = blvl >= 8 ? 22 : blvl >= 7 ? 14 : 8;
        for (let i = 0; i < sparkCount; i++) {
          const a = Date.now() * 0.007 + (i / sparkCount) * Math.PI * 2;
          const sr = BALL_R + 5 + Math.sin(Date.now() * 0.012 + i) * 2;
          ctx.fillStyle = blvl >= 8 ? `hsl(${(Date.now()*0.3+i*60)%360},100%,70%)` : `rgba(255,255,255,${0.75 - i * 0.08})`;
          ctx.beginPath(); ctx.arc(bx + Math.cos(a) * sr * 0.45, by + Math.sin(a) * sr * 0.45, 2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      // Lv2: soft glow only (no sparkle)
      if (!isGolden && blvl === 2) {
        ctx.shadowColor = c; ctx.shadowBlur = 6;
      }

      // golden outer sparkle + rainbow trail
      if (isGolden) {
        // 무지개 궤적
        if (s.ball.rainbowTrail && s.ball.rainbowTrail.length > 0) {
          s.ball.rainbowTrail.forEach((pt, i) => {
            const alpha = (i / s.ball.rainbowTrail.length) * 0.55;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = `hsl(${(Date.now() * 0.3 + i * 30) % 360}, 100%, 65%)`;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, BALL_R * (0.3 + i / s.ball.rainbowTrail.length * 0.5), 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.globalAlpha = 1;
        }
        ctx.shadowColor = "#FFD700"; ctx.shadowBlur = 24;
        for (let i = 0; i < 6; i++) {
          const a = Date.now() * 0.006 + (i / 6) * Math.PI * 2;
          const r = BALL_R + 8 + Math.sin(Date.now() * 0.01 + i) * 3;
          ctx.fillStyle = `rgba(255,215,0,${0.6 - i * 0.08})`;
          ctx.beginPath(); ctx.arc(bx + Math.cos(a) * r * 0.4, by + Math.sin(a) * r * 0.4, 2.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      for (let i = 1; i <= 5; i++) {
        ctx.globalAlpha = (0.15 * i) / 5;
        ctx.fillStyle = c;
        ctx.beginPath(); ctx.arc(bx, by + i * 5, BALL_R * (0.4 + i * 0.1), 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      const grd = ctx.createRadialGradient(bx - 2, by - 3, 1, bx, by, BALL_R);
      grd.addColorStop(0, "#fff");
      grd.addColorStop(0.35, c);
      grd.addColorStop(1, c + "77");
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(bx, by, BALL_R, 0, Math.PI * 2); ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.65)"; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx - BALL_R, by); ctx.lineTo(bx + BALL_R, by);
      ctx.stroke(); ctx.lineWidth = 1;

      const gl = ctx.createRadialGradient(bx, by, 0, bx, by, BALL_R * 2.8);
      gl.addColorStop(0, c + "55"); gl.addColorStop(1, "transparent");
      ctx.fillStyle = gl;
      ctx.beginPath(); ctx.arc(bx, by, BALL_R * 2.8, 0, Math.PI * 2); ctx.fill();
    }

    // ── draw item ──
    function drawItem(item) {
      const { x, y, type, timer } = item;
      const ratio = timer / 300;
      const ITEM_CFG = {
        speed:     { icon: "⚡", label: "빠르게!", color: "#FFD700", bg: "rgba(255,215,0,0.22)" },
        slow:      { icon: "🐌", label: "느리게!", color: "#00BCD4", bg: "rgba(0,188,212,0.22)" },
        magnet:    { icon: "🧲", label: "자석!",   color: "#FF4081", bg: "rgba(255,64,129,0.22)" },
        shield:    { icon: "🛡️", label: "방패!",   color: "#69F0AE", bg: "rgba(105,240,174,0.22)" },
        timeplus:  { icon: "⏰", label: "시간+10!", color: "#FF9800", bg: "rgba(255,152,0,0.22)" },
        autoCatch: { icon: "🎫", label: "뽑기권!", color: "#E040FB", bg: "rgba(224,64,251,0.22)" },
        rewind:    { icon: "⏪", label: "되감기!", color: "#7C4DFF", bg: "rgba(124,77,255,0.22)" },
        sniper:    { icon: "🎯", label: "조준경!", color: "#00E676", bg: "rgba(0,230,118,0.22)" },
        fever:     { icon: "🔥", label: "콤보불꽃!", color: "#FF6D00", bg: "rgba(255,109,0,0.22)" },
        freeze:    { icon: "🧊", label: "냉동!", color: "#00B0FF", bg: "rgba(0,176,255,0.22)" },
        double:    { icon: "💫", label: "더블!", color: "#F50057", bg: "rgba(245,0,87,0.22)" },
      };
      const cfg = ITEM_CFG[type] || ITEM_CFG.speed;

      // 외부 pulse ring
      const pulseR = 32 + 4 * Math.sin(Date.now() * 0.008);
      ctx.shadowColor = cfg.color; ctx.shadowBlur = 28;
      ctx.strokeStyle = cfg.color + "BB"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(x, y, pulseR, 0, Math.PI * 2); ctx.stroke();
      ctx.shadowBlur = 0; ctx.lineWidth = 1;

      // countdown arc
      ctx.strokeStyle = cfg.color; ctx.lineWidth = 4;
      ctx.shadowColor = cfg.color; ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(x, y, pulseR, -Math.PI / 2, -Math.PI / 2 + ratio * Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0; ctx.lineWidth = 1;

      // background circle
      ctx.fillStyle = cfg.bg;
      ctx.beginPath(); ctx.arc(x, y, 26, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = cfg.color + "CC"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(x, y, 26, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 1;

      // icon (크게)
      ctx.font = "22px serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(cfg.icon, x, y);

      // label
      ctx.fillStyle = cfg.color;
      ctx.font = "bold 9px 'Noto Sans KR', monospace";
      ctx.textBaseline = "top";
      ctx.shadowColor = cfg.color; ctx.shadowBlur = 8;
      ctx.fillText(cfg.label, x, y + 32);
      ctx.shadowBlur = 0;

      // 초 카운트
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "bold 9px monospace";
      ctx.textBaseline = "bottom";
      ctx.fillText(Math.ceil(timer / 60) + "s", x, y - 34);
    }

    // ── draw active effect HUD ──
    function drawEffectHud() {
      const EFFECT_MAP = {
        speed:  { color: "#FFD700", icon: "⚡", label: "빠르게", timerKey: "effect" },
        slow:   { color: "#00BCD4", icon: "🐌", label: "느리게", timerKey: "effect" },
        magnet: { color: "#FF4081", icon: "🧲", label: "자석",   timerKey: "effect" },
      };
      const slots = [];
      if (s.effect && EFFECT_MAP[s.effect.type]) {
        const m = EFFECT_MAP[s.effect.type];
        slots.push({ color: m.color, icon: m.icon, label: m.label, secs: Math.ceil(s.effect.timer / 60) });
      }
      if (s.sniperTimer > 0)
        slots.push({ color: "#00E676", icon: "🎯", label: "조준경", secs: Math.ceil(s.sniperTimer / 60) });
      if (s.feverTimer > 0)
        slots.push({ color: "#FF6D00", icon: "🔥", label: "콤보불꽃", secs: Math.ceil(s.feverTimer / 60) });
      if (s.freezeTimer > 0)
        slots.push({ color: "#00B0FF", icon: "🧊", label: "냉동", secs: Math.ceil(s.freezeTimer / 60) });
      if (s.shield)
        slots.push({ color: "#69F0AE", icon: "🛡️", label: "방패대기", secs: null });
      if (s.rewind)
        slots.push({ color: "#7C4DFF", icon: "⏪", label: "되감기", secs: null });
      if (s.doubleNext)
        slots.push({ color: "#F50057", icon: "💫", label: "더블대기", secs: null });

      slots.forEach((m, i) => {
        const y0 = 6 + i * 26;
        ctx.fillStyle = m.color + "26";
        ctx.strokeStyle = m.color + "99";
        ctx.lineWidth = 1.5;
        roundRect(ctx, GW - 84, y0, 76, 22, 6);
        ctx.fill(); ctx.stroke(); ctx.lineWidth = 1;
        ctx.font = "10px serif";
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(m.icon, GW - 78, y0 + 11);
        ctx.fillStyle = m.color;
        ctx.font = "bold 8px monospace";
        ctx.fillText(m.secs != null ? `${m.label} ${m.secs}s` : m.label, GW - 65, y0 + 11);
      });
    }

    // ── draw shield HUD (legacy, now handled in drawEffectHud) ──
    function drawShieldHud() {}

    // ── draw player HP (hearts, top-left) ──
    function drawPlayerHp() {
      const hp = s.playerHp, maxHp = s.playerMaxHp;
      // 피격 무적 중 깜박임
      if (s.playerInvincible > 0 && Math.floor(s.playerInvincible / 6) % 2 === 0) return;
      ctx.font = "15px serif";
      ctx.textBaseline = "top";
      ctx.textAlign = "left";
      for (let i = 0; i < maxHp; i++) {
        ctx.globalAlpha = i < hp ? 1 : 0.2;
        ctx.fillText("❤️", 8 + i * 19, 8);
      }
      ctx.globalAlpha = 1;
    }

    function roundRect(c, x, y, w, h, r) {
      c.beginPath();
      c.moveTo(x + r, y);
      c.lineTo(x + w - r, y); c.arcTo(x + w, y, x + w, y + r, r);
      c.lineTo(x + w, y + h - r); c.arcTo(x + w, y + h, x + w - r, y + h, r);
      c.lineTo(x + r, y + h); c.arcTo(x, y + h, x, y + h - r, r);
      c.lineTo(x, y + r); c.arcTo(x, y, x + r, y, r);
      c.closePath();
    }

    // ── boss projectiles & pre-attack warning ──
    function drawBossProjectiles() {
      // 발사 전 경고: 바닥에 깜박이는 빨간 타원 (targets 배열 순회)
      if (s.bossPreAttack) {
        const { targets, impactR } = s.bossPreAttack;
        const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.04);
        targets.forEach(targetX => {
          ctx.globalAlpha = 0.35 + 0.45 * pulse;
          ctx.fillStyle = "#FF1744";
          ctx.shadowColor = "#FF1744"; ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.ellipse(targetX, GROUND_Y - 4, impactR, impactR * 0.28, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; ctx.globalAlpha = 1;
          // 테두리 링
          ctx.strokeStyle = `rgba(255,80,80,${0.7 + 0.3 * pulse})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(targetX, GROUND_Y - 4, impactR, impactR * 0.28, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.lineWidth = 1;
        });
      }
      // 날아오는 투사체
      s.bossProjectiles.forEach(p => {
        // 바닥 경고 그림자 (투사체 비행 중에도 유지)
        const progress = Math.max(0, (p.y - (s.monster?.y ?? 0)) / (GROUND_Y - (s.monster?.y ?? 0)));
        ctx.globalAlpha = 0.2 + 0.4 * progress;
        ctx.fillStyle = "#FF1744";
        ctx.beginPath();
        ctx.ellipse(p.targetX, GROUND_Y - 4, p.impactR, p.impactR * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        // 투사체 볼
        ctx.fillStyle = "#FF3D00";
        ctx.shadowColor = "#FF6D00"; ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, Math.PI * 2); ctx.fill();
        // 꼬리 흔적
        ctx.strokeStyle = "rgba(255,120,50,0.55)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(p.x - p.vx * 4, p.y - p.vy * 4);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.shadowBlur = 0; ctx.lineWidth = 1;
      });
    }

    // ── special banner ──
    function drawSpecialBanner() {
      if (s.specialBanner <= 0) return;
      const alpha = Math.min(1, s.specialBanner / 30) * Math.min(1, s.specialBanner / 160);
      const scale = 1 + 0.08 * Math.sin(Date.now() * 0.008);
      ctx.save();
      ctx.globalAlpha = alpha;
      // dark overlay
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, GH / 2 - 55, GW, 110);
      // glow bg
      const grd = ctx.createRadialGradient(GW/2, GH/2, 10, GW/2, GH/2, 200);
      grd.addColorStop(0, "rgba(255,215,0,0.35)");
      grd.addColorStop(1, "rgba(255,215,0,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, GH/2 - 55, GW, 110);
      // text
      ctx.translate(GW/2, GH/2);
      ctx.scale(scale, scale);
      ctx.shadowColor = "#FFD700"; ctx.shadowBlur = 30;
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 26px 'Noto Sans KR', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("✨ 특별 몬스터 포획! ✨", 0, -12);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "13px 'Noto Sans KR', monospace";
      ctx.fillText("대단해! 정말 대단해!", 0, 16);
      ctx.restore();
      s.specialBanner--;
    }

    // ── boss catch banner ──
    function drawBossCatchBanner() {
      if (s.bossCatchBanner <= 0) return;
      const alpha = Math.min(1, s.bossCatchBanner / 30) * Math.min(1, s.bossCatchBanner / 200);
      const scale = 1.0 + 0.12 * Math.sin(Date.now() * 0.01);
      ctx.save();
      ctx.globalAlpha = alpha;
      // dark overlay
      ctx.fillStyle = "rgba(0,0,50,0.6)";
      ctx.fillRect(0, GH / 2 - 70, GW, 140);
      // rainbow glow
      const gr = ctx.createRadialGradient(GW/2, GH/2, 5, GW/2, GH/2, 220);
      gr.addColorStop(0, `hsla(${Date.now() * 0.3 % 360},100%,65%,0.4)`);
      gr.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gr;
      ctx.fillRect(0, GH/2 - 70, GW, 140);
      ctx.translate(GW/2, GH/2);
      ctx.scale(scale, scale);
      // main text
      ctx.shadowColor = "#FFD700"; ctx.shadowBlur = 40;
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 32px 'Noto Sans KR', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("👑 보스 포켓몬 캐치! 👑", 0, -14);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#FFF";
      ctx.font = "bold 15px 'Noto Sans KR', monospace";
      ctx.fillText("최고야! 정말 대단해! 🎉", 0, 18);
      ctx.restore();
      s.bossCatchBanner--;
    }

    // ── draw monster ──
    function drawMonster(mon, t, catching) {
      const bob = catching ? 0 : Math.sin(t * 0.0023 + mon.x * 0.02) * 5;
      const mx = mon.x, my = mon.y + bob;
      const rc = RARITY_COLOR[mon.rarity];

      // special monster: rainbow spinning ring
      if (mon.special && !catching) {
        const rings = 3;
        for (let i = 0; i < rings; i++) {
          const angle = t * 0.003 + (i / rings) * Math.PI * 2;
          ctx.strokeStyle = `hsl(${(t * 0.5 + i * 120) % 360}, 100%, 65%)`;
          ctx.lineWidth = 3;
          ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(mx, my, MON_R + 10 + i * 6, angle, angle + Math.PI * 1.2);
          ctx.stroke();
        }
        ctx.shadowBlur = 0; ctx.lineWidth = 1;
      }

      if (catching) {
        const pulse = 0.25 + 0.2 * Math.sin(t * 0.009);
        ctx.fillStyle = `rgba(255,220,50,${pulse})`;
        ctx.beginPath(); ctx.arc(mx, my, MON_R + 14, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.shadowColor = mon.special ? "#FFD700" : rc;
        ctx.shadowBlur = mon.special ? 20 : 8 + mon.level;
      }

      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.beginPath(); ctx.ellipse(mx, my + MON_R + 4, MON_R * 0.8, MON_R * 0.2, 0, 0, Math.PI * 2); ctx.fill();

      ctx.shadowBlur = 0;
      if (mon.boss) {
        // 순간이동 후 무적 반짝임
        if (s.bossInvincible > 0) {
          const blink = Math.floor(s.bossInvincible / 5) % 2 === 0;
          ctx.globalAlpha = blink ? 0.3 : 1;
        }
        drawBossSprite(mon, mx, my, t);
        ctx.globalAlpha = 1;
        // boss HP display
        ctx.fillStyle = s.bossInvincible > 0 ? "#90CAF9" : "#FF5252";
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10;
        ctx.fillText(s.bossInvincible > 0 ? `🛡️ ${"❤️".repeat(mon.hp)}` : `HP ${"❤️".repeat(mon.hp)}`, mx, my - 82);
        ctx.shadowBlur = 0;
      } else {
        ctx.font = "42px serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(mon.emoji, mx, my);
      }

      // 졸음형: 잠든 상태 Zzz 표시
      if (mon.pattern === "sleepy" && mon.sleeping) {
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = "#B0BEC5";
        ctx.font = "12px serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("Zzz", mx + MON_R + 6, my - MON_R - 6);
        ctx.globalAlpha = 1;
      }

      // Level badge
      const badgeX = mx + MON_R - 1, badgeY = my - MON_R + 1;
      ctx.fillStyle = rc;
      ctx.beginPath(); ctx.arc(badgeX, badgeY, 13, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1.5;
      ctx.stroke(); ctx.lineWidth = 1;
      ctx.fillStyle = "white";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(mon.level, badgeX, badgeY);

      // Name tag (Korean, larger font)
      ctx.font = "bold 13px 'Noto Sans KR', sans-serif";
      const nw = ctx.measureText(mon.name).width + 14;
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.fillRect(mx - nw / 2, my + MON_R + 5, nw, 22);
      ctx.fillStyle = "#E8F5E9";
      ctx.textBaseline = "top";
      ctx.fillText(mon.name, mx, my + MON_R + 7);
    }

    // ── catch orbit animation ──
    function drawOrbit(mon, t) {
      const blvl = s.ballLvl;
      const orbitCount = blvl >= 7 ? 5 : blvl >= 4 ? 4 : 3;
      const orbitR = 34 + blvl * 2;
      const ballR = 5 + Math.floor(blvl / 3);
      const speed = 0.06 + blvl * 0.005;

      for (let i = 0; i < orbitCount; i++) {
        const a = t * speed + (i * Math.PI * 2) / orbitCount;
        const bx = mon.x + Math.cos(a) * orbitR;
        const by2 = mon.y + Math.sin(a) * (orbitR * 0.38);

        // color varies by level
        let col;
        if (blvl >= 9) {
          col = `hsl(${(Date.now() * 0.5 + i * 72) % 360},100%,65%)`;
        } else if (blvl >= 6) {
          col = `hsl(${(i * 360 / orbitCount + t) % 360},90%,65%)`;
        } else {
          col = BALL_COLORS[blvl - 1];
        }

        ctx.globalAlpha = 0.55 + 0.4 * Math.sin(a + t * 0.04);
        if (blvl >= 5) {
          ctx.shadowColor = col; ctx.shadowBlur = 10;
        }
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(bx, by2, ballR, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;

        // stripe line on ball
        ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bx - ballR, by2); ctx.lineTo(bx + ballR, by2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    // ── boss pixel art sprite (GBA 스타일 도트 디자인, 20종) ──
    function drawBossSprite(mon, mx, my, t) {
      const pulse = 1 + 0.04 * Math.sin(t * 0.04);
      ctx.save();
      ctx.translate(mx, my);
      ctx.scale(pulse, pulse);

      const img = bossImgs.current[mon.name];
      if (img && img.complete && img.naturalWidth > 0) {
        const size = 108;
        ctx.drawImage(img, -size / 2, -size / 2, size, size);

      // ── crown emoji ──
      ctx.font = 'bold 26px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 14;
      ctx.fillText('👑', 0, -size / 2 + 4);
      ctx.shadowBlur = 0;
      ctx.restore();
      return;
      }

      // ── fallback: 이미지 미로드시 빈 원 표시 ──
      ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.fill();
      ctx.restore();
    }


    // ── particles ──
    function spawnParticles(x, y, ok) {
      const cols = ok
        ? ["#FFD700","#69F0AE","#FFFF8D","#B9F6CA","#FFF176"]
        : ["#FF5252","#FF8A80","#FF6E40","#FFAB40","#FF4081"];
      for (let i = 0; i < 22; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 1.2 + Math.random() * 4.5;
        s.particles.push({
          x, y,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.5,
          r: 2 + Math.random() * 4,
          color: cols[Math.floor(Math.random() * cols.length)],
          life: 35 + Math.random() * 20, maxLife: 55,
        });
      }
    }

    function triggerQuiz() {
      // 홀수번째 퀴즈: +, 짝수번째: -
      const op = (s.totalCaught / 5) % 2 === 1 ? "+" : "-";
      let a = Math.floor(Math.random() * 9) + 1;
      let b = Math.floor(Math.random() * 9) + 1;
      if (op === "-" && a < b) { const tmp = a; a = b; b = tmp; }
      const answer = op === "+" ? a + b : a - b;
      const maxVal = op === "+" ? 18 : 8;
      const choiceSet = new Set([answer]);
      while (choiceSet.size < 4) {
        const offset = Math.floor(Math.random() * 4) + 1;
        const c = answer + (Math.random() > 0.5 ? offset : -offset);
        if (c !== answer && c >= 0 && c <= maxVal) choiceSet.add(c);
      }
      const choices = [...choiceSet].sort(() => Math.random() - 0.5);
      s.phase = "quiz";
      setQuiz({ a, b, op, answer, choices, wrong: false });
    }

    function spawnLevelUpEffect(x, y) {
      const cols = ["#FFD700","#FF80AB","#80D8FF","#CCFF90","#FFD740","#FFFFFF","#FF6E40"];
      for (let i = 0; i < 50; i++) {
        const a = (i / 50) * Math.PI * 2;
        const sp = 2.5 + Math.random() * 6;
        s.particles.push({
          x, y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 2.5,
          r: 3 + Math.random() * 5,
          color: cols[Math.floor(Math.random() * cols.length)],
          life: 55 + Math.random() * 35, maxLife: 90,
        });
      }
      s.levelUpTimer = 180; // ~3 seconds of aura
    }

    // 몬스터별 전용 파티클
    function spawnMonsterParticles(mon) {
      const emojiParts = {
        "🐯": ["🐾","🐾","💥"], "🦁": ["⭐","💛","🦁"],
        "🦋": ["🌸","🌺","🌸"], "🐉": ["🔥","🔥","💥"],
        "🌟": ["✨","⭐","💫"], "🦄": ["🌈","💜","⭐"],
        "🐊": ["💧","🌿","💚"], "⚡": ["💛","⚡","✨"],
        "🔥": ["🔥","💥","❤️"], "🌊": ["💧","🔵","💙"],
      };
      const emojiList = emojiParts[mon.emoji];
      const fallbackCols = ["#FFD700","#69F0AE","#FF80AB","#FFFF8D"];
      for (let i = 0; i < 18; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 1.5 + Math.random() * 4;
        s.particles.push({
          x: mon.x, y: mon.y,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.2,
          r: emojiList ? 12 : 3 + Math.random() * 4,
          color: emojiList ? null : fallbackCols[Math.floor(Math.random() * fallbackCols.length)],
          emoji: emojiList ? emojiList[Math.floor(Math.random() * emojiList.length)] : null,
          life: 40 + Math.random() * 20, maxLife: 60,
        });
      }
    }

    function drawParticles() {
      s.particles = s.particles.filter(p => p.life > 0);
      s.particles.forEach(p => {
        ctx.globalAlpha = p.life / p.maxLife;
        if (p.emoji) {
          ctx.font = `${Math.max(6, p.r)}px serif`;
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(p.emoji, p.x, p.y);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        }
        p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.r *= 0.97; p.life--;
      });
      ctx.globalAlpha = 1;
    }

    // ── combo popup draw ──
    function drawComboPopup() {
      if (s.comboPopTimer <= 0) return;
      const progress = s.comboPopTimer / 90;
      const scale = progress > 0.8 ? 1 + (1 - progress) * 1.5 : 1;
      const alpha = progress < 0.25 ? progress * 4 : 1;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(GW / 2, GH / 2 - 40);
      ctx.scale(scale, scale);
      ctx.shadowColor = "#FFD700"; ctx.shadowBlur = 30;
      ctx.fillStyle = "#FFD700";
      ctx.font = `bold ${s.comboPopValue >= 10 ? 36 : 42}px 'Noto Sans KR', monospace`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(`${s.comboPopValue}콤보!🔥`, 0, 0);
      ctx.shadowBlur = 0;
      ctx.restore();
      s.comboPopTimer--;
    }

    // ── main loop ──
    function loop(t) {
      ctx.clearRect(0, 0, GW, GH);
      drawBg(t);

      // 포획 성공 화면 플래시
      if (s.flashTimer > 0) {
        ctx.fillStyle = `rgba(255,255,255,${(s.flashTimer / 8) * 0.4})`;
        ctx.fillRect(0, 0, GW, GH);
        s.flashTimer--;
      }

      // 골든 타임 오버레이
      if (s.goldenTime) {
        const pulse = 0.04 + 0.03 * Math.sin(Date.now() * 0.006);
        ctx.fillStyle = `rgba(255,215,0,${pulse})`;
        ctx.fillRect(0, 0, GW, GH);
        const gtSecs = Math.ceil(s.goldenTimeTimer / 60);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, GW, 22);
        ctx.fillStyle = "#FFD700";
        ctx.font = "bold 10px 'Noto Sans KR', monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.shadowColor = "#FFD700"; ctx.shadowBlur = 14;
        ctx.fillText(`🌈 골든 타임 XP×2  ${gtSecs}s`, GW / 2, 11);
        ctx.shadowBlur = 0;
      }

      if (s.levelUpTimer > 0) s.levelUpTimer--;

      // 규칙 화면 — 게임 정지 (draw only)
      if (s.paused) {
        if (s.monster) drawMonster(s.monster, t, false);
        drawParticles();
        drawPlayer(s.player.x, 0);
        // dim overlay
        ctx.fillStyle = "rgba(4,9,22,0.55)";
        ctx.fillRect(0, 0, GW, GH);
        ctx.fillStyle = "#FFD700";
        ctx.font = "bold 14px 'Noto Sans KR', monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("⏸ 일시정지", GW / 2, GH / 2);
        s.raf = requestAnimationFrame(loop); return;
      }

      if (s.gameOver) {
        if (s.monster) drawMonster(s.monster, t, false);
        drawParticles();
        drawPlayer(s.player.x, 0);
        s.raf = requestAnimationFrame(loop); return;
      }

      if (s.phase === "quiz") {
        // Game frozen during quiz — draw static scene only
        if (s.monster) drawMonster(s.monster, t, false);
        drawParticles();
        drawPlayer(s.player.x, 0);
        s.raf = requestAnimationFrame(loop); return;
      }

      if (s.phase === "catching") {
        s.catchTimer += 16;
        drawMonster(s.monster, t, true);
        drawOrbit(s.monster, t);
        drawParticles();
        drawPlayer(s.player.x, 0);

        if (s.catchTimer >= 1500) {
          const sleepBonus = (s.monster.pattern === "sleepy" && s.monster.sleeping) ? 2.0 : 1.0;
          const rate = s.monster.special ? 0.30 : Math.min(0.98, catchRate(s.ballLvl, s.monster.level) * sleepBonus);
          const ok = s.ball.golden || Math.random() < rate;
          s.ball.active = false;

          // 보스 타격 처리 (HP n→n-1)
          if (ok && s.monster.boss && s.monster.hp > 1 && s.bossInvincible <= 0) {
            s.monster.hp--;
            s.monTimer = Math.min(s.monTimer + 300, 1500);
            s.phase = "playing";
            spawnParticles(s.monster.x, s.monster.y, true);

            // 직전 피격 위치와 80px 이내 → "같은 자리 연속" 판정 → 순간이동
            const sameSpot = Math.abs(s.monster.x - s.bossLastHitX) < 80;
            s.bossLastHitX = s.monster.x;

            if (sameSpot) {
              // 화면 반대쪽 랜덤 위치로 순간이동 + 1초 무적
              const half = GW / 2;
              const newX = s.monster.x < half
                ? half + 40 + Math.random() * (half - 80)
                : 40 + Math.random() * (half - 80);
              const newY = 40 + Math.random() * (GROUND_Y * 0.45);
              s.monster.x = newX;
              s.monster.y = newY;
              s.bossInvincible = 60; // 1초 무적
              s.monster.stunTimer = 20;
              showMsg(`💥 보스 HP: ${"❤️".repeat(s.monster.hp)} — 순간이동!`, true);
            } else {
              // 일반 피격: 랜덤 방향으로 이동
              s.monster.stunTimer = 30;
              const spd = 1.8 + Math.random() * 1.8;
              const ang = Math.random() * Math.PI * 2;
              s.monster.vx = Math.cos(ang) * spd;
              s.monster.vy = Math.sin(ang) * spd * 0.5;
              showMsg(`💥 보스 HP: ${"❤️".repeat(s.monster.hp)} 남았다!`, true);
            }
            s.raf = requestAnimationFrame(loop); return;
          }
          // 무적 중 피격 시도 → 튕김 처리
          if (ok && s.monster.boss && s.monster.hp > 1 && s.bossInvincible > 0) {
            s.ball.active = false;
            s.phase = "playing";
            showMsg("🛡️ 보스 이동 중 — 무적!", false);
            s.raf = requestAnimationFrame(loop); return;
          }

          // 파워 포켓몬 최종 타격 — 30~50% 포획 확률
          if (ok && s.monster.boss && s.monster.power) {
            const catchChance = 0.30 + Math.random() * 0.20;
            if (Math.random() >= catchChance) {
              s.ball.active = false;
              s.monster.stunTimer = 30;
              s.phase = "playing";
              spawnParticles(s.monster.x, s.monster.y, false);
              showMsg(`💨 포획 실패! 파워 포켓몬이 버텼다! ❤️ HP 1 남음`, false);
              s.raf = requestAnimationFrame(loop); return;
            }
          }

          if (ok) {
            spawnParticles(s.monster.x, s.monster.y, true);
            spawnMonsterParticles(s.monster);
            s.flashTimer = 8;
            const wasBoss = s.monster.boss;
            const wasPower = s.monster.power;
            if (wasBoss) {
              s.bossCatchBanner = 240; // 4초 배너
              spawnLevelUpEffect(s.monster.x, s.monster.y);
              spawnLevelUpEffect(s.monster.x, s.monster.y);
            }
            const wasSpecial = s.monster.special;
            s.collection.push({ ...s.monster });
            s.totalCaught++;
            // 10마리마다 HP 1 회복 (최대 5)
            if (s.totalCaught % 10 === 0 && s.playerHp < s.playerMaxHp) {
              s.playerHp = Math.min(s.playerMaxHp, s.playerHp + 1);
              showMsg("💖 HP 회복!", true);
            }
            s.xp += wasPower ? 100 * (s.goldenTime ? 2 : 1) : wasBoss ? 50 * (s.goldenTime ? 2 : 1) : s.monster.level * (s.goldenTime ? 2 : 1);

            // combo & miss reset
            s.combo += s.feverTimer > 0 ? 2 : 1; // 콤보 불꽃: 2콤보씩 적립
            s.missStreak = 0;
            s.dangerTimer = 0; // 위기 해제
            if (s.combo > s.maxCombo) s.maxCombo = s.combo;
            if (s.combo >= 3) {
              s.comboPopTimer = 90;
              s.comboPopValue = s.combo;
            }
            if (s.combo % 5 === 0) {
              s.goldenBall = true;
              showMsg(`🏆 ${s.combo}콤보! 황금볼 획득!`, true);
            }

            const scoreMult = (s.difficulty === "easy" ? 1.5 : 1) * (s.doubleNext ? 3 : 1);
            if (s.doubleNext) { s.doubleNext = false; showMsg("💫 더블! ×3!", true); }

            if (wasBoss) {
              // 보스 포획: lv10 몬스터 3배 = 30 XP (일반 +level 10은 아래서 추가)
              s.charXp += 20; // 총 30XP (10은 아래 s.monster.level에서)
              s.totalScore += 20 * scoreMult;
            } else if (wasSpecial) {
              s.specialCaught++;
              s.specialBanner = 200;
              spawnLevelUpEffect(s.monster.x, s.monster.y);
              // 특별 몬스터 포획: XP 대량 보너스 (5레벨치)
              const specialBonus = CHAR_XP_REQ[Math.min(s.charLvl - 1, CHAR_XP_REQ.length - 1)] * 5;
              s.charXp += specialBonus;
              s.totalScore += specialBonus * scoreMult;
              s.charLvl = Math.min(50, charLvlFromXp(s.charXp));
              spawnLevelUpEffect(s.player.x, GROUND_Y - PLAYER_H);
            }

            // Character XP & level up
            s.charXp += s.monster.level;
            s.totalScore += s.monster.level * scoreMult;
            const newCharLvl = charLvlFromXp(s.charXp);
            if (newCharLvl > s.charLvl) {
              s.charLvl = newCharLvl;
              spawnLevelUpEffect(s.player.x, GROUND_Y - PLAYER_H);
              const req = XP_REQ[s.ballLvl - 1];
              if (s.ballLvl < 10 && req !== Infinity && s.xp >= req) {
                s.xp -= req;
                s.ballLvl = Math.min(10, s.ballLvl + 1);
              }
              if (!wasSpecial) showMsg(`🎊 캐릭터 Lv.${s.charLvl} 달성!`, true);
            } else if (!wasSpecial) {
              const req = XP_REQ[s.ballLvl - 1];
              if (s.ballLvl < 10 && req !== Infinity && s.xp >= req) {
                s.xp -= req;
                s.ballLvl = Math.min(10, s.ballLvl + 1);
                showMsg(`✨ 볼 Lv.${s.ballLvl}! ${BALL_NAMES[s.ballLvl-1]}!`, true);
              } else {
                const comboMsgs = ["", "", "👍 2콤보!", "🔥 3콤보!", "💥 4콤보!", "⭐ 5콤보! 굉장해!", "🌟 6콤보!", "🚀 7콤보! 천재!", "👑 8콤보!", "💎 9콤보!", "🏆 10콤보!! 전설!"];
                const cm = s.combo >= 10 ? "🏆 " + s.combo + "콤보!! 전설!" : (comboMsgs[s.combo] || `🎉 ${s.monster.name} 포획!`);
                showMsg(s.combo >= 2 ? cm : `🎉 ${s.monster.name} 포획!`, true);
              }
            }
          } else {
            s.combo = 0;
            spawnParticles(s.monster.x, s.monster.y, false);
            s.shake = 20;
            if (s.monster.boss) {
              // 보스는 도망치지 않음 — 그 자리에 유지
              showMsg(`💨 빗나갔다! 보스 HP: ${"❤️".repeat(s.monster.hp)}`, false);
              s.raf = requestAnimationFrame(loop); return;
            }
            showMsg(`💨 ${s.monster.name} 도망갔다!`, false);
            const dir = s.monster.x < GW / 2 ? -1 : 1;
            s.monster.vx = dir * 7;
            s.monster.vy = -4;
            s.escapeAlpha = 1.0;
            s.phase = "escaping";
            // 도망 웃음 이모지 파티클
            s.particles.push({
              x: s.monster.x, y: s.monster.y - MON_R - 10,
              vx: 0, vy: -1.5,
              r: 14, color: null, emoji: "😂",
              life: 60, maxLife: 60,
            });
            s.raf = requestAnimationFrame(loop); return;
          }

          // boss every 7 catches (overrides special)
          const isBossSpawn = s.totalCaught >= 7 && s.totalCaught % 7 === 0;
          // special monster every 5 catches (only if not boss)
          const isSpecialSpawn = !isBossSpawn && s.totalCaught > 0 && s.totalCaught % 5 === 0;
          s.phase = "playing";
          s.monster = spawnMonster(s.ballLvl, s.charLvl, isBossSpawn ? false : isSpecialSpawn, s.difficulty || "hard");
          s.monTimer = isBossSpawn ? 1500 : 900; // 보스: 25초, 일반: 15초
          if (isBossSpawn) {
            const powerList = BOSS_MONSTERS.filter(b => b.power);
            const regularList = BOSS_MONSTERS.filter(b => !b.power);
            const isPower = Math.random() < 0.5 && powerList.length > 0;
            const pool = isPower ? powerList : regularList;
            const bd = pool[Math.floor(Math.random() * pool.length)];
            s.monster.boss = true;
            s.monster.power = !!bd.power;
            s.monster.hp = bd.power ? 15 : 10;
            s.monster.level = 10;
            s.monster.rarity = "legend";
            s.monster.emoji = "👑";
            s.monster.name = bd.name;
            s.monster.bossType = bd.type;
            if (s.difficulty !== "easy") { s.monster.vx *= 1.5; s.monster.vy *= 1.5; }
            // 보스 공격 상태 초기화
            s.bossAttackTimer = 0;
            s.bossPreAttack = null;
            s.bossProjectiles = [];
            if (bd.power) {
              showMsg(`⚡ 파워 포켓몬이 나타났다! (경험치 2배!)`, false);
            } else {
              showMsg(`👑 ${bd.name} 등장!! 10번 맞춰야 잡힌다!`, false);
            }
          } else if (isSpecialSpawn) {
            showMsg("🌟 특별 몬스터 등장!", true);
          }

          // Item spawn — 35% chance, only if no item already on field
          if (!s.item && Math.random() < 0.35) {
            const itemTypes = ["speed","slow","magnet","shield","timeplus","autoCatch","rewind","sniper","fever","freeze","double"];
            const w = 1/11;
            const itemWeights = [w,w,w,w,w,w,w,w,w,w,w];
            let r = Math.random(), cumW = 0, type = "speed";
            for (let i = 0; i < itemTypes.length; i++) {
              cumW += itemWeights[i]; if (r < cumW) { type = itemTypes[i]; break; }
            }
            const side = Math.random() > 0.5 ? 1 : -1;
            s.item = {
              type,
              x: GW / 2 + side * (60 + Math.random() * 100),
              y: 80 + Math.random() * 120,
              vx: (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.8),
              vy: (Math.random() > 0.5 ? 0.5 : -0.5) * 0.7,
              timer: 300,
            };
            const itemNames = { speed:"⚡빠르게!", slow:"🐌느리게!", magnet:"🧲자석!", shield:"🛡️방패!", timeplus:"⏰시간+!", autoCatch:"🎫뽑기권!", rewind:"⏪되감기!", sniper:"🎯조준경!", fever:"🔥콤보불꽃!", freeze:"🧊냉동!", double:"💫더블!" };
            showMsg(itemNames[type] + " 아이템 등장!", true);
          }

          // 골든 타임: 20마리마다 트리거 (보스 제외)
          if (s.totalCaught > 0 && s.totalCaught % 20 === 0 && !s.goldenTime) {
            s.goldenTime = true;
            s.goldenTimeTimer = 1800; // 30초
            showMsg("🌈 골든 타임! 30초 동안 XP 2배!", true);
          }

          // Math quiz every 5 catches
          if (s.totalCaught % 5 === 0) {
            setTimeout(() => triggerQuiz(), 700);
          }
        }
      } else if (s.phase === "escaping") {
        if (s.keys.has("ArrowLeft"))  s.player.x = Math.max(22, s.player.x - 5);
        if (s.keys.has("ArrowRight")) s.player.x = Math.min(GW - 22, s.player.x + 5);

        s.monster.vx *= 1.09;
        s.monster.vy -= 0.3;
        s.monster.x  += s.monster.vx;
        s.monster.y  += s.monster.vy;
        s.escapeAlpha = Math.max(0, s.escapeAlpha - 0.018);

        if (Math.random() < 0.65) {
          s.particles.push({
            x: s.monster.x - s.monster.vx * 0.4,
            y: s.monster.y - s.monster.vy * 0.4,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            r: 3 + Math.random() * 5,
            color: Math.random() > 0.5 ? "#FF5252" : "#FF9800",
            life: 18 + Math.random() * 10, maxLife: 28,
          });
        }

        ctx.globalAlpha = s.escapeAlpha;
        drawMonster(s.monster, t, false);
        ctx.globalAlpha = 1;
        drawParticles();
        if (s.shake > 0) s.shake--;
        drawPlayer(s.player.x, s.shake);

        const offscreen = s.monster.x < -80 || s.monster.x > GW + 80 || s.monster.y < -80;
        if (offscreen || s.escapeAlpha <= 0) {
          s.phase = "playing";
          s.monster = spawnMonster(s.ballLvl, s.charLvl, false, s.difficulty || "hard");
          s.monTimer = 900;
        }

      } else {
        // ── golden time timer ──
        if (s.goldenTime) {
          s.goldenTimeTimer--;
          if (s.goldenTimeTimer <= 0) {
            s.goldenTime = false;
            showMsg("🌈 골든 타임 종료!", false);
          }
        }

        // ── effect timer ──
        if (s.effect) {
          s.effect.timer--;
          if (s.effect.timer <= 0) {
            const endMsg = { speed: "⚡ 볼 가속 종료!", slow: "🐌 느리게 종료!", magnet: "🧲 자석 종료!" };
            showMsg(endMsg[s.effect.type] || "이펙트 종료!", false);
            s.effect = null;
          }
        }
        if (s.sniperTimer > 0) { s.sniperTimer--; if (s.sniperTimer === 0) showMsg("🎯 조준경 종료!", false); }
        if (s.feverTimer > 0)  { s.feverTimer--;  if (s.feverTimer === 0)  showMsg("🔥 콤보 불꽃 종료!", false); }
        if (s.freezeTimer > 0) { s.freezeTimer--; if (s.freezeTimer === 0) showMsg("🧊 냉동 종료!", false); }

        // ── player movement (speed effect → 볼 속도 증가, 이동속도 기본값) ──
        if (s.keys.has("ArrowLeft"))  s.player.x = Math.max(22, s.player.x - 5);
        if (s.keys.has("ArrowRight")) s.player.x = Math.min(GW - 22, s.player.x + 5);

        if (s.ball.active) {
          const speedBoost = (s.effect && s.effect.type === "speed") ? 1.3 : 1.0;
          const totalSpeedMult = Math.min(2.0, ballSpeedMult(s.charLvl) * ballLvlSpeedMult(s.ballLvl));
          s.ball.y -= 9 * totalSpeedMult * speedBoost;
          // 조준경: 볼이 몬스터 x 방향으로 자동 추적
          if (s.sniperTimer > 0 && s.monster) {
            const dx = s.monster.x - s.ball.x;
            s.ball.x += Math.max(-4, Math.min(4, dx * 0.1));
          }
          // trail 업데이트 (황금볼 또는 Lv2+ 일반 볼)
          if (s.ball.golden) {
            if (!s.ball.rainbowTrail) s.ball.rainbowTrail = [];
            s.ball.rainbowTrail.unshift({ x: s.ball.x, y: s.ball.y });
            if (s.ball.rainbowTrail.length > 12) s.ball.rainbowTrail.pop();
          } else if (s.ballLvl >= 2) {
            if (!s.ball.trail) s.ball.trail = [];
            s.ball.trail.unshift({ x: s.ball.x, y: s.ball.y });
            const maxLen = 2 + (s.ballLvl - 2) * 2; // Lv2:2, Lv3:4 ... Lv10:18
            if (s.ball.trail.length > maxLen) s.ball.trail.pop();
          }
          if (s.ball.y < -20) {
            // 되감기: miss 무효 처리
            if (s.rewind) {
              s.rewind = false;
              s.ball.y = GROUND_Y - PLAYER_H - 10;
              s.ball.x = s.player.x;
              showMsg("⏪ 되감기! 볼이 돌아왔다!", true);
            } else {
            s.ball.active = false;
            if (s.shield) {
              s.shield = false;
              showMsg("🛡️ 방패가 miss를 막았다!", true);
            } else {
              s.combo = 0;
              s.missStreak++;
              const limit = s.monster?.boss ? 50 : missLimit(s.charLvl);
              if (s.missStreak >= limit) {
                s.gameOver = true;
                setGameOver(true);
              } else {
                showMsg(`놓쳤다! (${s.missStreak}/${limit})`, false);
                // 7번 연속 miss → 도움 아이템 자동 등장
                if (s.missStreak >= 7 && !s.item) {
                  // 확률: slow(30%)>speed(25%)>shield(20%)>autoCatch(15%)>magnet(7%)>timeplus(3%)
                  const helpWeights = [0.30,0.25,0.20,0.15,0.07,0.03];
                  const helpTypes   = ["slow","speed","shield","autoCatch","magnet","timeplus"];
                  let hr = Math.random(), hc = 0, helpType = "shield";
                  for (let i = 0; i < helpWeights.length; i++) { hc += helpWeights[i]; if (hr < hc) { helpType = helpTypes[i]; break; } }
                  s.item = {
                    type: helpType,
                    x: GW / 2 + (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * 80),
                    y: 80 + Math.random() * 100,
                    vx: (Math.random() > 0.5 ? 1 : -1) * 0.6,
                    vy: 0,
                    timer: 400,
                  };
                  setTimeout(() => showMsg("💝 힘내! 도움 아이템이 나타났어!", true), 600);
                }
              }
            }
            } // end else (no rewind)
          }
          // ball vs monster
          if (s.monster) {
            const dx = s.ball.x - s.monster.x;
            const dy = s.ball.y - s.monster.y;
            if (Math.sqrt(dx * dx + dy * dy) < MON_R + BALL_R + 6) {
              s.phase = "catching";
              s.catchTimer = 0;
            }
          }
          // ball vs item
          if (s.item) {
            const dx = s.ball.x - s.item.x;
            const dy = s.ball.y - s.item.y;
            if (Math.sqrt(dx * dx + dy * dy) < 26 + BALL_R + 4) {
              const type = s.item.type;
              s.item = null;
              s.ball.active = false;
              spawnParticles(s.ball.x, s.ball.y, true);

              if (type === "speed" || type === "slow" || type === "magnet") {
                s.effect = { type, timer: 300 };
                const effectMsg = { speed: "⚡ 볼 발사 30% 빠르게! 5초!", slow: "🐌 느리게 5초!", magnet: "🧲 자석! 5초간 몬스터가 다가온다!" };
                showMsg(effectMsg[type], true);
              } else if (type === "shield") {
                s.shield = true;
                showMsg("🛡️ 방패! 다음 실패 1번 무효!", true);
              } else if (type === "timeplus") {
                s.monTimer = Math.min(900, s.monTimer + 600);
                showMsg("⏰ 시간 +10초!", true);
              } else if (type === "autoCatch") {
                // 뽑기권: 10가지 아이템 중 랜덤 1개 (동일 확률 10%)
                const lootAll = ["speed","slow","magnet","shield","timeplus","rewind","sniper","fever","freeze","double"];
                const lootType = lootAll[Math.floor(Math.random() * lootAll.length)];
                const lootPfx = "🎫 뽑기! ";
                if (lootType === "speed" || lootType === "slow" || lootType === "magnet") {
                  s.effect = { type: lootType, timer: 300 };
                  const em = { speed: "⚡ 빠르게 5초!", slow: "🐌 느리게 5초!", magnet: "🧲 자석 5초!" };
                  showMsg(lootPfx + em[lootType], true);
                } else if (lootType === "shield") {
                  s.shield = true; showMsg(lootPfx + "🛡️ 방패!", true);
                } else if (lootType === "timeplus") {
                  s.monTimer = Math.min(s.monTimer + 600, 900); showMsg(lootPfx + "⏰ 시간 +10초!", true);
                } else if (lootType === "rewind") {
                  s.rewind = true; showMsg(lootPfx + "⏪ 되감기!", true);
                } else if (lootType === "sniper") {
                  s.sniperTimer = 300; showMsg(lootPfx + "🎯 조준경 5초!", true);
                } else if (lootType === "fever") {
                  s.feverTimer = 600; showMsg(lootPfx + "🔥 콤보 불꽃 10초!", true);
                } else if (lootType === "freeze") {
                  s.freezeTimer = 180; showMsg(lootPfx + "🧊 냉동 3초!", true);
                } else if (lootType === "double") {
                  s.doubleNext = true; showMsg(lootPfx + "💫 더블!", true);
                }
                spawnParticles(s.ball.x, s.ball.y, true);
              } else if (type === "rewind") {
                s.rewind = true;
                showMsg("⏪ 되감기! 다음 miss 1회 무효!", true);
              } else if (type === "sniper") {
                s.sniperTimer = 300;
                showMsg("🎯 조준경! 5초간 자동 조준!", true);
              } else if (type === "fever") {
                s.feverTimer = 600;
                showMsg("🔥 콤보 불꽃! 10초간 콤보 ×2!", true);
              } else if (type === "freeze") {
                s.freezeTimer = 180;
                showMsg("🧊 냉동! 3초간 몬스터 정지!", true);
              } else if (type === "double") {
                s.doubleNext = true;
                showMsg("💫 더블! 다음 포획 XP/점수 ×3!", true);
              }
            }
          }
        }

        // ── item update ──
        if (s.item) {
          s.item.timer--;
          if (s.item.timer <= 0) {
            // item escapes
            s.item.vx = (s.item.x < GW / 2 ? -1 : 1) * 8;
            s.item.vy = -5;
            // fly off then remove
            s.item = null;
            showMsg("아이템이 도망갔다!", false);
          } else {
            s.item.x += s.item.vx;
            s.item.y += s.item.vy;
            const ITEM_R = 22;
            const maxIY = GROUND_Y * 0.65;
            if (s.item.x < ITEM_R || s.item.x > GW - ITEM_R) s.item.vx *= -1;
            if (s.item.y < 20     || s.item.y > maxIY)       s.item.vy *= -1;
            s.item.x = Math.max(ITEM_R, Math.min(GW - ITEM_R, s.item.x));
            s.item.y = Math.max(20, Math.min(maxIY, s.item.y));
          }
        }

        // ── monster movement (slow/magnet/pattern) ──
        if (s.monster) {
          // 보스 스턴 차감 (타격 후 0.5초 정지)
          if (s.monster.stunTimer > 0) s.monster.stunTimer--;
          if (s.bossInvincible > 0) s.bossInvincible--;
          if (s.freezeTimer > 0 || s.monster.stunTimer > 0) {
            // 냉동 또는 보스 스턴: 몬스터 완전 정지
          } else {
          const slowFactor = (s.effect && s.effect.type === "slow") ? 0.35 : 1;
          const mon = s.monster;

          // 자석: 몬스터가 플레이어 방향으로 이동
          if (s.effect && s.effect.type === "magnet") {
            const dx = s.player.x - mon.x;
            const dy = (GROUND_Y - PLAYER_H / 2) - mon.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            mon.vx += (dx / dist) * 0.4;
            mon.vy += (dy / dist) * 0.25;
            const spd = Math.sqrt(mon.vx * mon.vx + mon.vy * mon.vy);
            if (spd > 4) { mon.vx = (mon.vx / spd) * 4; mon.vy = (mon.vy / spd) * 4; }
          }

          // 도망 AI: Lv8+ 몬스터가 볼이 근접 시 반응 (easy: 50px, hard: 100px)
          if (mon.level >= 8 && s.ball.active) {
            const dx = s.ball.x - mon.x;
            const dy = s.ball.y - mon.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const fleeRange = s.difficulty === "easy" ? 50 : (mon.boss ? 120 : 110);
            if (dist < fleeRange) {
              mon.vx = Math.abs(mon.vx) * (dx > 0 ? -1 : 1);
            }
          }

          if (mon.pattern === "sleepy") {
            mon.sleepTimer = (mon.sleepTimer || 0) + 1;
            const sleeping = (mon.sleepTimer % 180) < 60;
            mon.sleeping = sleeping;
            if (!sleeping) {
              mon.x += mon.vx * slowFactor;
              mon.y += mon.vy * slowFactor;
            }
          } else if (mon.pattern === "jump") {
            mon.jumpPhase = (mon.jumpPhase || 0) + 1;
            if (mon.jumpPhase % 150 === 0) {
              mon.vy = -Math.abs(mon.vy || 1) * 1.4;
            }
            mon.x += mon.vx * slowFactor;
            mon.y += mon.vy * slowFactor;
            mon.vy += 0.08; // gravity
          } else if (mon.pattern === "zigzag") {
            mon.zigzagTimer = (mon.zigzagTimer || 0) + 1;
            const zigzagInterval = s.difficulty === "hard" ? 72 : 80;
            if (mon.zigzagTimer % zigzagInterval === 0) mon.vx *= -1;
            mon.x += mon.vx * slowFactor;
            mon.y += mon.vy * slowFactor;
          } else {
            mon.x += mon.vx * slowFactor;
            mon.y += mon.vy * slowFactor;
          }

          const maxY = GROUND_Y * 0.60;
          if (mon.x < MON_R || mon.x > GW - MON_R) mon.vx *= -1;
          if (mon.y < 22   || mon.y > maxY)        mon.vy *= -1;
          mon.x = Math.max(MON_R, Math.min(GW - MON_R, mon.x));
          mon.y = Math.max(22,    Math.min(maxY,        mon.y));
          } // end else (not frozen)
        }

        // ── boss projectile attack ──
        if (s.monster && s.monster.boss && s.phase === "playing" && s.freezeTimer <= 0) {
          const isEasy = s.difficulty === "easy";
          // Easy: 6초(일반)/5초(파워)  |  Hard: 3.5초(일반)/2.5초(파워)
          const attackInterval = isEasy
            ? (s.monster.power ? 300 : 360)
            : 120; // Hard: 2초
          // 발사 전 경고 단계 (Easy: 1.2초=72f, Hard: 0.6초=36f)
          const warnFrames = isEasy ? 72 : 36;
          const impactR = isEasy ? 48 : 60;

          if (s.bossPreAttack) {
            // 경고 카운트다운 — 이 시간 동안 바닥에 빨간 원 표시
            s.bossPreAttack.timer--;
            if (s.bossPreAttack.timer <= 0) {
              // 경고 종료 → 실제 발사 (targets 배열의 각 위치로 투사체 발사)
              const speed = isEasy ? 5 : 8;
              s.bossPreAttack.targets.forEach(targetX => {
                const dx = targetX - s.monster.x;
                const dy = GROUND_Y - s.monster.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                s.bossProjectiles.push({
                  x: s.monster.x, y: s.monster.y,
                  vx: (dx / dist) * speed,
                  vy: (dy / dist) * speed,
                  targetX,
                  impactR,
                });
              });
              s.bossPreAttack = null;
            }
          } else {
            s.bossAttackTimer++;
            if (s.bossAttackTimer >= attackInterval) {
              s.bossAttackTimer = 0;
              // Hard: 기본 3존, HP ≤ 5 → 4존
              const px = s.player.x;
              let targets;
              let attackMsg;
              if (isEasy) {
                targets = [px];
                attackMsg = "⚠️ 공격! 빨간 원을 피해!";
              } else if (s.monster.hp <= 5) {
                targets = [px - 108, px - 36, px + 36, px + 108];
                attackMsg = "⚠️ 4존 공격! 피해!";
              } else {
                targets = [px - 81, px, px + 81];
                attackMsg = "⚠️ 3존 공격! 피해!";
              }
              s.bossPreAttack = { targets, timer: warnFrames, impactR };
              showMsg(attackMsg, false);
            }
          }
        } else {
          // 보스 없어지면 경고/투사체 초기화
          s.bossPreAttack = null;
          s.bossProjectiles = [];
        }
        // 투사체 이동 + 착탄 판정
        if (s.bossProjectiles.length > 0) {
          s.bossProjectiles = s.bossProjectiles.filter(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.y >= GROUND_Y - 8) {
              // 착탄: 플레이어와 X 거리 체크
              if (Math.abs(s.player.x - p.targetX) < p.impactR && s.playerInvincible <= 0) {
                if (s.shield) {
                  s.shield = false;
                  showMsg("🛡️ 방패가 공격을 막았다!", true);
                } else {
                  s.playerHp = Math.max(0, s.playerHp - 1);
                  s.playerInvincible = 120;
                  s.shake = 25;
                  spawnParticles(s.player.x, GROUND_Y - PLAYER_H / 2, false);
                  if (s.playerHp <= 0) {
                    s.gameOver = true; setGameOver(true);
                  } else {
                    showMsg(`💥 공격 맞았다! HP: ${"❤️".repeat(s.playerHp)}`, false);
                  }
                }
              } else {
                spawnParticles(p.targetX, GROUND_Y - 5, false);
              }
              return false;
            }
            return true;
          });
        }
        // 무적 프레임 차감
        if (s.playerInvincible > 0) s.playerInvincible--;

        // ── monster timer ──
        if (s.phase === "playing" && s.monster && !s.ball.active) {
          s.monTimer--;
          if (s.monTimer <= 0) {
            if (s.monster.boss) {
              // 보스 타임아웃 → 게임오버
              s.gameOver = true;
              setGameOver(true);
            } else {
              // 시간 초과 → 도망 처리 + 위기 카운트다운 시작
              s.combo = 0;
              const dir = s.monster.x < GW / 2 ? -1 : 1;
              s.monster.vx = dir * 9;
              s.monster.vy = -5;
              s.escapeAlpha = 1.0;
              s.phase = "escaping";
              s.dangerTimer = 600; // 10초 카운트다운
              showMsg("⏰ 시간 초과! 10초 안에 잡아라!", false);
            }
          }
        }

        if (s.monster) drawMonster(s.monster, t, false);
        if (s.item) drawItem(s.item);
        if (s.ball.active) drawBall(s.ball.x, s.ball.y);
        drawParticles();
        drawComboPopup();
        drawSpecialBanner();
        drawBossCatchBanner();
        // 5초 이하 카운트다운
        if (s.monTimer > 0 && s.monTimer <= 300 && s.phase === "playing") {
          const secs = Math.ceil(s.monTimer / 60);
          const pulse = 0.7 + 0.3 * Math.sin(Date.now() * 0.015);
          ctx.globalAlpha = pulse;
          ctx.fillStyle = secs <= 2 ? "#FF5252" : "#FF9800";
          ctx.font = `bold ${secs <= 2 ? 32 : 26}px monospace`;
          ctx.textAlign = "center"; ctx.textBaseline = "top";
          ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 16;
          ctx.fillText(`⏰ ${secs}`, GW / 2, 8);
          ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        }
        // ── danger timer (시간 초과 후 10초 카운트다운) ──
        if (s.dangerTimer > 0) {
          s.dangerTimer--;
          if (s.dangerTimer <= 0) {
            s.gameOver = true;
            setGameOver(true);
          } else {
            const dsecs = Math.ceil(s.dangerTimer / 60);
            const pulse = 0.65 + 0.35 * Math.sin(Date.now() * 0.02);
            ctx.globalAlpha = pulse;
            ctx.fillStyle = "#FF1744";
            ctx.font = `bold ${dsecs <= 3 ? 22 : 18}px 'Noto Sans KR', monospace`;
            ctx.textAlign = "center"; ctx.textBaseline = "bottom";
            ctx.shadowColor = "#FF1744"; ctx.shadowBlur = 20;
            ctx.fillText(`⚠️ ${dsecs}초 안에 잡아라!`, GW / 2, GH - 8);
            ctx.shadowBlur = 0; ctx.globalAlpha = 1;
          }
        }
        drawBossProjectiles();
        drawEffectHud();
        drawShieldHud();
        drawPlayerHp();
        if (s.shake > 0) s.shake--;
        drawPlayer(s.player.x, s.shake);
      }

      s.raf = requestAnimationFrame(loop);
    }

    s.raf = requestAnimationFrame(loop);

    function onKeyDown(e) {
      s.keys.add(e.key);
      if ((e.key === " " || e.code === "Space") && !s.ball.active && s.phase === "playing") {
        e.preventDefault();
        const golden = s.goldenBall;
        if (golden) s.goldenBall = false;
        s.ball = { x: s.player.x, y: GROUND_Y - PLAYER_H + 8, active: true, golden, rainbowTrail: golden ? [] : null };
      }
      if (["ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault();
    }
    function onKeyUp(e) { s.keys.delete(e.key); }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    syncUi("", true);

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      clearTimeout(msgTimeout.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // touch controls
  const holdRef = useRef(null);
  const activeKeys = useRef(new Set()); // 현재 눌린 방향키 추적

  const stopMove = (dir) => {
    activeKeys.current.delete(dir);
    if (activeKeys.current.size === 0) cancelAnimationFrame(holdRef.current);
  };

  const startMove = (dir) => {
    activeKeys.current.add(dir);
    cancelAnimationFrame(holdRef.current);
    const step = () => {
      const s = gs.current;
      if (activeKeys.current.has("L")) s.player.x = Math.max(22, s.player.x - 6);
      if (activeKeys.current.has("R")) s.player.x = Math.min(GW - 22, s.player.x + 6);
      if (activeKeys.current.size > 0) holdRef.current = requestAnimationFrame(step);
    };
    holdRef.current = requestAnimationFrame(step);
  };

  const doThrow = () => {
    const s = gs.current;
    if (!s.ball.active && s.phase === "playing") {
      const golden = s.goldenBall;
      if (golden) s.goldenBall = false;
      s.ball = { x: s.player.x, y: GROUND_Y - PLAYER_H + 8, active: true, golden, rainbowTrail: golden ? [] : null };
    }
  };

  // 터치 이벤트 핸들러 (preventDefault로 스크롤/줌 방지)
  const makeTouchMove = (dir) => ({
    onTouchStart: (e) => { e.preventDefault(); startMove(dir); },
    onTouchEnd:   (e) => { e.preventDefault(); stopMove(dir); },
    onTouchCancel:(e) => { e.preventDefault(); stopMove(dir); },
  });
  const touchThrow = {
    onTouchStart: (e) => { e.preventDefault(); doThrow(); },
    onTouchEnd:   (e) => { e.preventDefault(); },
  };

  function handleQuizAnswer(num) {
    if (num === quiz.answer) {
      setQuiz(null);
      gs.current.phase = "playing";
      showMsg("⭕ 정답! 계속 가자!", true);
    } else {
      setQuiz(prev => ({ ...prev, wrong: true }));
    }
  }

  const xpPct = Math.min(100, (ui.xp / ui.xpReq) * 100);
  const bc = BALL_COLORS[ui.ballLvl - 1];
  const charTheme = getCharTheme(ui.charLvl);


  return (
    <div style={{
      fontFamily: "'Press Start 2P', 'Noto Sans KR', monospace",
      background: "radial-gradient(ellipse at 50% 0%, #0D1E3D 0%, #040916 70%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", padding: "10px 8px 14px", userSelect: "none",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&family=Press+Start+2P&display=swap');
        @keyframes pop   { 0%{transform:scale(0.7);opacity:0} 30%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
        @keyframes glow  { 0%,100%{text-shadow:0 0 8px currentColor} 50%{text-shadow:0 0 20px currentColor,0 0 30px currentColor} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        .touch-btn { -webkit-tap-highlight-color: transparent; touch-action: none; }
        .touch-btn:active { transform:scale(0.91); filter:brightness(1.4); }
        * { -webkit-touch-callout: none; user-select: none; -webkit-user-select: none; }
        @media (max-width: 600px) {
          .game-title { font-size: 13px !important; margin-bottom: 6px !important; }
          .subtitle-row { margin: -4px 0 6px !important; gap: 8px !important; }
          .subtitle-text { display: none !important; }
          .stat-panel { padding: 4px 8px !important; gap: 6px !important; margin-bottom: 6px !important; }
          .stat-box { min-width: 50px !important; }
          .stat-box-label { font-size: 6px !important; margin-bottom: 1px !important; }
          .stat-box-value { font-size: 11px !important; }
          .stat-box-sub { font-size: 6px !important; }
          .stat-divider { margin: 0 1px !important; }
          .btn-row { margin-bottom: 5px !important; gap: 6px !important; }
          .result-btn { padding: 5px 12px !important; font-size: 9px !important; }
          .xp-section { margin-bottom: 3px !important; }
          .msg-banner { height: 24px !important; margin-bottom: 1px !important; }
          .game-canvas { max-width: 100vw !important; border-radius: 0 !important; }
          .canvas-wrapper { max-width: 100vw !important; width: 100% !important; }
          .controls-row { margin-top: 8px !important; gap: 12px !important; }
          .hint-text { font-size: 6px !important; margin-top: 4px !important; }
        }
      `}</style>

      {/* Title */}
      <h1 className="game-title" style={{
        color: "#FFD700", fontSize: 20, margin: "0 0 14px",
        textShadow: "3px 3px 0 #7A5C00, 0 0 24px #FFD70077",
        animation: "glow 3s ease infinite", letterSpacing: 2,
        fontFamily: "'Noto Sans KR', 'Press Start 2P', monospace",
      }}>
        🌟 이준캐치 🌟
      </h1>
      <div className="subtitle-row" style={{
        display: "flex", alignItems: "center", gap: 14,
        margin: "-10px 0 14px",
      }}>
        <p className="subtitle-text" style={{
          color: "#FFD70099", fontSize: 11, margin: 0,
          fontFamily: "'Noto Sans KR', monospace", letterSpacing: 1,
        }}>
          우리 아이를 위한 모험
        </p>
        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          background: "rgba(255,255,255,0.06)", border: "1px solid #ffffff18",
          borderRadius: 20, padding: "3px 10px",
        }}>
          <span style={{ fontSize: 9 }}>⏱</span>
          <span style={{
            color: "#90CAF9", fontSize: 10,
            fontFamily: "monospace", letterSpacing: 1,
          }}>
            {String(Math.floor(playTime / 3600)).padStart(2,"0")}:
            {String(Math.floor((playTime % 3600) / 60)).padStart(2,"0")}:
            {String(playTime % 60).padStart(2,"0")}
          </span>
        </div>
      </div>

      {/* Stats panel */}
      <div className="stat-panel" style={{
        display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap", justifyContent: "center",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${bc}44`,
        borderRadius: 10, padding: "8px 16px",
        boxShadow: `0 0 16px ${bc}22`,
      }}>
        <StatBox label="캐릭터" value={`Lv.${ui.charLvl}`} sub={`/ 50`} color={charTheme.accent || "#78B7FF"} />
        <div className="stat-divider" style={{ width: 1, background: "#ffffff15", margin: "0 4px" }} />
        <StatBox label="BALL" value={`★ Lv.${ui.ballLvl}`} sub={ui.ballName} color={bc} />
        <div className="stat-divider" style={{ width: 1, background: "#ffffff15", margin: "0 4px" }} />
        <StatBox label="포획수" value={ui.totalCaught} color="#FFD740" />
        <div className="stat-divider" style={{ width: 1, background: "#ffffff15", margin: "0 4px" }} />
        <StatBox label="볼속도" value={`${ui.ballSpeed}%`} color="#00E5FF" />
        <div className="stat-divider" style={{ width: 1, background: "#ffffff15", margin: "0 4px" }} />
        <StatBox label="콤보" value={`${ui.combo}콤보`} sub={`최고 ${ui.maxCombo}`} color="#FF80AB" />
        <div className="stat-divider" style={{ width: 1, background: "#ffffff15", margin: "0 4px" }} />
        <StatBox label="특별" value={`🌟${ui.specialCaught}`} color="#FFD700" />
      </div>

      {/* SCORE 표시 */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 10, marginBottom: 8,
        background: "rgba(0,229,255,0.07)", border: "1px solid #00E5FF44",
        borderRadius: 10, padding: "6px 20px",
      }}>
        <span style={{ color: "#00E5FF", fontSize: 11, letterSpacing: 2, fontFamily: "monospace" }}>🏆 SCORE</span>
        <span style={{ color: "#fff", fontSize: 20, fontWeight: "bold", fontFamily: "monospace", letterSpacing: 1 }}>
          {ui.score.toLocaleString()}
        </span>
      </div>

      {/* 버튼 행 */}
      <div className="btn-row" style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button className="result-btn" onClick={() => { gs.current.paused = true; setShowResult(true); }} style={{
          padding: "6px 18px",
          background: "linear-gradient(135deg, #1A2744, #0D1E3D)",
          border: "1px solid #FFD70066", borderRadius: 20,
          color: "#FFD700", fontSize: 11, cursor: "pointer",
          fontFamily: "'Noto Sans KR', monospace", letterSpacing: 1,
          WebkitTapHighlightColor: "transparent",
        }}>
          📊 오늘의 결과
        </button>
        <button className="result-btn" onClick={() => {
          gs.current.paused = true;
          setShowRules(true);
        }} style={{
          padding: "6px 18px",
          background: "linear-gradient(135deg, #1A2744, #0D1E3D)",
          border: "1px solid #78B7FF66", borderRadius: 20,
          color: "#78B7FF", fontSize: 11, cursor: "pointer",
          fontFamily: "'Noto Sans KR', monospace", letterSpacing: 1,
          WebkitTapHighlightColor: "transparent",
        }}>
          📖 규칙 보기 (일시정지)
        </button>
      </div>

      {/* XP bar */}
      <div className="xp-section" style={{ width: Math.min(GW, 520), marginBottom: 6, maxWidth: "95vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
          <span style={{ color: "#556", fontSize: 7 }}>XP</span>
          <span style={{ color: bc, fontSize: 7 }}>{ui.xp} / {ui.xpReq}</span>
        </div>
        <div style={{ height: 9, background: "#0D1929", borderRadius: 5, overflow: "hidden", border: "1px solid #1A2744" }}>
          <div style={{
            width: `${xpPct}%`, height: "100%", borderRadius: 5,
            background: `linear-gradient(90deg, ${bc}, #FFD700)`,
            boxShadow: `0 0 8px ${bc}`, transition: "width 0.5s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
          {Array.from({length: 10}, (_, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: "50%",
              background: i < ui.ballLvl ? BALL_COLORS[i] : "#1A2744",
              border: `1px solid ${i < ui.ballLvl ? BALL_COLORS[i] : "#2A3A54"}`,
              boxShadow: i < ui.ballLvl ? `0 0 6px ${BALL_COLORS[i]}` : "none",
            }} />
          ))}
        </div>
      </div>

      {/* Message banner */}
      <div className="msg-banner" style={{ height: 32, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
        {ui.message && (
          <div style={{
            color: ui.msgOk ? "#69F0AE" : "#FF5252",
            fontSize: 10, animation: "pop 0.25s ease",
            textShadow: `0 0 12px ${ui.msgOk ? "#69F0AE" : "#FF5252"}`,
            background: "rgba(0,0,0,0.5)", padding: "4px 12px", borderRadius: 6,
            fontFamily: "'Noto Sans KR', monospace",
          }}>
            {ui.message}
          </div>
        )}
      </div>

      {/* Canvas + Quiz overlay wrapper */}
      <div className="canvas-wrapper" style={{ position: "relative", display: "inline-block", maxWidth: "95vw" }}>
        <canvas ref={canvasRef} width={GW} height={GH} className="game-canvas" style={{
          display: "block", maxWidth: "95vw",
          border: `2px solid ${bc}66`,
          borderRadius: 8,
          boxShadow: `0 0 30px ${bc}22, 0 8px 32px rgba(0,0,0,0.7)`,
        }} />
        {quiz && (
          <QuizModal quiz={quiz} onAnswer={handleQuizAnswer} />
        )}
        {showResult && (
          <ResultModal
            ui={ui} playTime={playTime}
            onClose={() => { gs.current.paused = false; setShowResult(false); }}
          />
        )}
        {showRules && (
          <RulesModal onClose={() => {
            gs.current.paused = false;
            setShowRules(false);
          }} />
        )}
        {gameOver && (
          <GameOverModal ui={ui} playTime={playTime} onRestart={() => {
            const s = gs.current;
            // reset all game state — show difficulty selection again
            s.player = { x: GW / 2 };
            s.ball = { x: 0, y: 0, active: false };
            s.monster = null;
            s.ballLvl = 1; s.xp = 0; s.charLvl = 1; s.levelUpTimer = 0;
            s.phase = "playing"; s.catchTimer = 0;
            s.totalCaught = 0; s.collection = []; s.particles = [];
            s.shake = 0; s.escapeAlpha = 1;
            s.item = null; s.effect = null;
            s.combo = 0; s.maxCombo = 0; s.specialCaught = 0;
            s.specialBanner = 0; s.missStreak = 0; s.gameOver = false;
            s.goldenBall = false; s.monTimer = 900; s.dangerTimer = 0;
            s.shield = false; s.flashTimer = 0; s.comboPopTimer = 0; s.comboPopValue = 0;
            s.goldenTime = false; s.goldenTimeTimer = 0;
            s.charXp = 0; s.bossCatchBanner = 0;
            s.difficulty = null; s.paused = true; s.totalScore = 0;
            s.rewind = false; s.sniperTimer = 0; s.feverTimer = 0; s.freezeTimer = 0; s.doubleNext = false;
            s.playerHp = 5; s.playerMaxHp = 5; s.playerInvincible = 0;
            s.bossAttackTimer = 0; s.bossPreAttack = null; s.bossProjectiles = [];
            s.bossLastHitX = -999; s.bossInvincible = 0;
            setGameOver(false);
            setDifficulty(null);
            setPlayTime(0);
          }} />
        )}
        {!difficulty && !gameOver && (
          <DifficultyModal onSelect={(diff) => {
            const s = gs.current;
            s.difficulty = diff;
            s.paused = false;
            s.monster = spawnMonster(1, s.charLvl, false, diff);
            setDifficulty(diff);
            syncUi("게임 시작!", true);
          }} />
        )}
      </div>

      {/* Touch controls */}
      <div className="controls-row" style={{ display: "flex", gap: 16, marginTop: 12, alignItems: "center" }}
        onContextMenu={(e) => e.preventDefault()}>
        <button className="touch-btn"
          {...makeTouchMove("L")}
          onPointerDown={() => startMove("L")} onPointerUp={() => stopMove("L")} onPointerCancel={() => stopMove("L")}
          onContextMenu={(e) => e.preventDefault()}
          style={btnStyle("#1565C0")}>◀</button>
        <button className="touch-btn"
          {...touchThrow}
          onPointerDown={doThrow}
          onContextMenu={(e) => e.preventDefault()}
          style={{ ...btnStyle(ui.goldenBall ? "#FFD700" : bc), minWidth: 150, fontSize: 10,
            boxShadow: ui.goldenBall ? "0 0 24px #FFD70099" : `0 0 20px ${bc}66`,
            background: ui.goldenBall
              ? "linear-gradient(135deg, #7A5C0088, #FFD70055)"
              : `linear-gradient(135deg, ${bc}33, ${bc}55)`,
            border: ui.goldenBall ? "2px solid #FFD700" : undefined,
          }}>
          {ui.goldenBall ? "🌟 황금볼!" : "⚡ 던지기!"}
        </button>
        <button className="touch-btn"
          {...makeTouchMove("R")}
          onPointerDown={() => startMove("R")} onPointerUp={() => stopMove("R")} onPointerCancel={() => stopMove("R")}
          onContextMenu={(e) => e.preventDefault()}
          style={btnStyle("#1565C0")}>▶</button>
      </div>

      {/* Keyboard hint */}
      <div className="hint-text" style={{ color: "#4A6080", fontSize: 7, marginTop: 6, textAlign: "center", lineHeight: 2.2, fontFamily: "'Noto Sans KR', monospace" }}>
        ← → 이동  •  SPACE 던지기  •  몬스터 레벨이 높을수록 더 많은 XP 획득!
      </div>

      {/* Collection */}
      {ui.collection.length > 0 && (
        <div style={{ marginTop: 18, width: Math.min(GW, 520), maxWidth: "95vw" }}>
          <div style={{
            color: "#FFD700", fontSize: 8, marginBottom: 8,
            textShadow: "0 0 8px #FFD70066",
            fontFamily: "'Noto Sans KR', monospace",
          }}>
            내 컬렉션 ({ui.collection.length})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {ui.collection.map((m, i) => {
              const rc = RARITY_COLOR[m.rarity];
              return (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${rc}55`,
                  borderRadius: 7, padding: "4px 8px",
                  display: "flex", alignItems: "center", gap: 4,
                  boxShadow: `0 0 6px ${rc}22`,
                  animation: "float 3s ease infinite",
                  animationDelay: `${i * 0.1}s`,
                }}>
                  <span style={{ fontSize: 16 }}>{m.emoji}</span>
                  <span style={{ fontSize: 7, color: rc }}>Lv{m.level}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, sub, color }) {
  return (
    <div className="stat-box" style={{ textAlign: "center", minWidth: 70 }}>
      <div className="stat-box-label" style={{ color: "#3A4A64", fontSize: 7, marginBottom: 3 }}>{label}</div>
      <div className="stat-box-value" style={{ color, fontSize: 12, textShadow: `0 0 8px ${color}88` }}>{value}</div>
      {sub && <div className="stat-box-sub" style={{ color: "#445", fontSize: 7, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function DifficultyModal({ onSelect }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(4,9,22,0.97)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      zIndex: 9999, overflowY: "auto",
    }}>
      <div style={{ fontSize: 32, marginBottom: 4 }}>🌟 이준 캐치 🌟</div>
      <div style={{ color: "#aaa", fontSize: 13, marginBottom: 24, fontFamily: "'Noto Sans KR', monospace" }}>난이도를 선택하세요</div>

      {/* EASY */}
      <button
        onPointerDown={(e) => { e.preventDefault(); onSelect("easy"); }}
        style={{
          width: "min(240px, 80vw)", padding: "16px 0", marginBottom: 16,
          background: "linear-gradient(135deg,#1b5e20,#43a047)",
          border: "2px solid #66bb6a", borderRadius: 12,
          color: "#fff", cursor: "pointer",
          boxShadow: "0 0 20px #43a04766",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          touchAction: "manipulation", WebkitTapHighlightColor: "transparent",
          fontFamily: "'Noto Sans KR', monospace",
        }}>
        <span style={{ fontSize: 26 }}>🌱</span>
        <span style={{ fontSize: 20, fontWeight: "bold", letterSpacing: 2 }}>EASY</span>
        <span style={{ fontSize: 11, color: "#c8e6c9", marginTop: 2 }}>몬스터가 느리고 순해요</span>
        <span style={{ fontSize: 10, color: "#a5d6a7" }}>속도 50% · 회피 50% 감소</span>
      </button>

      {/* HARD */}
      <button
        onPointerDown={(e) => { e.preventDefault(); onSelect("hard"); }}
        style={{
          width: "min(240px, 80vw)", padding: "16px 0",
          background: "linear-gradient(135deg,#b71c1c,#e53935)",
          border: "2px solid #ef5350", borderRadius: 12,
          color: "#fff", cursor: "pointer",
          boxShadow: "0 0 20px #e5393566",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          touchAction: "manipulation", WebkitTapHighlightColor: "transparent",
          fontFamily: "'Noto Sans KR', monospace",
        }}>
        <span style={{ fontSize: 26 }}>💀</span>
        <span style={{ fontSize: 20, fontWeight: "bold", letterSpacing: 2 }}>HARD</span>
        <span style={{ fontSize: 11, color: "#ffcdd2", marginTop: 2 }}>기본 난이도로 도전!</span>
        <span style={{ fontSize: 10, color: "#ef9a9a" }}>몬스터가 빠르고 영리해요</span>
      </button>
    </div>
  );
}

function RulesModal({ onClose }) {
  const sections = [
    {
      title: "🎮 기본 조작",
      items: [
        "← → (방향키 또는 ◀ ▶ 버튼) 으로 이동",
        "Space 또는 ⚡던지기! 버튼으로 볼 발사",
        "볼이 몬스터에 맞으면 포획 시도!",
      ],
    },
    {
      title: "❤️ 플레이어 HP",
      items: [
        "HP ❤️×5로 시작 (화면 좌상단 표시)",
        "보스 몬스터가 주기적으로 공격 볼을 발사!",
        "바닥 빨간 원 = 착탄 지점 — 원 밖으로 이동해 피하세요!",
        "피격 시 HP -1, 2초간 무적",
        "이지: 6초마다 공격, 경고 1.2초 / 하드: 3.5초마다 공격, 경고 0.6초",
        "🛡️ 방패 아이템으로 돌진 1회 막기 가능",
        "10마리 포획마다 💖 HP 1 자동 회복 (최대 5)",
        "HP 0 = 게임 오버!",
      ],
    },
    {
      title: "⏰ 제한 시간",
      items: [
        "몬스터는 15초 안에 잡아야 함",
        "5초 이하 남으면 화면 중앙에 카운트다운 표시",
        "시간 초과 시 몬스터 도망 + ⚠️ 위기 발동!",
        "위기 발동 후 10초 안에 다음 몬스터를 잡아야 함",
        "10초 안에 못 잡으면 게임 오버!",
      ],
    },
    {
      title: "💀 게임 오버",
      items: [
        "볼을 던졌는데 못 맞히면 MISS 카운트",
        "Lv.1-9: 20번, Lv.10-19: 18번, Lv.20-29: 16번",
        "Lv.30-39: 14번, Lv.40-49: 12번, Lv.50: 10번 실패 시 종료",
        "7번 연속 miss 시 💝 도움 아이템 자동 등장!",
        "몬스터 도망은 MISS 카운트 없음",
        "시간 초과 후 10초 카운트다운 0이 되면 즉시 종료",
      ],
    },
    {
      title: "🔥 콤보 & 황금볼",
      items: [
        "연속 포획 성공마다 콤보 증가!",
        "5콤보 달성 시 🌟황금볼 지급 (확정 포획)",
        "실패하면 콤보 초기화",
      ],
    },
    {
      title: "🎯 볼 레벨 이펙트 (8종)",
      items: [
        "볼 레벨업마다 이펙트 강화 + 발사 속도 증가!",
        "Lv1: 100% → Lv8: 200% (선형 증가, 최대 200%)",
        "Lv2: 흰색 페이드 trail · 소프트 글로우",
        "Lv3: 컬러 페이드 trail",
        "Lv4: 선명한 컬러 trail",
        "Lv5: 밝은 trail + 스파크 3개",
        "Lv6: 펄싱 글로우 trail + 스파크 4개",
        "Lv7: 더블 레이어 trail + 스파크 5개",
        "Lv8+: 무지개 trail + 레인보우 스파크 6개",
        "포획 중 orbit도 볼 레벨에 따라 변화",
      ],
    },
    {
      title: "🎒 캐릭터 레벨업 (XP 방식)",
      items: [
        "몬스터 포획 시 몬스터 레벨만큼 XP 획득",
        "Lv1-10: 10XP/레벨, Lv10-20: 100XP/레벨",
        "Lv20-30: 300XP, Lv30-40: 600XP, Lv40-50: 900XP",
        "레벨업 시 모자 모양·복장 색상 변화!",
        "레벨 5단계마다 몬스터 속도 증가 (최대 2배)",
        "캐릭터 Lv10마다 볼 발사 속도 +10% 추가 보너스",
      ],
    },
    {
      title: "🌟 특별 몬스터",
      items: [
        "10마리 포획마다 특별 몬스터 등장",
        "무지개 링 + 중앙 배너 이펙트",
        "포획 성공 시 현재 레벨 5단계치 XP 대량 보너스!",
        "포획률 30% — 황금볼 사용 추천!",
      ],
    },
    {
      title: "🎁 아이템 (11종)",
      items: [
        "포획 성공 후 35% 확률로 11종 아이템 등장 (균등 확률)",
        "⚡빠르게: 5초간 볼 발사 속도 30% 증가",
        "🐌느리게: 5초간 몬스터 속도 35%로 감소",
        "🧲자석: 5초간 몬스터가 플레이어 쪽으로 이동",
        "🛡️방패: 다음 볼 miss 1회 무효",
        "⏰시간+: 몬스터 제한 시간 +10초",
        "🎫뽑기권: 나머지 10종 중 랜덤 1개 발동! (각 10%)",
        "⏪되감기: 볼이 화면 밖으로 나가도 되돌아옴 (miss 무효)",
        "🎯조준경: 5초간 볼이 몬스터 방향 자동 추적",
        "🔥콤보불꽃: 10초간 포획마다 콤보 +2씩 적립",
        "🧊냉동: 3초간 몬스터 완전 정지",
        "💫더블: 다음 포획 1회 XP·점수 ×3",
        "5초 안에 볼로 맞추지 않으면 도망!",
      ],
    },
    {
      title: "👾 몬스터 패턴",
      items: [
        "졸음형(Lv1-3): 가끔 멈추고 Zzz — 이때 포획률 2배!",
        "점프형(Lv3-6): 주기적으로 높게 점프",
        "지그재그(Lv7+): 방향을 빠르게 바꿈",
        "도망AI(Lv5+): 볼이 날아오면 반대로 이동",
        "3콤보 이상 달성 시 화면 중앙에 콤보 팝업!",
      ],
    },
    {
      title: "💀 보스 몬스터",
      items: [
        "7마리 포획마다 보스 등장! (도망치지 않음)",
        "피카추·팬텀·리자몽 등 30종 포켓몬",
        "보스는 10번 맞춰야 포획 시도됨 (HP ❤️×10)",
        "10번 타격 후 포획 성공 여부는 확률로 결정",
        "포획 시 XP 50 획득 (lv10 몬스터의 5배)",
        "포획 성공 시 👑 보스 포켓몬 캐치! 배너 등장",
        "황금볼 활용 추천!",
      ],
    },
    {
      title: "⚡ 파워 포켓몬",
      items: [
        "보스 등장 시 50% 확률로 파워 포켓몬 출현!",
        "거북왕·리자몽·뮤츠·뮤·망나뇽·이상해꽃·후딘·나인테일",
        "HP ❤️×15 — 15번 맞춰야 포획 시도됨",
        "15번 타격 후 포획 확률 30~50% (랜덤)",
        "포획 실패 시 HP 1로 유지 — 계속 도전 가능!",
        "포획 성공 시 XP 100 획득 (경험치 2배!)",
        "등장 메시지: ⚡ 파워 포켓몬이 나타났다! (경험치 2배!)",
      ],
    },
    {
      title: "🌈 골든 타임",
      items: [
        "20마리 포획마다 골든 타임 30초 발동!",
        "골든 타임 중 XP 2배 획득",
        "화면에 황금빛 오버레이 + 상단 배너 표시",
      ],
    },
    {
      title: "🧮 퀴즈",
      items: [
        "5마리 포획마다 덧셈/뺄셈 퀴즈 등장",
        "4지선다 버튼 또는 키보드 입력",
        "정답을 맞춰야 게임 계속!",
      ],
    },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(4,9,22,0.97)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      zIndex: 9999, overflowY: "auto",
      padding: "16px 0",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #0D1E3D, #1A2744)",
        border: "2px solid #78B7FF55", borderRadius: 16,
        padding: "22px 20px 18px", width: 288,
        boxShadow: "0 0 40px #78B7FF22",
        fontFamily: "'Noto Sans KR', monospace",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ color: "#78B7FF", fontSize: 13, fontWeight: "bold", letterSpacing: 1 }}>
            ⏸ 규칙 보기
          </span>
          <span style={{ color: "#556", fontSize: 10 }}>게임 일시정지 중</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sections.map(sec => (
            <div key={sec.title} style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: 10, padding: "10px 12px",
              borderLeft: "3px solid #78B7FF44",
            }}>
              <div style={{ color: "#78B7FF", fontSize: 11, fontWeight: "bold", marginBottom: 6 }}>
                {sec.title}
              </div>
              {sec.items.map((item, i) => (
                <div key={i} style={{
                  color: "#B0BEC5", fontSize: 10, lineHeight: 1.7,
                  paddingLeft: 6,
                }}>
                  · {item}
                </div>
              ))}
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{
          width: "100%", padding: "12px 0", marginTop: 14,
          background: "linear-gradient(135deg, #0D3060, #1565C0)",
          border: "none", borderRadius: 8,
          color: "white", fontSize: 13, cursor: "pointer",
          fontFamily: "'Noto Sans KR', monospace", letterSpacing: 1,
          boxShadow: "0 0 16px #1565C044",
          WebkitTapHighlightColor: "transparent",
        }}>
          ▶ 게임 계속하기
        </button>
      </div>
    </div>
  );
}

function GameOverModal({ ui, playTime, onRestart }) {
  const fmt = s => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(4,0,0,0.95)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999,
    }}>
      <div style={{
        background: "linear-gradient(135deg, #1A0000, #2D0A0A)",
        border: "2px solid #FF525277", borderRadius: 16,
        padding: "28px 28px 22px", textAlign: "center", width: 280,
        boxShadow: "0 0 50px #FF525233",
        fontFamily: "'Noto Sans KR', monospace",
      }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>💀</div>
        <div style={{ color: "#FF5252", fontSize: 16, fontWeight: "bold", marginBottom: 4, letterSpacing: 2 }}>
          GAME OVER
        </div>
        <div style={{ color: "#90A4AE", fontSize: 10, marginBottom: 20 }}>
          7번 연속 실패... 다시 도전해봐!
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 18 }}>
          {[
            { label: "🏆 SCORE",    value: ui.score.toLocaleString(), color: "#00E5FF" },
            { label: "총 포획수",   value: `${ui.totalCaught}마리`, color: "#FFD740" },
            { label: "최고 콤보",   value: `${ui.maxCombo}콤보`,   color: "#FF80AB" },
            { label: "최고 레벨",   value: `Lv.${ui.charLvl}`,    color: "#78B7FF" },
            { label: "플레이 시간", value: fmt(playTime),           color: "#90CAF9" },
          ].map(r => (
            <div key={r.label} style={{
              display: "flex", justifyContent: "space-between",
              background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "6px 14px",
            }}>
              <span style={{ color: "#90A4AE", fontSize: 11 }}>{r.label}</span>
              <span style={{ color: r.color, fontSize: 13, fontWeight: "bold", fontFamily: "monospace" }}>{r.value}</span>
            </div>
          ))}
        </div>
        <button onClick={onRestart} style={{
          width: "100%", padding: "11px 0",
          background: "linear-gradient(135deg, #B71C1C, #C62828)",
          border: "none", borderRadius: 8,
          color: "white", fontSize: 12, cursor: "pointer",
          fontFamily: "'Noto Sans KR', monospace", letterSpacing: 1,
          boxShadow: "0 0 16px #FF525244",
        }}>
          다시 도전! 🔥
        </button>
      </div>
    </div>
  );
}

function ResultModal({ ui, playTime, onClose }) {
  const fmt = s => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const stars = ui.totalCaught >= 30 ? 3 : ui.totalCaught >= 15 ? 2 : ui.totalCaught >= 5 ? 1 : 0;
  const rows = [
    { label: "🏆 SCORE",       value: ui.score.toLocaleString(),     color: "#00E5FF" },
    { label: "총 포획수",      value: `${ui.totalCaught}마리`,       color: "#FFD740" },
    { label: "최고 콤보",      value: `${ui.maxCombo}콤보`,          color: "#FF80AB" },
    { label: "특별 몬스터",    value: `${ui.specialCaught}마리`,     color: "#FFD700" },
    { label: "최고 레벨",      value: `Lv.${ui.charLvl}`,           color: "#78B7FF" },
    { label: "플레이 시간",    value: fmt(playTime),                  color: "#90CAF9" },
  ];
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(4,9,22,0.97)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999,
    }}>
      <div style={{
        background: "linear-gradient(135deg, #0D1E3D, #1A2744)",
        border: "2px solid #FFD70077", borderRadius: 16,
        padding: "28px 28px 22px", textAlign: "center", width: 280,
        boxShadow: "0 0 50px #FFD70033",
        fontFamily: "'Noto Sans KR', monospace",
      }}>
        <div style={{ color: "#FFD700", fontSize: 13, marginBottom: 4, letterSpacing: 1 }}>
          📊 오늘의 모험 결과
        </div>
        <div style={{ fontSize: 28, marginBottom: 12, letterSpacing: 4 }}>
          {"⭐".repeat(stars)}{"☆".repeat(3 - stars)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
          {rows.map(r => (
            <div key={r.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "7px 14px",
            }}>
              <span style={{ color: "#90A4AE", fontSize: 11 }}>{r.label}</span>
              <span style={{ color: r.color, fontSize: 13, fontWeight: "bold", fontFamily: "monospace" }}>{r.value}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{
          width: "100%", padding: "11px 0",
          background: "linear-gradient(135deg, #1A2744, #263554)",
          border: "1px solid #FFD70055", borderRadius: 8,
          color: "#FFD700", fontSize: 12, cursor: "pointer",
          fontFamily: "'Noto Sans KR', monospace", letterSpacing: 1,
        }}>
          계속 모험! 🚀
        </button>
      </div>
    </div>
  );
}

function QuizModal({ quiz, onAnswer }) {
  const [input, setInput] = useState("");
  const opColor = quiz.op === "+" ? "#64B5F6" : "#FF8A65";

  const submit = () => {
    const num = parseInt(input, 10);
    if (!isNaN(num)) { onAnswer(num); setInput(""); }
  };

  useEffect(() => {
    const handler = (e) => {
      const idx = parseInt(e.key, 10);
      if (idx >= 1 && idx <= 4 && quiz.choices[idx - 1] !== undefined) {
        onAnswer(quiz.choices[idx - 1]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [quiz, onAnswer]);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(4,9,22,0.97)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999,
      touchAction: "none",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #0D1E3D, #1A2744)",
        border: `2px solid ${opColor}77`,
        borderRadius: 16, padding: "20px 20px",
        textAlign: "center", width: "min(300px, 90vw)",
        boxShadow: `0 0 40px ${opColor}44`,
        fontFamily: "'Noto Sans KR', monospace",
      }}>
        <div style={{ fontSize: 11, color: opColor, marginBottom: 4, letterSpacing: 1 }}>
          🧮 퀴즈 타임!
        </div>
        <div style={{ fontSize: 10, color: "#90A4AE", marginBottom: 12 }}>
          5마리 포획 달성! 정답을 맞춰야 계속할 수 있어요
        </div>

        <div style={{
          fontSize: 36, color: "white", fontWeight: "bold",
          marginBottom: 14, letterSpacing: 4,
          textShadow: `0 0 20px ${opColor}88`,
        }}>
          {quiz.a} <span style={{ color: opColor }}>{quiz.op}</span> {quiz.b} = ?
        </div>

        {quiz.wrong && (
          <div style={{
            color: "#FF5252", fontSize: 11, marginBottom: 8,
            animation: "pop 0.2s ease",
          }}>
            ❌ 틀렸어! 다시 해봐!
          </div>
        )}

        {/* 4지선다 — onPointerDown으로 모바일 300ms 딜레이 제거 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {quiz.choices.map((n, i) => (
            <button
              key={n}
              onPointerDown={(e) => { e.preventDefault(); onAnswer(n); }}
              style={{
                padding: "16px 0", fontSize: 22, fontWeight: "bold",
                background: quiz.wrong && n === quiz.answer
                  ? "rgba(105,240,174,0.25)" : "rgba(255,255,255,0.10)",
                border: quiz.wrong && n === quiz.answer
                  ? "2px solid #69F0AE" : `2px solid ${opColor}55`,
                borderRadius: 12, color: "#E8EAF6", cursor: "pointer",
                fontFamily: "monospace",
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
                userSelect: "none", WebkitUserSelect: "none",
              }}
            >
              <span style={{ fontSize: 11, opacity: 0.5, marginRight: 4 }}>{i + 1}</span>{n}
            </button>
          ))}
        </div>

        {/* 키보드 직접 입력 (선택사항) */}
        <div style={{ display: "flex", gap: 6 }}>
          <input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            style={{
              flex: 1, padding: "8px 0",
              fontSize: 18, textAlign: "center",
              background: "rgba(255,255,255,0.08)",
              border: quiz.wrong ? "2px solid #FF5252" : `2px solid ${opColor}44`,
              borderRadius: 8, color: "white",
              outline: "none",
              fontFamily: "monospace", boxSizing: "border-box",
            }}
            placeholder="직접 입력"
          />
          <button
            onPointerDown={(e) => { e.preventDefault(); submit(); }}
            style={{
              padding: "8px 14px", fontSize: 13, fontWeight: "bold",
              background: `${opColor}33`, border: `2px solid ${opColor}88`,
              borderRadius: 8, color: opColor, cursor: "pointer",
              fontFamily: "monospace",
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
            }}
          >확인</button>
        </div>
      </div>
    </div>
  );
}

function btnStyle(color) {
  return {
    background: `${color}22`, border: `2px solid ${color}`,
    color: color, padding: "20px 22px", borderRadius: 12,
    fontSize: 20, fontFamily: "'Press Start 2P', monospace",
    cursor: "pointer", touchAction: "none", minWidth: 70,
    boxShadow: `0 0 10px ${color}44`, transition: "all 0.08s",
    userSelect: "none", WebkitUserSelect: "none",
    WebkitTapHighlightColor: "transparent",
    WebkitTouchCallout: "none",
    outline: "none",
  };
}
