"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, type Variants } from "motion/react";
import { Cormorant_Garamond, Outfit } from "next/font/google";

/* ───────── edit these ───────── */
const NAME = "MANDIRA 'MY LOVE'";
const FROM = "SOMNATH";
const MESSAGES = [
  "Your laugh is my favourite sound, and I'm still trying to cause it more often.",
  "You are the person I love most in my life..",
  `I don't need a perfect plan for the future. I just need you in it. — ${FROM}`,
];
// Put images in /public/images and set src: "/images/1.jpg". Empty src shows a placeholder.
const PHOTOS = [
  { src: "/images/1.jpg", cap: "My favourite you", emoji: "📸", g: "from-[#ff8fab] to-[#c8b6ff]" },
  { src: "/images/2.jpg", cap: "My favourite you", emoji: "🌅", g: "from-[#ffd6a5] to-[#ff8fab]" },
  { src: "/images/3.jpg", cap: "Love it", emoji: "😜", g: "from-[#bde0fe] to-[#c8b6ff]" },
  { src: "/images/4.jpg", cap: "My favourite you", emoji: "💞", g: "from-[#c8b6ff] to-[#ff5d8f]" },
  { src: "/images/5.jpg", cap: "Love it", emoji: "📸", g: "from-[#ff8fab] to-[#c8b6ff]" },
  { src: "/images/6.jpg", cap: "My favourite you", emoji: "🌅", g: "from-[#ffd6a5] to-[#ff8fab]" },
  { src: "/images/7.jpg", cap: "Love it", emoji: "😜", g: "from-[#bde0fe] to-[#c8b6ff]" },
  { src: "/images/8.jpg", cap: "My favourite you", emoji: "💞", g: "from-[#c8b6ff] to-[#ff5d8f]" },
];
// Image cut into pieces for the puzzle. Any photo in /public/images (a square one works best).
const PUZZLE_SRC = "/images/1.jpg";
const PUZZLE_N = 3; // 3 = 3x3 pieces, 4 = 4x4 (harder)
/* ────────────────────────────── */

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "500"], style: ["normal", "italic"] });
const sans = Outfit({ subsets: ["latin"], weight: ["300", "400"] });
const COLORS = ["#ff8fab", "#c8b6ff", "#ffd6a5", "#bde0fe", "#fff1f2", "#ff5d8f"];
const STAGES = ["gate", "cake", "wish", "photos", "puzzle", "tree", "propose"] as const;
type Stage = (typeof STAGES)[number];

const pill = "rounded-full bg-[#ff8fab] px-9 py-3.5 text-base font-normal text-[#150d20]";

/* ── letters rise in one by one ── */
const wordV: Variants = { show: { transition: { staggerChildren: 0.05 } } };
const letterV: Variants = {
  hidden: { y: "110%", rotate: 8, opacity: 0 },
  show: { y: 0, rotate: 0, opacity: 1, transition: { type: "spring", damping: 14, stiffness: 120 } },
};
function Letters({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.span variants={wordV} initial="hidden" animate="show" transition={{ delayChildren: delay }} className="inline-flex flex-wrap justify-center">
      {text.split(" ").map((w, wi) => (
        <span key={wi} className="mx-[0.12em] inline-flex whitespace-nowrap">
          {w.split("").map((c, i) => (
            <span key={i} className="inline-block overflow-hidden pb-2">
              <motion.span variants={letterV} className="inline-block">{c}</motion.span>
            </span>
          ))}
        </span>
      ))}
    </motion.span>
  );
}

function Background() {
  const [stars, setStars] = useState<{ x: number; y: number; s: number; d: number }[]>([]);
  useEffect(() => {
    setStars(Array.from({ length: 80 }, () => ({ x: Math.random() * 100, y: Math.random() * 100, s: 1 + Math.random() * 2, d: Math.random() * 4 })));
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#150d20]">
      <motion.div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#ff8fab]/25 blur-3xl" animate={{ x: [0, 120, 0], y: [0, 80, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute -bottom-40 -right-40 h-[34rem] w-[34rem] rounded-full bg-[#c8b6ff]/25 blur-3xl" animate={{ x: [0, -140, 0], y: [0, -90, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />
      {stars.map((s, i) => (
        <motion.span key={i} className="absolute rounded-full bg-white" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s }} animate={{ opacity: [0.15, 1, 0.15] }} transition={{ duration: 3 + s.d, repeat: Infinity, delay: s.d }} />
      ))}
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        id: i, x: (Math.random() - 0.5) * Math.min(1000, window.innerWidth * 1.4), up: -(window.innerHeight * (0.25 + Math.random() * 0.4)), r: (Math.random() - 0.5) * 1080,
        c: COLORS[i % COLORS.length], w: 6 + Math.random() * 8, round: i % 3 === 0,
      })),
    []
  );
  return (
    <div className="pointer-events-none fixed left-1/2 top-1/2 z-50">
      {pieces.map((p) => (
        <motion.span key={p.id} className="absolute" style={{ width: p.w, height: p.round ? p.w : p.w * 2, background: p.c, borderRadius: p.round ? 999 : 2 }}
          initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: p.x, y: [0, p.up, p.up + 900], rotate: p.r, opacity: [1, 1, 0] }}
          transition={{ duration: 3, ease: "easeOut", times: [0, 0.4, 1] }} />
      ))}
    </div>
  );
}

