import { useState, useEffect, useRef } from "react";

// ── Game Constants ─────────────────────────────────────────
const GW = 540, GH = 390;
const GROUND_Y = GH - 58;
const PLAYER_H = 50;
const BALL_R = 11;
const MON_R = 28;

const MONSTERS = [
  { level: 1,  emoji: "🐛", name: "꼬물이",  rarity: "common"   },
  { level: 2,  emoji: "🐝", name: "꿀벌이",  rarity: "common"   },
  { level: 3,  emoji: "🦊", name: "여우린",  rarity: "common"   },
  { level: 4,  emoji: "🐰", name: "토실이",  rarity: "uncommon" },
  { level: 5,  emoji: "🦝", name: "너구리",  rarity: "uncommon" },
  { level: 6,  emoji: "🐯", name: "호랑이",  rarity: "rare"     },
  { level: 7,  emoji: "🦄", name: "유니콘",  rarity: "rare"     },
  { level: 8,  emoji: "🐲", name: "드래곤",  rarity: "epic"     },
  { level: 9,  emoji: "⚡", name: "번개신",  rarity: "epic"     },
  { level: 10, emoji: "🌟", name: "별이",    rarity: "legend"   },
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

function spawnMonster(ballLvl) {
  const min = Math.max(1, ballLvl - 1);
  const max = Math.min(10, ballLvl + 2);
  const lvl = Math.floor(Math.random() * (max - min + 1)) + min;
  const speed = 0.9 + lvl * 0.22;
  return {
    ...MONSTERS[lvl - 1],
    x: 70 + Math.random() * (GW - 140),
    y: 35 + Math.random() * (GROUND_Y * 0.50),
    vx: (Math.random() > 0.5 ? 1 : -1) * speed,
    vy: (Math.random() > 0.5 ? 0.5 : -0.5) * speed * 0.55,
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
    charLvl: 1, levelUpTimer: 0,
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
  });

  const [ui, setUi] = useState({
    ballLvl: 1, xp: 0, xpReq: XP_REQ[0],
    totalCaught: 0, message: "", msgOk: true,
    collection: [], ballName: BALL_NAMES[0],
    catchPct: 88, charLvl: 1,
  });

  const [quiz, setQuiz] = useState(null); // null | { a, b, answer, wrong }

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
      catchPct: pct,
      charLvl: s.charLvl,
    });
  }

  const msgTimeout = useRef(null);
  function showMsg(text, ok) {
    clearTimeout(msgTimeout.current);
    syncUi(text, ok);
    msgTimeout.current = setTimeout(() => {
      const s = gs.current;
      const req = XP_REQ[s.ballLvl - 1] === Infinity ? 999 : XP_REQ[s.ballLvl - 1];
      const mon = s.monster;
      const pct = mon ? Math.round(catchRate(s.ballLvl, mon.level) * 100) : 0;
      setUi(prev => ({ ...prev, message: "", xp: s.xp, xpReq: req, totalCaught: s.totalCaught, catchPct: pct, charLvl: s.charLvl }));
    }, 2200);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const s = gs.current;

    s.monster = spawnMonster(1);
    s.stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * GW,
      y: Math.random() * GROUND_Y * 0.78,
      r: Math.random() * 1.5 + 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    // ── draw bg (day/night cycle) ──
    function drawBg(t) {
      const cycleDuration = 120000; // 2-minute full cycle
      const cyclePos = (t % cycleDuration) / cycleDuration;
      // 0–0.45: day │ 0.45–0.55: dusk │ 0.55–0.95: night │ 0.95–1.0: dawn
      let dayBlend;
      if      (cyclePos < 0.45) dayBlend = 1;
      else if (cyclePos < 0.55) dayBlend = 1 - (cyclePos - 0.45) / 0.10;
      else if (cyclePos < 0.95) dayBlend = 0;
      else                      dayBlend = (cyclePos - 0.95) / 0.05;

      const lerp = (a, b, f) => Math.round(a + (b - a) * f);
      const lerpRGB = (c1, c2, f) =>
        `rgb(${lerp(c1[0],c2[0],f)},${lerp(c1[1],c2[1],f)},${lerp(c1[2],c2[2],f)})`;

      // Sky gradient
      const skyTop = lerpRGB([4, 9, 22],   [65, 130, 195], dayBlend);
      const skyBot = lerpRGB([13, 30, 61],  [155, 205, 240], dayBlend);
      const g = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      g.addColorStop(0, skyTop);
      g.addColorStop(1, skyBot);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, GW, GROUND_Y);

      // Stars (night only)
      const starAlpha = 1 - dayBlend;
      if (starAlpha > 0.05) {
        s.stars.forEach(st => {
          const a = starAlpha * (0.35 + 0.6 * Math.sin(t * 0.0015 + st.phase));
          ctx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Moon (night)
      if (dayBlend < 0.7) {
        const moonA = Math.min(1, (1 - dayBlend) * 1.5);
        ctx.globalAlpha = moonA;
        ctx.shadowColor = "#FFF9C4"; ctx.shadowBlur = 28;
        ctx.fillStyle = "#FFFFF0";
        ctx.beginPath(); ctx.arc(GW - 58, 42, 24, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = lerpRGB([4, 9, 22], [65, 130, 195], dayBlend);
        ctx.beginPath(); ctx.arc(GW - 48, 37, 19, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Sun (day)
      if (dayBlend > 0.15) {
        const sunA = Math.min(1, (dayBlend - 0.15) / 0.35);
        ctx.globalAlpha = sunA;
        ctx.shadowColor = "#FFD700"; ctx.shadowBlur = 40;
        ctx.fillStyle = "#FFE566";
        ctx.beginPath(); ctx.arc(80, 55, 26, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#FFD700aa"; ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
          const ang = (i * Math.PI) / 4 + t * 0.0003;
          ctx.beginPath();
          ctx.moveTo(80 + Math.cos(ang) * 32, 55 + Math.sin(ang) * 32);
          ctx.lineTo(80 + Math.cos(ang) * 44, 55 + Math.sin(ang) * 44);
          ctx.stroke();
        }
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
      }

      // Ground (brighter during day)
      const gBase = dayBlend > 0.5 ? "#1E5C14" : "#132A0C";
      const gTop  = dayBlend > 0.5 ? "#2E8020" : "#1E4A12";
      const gDet  = dayBlend > 0.5 ? "#3A9E28" : "#295E18";
      ctx.fillStyle = gBase;
      ctx.fillRect(0, GROUND_Y, GW, GH - GROUND_Y);
      ctx.fillStyle = gTop;
      ctx.fillRect(0, GROUND_Y, GW, 10);
      ctx.fillStyle = gDet;
      for (let i = 3; i < GW; i += 19) {
        const h = 4 + (i % 7);
        ctx.fillRect(i, GROUND_Y - h + 5, 2, h);
        ctx.fillRect(i + 7, GROUND_Y - h + 2, 2, h + 2);
        ctx.fillRect(i + 13, GROUND_Y - h + 6, 2, h - 2);
      }
    }

    // ── draw player ──
    function drawPlayer(px, shake) {
      const ox = shake > 0 ? (Math.random() - 0.5) * 5 : 0;
      const x = px + ox;
      const by = GROUND_Y - PLAYER_H;
      const theme = getCharTheme(s.charLvl);

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

      // Hat brim
      ctx.fillStyle = theme.hat;
      ctx.fillRect(x - 18, by + 2, 36, 8);
      // Hat top
      ctx.fillRect(x - 12, by - 11, 24, 14);

      // Lv50 gold star on hat
      if (s.charLvl >= 50) {
        ctx.fillStyle = "#FFD700";
        ctx.font = "10px serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("★", x, by - 4);
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
    }

    // ── draw flying ball ──
    function drawBall(bx, by) {
      const c = BALL_COLORS[s.ballLvl - 1];
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

    // ── draw monster ──
    function drawMonster(mon, t, catching) {
      const bob = catching ? 0 : Math.sin(t * 0.0023 + mon.x * 0.02) * 5;
      const mx = mon.x, my = mon.y + bob;
      const rc = RARITY_COLOR[mon.rarity];

      if (catching) {
        const pulse = 0.25 + 0.2 * Math.sin(t * 0.009);
        ctx.fillStyle = `rgba(255,220,50,${pulse})`;
        ctx.beginPath(); ctx.arc(mx, my, MON_R + 14, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.shadowColor = rc; ctx.shadowBlur = 8 + mon.level;
      }

      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.beginPath(); ctx.ellipse(mx, my + MON_R + 4, MON_R * 0.8, MON_R * 0.2, 0, 0, Math.PI * 2); ctx.fill();

      ctx.shadowBlur = 0;
      ctx.font = "42px serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(mon.emoji, mx, my);

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
      const c = BALL_COLORS[s.ballLvl - 1];
      for (let i = 0; i < 3; i++) {
        const a = t * 0.06 + (i * Math.PI * 2) / 3;
        const bx = mon.x + Math.cos(a) * 38;
        const by2 = mon.y + Math.sin(a) * 14;
        ctx.globalAlpha = 0.6 + 0.35 * Math.sin(a + t * 0.03);
        ctx.fillStyle = c;
        ctx.beginPath(); ctx.arc(bx, by2, 7, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bx - 7, by2); ctx.lineTo(bx + 7, by2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
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
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      s.phase = "quiz";
      setQuiz({ a, b, answer: a + b, wrong: false });
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

    function drawParticles() {
      s.particles = s.particles.filter(p => p.life > 0);
      s.particles.forEach(p => {
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.r *= 0.97; p.life--;
      });
      ctx.globalAlpha = 1;
    }

    // ── main loop ──
    function loop(t) {
      ctx.clearRect(0, 0, GW, GH);
      drawBg(t);

      if (s.levelUpTimer > 0) s.levelUpTimer--;

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
          const rate = catchRate(s.ballLvl, s.monster.level);
          const ok = Math.random() < rate;
          s.ball.active = false;

          if (ok) {
            spawnParticles(s.monster.x, s.monster.y, true);
            s.collection.push({ ...s.monster });
            s.totalCaught++;
            s.xp += s.monster.level;

            // Character level up check (every 10 catches, max level 50)
            const newCharLvl = Math.min(50, Math.floor(s.totalCaught / 10) + 1);
            if (newCharLvl > s.charLvl) {
              s.charLvl = newCharLvl;
              spawnLevelUpEffect(s.player.x, GROUND_Y - PLAYER_H);
              // Still process ball XP silently
              const req = XP_REQ[s.ballLvl - 1];
              if (s.ballLvl < 10 && req !== Infinity && s.xp >= req) {
                s.xp -= req;
                s.ballLvl = Math.min(10, s.ballLvl + 1);
              }
              showMsg(`🎊 캐릭터 Lv.${s.charLvl} 달성!`, true);
            } else {
              const req = XP_REQ[s.ballLvl - 1];
              if (s.ballLvl < 10 && req !== Infinity && s.xp >= req) {
                s.xp -= req;
                s.ballLvl = Math.min(10, s.ballLvl + 1);
                showMsg(`✨ 볼 Lv.${s.ballLvl}! ${BALL_NAMES[s.ballLvl-1]}!`, true);
              } else {
                showMsg(`🎉 ${s.monster.name} 포획!`, true);
              }
            }
          } else {
            spawnParticles(s.monster.x, s.monster.y, false);
            s.shake = 20;
            showMsg(`💨 ${s.monster.name} 도망갔다!`, false);
            const dir = s.monster.x < GW / 2 ? -1 : 1;
            s.monster.vx = dir * 7;
            s.monster.vy = -4;
            s.escapeAlpha = 1.0;
            s.phase = "escaping";
            s.raf = requestAnimationFrame(loop); return;
          }

          s.phase = "playing";
          s.monster = spawnMonster(s.ballLvl);

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
          s.monster = spawnMonster(s.ballLvl);
        }

      } else {
        if (s.keys.has("ArrowLeft"))  s.player.x = Math.max(22, s.player.x - 5);
        if (s.keys.has("ArrowRight")) s.player.x = Math.min(GW - 22, s.player.x + 5);

        if (s.ball.active) {
          s.ball.y -= 9;
          if (s.ball.y < -20) {
            s.ball.active = false;
            showMsg("놓쳤다! 다시 도전!", false);
          }
          if (s.monster) {
            const dx = s.ball.x - s.monster.x;
            const dy = s.ball.y - s.monster.y;
            if (Math.sqrt(dx * dx + dy * dy) < MON_R + BALL_R + 6) {
              s.phase = "catching";
              s.catchTimer = 0;
            }
          }
        }

        if (s.monster) {
          s.monster.x += s.monster.vx;
          s.monster.y += s.monster.vy;
          const maxY = GROUND_Y * 0.60;
          if (s.monster.x < MON_R || s.monster.x > GW - MON_R) s.monster.vx *= -1;
          if (s.monster.y < 22   || s.monster.y > maxY)        s.monster.vy *= -1;
          s.monster.x = Math.max(MON_R, Math.min(GW - MON_R, s.monster.x));
          s.monster.y = Math.max(22,    Math.min(maxY,        s.monster.y));
        }

        if (s.monster) drawMonster(s.monster, t, false);
        if (s.ball.active) drawBall(s.ball.x, s.ball.y);
        drawParticles();
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
        s.ball = { x: s.player.x, y: GROUND_Y - PLAYER_H + 8, active: true };
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
  }, []);

  // touch controls
  const holdRef = useRef(null);
  const stopMove = () => cancelAnimationFrame(holdRef.current);
  const startMove = (dir) => {
    const step = () => {
      const s = gs.current;
      s.player.x = dir === "L"
        ? Math.max(22, s.player.x - 6)
        : Math.min(GW - 22, s.player.x + 6);
      holdRef.current = requestAnimationFrame(step);
    };
    holdRef.current = requestAnimationFrame(step);
  };
  const doThrow = () => {
    const s = gs.current;
    if (!s.ball.active && s.phase === "playing") {
      s.ball = { x: s.player.x, y: GROUND_Y - PLAYER_H + 8, active: true };
    }
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

  const pct = ui.catchPct;
  const pctColor = pct >= 80 ? "#69F0AE" : pct >= 50 ? "#FFD740" : pct >= 25 ? "#FF9800" : "#FF5252";

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
        .touch-btn:active { transform:scale(0.93); filter:brightness(1.3); }
      `}</style>

      {/* Title */}
      <h1 style={{
        color: "#FFD700", fontSize: 20, margin: "0 0 14px",
        textShadow: "3px 3px 0 #7A5C00, 0 0 24px #FFD70077",
        animation: "glow 3s ease infinite", letterSpacing: 2,
        fontFamily: "'Noto Sans KR', 'Press Start 2P', monospace",
      }}>
        🌟 준이 캐치 🌟
      </h1>

      {/* Stats panel */}
      <div style={{
        display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap", justifyContent: "center",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${bc}44`,
        borderRadius: 10, padding: "8px 16px",
        boxShadow: `0 0 16px ${bc}22`,
      }}>
        <StatBox label="캐릭터" value={`Lv.${ui.charLvl}`} sub={`/ 50`} color={charTheme.accent || "#78B7FF"} />
        <div style={{ width: 1, background: "#ffffff15", margin: "0 4px" }} />
        <StatBox label="BALL" value={`★ Lv.${ui.ballLvl}`} sub={ui.ballName} color={bc} />
        <div style={{ width: 1, background: "#ffffff15", margin: "0 4px" }} />
        <StatBox label="포획수" value={ui.totalCaught} color="#FFD740" />
        <div style={{ width: 1, background: "#ffffff15", margin: "0 4px" }} />
        <StatBox label="확률" value={`${pct}%`} color={pctColor} />
      </div>

      {/* XP bar */}
      <div style={{ width: Math.min(GW, 520), marginBottom: 6, maxWidth: "95vw" }}>
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
      <div style={{ height: 32, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
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
      <div style={{ position: "relative", display: "inline-block", maxWidth: "95vw" }}>
        <canvas ref={canvasRef} width={GW} height={GH} style={{
          display: "block", maxWidth: "95vw",
          border: `2px solid ${bc}66`,
          borderRadius: 8,
          boxShadow: `0 0 30px ${bc}22, 0 8px 32px rgba(0,0,0,0.7)`,
        }} />
        {quiz && (
          <QuizModal quiz={quiz} onAnswer={handleQuizAnswer} />
        )}
      </div>

      {/* Touch controls */}
      <div style={{ display: "flex", gap: 14, marginTop: 10, alignItems: "center" }}>
        <button className="touch-btn"
          onPointerDown={() => startMove("L")} onPointerUp={stopMove} onPointerLeave={stopMove}
          style={btnStyle("#1565C0")}>◀</button>
        <button className="touch-btn"
          onPointerDown={doThrow} onPointerUp={() => {}}
          style={{ ...btnStyle(bc), minWidth: 130, fontSize: 10,
            boxShadow: `0 0 20px ${bc}66`,
            background: `linear-gradient(135deg, ${bc}33, ${bc}55)`,
          }}>
          ⚡ 던지기!
        </button>
        <button className="touch-btn"
          onPointerDown={() => startMove("R")} onPointerUp={stopMove} onPointerLeave={stopMove}
          style={btnStyle("#1565C0")}>▶</button>
      </div>

      {/* Keyboard hint */}
      <div style={{ color: "#4A6080", fontSize: 7, marginTop: 6, textAlign: "center", lineHeight: 2.2, fontFamily: "'Noto Sans KR', monospace" }}>
        ← → 이동  •  SPACE 던지기  •  10마리 포획마다 캐릭터 레벨업!
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
    <div style={{ textAlign: "center", minWidth: 70 }}>
      <div style={{ color: "#3A4A64", fontSize: 7, marginBottom: 3 }}>{label}</div>
      <div style={{ color, fontSize: 12, textShadow: `0 0 8px ${color}88` }}>{value}</div>
      {sub && <div style={{ color: "#445", fontSize: 7, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function QuizModal({ quiz, onAnswer }) {
  const [input, setInput] = useState("");

  const submit = () => {
    const num = parseInt(input, 10);
    if (!isNaN(num)) onAnswer(num);
  };

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "rgba(4,9,22,0.92)",
      display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: 8, zIndex: 10,
    }}>
      <div style={{
        background: "linear-gradient(135deg, #0D1E3D, #1A2744)",
        border: "2px solid #FFD70077",
        borderRadius: 16, padding: "28px 32px",
        textAlign: "center", width: 280,
        boxShadow: "0 0 40px #FFD70044",
        fontFamily: "'Noto Sans KR', monospace",
      }}>
        <div style={{ fontSize: 11, color: "#FFD700", marginBottom: 6, letterSpacing: 1 }}>
          🧮 퀴즈 타임!
        </div>
        <div style={{ fontSize: 10, color: "#90A4AE", marginBottom: 20 }}>
          5마리 포획 달성! 정답을 맞춰야 계속할 수 있어요
        </div>

        <div style={{
          fontSize: 38, color: "white", fontWeight: "bold",
          marginBottom: 20, letterSpacing: 4,
          textShadow: "0 0 20px #FFD70088",
        }}>
          {quiz.a} + {quiz.b} = ?
        </div>

        <input
          type="number"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          autoFocus
          style={{
            width: "100%", padding: "10px 0",
            fontSize: 28, textAlign: "center",
            background: "rgba(255,255,255,0.08)",
            border: quiz.wrong ? "2px solid #FF5252" : "2px solid #1E88E5",
            borderRadius: 8, color: "white",
            outline: "none", marginBottom: 12,
            fontFamily: "monospace",
            boxSizing: "border-box",
          }}
          placeholder="?"
        />

        {quiz.wrong && (
          <div style={{
            color: "#FF5252", fontSize: 11, marginBottom: 10,
            animation: "pop 0.2s ease",
          }}>
            ❌ 틀렸어! 다시 해봐!
          </div>
        )}

        <button
          onClick={submit}
          style={{
            width: "100%", padding: "12px 0",
            background: "linear-gradient(135deg, #1565C0, #1E88E5)",
            border: "none", borderRadius: 8,
            color: "white", fontSize: 14, fontWeight: "bold",
            cursor: "pointer", letterSpacing: 1,
            fontFamily: "'Noto Sans KR', monospace",
            boxShadow: "0 0 16px #1E88E544",
          }}
        >
          확인 ✓
        </button>

        {/* 숫자 패드 (모바일용) */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
          gap: 6, marginTop: 14,
        }}>
          {Array.from({ length: 19 }, (_, i) => i).map(n => (
            <button key={n} onClick={() => onAnswer(n)} style={{
              padding: "8px 0", fontSize: 13, fontWeight: "bold",
              background: n === quiz.answer && quiz.wrong
                ? "rgba(105,240,174,0.15)" : "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 6, color: "#CFD8DC", cursor: "pointer",
              fontFamily: "monospace",
            }}>
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function btnStyle(color) {
  return {
    background: `${color}22`, border: `2px solid ${color}`,
    color: color, padding: "12px 16px", borderRadius: 8,
    fontSize: 16, fontFamily: "'Press Start 2P', monospace",
    cursor: "pointer", touchAction: "none", minWidth: 52,
    boxShadow: `0 0 10px ${color}44`, transition: "all 0.1s",
  };
}