/* ── stage 2: cake (builds itself, then floats) ── */
function Balloons({ popped }: { popped: boolean }) {
  const items = useMemo(
    () => Array.from({ length: 8 }, (_, i) => ({
      left: i % 2 ? 78 + Math.random() * 14 : 3 + Math.random() * 14,
      top: 6 + Math.random() * 48, c: COLORS[i % COLORS.length], d: i * 0.25, bob: 3 + Math.random() * 2,
    })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {items.map((b, i) => (
        <motion.div key={i} className="absolute" style={{ left: `${b.left}%`, top: `${b.top}%` }} initial={{ y: "110vh" }}
          animate={popped ? { scale: 1.5, opacity: 0 } : { y: 0 }}
          transition={popped ? { duration: 0.25, delay: i * 0.08 } : { type: "spring", damping: 18, stiffness: 30, delay: b.d }}>
          <motion.div className="relative h-12 w-10 sm:h-16 sm:w-[3.2rem] rounded-[50%_50%_50%_50%/55%_55%_45%_45%]"
            style={{ background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,.55), transparent 35%), ${b.c}` }}
            animate={{ y: [-8, 10], rotate: [-4, 4] }} transition={{ duration: b.bob, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: b.d + 1 }}>
            <span className="absolute left-1/2 top-full h-20 w-px bg-white/30" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

function Drips({ n, base }: { n: number; base: number }) {
  return (
    <div className="absolute inset-x-0 top-0 flex h-5 justify-around bg-[#fff1f2]">
      {Array.from({ length: n }, (_, i) => (
        <motion.span key={i} className="h-9 w-5 rounded-b-full bg-[#fff1f2]" style={{ originY: 0 }}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.6, delay: base + i * 0.08, ease: "easeOut" }} />
      ))}
    </div>
  );
}

const land = (delay: number) => ({
  initial: { y: -700, opacity: 0, scaleX: 1, scaleY: 1 },
  animate: { y: [-700, 0, 0, 0], opacity: [0, 1, 1, 1], scaleX: [1, 1, 1.06, 1], scaleY: [1, 1, 0.88, 1] },
  transition: { duration: 0.9, delay, times: [0, 0.6, 0.72, 1], ease: ["easeIn", "easeOut", "easeOut"] as ("easeIn" | "easeOut")[] },
});

function CakeStage({ onDone }: { onDone: () => void }) {
  const [blown, setBlown] = useState(false);
  const [ready, setReady] = useState(false);
  const sprinkles = useMemo(() => Array.from({ length: 30 }, (_, i) => ({ x: 4 + Math.random() * 92, y: 30 + Math.random() * 60, r: Math.random() * 180, c: COLORS[i % COLORS.length], d: 1.1 + Math.random() * 0.7 })), []);
  const sparks = useMemo(() => Array.from({ length: 14 }, () => ({ x: -12 + Math.random() * 124, y: -30 + Math.random() * 130, s: 10 + Math.random() * 14, d: 4.4 + Math.random() * 2 })), []);
  const blow = () => { setBlown(true); setTimeout(() => setReady(true), 1800); };

  return (
    <div className="relative z-10 w-full text-center">
      <Balloons popped={blown} />
      {blown && <Confetti />}
      <h1 className={`${serif.className} text-[clamp(2.4rem,9vw,5rem)] font-light italic leading-tight`}>
        <Letters text="Happy Birthday," delay={0.1} />
        <br />
        <Letters text={`${NAME}.`} delay={0.9} />
      </h1>

      {/* idle float once the cake is built */}
      <div className="mt-12 origin-top sm:mt-20 [@media(max-height:700px)]:mt-14 [@media(max-height:700px)]:-mb-11 [@media(max-height:700px)]:scale-[.8] [@media(max-height:600px)]:mt-10 [@media(max-height:600px)]:-mb-20 [@media(max-height:600px)]:scale-[.65]"><motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 5 }}>
        <motion.button onClick={blow} disabled={blown} aria-label="Blow out the candles" className="relative mx-auto block cursor-pointer outline-none"
          whileHover={blown ? undefined : { scale: 1.04 }} whileTap={blown ? undefined : { scale: 0.96 }}>
          {/* sparkles around the cake */}
          <div className="pointer-events-none absolute -inset-x-10 -top-14 bottom-0">
            {sparks.map((s, i) => (
              <motion.span key={i} className="absolute text-[#fff3b0]" style={{ left: `${s.x}%`, top: s.y, fontSize: s.s }}
                initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0], scale: [0.3, 1, 0.3], rotate: [0, 90] }} transition={{ duration: 2, repeat: Infinity, delay: s.d }}>✦</motion.span>
            ))}
          </div>

          {/* candles pop in one by one, lit */}
          <div className="absolute -top-16 left-1/2 flex -translate-x-1/2 gap-8">
            {[0, 1, 2].map((i) => (
              <motion.div key={i} className="relative flex flex-col items-center" initial={{ scale: 0, y: -40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 9, stiffness: 160, delay: 3.4 + i * 0.15 }}>
                <AnimatePresence>
                  {!blown ? (
                    <motion.span key="f" className="mb-1 h-6 w-3.5 origin-bottom rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-t from-[#ff9f43] to-[#fff3b0] shadow-[0_0_24px_8px_rgba(255,200,100,0.55)]"
                      animate={{ scaleY: [1, 1.2, 0.92, 1.15, 1], rotate: [-4, 4, -2, 3, -4] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2 }}
                      exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }} />
                  ) : (
                    <motion.span key="s" className="absolute -top-2 h-3 w-3 rounded-full bg-white/50 blur-sm" initial={{ y: 0, opacity: 0.8, scale: 0.6 }}
                      animate={{ y: -70, x: (i - 1) * 14, opacity: 0, scale: 2.4 }} transition={{ duration: 2, ease: "easeOut" }} />
                  )}
                </AnimatePresence>
                <span className="h-12 w-2.5 rounded-sm bg-gradient-to-b from-[#bde0fe] to-[#8ecae6]" />
              </motion.div>
            ))}
          </div>

          {/* four tiers fall in one after another */}
          {[
            { w: "w-[7.5rem]", h: "h-11", bg: "bg-[#bde0fe]", r: "rounded-t-2xl", n: 3, land: 2.5, sp: false },
            { w: "w-[10.5rem]", h: "h-[3.25rem]", bg: "bg-[#ffd6a5]", r: "", n: 4, land: 1.8, sp: false },
            { w: "w-[13.5rem]", h: "h-14", bg: "bg-[#c8b6ff]", r: "", n: 5, land: 1.1, sp: false },
            { w: "w-64", h: "h-16", bg: "bg-[#ff8fab]", r: "rounded-b-2xl", n: 7, land: 0.4, sp: true },
          ].map((t, k) => (
            <motion.div key={k} className={`relative mx-auto overflow-hidden ${t.w} ${t.h} ${t.bg} ${t.r}`} style={{ originY: 1 }} {...land(t.land)}>
              <Drips n={t.n} base={t.land + 0.55} />
              {t.sp && sprinkles.map((s, i) => (
                <motion.span key={i} className="absolute h-2.5 w-[3px] rounded-sm" style={{ left: `${s.x}%`, top: `${s.y}%`, background: s.c, rotate: s.r }}
                  initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: s.d + 0.4 }} />
              ))}
            </motion.div>
          ))}
          {/* plate slides out */}
          <motion.div className="mx-auto -mt-1 h-2 w-72 rounded-full bg-white/70" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }} />
        </motion.button>
      </motion.div></div>

      <motion.p key={String(blown)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: blown ? 0.2 : 4.6 }} className="mt-9 text-[#c8b6ff]">
        {blown ? "Make a wish." : "Tap the cake to blow out the candles."}
      </motion.p>
      <motion.button onClick={onDone} className={`${pill} mt-7`} initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} style={{ pointerEvents: ready ? "auto" : "none" }} whileHover={{ scale: 1.08 }}>
        Make a wish ›
      </motion.button>
    </div>
  );
}

/* ── stage 3: wishes, one at a time ── */
function WishStage({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const last = i === MESSAGES.length - 1;
  return (
    <div className="flex max-w-xl flex-col items-center text-center">
      <div className="flex min-h-36 items-center">
        <AnimatePresence mode="wait">
          <motion.p key={i} className={`${serif.className} text-[clamp(1.8rem,6vw,2.6rem)] font-light leading-snug`}
            initial={{ opacity: 0, y: 24, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -24, filter: "blur(12px)" }} transition={{ duration: 0.6 }}>
            {MESSAGES[i]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="mt-5 flex gap-2">
        {MESSAGES.map((_, d) => <motion.span key={d} className="h-2 w-2 rounded-full" animate={{ scale: d === i ? 1.5 : 1, backgroundColor: d === i ? "#ff8fab" : "rgba(255,255,255,0.25)" }} />)}
      </div>
      <motion.button onClick={() => (last ? onDone() : setI(i + 1))} className={`${pill} mt-7`} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}>
        {last ? "Our memories ›" : "Next ›"}
      </motion.button>
    </div>
  );
}

/* ── stage 4: polaroid stack, tap to flip through ── */
const ROTS = [-4, 5, -7, 6, -3, 4];
function PhotoStage({ onDone }: { onDone: () => void }) {
  const [order, setOrder] = useState(PHOTOS.map((_, i) => i));
  const [flying, setFlying] = useState<number | null>(null);
  const [intro, setIntro] = useState(true);

  // stagger delay only for the first entrance
  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const flip = (id: number) => {
    if (flying !== null) return;
    setFlying(id);
    // don't rely on onAnimationComplete: move the card to the back on a timer
    setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setFlying(null);
    }, 350);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[min(52dvh,330px)] w-[min(70vw,260px)]">
        {PHOTOS.map((p, id) => {
          const pos = order.indexOf(id);
          const isFly = flying === id;
          return (
            <motion.div
              key={id}
              onClick={() => pos === 0 && flip(id)}
              className="absolute inset-0 flex cursor-pointer flex-col rounded-md bg-white px-3 pt-3 text-[#2a1a33] shadow-2xl"
              style={{ zIndex: PHOTOS.length - pos }}
              initial={{ y: 400, opacity: 0, rotate: 0 }}
              animate={
                isFly
                  ? { x: 340, y: 0, rotate: 30, opacity: 0, scale: 1 }
                  : { x: 0, y: pos * 8, rotate: ROTS[pos % ROTS.length], scale: 1 - pos * 0.04, opacity: 1 }
              }
              transition={
                isFly
                  ? { duration: 0.35, ease: "easeIn" }
                  : { type: "spring", damping: 16, stiffness: 120, delay: intro ? id * 0.12 : 0 }
              }
            >
              <div
                className={`flex flex-1 items-center justify-center rounded-sm bg-gradient-to-br text-6xl ${p.g}`}
                style={p.src ? { backgroundImage: `url(${p.src})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
              >
                {!p.src && p.emoji}
              </div>
              <p className={`${serif.className} py-3 text-xl italic`}>{p.cap}</p>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-[#c8b6ff]">Tap a photo to flip through</p>
      <motion.button onClick={onDone} className={`${pill} mt-6`} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}>
        One more thing ›
      </motion.button>
    </div>
  );
}

/* ── stage 5: picture puzzle (tap two pieces to swap them) ── */
function shufflePieces(n: number) {
  const total = n * n;
  let a: number[];
  do {
    a = Array.from({ length: total }, (_, i) => i);
    for (let i = total - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  } while (a.every((p, i) => p === i));
  return a;
}

function PuzzleStage({ onDone }: { onDone: () => void }) {
  const N = PUZZLE_N;
  const [tiles, setTiles] = useState<number[]>(() => shufflePieces(N));
  const [sel, setSel] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [bursts, setBursts] = useState<BurstT[]>([]);
  const [cKey, setCKey] = useState(0);
  const boardRef = useRef<HTMLDivElement>(null);
  const solved = tiles.every((p, i) => p === i);
  const addBurst = (x: number, y: number) => setBursts((b) => [...b, { id: Math.random(), x, y, big: true }]);

  // blast: flash, confetti x3, firework hearts around the picture, heart rain
  useEffect(() => {
    if (!solved) return;
    setCKey(1);
    const t1 = setTimeout(() => setCKey(2), 700);
    const t2 = setTimeout(() => setCKey(3), 1500);
    const r = boardRef.current?.getBoundingClientRect();
    if (r) addBurst(r.left + r.width / 2, r.top + r.height / 2);
    const iv = setInterval(() => {
      const b = boardRef.current?.getBoundingClientRect();
      if (!b) return;
      addBurst(b.left + Math.random() * b.width, b.top + Math.random() * b.height);
    }, 450);
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(iv); };
  }, [solved]);

  const tap = (pos: number) => {
    if (solved) return;
    if (sel === null) return setSel(pos);
    if (sel === pos) return setSel(null);
    setTiles((t) => {
      const n = [...t];
      [n[sel], n[pos]] = [n[pos], n[sel]];
      return n;
    });
    setMoves((m) => m + 1);
    setSel(null);
  };
  const reshuffle = () => { setTiles(shufflePieces(N)); setSel(null); setMoves(0); };

  return (
    <div className="flex flex-col items-center">
      {solved && (
        <>
          <motion.div className="pointer-events-none fixed inset-0 z-[65] bg-white" initial={{ opacity: 0.85 }} animate={{ opacity: 0 }} transition={{ duration: 0.7 }} />
          {cKey > 0 && <Confetti key={cKey} />}
          <HeartRain />
        </>
      )}
      {bursts.map((b) => <Burst key={b.id} {...b} onDone={() => setBursts((all) => all.filter((x) => x.id !== b.id))} />)}

      <motion.h2 className={`${serif.className} mb-1 text-[clamp(1.8rem,7vw,2.6rem)] font-light italic`}
        key={String(solved)} initial={{ scale: solved ? 0.3 : 1, opacity: 0 }}
        animate={solved ? { scale: [0.3, 1.25, 1], opacity: 1, rotate: [-6, 4, 0] } : { scale: 1, opacity: 1 }}
        transition={{ duration: solved ? 0.8 : 0.4 }}>
        {solved ? "You did it ♥" : "Put us back together"}
      </motion.h2>
      <p className="mb-4 text-sm text-[#c8b6ff]">
        {solved ? `Solved in ${moves} moves` : "Tap one piece, then another to swap them"}
      </p>

      <div ref={boardRef} className="relative aspect-square w-[min(84vw,320px,calc(48dvh))]">
        {/* glowing pulse behind the picture once it is complete */}
        {solved && (
          <motion.div className="pointer-events-none absolute -inset-3 rounded-xl bg-gradient-to-br from-[#ff8fab] to-[#c8b6ff] blur-xl"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: [0, 0.9, 0.5], scale: [0.9, 1.15, 1.08] }} transition={{ duration: 1.2 }} />
        )}
        <motion.div className={`relative grid h-full w-full overflow-hidden rounded-md bg-white/10 shadow-2xl ${solved ? "gap-0" : "gap-[3px]"}`}
          style={{ gridTemplateColumns: `repeat(${N}, 1fr)`, gridTemplateRows: `repeat(${N}, 1fr)` }}
          animate={solved ? { scale: [1, 1.1, 1], rotate: [0, -2, 2, 0] } : { scale: 1 }} transition={{ duration: 0.9, delay: 0.3 }}>
          {tiles.map((piece, pos) => {
            const r = Math.floor(piece / N), c = piece % N;
            return (
              <motion.button key={piece} layout
                transition={solved ? { duration: 0.5, delay: pos * 0.05 } : { type: "spring", damping: 20, stiffness: 260 }}
                onClick={() => tap(pos)} aria-label={`Puzzle piece ${pos + 1}`}
                className={`relative cursor-pointer bg-gradient-to-br from-[#ff8fab] to-[#c8b6ff] outline-none ${sel === pos ? "z-10 ring-2 ring-inset ring-white" : ""}`}
                style={{
                  backgroundImage: `url(${PUZZLE_SRC})`,
                  backgroundSize: `${N * 100}% ${N * 100}%`,
                  backgroundPosition: `${(c / (N - 1)) * 100}% ${(r / (N - 1)) * 100}%`,
                }}
                animate={solved ? { scale: [1, 1.18, 1] } : { scale: sel === pos ? 0.93 : 1 }} />
            );
          })}
        </motion.div>
        {/* shine sweeping across the finished picture */}
        {solved && (
          <motion.div className="pointer-events-none absolute inset-0 overflow-hidden rounded-md">
            <motion.div className="absolute -inset-y-4 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent"
              initial={{ x: "-150%" }} animate={{ x: "450%" }} transition={{ duration: 1.1, delay: 0.9, ease: "easeInOut" }} />
          </motion.div>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3">
        {!solved && (
          <button onClick={reshuffle} className="rounded-full border border-[#c8b6ff]/50 px-6 py-2.5 text-sm text-[#c8b6ff]">Shuffle</button>
        )}
      </div>
      <motion.button onClick={onDone} className={`${pill} mt-5`} initial={{ opacity: 0 }} animate={{ opacity: solved ? 1 : 0 }}
        transition={{ delay: solved ? 1.5 : 0 }} style={{ pointerEvents: solved ? "auto" : "none" }} whileHover={{ scale: 1.08 }}>
        One more thing ›
      </motion.button>
      {!solved && (
        <button onClick={onDone} className="mt-3 text-xs text-white/40 underline">Skip</button>
      )}
    </div>
  );
}

/* ── stage 6: the heart tree ── */
function canopy(n: number) {
  const pts: { x: number; y: number }[] = [];
  while (pts.length < n) {
    const u = Math.random() * 2.6 - 1.3, v = Math.random() * 2.4 - 1.1;
    if (Math.pow(u * u + v * v - 1, 3) - u * u * Math.pow(v, 3) <= 0) pts.push({ x: 50 + u * 27, y: 40 - v * 22 });
  }
  return pts.sort((a, b) => b.y - a.y); // bottom hearts bloom first
}
type Fall = { id: number; x: number; y: number; dx: number; dy: number; c: string; s: number };

const num = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
const bez = (d: string, t: number): [number, number] => {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = num(d), u = 1 - t;
  return [u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3, u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3];
};
// 7 main branches + 14 twigs; `orn` hangs a swinging heart ornament on that twig
const BRANCHES: { d: string; w: number; t: number; tw: { d: string; orn?: boolean }[] }[] = [
  { d: "M170 340 C145 325 125 300 100 268", w: 6, t: 1.9, tw: [{ d: "M135 310 C120 305 105 300 88 292", orn: true }] },
  { d: "M170 332 C198 315 222 292 245 260", w: 6, t: 2.0, tw: [{ d: "M209 302 C224 300 238 294 254 284", orn: true }] },
  { d: "M168 312 C150 290 132 262 112 228", w: 5, t: 2.1, tw: [{ d: "M141 275 C128 272 112 266 96 254", orn: true }, { d: "M112 228 C100 220 90 208 84 192" }] },
  { d: "M172 308 C190 285 208 255 228 222", w: 5, t: 2.2, tw: [{ d: "M199 269 C212 266 228 258 244 244", orn: true }, { d: "M228 222 C240 214 250 202 256 186" }] },
  { d: "M169 295 C158 265 142 232 128 190", w: 4.5, t: 2.3, tw: [{ d: "M150 247 C138 238 124 226 108 210", orn: true }, { d: "M128 190 C122 176 120 162 124 148" }] },
  { d: "M171 292 C182 262 198 230 212 190", w: 4.5, t: 2.4, tw: [{ d: "M190 245 C202 236 218 224 234 208", orn: true }, { d: "M212 190 C220 176 222 162 218 148" }] },
  { d: "M170 290 C168 255 170 215 170 150", w: 4, t: 2.5, tw: [{ d: "M169 231 C156 222 144 208 136 188" }, { d: "M170 215 C182 206 192 192 198 172" }, { d: "M170 150 C160 142 152 130 148 116" }, { d: "M170 150 C180 142 188 130 192 116" }] },
];
const TREE_CSS =
  ".bsw{transform-box:view-box;animation:bsway 3s ease-in-out infinite}@keyframes bsway{0%,100%{rotate:0deg}25%{rotate:2.5deg}75%{rotate:-2.5deg}}" +
  ".orn{transform-box:view-box;opacity:0;animation:ornin .5s both,oswing 2.4s ease-in-out infinite}@keyframes ornin{to{opacity:1}}@keyframes oswing{0%,100%{rotate:-12deg}50%{rotate:12deg}}";

function TreeStage({ onDone }: { onDone: () => void }) {
  const hearts = useMemo(() => canopy(150).map((p) => ({ ...p, s: 14 + Math.random() * 14, c: COLORS[Math.floor(Math.random() * COLORS.length)], sw: Math.random() * 3, sd: 2 + Math.random() * 2 })), []);
  const grass = useMemo(() => Array.from({ length: 26 }, (_, i) => {
    const x = 85 + Math.random() * 170, h = 10 + Math.random() * 18, tx = x + (Math.random() * 12 - 6);
    return { i, d: `M${x} 414 Q${x + 2} ${414 - h * 0.6} ${tx} ${414 - h}`, tx, ty: 414 - h, flower: i % 4 === 0, c: COLORS[i % COLORS.length], sd: Math.random() * 2 };
  }), []);
  const flies = useMemo(() => Array.from({ length: 14 }, () => ({ x: 8 + Math.random() * 84, y: 8 + Math.random() * 70, dx: (Math.random() - 0.5) * 60, dy: (Math.random() - 0.5) * 60, d: 5.6 + Math.random() * 4, t: 5 + Math.random() * 4 })), []);
  const [stars, setStars] = useState<{ id: number; x: number; y: number }[]>([]);
  const [falls, setFalls] = useState<Fall[]>([]);
  const [done, setDone] = useState(false);
  const [round] = useState(0);
  const add = (x: number, y: number, dx: number, dy: number) =>
    setFalls((f) => [...f, { id: Math.random(), x, y, dx, dy, c: COLORS[Math.floor(Math.random() * COLORS.length)], s: 12 + Math.random() * 14 }]);

  useEffect(() => {
    setDone(false);
    const t = setTimeout(() => setDone(true), 5700);
    return () => clearTimeout(t);
  }, [round]);
  useEffect(() => {
    if (!done) return;
    const t = setInterval(() => setStars((st) => [...st, { id: Math.random(), x: Math.random() * window.innerWidth * 0.6, y: Math.random() * window.innerHeight * 0.35 }]), 3800);
    return () => clearInterval(t);
  }, [done]);
  useEffect(() => {
    if (!done) return;
    const t = setInterval(() => { const p = canopy(1)[0]; add(p.x, p.y, (Math.random() - 0.5) * 80, 260); }, 350);
    return () => clearInterval(t);
  }, [done]);

  const trunk = (d: string, w: number, delay: number) => (
    <motion.path d={d} fill="none" stroke="#b07a8c" strokeWidth={w} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay, ease: "easeOut" }} />
  );

  return (
    <div className="flex flex-col items-center">
      <div key={round} className="relative aspect-[340/420] w-[min(92vw,340px,calc(52dvh*0.81))] [container-type:inline-size]"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width) * 100, y = ((e.clientY - r.top) / r.height) * 100;
          for (let i = 0; i < 14; i++) add(x, y, (Math.random() - 0.5) * 220, -(60 + Math.random() * 180));
        }}>
        <motion.div className="pointer-events-none absolute left-[5%] top-[40%] -z-10 aspect-square w-[90%] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,143,171,.4), transparent 65%)", y: "-50%" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1, scale: [0.9, 1.1] }}
          transition={{ opacity: { duration: 2, delay: 2.4 }, scale: { duration: 3, delay: 4.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } }} />
        <style>{TREE_CSS}</style>
        <svg viewBox="0 0 340 420" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <ellipse cx="170" cy="414" rx="70" ry="6" fill="rgba(255,255,255,.12)" />
          {trunk("M170 412 C170 380 165 340 170 290", 9, 1.2)}
          {BRANCHES.map((b, bi) => {
            const [ox, oy] = bez(b.d, 0);
            return (
              <g key={bi} className="bsw" style={{ transformOrigin: `${ox}px ${oy}px`, animationDuration: `${3 + bi * 0.3}s`, animationDelay: `${5.2 + bi * 0.2}s` }}>
                <motion.path d={b.d} fill="none" stroke="#b07a8c" strokeWidth={b.w} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: b.t, ease: "easeOut" }} />
                {b.tw.map((w, wi) => {
                  const t = b.t + 0.6 + wi * 0.15;
                  const [sx, sy] = bez(w.d, 0), [tx, ty] = bez(w.d, 1), [mx, my] = bez(w.d, 0.55);
                  const c = COLORS[(bi * 2 + wi) % COLORS.length];
                  return (
                    <g key={wi} className="bsw" style={{ transformOrigin: `${sx}px ${sy}px`, animationDuration: `${2.4 + wi * 0.4}s`, animationDelay: `${5.6 + wi * 0.3}s` }}>
                      <motion.path d={w.d} fill="none" stroke="#b07a8c" strokeWidth={2.6} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: t, ease: "easeOut" }} />
                      <motion.circle cx={tx} cy={ty} r={3} fill={c} style={{ transformBox: "fill-box", transformOrigin: "center" }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 8, stiffness: 220, delay: t + 0.7 }} />
                      <motion.circle cx={tx} cy={ty} r={3} fill="none" stroke={c} strokeWidth={1} style={{ transformBox: "fill-box", transformOrigin: "center" }} initial={{ scale: 1, opacity: 0 }} animate={{ scale: [1, 2.6], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity, delay: t + 1.2 + wi * 0.4 }} />
                      {w.orn && (
                        <g className="orn" style={{ transformOrigin: `${mx}px ${my}px`, animationDelay: `${t + 0.9}s, ${t + 0.9}s` }}>
                          <line x1={mx} y1={my} x2={mx} y2={my + 16} stroke="rgba(255,255,255,.4)" strokeWidth={1} />
                          <text x={mx} y={my + 27} textAnchor="middle" fontSize={11} fill={c}>♥</text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}
          {grass.map((g) => (
            <g key={g.i}>
              <motion.path d={g.d} fill="none" stroke="#8ed1a0" strokeWidth={2} strokeLinecap="round" style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
                initial={{ scaleY: 0 }} animate={{ scaleY: 1, rotate: [-6, 6] }}
                transition={{ scaleY: { duration: 0.6, delay: 1.1 + g.i * 0.03 }, rotate: { duration: 2.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: g.sd } }} />
              {g.flower && (
                <motion.circle cx={g.tx} cy={g.ty} r={3.5} fill={g.c} style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 8, stiffness: 200, delay: 1.8 + g.i * 0.03 }} />
              )}
            </g>
          ))}
        </svg>
        <motion.span className="absolute h-[18px] w-[14px] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-[#d9a066]" style={{ left: "calc(50% - 7px)" }}
          initial={{ top: "-15%", opacity: 0, scale: 1 }} animate={{ top: ["-15%", "96%", "96%"], opacity: [0, 1, 0], scale: [1, 1, 0] }} transition={{ duration: 1.1, times: [0, 0.85, 1], ease: "easeIn" }} />
        <motion.span className="absolute bottom-[1%] h-1.5 w-5 rounded-full border-2 border-white/50" style={{ left: "calc(50% - 10px)" }}
          initial={{ scale: 1, opacity: 0 }} animate={{ scale: [1, 9], opacity: [0.9, 0] }} transition={{ duration: 1, delay: 0.95, ease: "easeOut" }} />
        {hearts.map((h, i) => (
          <motion.span key={i} className="absolute leading-none" style={{ left: `${h.x}%`, top: `${h.y}%`, fontSize: `${(h.s / 340) * 100}cqw`, color: h.c, x: "-50%", y: "-50%" }}
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 8, stiffness: 160, delay: 2.7 + (i / hearts.length) * 2.6 }}>
            <motion.span className="block" animate={{ scale: [1, 1.35, 1] }} transition={{ duration: 4, repeat: Infinity, delay: 6 + (i / hearts.length) * 2.4 }}>
              <motion.span className="block" animate={{ rotate: [-9, 9], scale: [0.95, 1.08] }} transition={{ duration: h.sd, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: h.sw }}>♥</motion.span>
            </motion.span>
          </motion.span>
        ))}
        {falls.map((f) => (
          <motion.span key={f.id} className="pointer-events-none absolute leading-none" style={{ left: `${f.x}%`, top: `${f.y}%`, color: f.c, fontSize: `${(f.s / 340) * 100}cqw` }}
            initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: f.dx, y: f.dy, opacity: 0, rotate: f.dx * 3 }} transition={{ duration: 3.5, ease: "easeIn" }}
            onAnimationComplete={() => setFalls((all) => all.filter((x) => x.id !== f.id))}>♥</motion.span>
        ))}
        {flies.map((f, i) => (
          <motion.span key={i} className="pointer-events-none absolute h-[5px] w-[5px] rounded-full bg-[#fff3b0] shadow-[0_0_8px_3px_rgba(255,243,176,0.8)]" style={{ left: `${f.x}%`, top: `${f.y}%` }}
            initial={{ opacity: 0 }} animate={{ x: [0, f.dx, -f.dx * 0.5], y: [0, f.dy, f.dy * 1.3], opacity: [0, 1, 0] }} transition={{ duration: f.t, repeat: Infinity, ease: "easeInOut", delay: f.d }} />
        ))}
        {[0, 1].map((k) => {
          const xs = ["10cqw", "72cqw", "28cqw", "82cqw", "10cqw"], ys = ["60cqw", "34cqw", "12cqw", "66cqw", "60cqw"];
          return (
            <motion.span key={k} className="pointer-events-none absolute left-0 top-0 text-[clamp(16px,6cqw,24px)]" initial={{ x: xs[0], y: ys[0], opacity: 0 }}
              animate={{ x: k ? [...xs].reverse() : xs, y: k ? [...ys].reverse() : ys, opacity: [0, 1, 1, 1, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 5.8 + k * 6 }}>
              <motion.span className="inline-block" animate={{ scaleX: [1, 0.35] }} transition={{ duration: 0.22, repeat: Infinity, repeatType: "reverse" }}>🦋</motion.span>
            </motion.span>
          );
        })}
        {stars.map((st) => (
          <div key={st.id} className="pointer-events-none fixed z-[1]" style={{ left: st.x, top: st.y, transform: "rotate(25deg)", transformOrigin: "left" }}>
            <motion.span className="block h-0.5 w-24 rounded bg-gradient-to-r from-transparent to-white" initial={{ x: 0, opacity: 0 }} animate={{ x: 260, opacity: [0, 1, 0] }} transition={{ duration: 0.9, ease: "easeIn" }}
              onAnimationComplete={() => setStars((all) => all.filter((x) => x.id !== st.id))} />
          </div>
        ))}
      </div>
      <motion.h2 className={`${serif.className} mt-3 text-[clamp(1.8rem,7vw,2.8rem)] font-light italic`} initial={{ opacity: 0 }} animate={{ opacity: done ? 1 : 0 }} transition={{ duration: 1.2 }}>
        Happy birthday, {NAME}
      </motion.h2>
      <motion.button onClick={onDone} className={`${pill} mt-4`} initial={{ opacity: 0 }} animate={{ opacity: done ? 1 : 0 }} style={{ pointerEvents: done ? "auto" : "none" }} whileHover={{ scale: 1.08 }}>
        One last thing ›
      </motion.button>
    </div>
  );
}

/* ── stage 6: the proposal (tap the heart → letter → question) ── */
const LETTER =
  "Meeting you this year was the best thing that happened to me. Every moment with you feels special, and I never want to lose you, no matter what situation life brings. I want you by my side in every chapter of my life. Happy Birthday! ❤️🎂. I want to ask you something I have been carrying in my heart for a long time.";
const NO_TEXTS = ["No", "Are you sure?", "Think again 🥺", "Really??", "Try Yes 😌"];
const rc = () => COLORS[Math.floor(Math.random() * COLORS.length)];

type BurstT = { id: number; x: number; y: number; big: boolean };
function Burst({ x, y, big, onDone }: BurstT & { onDone: () => void }) {
  const ps = useMemo(
    () => Array.from({ length: big ? 22 : 16 }, () => {
      const a = Math.random() * Math.PI * 2;
      const d = (big ? 120 : 70) + Math.random() * (big ? 200 : 90);
      return { dx: Math.cos(a) * d, dy: Math.sin(a) * d, s: (big ? 16 : 12) + Math.random() * (big ? 20 : 12), c: rc(), h: Math.random() < 0.7 };
    }),
    [big]
  );
  return (
    <div className="pointer-events-none fixed z-[60]" style={{ left: x, top: y }}>
      {ps.map((p, i) => (
        <motion.span key={i} className="absolute leading-none" style={{ color: p.c, fontSize: p.s }}
          initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
          animate={{ x: [0, p.dx, p.dx * 1.1], y: [0, p.dy, p.dy + 60], scale: [0.4, 1, 0.6], opacity: [1, 1, 0] }}
          transition={{ duration: 1.6, ease: "easeOut", times: [0, 0.6, 1] }}
          onAnimationComplete={i === 0 ? onDone : undefined}>
          {p.h ? "♥" : "✦"}
        </motion.span>
      ))}
    </div>
  );
}

function HeartRain() {
  const [hs, setHs] = useState<{ id: number; left: number; s: number; c: string; dx: number; dur: number }[]>([]);
  useEffect(() => {
    const t = setInterval(
      () => setHs((h) => [...h.slice(-60), { id: Math.random(), left: Math.random() * 100, s: 14 + Math.random() * 26, c: rc(), dx: (Math.random() - 0.5) * 120, dur: 3.5 + Math.random() * 2.5 }]),
      130
    );
    return () => clearInterval(t);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[55] overflow-hidden">
      {hs.map((h) => (
        <motion.span key={h.id} className="absolute leading-none" style={{ left: `${h.left}%`, bottom: -30, color: h.c, fontSize: h.s }}
          initial={{ y: 0, opacity: 1 }} animate={{ y: -(window.innerHeight + 60), x: h.dx, rotate: h.dx / 2, opacity: 0.9 }} transition={{ duration: h.dur, ease: "easeIn" }}>
          ♥
        </motion.span>
      ))}
    </div>
  );
}

function ProposeStage() {
  const [phase, setPhase] = useState<"env" | "open" | "letter" | "yes">("env");
  const [typed, setTyped] = useState(0);
  const [ask, setAsk] = useState(false);
  const [noTry, setNoTry] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [ambient, setAmbient] = useState<{ id: number; x: number; dx: number; s: number; c: string }[]>([]);
  const [bursts, setBursts] = useState<BurstT[]>([]);
  const [cKey, setCKey] = useState(0);
  const [round, setRound] = useState(0);
  const sealRef = useRef<HTMLDivElement>(null);
  const lastDodge = useRef(0);
  const done = typed >= LETTER.length;
  const addBurst = (x: number, y: number, big: boolean) => setBursts((b) => [...b, { id: Math.random(), x, y, big }]);

  // hearts drift up around the envelope until it is opened
  useEffect(() => {
    if (phase !== "env") return;
    const t = setInterval(() => setAmbient((a) => [...a.slice(-14), { id: Math.random(), x: (Math.random() - 0.5) * 160, dx: (Math.random() - 0.5) * 220, s: 12 + Math.random() * 14, c: rc() }]), 550);
    return () => clearInterval(t);
  }, [phase, round]);
  // envelope opens, then the letter takes over
  useEffect(() => {
    if (phase !== "open") return;
    const t = setTimeout(() => setPhase("letter"), 2200);
    return () => clearTimeout(t);
  }, [phase]);
  // typewriter
  useEffect(() => {
    if (phase !== "letter" || done) return;
    const t = setTimeout(() => setTyped((n) => n + 1), 34);
    return () => clearTimeout(t);
  }, [phase, typed, done]);
  useEffect(() => {
    if (phase !== "letter" || !done) return;
    const t = setTimeout(() => setAsk(true), 700);
    return () => clearTimeout(t);
  }, [phase, done]);
  // celebration: confetti x3, firework hearts, heart rain
  useEffect(() => {
    if (phase !== "yes") return;
    setCKey(1);
    const t1 = setTimeout(() => setCKey(2), 700);
    const t2 = setTimeout(() => setCKey(3), 1500);
    addBurst(window.innerWidth / 2, window.innerHeight * 0.35, true);
    const iv = setInterval(() => addBurst(window.innerWidth * (0.15 + Math.random() * 0.7), window.innerHeight * (0.12 + Math.random() * 0.45), true), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(iv); };
  }, [phase]);

  const openEnv = () => {
    if (phase !== "env") return;
    const r = sealRef.current?.getBoundingClientRect();
    if (r) addBurst(r.left + r.width / 2, r.top + r.height / 2, false);
    setPhase("open");
  };
  const dodge = () => {
    const now = Date.now();
    if (now - lastDodge.current < 300) return;
    lastDodge.current = now;
    setNoTry((n) => n + 1);
    setNoPos({ x: (Math.random() * 2 - 1) * 110, y: (Math.random() * 2 - 1) * 55 });
  };
  const replay = () => { setPhase("env"); setTyped(0); setAsk(false); setNoTry(0); setNoPos({ x: 0, y: 0 }); setCKey(0); setRound((r) => r + 1); };
  const open = phase === "open";

  return (
    <div className="relative flex w-full flex-col items-center">
      {phase === "yes" && (<><Confetti key={cKey} /><HeartRain /></>)}
      {bursts.map((b) => <Burst key={b.id} {...b} onDone={() => setBursts((all) => all.filter((x) => x.id !== b.id))} />)}
      <AnimatePresence mode="wait">
        {(phase === "env" || open) && (
          <motion.div key="env" className="flex flex-col items-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60, scale: 0.8 }} transition={{ duration: 0.5 }}>
            <div className="relative aspect-[280/190] w-[min(78vw,280px)] [perspective:900px]">
              {ambient.map((a) => (
                <motion.span key={a.id} className="pointer-events-none absolute left-1/2 top-[60%] leading-none" style={{ color: a.c, fontSize: a.s, marginLeft: a.x }}
                  initial={{ y: 0, x: 0, opacity: 0.9 }} animate={{ y: -220, x: a.dx / 3, rotate: a.dx / 3, opacity: 0 }} transition={{ duration: 2.6, ease: "easeOut" }}>♥</motion.span>
              ))}
              <div className="absolute inset-0 rounded-lg bg-[#e9b8c9]" />
              <motion.div className={`${serif.className} absolute inset-x-[8%] bottom-[10%] top-[6%] z-[2] flex items-start justify-center rounded bg-[#fff1f2] pt-[8%] text-xl italic text-[#7a4b63]`}
                animate={{ y: open ? "-55%" : "0%" }} transition={{ delay: 0.7, type: "spring", damping: 14, stiffness: 90 }}>
                For you ♥
              </motion.div>
              <div className="absolute inset-0 z-[3] rounded-lg bg-gradient-to-br from-[#ffb3c6] to-[#ff8fab] [clip-path:polygon(0_0,50%_55%,100%_0,100%_100%,0_100%)]" />
              <motion.div className="absolute inset-x-0 top-0 h-[55%] origin-top bg-[#ffc2d1] [clip-path:polygon(0_0,100%_0,50%_100%)]"
                animate={{ rotateX: open ? 180 : 0, zIndex: open ? 1 : 4 }} transition={{ rotateX: { duration: 0.7, ease: "easeInOut" }, zIndex: { delay: 0.35, duration: 0.01 } }} />
              <div ref={sealRef} className="absolute left-1/2 top-[55%] z-[5] -translate-x-1/2 -translate-y-1/2">
                <motion.button onClick={openEnv} aria-label="Open the letter" className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff5d8f] text-3xl leading-none text-white outline-none"
                  animate={open ? { scale: 0, opacity: 0 } : { scale: [1, 1.18, 1, 1.12, 1] }} transition={open ? { duration: 0.3 } : { duration: 1.4, repeat: Infinity }} whileTap={{ scale: 0.85 }}>
                  ♥
                </motion.button>
              </div>
            </div>
            <motion.p animate={{ opacity: open ? 0 : 1 }} className="mt-5 text-[#c8b6ff]">Tap the heart</motion.p>
          </motion.div>
        )}

        {phase === "letter" && (
          <motion.div key="letter" className="relative w-[min(88vw,380px)] rounded-md bg-[#fff4ef] px-6 pb-4 pt-7 text-left text-[#3b2230] shadow-2xl [@media(max-height:620px)]:px-4 [@media(max-height:620px)]:pt-5"
            initial={{ scale: 0.3, y: 120, rotate: -6, opacity: 0 }} animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }} exit={{ scale: 0.9, y: -30, opacity: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }} onClick={() => setTyped(LETTER.length)}>
            <span className="absolute -top-2.5 left-1/2 h-5 w-24 -translate-x-1/2 -rotate-3 bg-[#ff8fab]/55" />
            <p className={`${serif.className} text-xl italic`}>My dearest {NAME},</p>
            <p className={`${serif.className} relative mt-2 text-[clamp(1.05rem,4.2vw,1.3rem)] italic leading-snug`}>
              <span className="invisible">{LETTER}</span>
              <span className="absolute inset-0">{LETTER.slice(0, typed)}{!done && <span className="animate-pulse">▍</span>}</span>
            </p>
            <motion.p className={`${serif.className} mt-2 text-right text-lg italic`} animate={{ opacity: done ? 1 : 0 }}>— {FROM}</motion.p>
            <motion.div className="mt-3 flex flex-col items-center border-t border-dashed border-[#c9a0b0] pt-3" animate={{ opacity: ask ? 1 : 0, y: ask ? 0 : 10 }} style={{ pointerEvents: ask ? "auto" : "none" }}>
              <p className={`${serif.className} mb-2 text-[1.35rem] italic`}>Will you be mine forever? 💍</p>
              <div className="flex h-16 items-center justify-center gap-4">
                <motion.button onClick={() => setPhase("yes")} className={pill} animate={{ scale: Math.min(1 + noTry * 0.12, 1.5) }} whileTap={{ scale: 0.95 }}>Yes ♥</motion.button>
                <motion.button onPointerEnter={dodge} onPointerDown={(e) => { e.preventDefault(); dodge(); }} onClick={dodge}
                  className="rounded-full border border-[#7a4b63] px-6 py-3 text-[#7a4b63]" animate={{ x: noPos.x, y: noPos.y }} transition={{ type: "spring", damping: 12, stiffness: 300 }}>
                  {NO_TEXTS[noTry % NO_TEXTS.length]}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {phase === "yes" && (
          <motion.div key="yes" className="relative z-[70] flex max-w-md flex-col items-center px-2" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", damping: 10 }}>
            <motion.div className="text-7xl" initial={{ rotate: -200, scale: 0 }} animate={{ rotate: 0, scale: 1, y: [0, -8, 0] }}
              transition={{ rotate: { type: "spring", damping: 9 }, scale: { type: "spring", damping: 9 }, y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.2 } }}>💍</motion.div>
            <h2 className={`${serif.className} mt-2 text-[clamp(2.4rem,10vw,3.6rem)] font-light italic`}>You said yes!</h2>
            <p className={`${serif.className} mt-3 text-[1.35rem] font-light`}>Forever starts today. Happy birthday, {NAME}.</p>
            <p className="mt-2 text-[#c8b6ff]">— {FROM}</p>
            <button onClick={replay} className="mt-6 rounded-full border border-[#c8b6ff]/50 px-8 py-3 text-[#c8b6ff]">Replay ↺</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── page: one stage per screen, nothing scrolls ── */
export default function BirthdayPage() {
  const [stage, setStage] = useState<Stage>("gate");
  const go = (s: Stage) => setStage(s);
  const idx = STAGES.indexOf(stage);

  return (
    <MotionConfig reducedMotion="user">
      <main className={`${sans.className} relative h-dvh w-full overflow-hidden font-light [-webkit-tap-highlight-color:transparent] text-[#fff1f2]`}>
        <Background />
        <motion.div className="fixed inset-x-0 top-0 z-40 h-1 origin-left bg-gradient-to-r from-[#ff8fab] to-[#c8b6ff]" animate={{ scaleX: (idx + 1) / STAGES.length }} transition={{ duration: 0.8 }} />
        <AnimatePresence mode="wait">
          <motion.section key={stage} className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center" style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
            initial={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }} transition={{ duration: 0.45 }}>
            {stage === "gate" && (
              <>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-6 text-lg text-[#c8b6ff]">{NAME}, I made you something.</motion.p>
                <motion.button onClick={() => go("cake")} className={`${pill} relative text-lg`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.9 }} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}>
                  <motion.span className="absolute inset-0 rounded-full border-2 border-[#ff8fab]" animate={{ scale: [1, 1.5], opacity: [0.8, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
                  Open it
                </motion.button>
              </>
            )}
            {stage === "cake" && <CakeStage onDone={() => go("wish")} />}
            {stage === "wish" && <WishStage onDone={() => go("photos")} />}
            {stage === "photos" && <PhotoStage onDone={() => go("puzzle")} />}
            {stage === "puzzle" && <PuzzleStage onDone={() => go("tree")} />}
            {stage === "tree" && <TreeStage onDone={() => go("propose")} />}
            {stage === "propose" && <ProposeStage />}
          </motion.section>
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}