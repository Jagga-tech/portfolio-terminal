'use client';

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';

// ─── Types ───────────────────────────────────────────────────────────
type LineType = 'input' | 'output' | 'error' | 'success' | 'warning' | 'system' | 'ascii' | 'link';

interface TerminalLine {
  id: number;
  type: LineType;
  content: string;
  href?: string;
}

// ─── Data ────────────────────────────────────────────────────────────
const PROMPT = 'chanpreet@portfolio:~$ ';

const COMMANDS = [
  'help', 'whoami', 'ls', 'ls projects', 'cat resume', 'cat alovia',
  'cat hackhayward', 'cat univibe', 'cat pantrypal', 'skills', 'contact',
  'open linkedin', 'open github', 'open resume', 'clear', 'about --verbose',
  'sudo hire chanpreet', 'sudo rm -rf chanpreet', 'matrix',
];

const BOOT_LINES = [
  '[BIOS] Chanpreet Portfolio OS v2.0.26',
  '[BOOT] Loading kernel modules...',
  '[  OK  ] Mounted product-thinking.ko',
  '[  OK  ] Mounted ai-builder.ko',
  '[  OK  ] Mounted startup-energy.ko',
  '[INIT] Starting terminal interface...',
  '[  OK  ] Network: connected (Bay Area)',
  '[  OK  ] All systems operational.',
  '',
];

// ─── Home Section Data (rendered as permanent header) ────────────────
const HOME_LINES: { type: LineType; content: string; href?: string }[] = [
  { type: 'ascii', content: '  ____ _                                     _   ' },
  { type: 'ascii', content: ' / ___| |__   __ _ _ __  _ __  _ __ ___  ___| |_ ' },
  { type: 'ascii', content: '| |   | \'_ \\ / _` | \'_ \\| \'_ \\| \'__/ _ \\/ _ \\ __|' },
  { type: 'ascii', content: '| |___| | | | (_| | | | | |_) | | |  __/  __/ |_ ' },
  { type: 'ascii', content: ' \\____|_| |_|\\__,_|_| |_| .__/|_|  \\___|\\___|\\__|' },
  { type: 'ascii', content: '                        |_|                       ' },
  { type: 'output', content: '' },
  { type: 'success', content: '  Product Manager & AI Builder' },
  { type: 'output', content: '  Hayward, CA | Open to Full-Time PM Roles' },
  { type: 'output', content: '' },
  { type: 'warning', content: '── About ──────────────────────────────────────' },
  { type: 'output', content: '  I ship AI-powered products, organize hackathons,' },
  { type: 'output', content: '  and build things that solve real problems.' },
  { type: 'output', content: '' },
  { type: 'warning', content: '── Experience ─────────────────────────────────' },
  { type: 'success', content: '  ● OpenAI CSU Student Ambassador  — CSUEB (Oct 2025-Present)' },
  { type: 'success', content: '  ● Library Ambassador             — CSUEB (Mar 2025-Present)' },
  { type: 'output', content: '  ● Office Support Assistant        — Sierra College (2023-2024)' },
  { type: 'output', content: '' },
  { type: 'warning', content: '── Projects ───────────────────────────────────' },
  { type: 'success', content: '  🟢 Alovia AI      AI content protection        aloviaai.com' },
  { type: 'output', content: '  🟡 HackHayward    Campus hackathon              Tech Lead' },
  { type: 'output', content: '  ⏸️  Univibe        Student collaboration         Paused' },
  { type: 'output', content: '  ✅ PantryPal      Grocery & recipe app          Shipped' },
  { type: 'output', content: '' },
  { type: 'warning', content: '── Skills ─────────────────────────────────────' },
  { type: 'output', content: '  Product  User Research, Roadmapping, PRDs, A/B Testing' },
  { type: 'output', content: '  AI       Prompt Engineering, LLM Integration, Claude Code' },
  { type: 'output', content: '  Tech     Python, Kotlin, Next.js, Git, Firebase, Figma' },
  { type: 'output', content: '' },
  { type: 'warning', content: '── Contact ────────────────────────────────────' },
  { type: 'link', content: '  Email     chanpreet.singh.cv@gmail.com', href: 'mailto:chanpreet.singh.cv@gmail.com' },
  { type: 'link', content: '  LinkedIn  linkedin.com/in/chanpreet-singh-259003259', href: 'https://www.linkedin.com/in/chanpreet-singh-259003259' },
  { type: 'link', content: '  GitHub    github.com/Jagga-tech', href: 'https://github.com/Jagga-tech' },
  { type: 'output', content: '' },
  { type: 'system', content: '── Commands ───────────────────────────────────' },
  { type: 'system', content: '  help | whoami | cat resume | ls projects | skills' },
  { type: 'system', content: '  cat <project> | contact | about --verbose' },
  { type: 'system', content: '  open linkedin | open github | open resume | clear' },
];

// ─── Command Handler ─────────────────────────────────────────────────
function getOutput(cmd: string): TerminalLine[] {
  const id = () => Date.now() + Math.random();

  switch (cmd) {
    case 'help':
      return [
        { id: id(), type: 'warning', content: '── Available Commands ──────────────────────────' },
        { id: id(), type: 'output', content: '  help              Show this help menu' },
        { id: id(), type: 'output', content: '  whoami            Who is Chanpreet?' },
        { id: id(), type: 'output', content: '  ls                List all sections' },
        { id: id(), type: 'output', content: '  cat resume        View experience timeline' },
        { id: id(), type: 'output', content: '  ls projects       List all projects' },
        { id: id(), type: 'output', content: '  cat <project>     View project details' },
        { id: id(), type: 'output', content: '                    (alovia, hackhayward, univibe, pantrypal)' },
        { id: id(), type: 'output', content: '  skills            Print skills config' },
        { id: id(), type: 'output', content: '  about --verbose   Detailed bio' },
        { id: id(), type: 'output', content: '  contact           Contact info & links' },
        { id: id(), type: 'output', content: '  open linkedin     Open LinkedIn' },
        { id: id(), type: 'output', content: '  open github       Open GitHub' },
        { id: id(), type: 'output', content: '  open resume       Download resume' },
        { id: id(), type: 'output', content: '  clear             Clear terminal output' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'system', content: '  Try: sudo hire chanpreet  😏' },
      ];

    case 'whoami':
      return [
        { id: id(), type: 'success', content: '> Chanpreet Singh' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'output', content: 'Product Manager & AI Builder based in the Bay Area.' },
        { id: id(), type: 'output', content: 'I ship AI-powered products, organize hackathons,' },
        { id: id(), type: 'output', content: 'and build things that solve real problems.' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'warning', content: 'STATUS: Actively looking for full-time PM roles.' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'system', content: 'Type "cat resume" to see my experience.' },
      ];

    case 'ls':
      return [
        { id: id(), type: 'success', content: 'drwxr-xr-x  resume/' },
        { id: id(), type: 'success', content: 'drwxr-xr-x  projects/' },
        { id: id(), type: 'success', content: '-rw-r--r--  skills.json' },
        { id: id(), type: 'success', content: '-rw-r--r--  contact.txt' },
        { id: id(), type: 'success', content: '-rw-r--r--  about.md' },
      ];

    case 'ls projects':
      return [
        { id: id(), type: 'warning', content: '── projects/ ──────────────────────────────────' },
        { id: id(), type: 'success', content: '  📦 alovia       Alovia AI — AI content protection (LIVE)' },
        { id: id(), type: 'output', content: '  📦 hackhayward  HackHayward — Campus hackathon' },
        { id: id(), type: 'output', content: '  📦 univibe      Univibe — Student collaboration platform' },
        { id: id(), type: 'output', content: '  📦 pantrypal    PantryPal — Grocery & recipe app' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'system', content: 'Use "cat <project>" to view details.' },
      ];

    case 'cat resume':
      return [
        { id: id(), type: 'warning', content: '── Experience Timeline ─────────────────────────' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'success', content: '  ● OpenAI CSU Student Ambassador' },
        { id: id(), type: 'output', content: '    California State University, East Bay' },
        { id: id(), type: 'system', content: '    Oct 2025 — Present' },
        { id: id(), type: 'output', content: '    Evangelizing AI tools & best practices across campus.' },
        { id: id(), type: 'output', content: '    Running workshops, demos, and building AI culture.' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'success', content: '  ● Library Ambassador' },
        { id: id(), type: 'output', content: '    California State University, East Bay' },
        { id: id(), type: 'system', content: '    Mar 2025 — Present' },
        { id: id(), type: 'output', content: '    Guiding students through research tools and resources.' },
        { id: id(), type: 'output', content: '    Connecting people with the right information.' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'success', content: '  ● Office Support Assistant' },
        { id: id(), type: 'output', content: '    Sierra College' },
        { id: id(), type: 'system', content: '    Jun 2023 — Jul 2024' },
        { id: id(), type: 'output', content: '    Administrative ops, scheduling, and student support.' },
        { id: id(), type: 'output', content: '    First professional role — learned to ship on time.' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'output', content: '  ─────────────────────────────────────────────' },
        { id: id(), type: 'system', content: '  Type "open resume" to download the full PDF.' },
      ];

    case 'cat alovia':
      return [
        { id: id(), type: 'warning', content: '── Alovia AI ──────────────────────────────────' },
        { id: id(), type: 'success', content: '  Status: 🟢 LIVE — aloviaai.com' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'output', content: '  AI-powered content protection platform that defends' },
        { id: id(), type: 'output', content: '  websites against unauthorized bot scraping and' },
        { id: id(), type: 'output', content: '  AI training data harvesting.' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'system', content: '  Key Features:' },
        { id: id(), type: 'output', content: '    → Bot detection & blocking' },
        { id: id(), type: 'output', content: '    → Content watermarking system' },
        { id: id(), type: 'output', content: '    → Real-time analytics dashboard' },
        { id: id(), type: 'output', content: '    → Lightweight embed script integration' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'system', content: '  Role: Founder / Product & Engineering' },
        { id: id(), type: 'output', content: '  Stack: Next.js, AI/ML, Vercel, Analytics' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'link', content: '  → Visit: https://aloviaai.com', href: 'https://aloviaai.com' },
      ];

    case 'cat hackhayward':
      return [
        { id: id(), type: 'warning', content: '── HackHayward ────────────────────────────────' },
        { id: id(), type: 'success', content: '  Status: 🟡 Active — Organizing' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'output', content: '  Campus hackathon event at CSUEB.' },
        { id: id(), type: 'output', content: '  Leading the organizing team as Tech Lead.' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'system', content: '  Contributions:' },
        { id: id(), type: 'output', content: '    → Built the official event website' },
        { id: id(), type: 'output', content: '    → Designed automated check-in system' },
        { id: id(), type: 'output', content: '    → Coordinating sponsors & logistics' },
        { id: id(), type: 'output', content: '    → Managing cross-functional team' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'system', content: '  Role: Organizing Team & Tech Lead' },
      ];

    case 'cat univibe':
      return [
        { id: id(), type: 'warning', content: '── Univibe ────────────────────────────────────' },
        { id: id(), type: 'output', content: '  Status: ⏸️  Paused' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'output', content: '  Student collaboration platform designed to connect' },
        { id: id(), type: 'output', content: '  students for projects, study groups, and campus life.' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'system', content: '  Phase: Product Discovery' },
        { id: id(), type: 'output', content: '    → User research & persona mapping' },
        { id: id(), type: 'output', content: '    → Feature prioritization with RICE framework' },
        { id: id(), type: 'output', content: '    → Paused due to scope complexity' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'output', content: '  Lesson: Knowing when NOT to build is a PM skill.' },
      ];

    case 'cat pantrypal':
      return [
        { id: id(), type: 'warning', content: '── PantryPal ──────────────────────────────────' },
        { id: id(), type: 'success', content: '  Status: ✅ Completed' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'output', content: '  Android app for grocery and recipe management.' },
        { id: id(), type: 'output', content: '  Track pantry inventory, discover recipes based' },
        { id: id(), type: 'output', content: '  on what you have, reduce food waste.' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'system', content: '  Tech Stack:' },
        { id: id(), type: 'output', content: '    → Kotlin + Android SDK' },
        { id: id(), type: 'output', content: '    → Firebase backend' },
        { id: id(), type: 'output', content: '    → Material Design UI' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'system', content: '  Role: Full-Stack Developer' },
      ];

    case 'skills':
      return [
        { id: id(), type: 'warning', content: '── skills.json ────────────────────────────────' },
        { id: id(), type: 'system', content: '{' },
        { id: id(), type: 'output', content: '  "product": [' },
        { id: id(), type: 'success', content: '    "User Research", "Roadmapping", "PRDs",' },
        { id: id(), type: 'success', content: '    "Prioritization", "KPI Tracking", "A/B Testing"' },
        { id: id(), type: 'output', content: '  ],' },
        { id: id(), type: 'output', content: '  "ai": [' },
        { id: id(), type: 'success', content: '    "Prompt Engineering", "LLM Integration",' },
        { id: id(), type: 'success', content: '    "Claude Code", "AI Product Strategy"' },
        { id: id(), type: 'output', content: '  ],' },
        { id: id(), type: 'output', content: '  "tools": [' },
        { id: id(), type: 'success', content: '    "Figma", "Firebase", "GA4", "Excel"' },
        { id: id(), type: 'output', content: '  ],' },
        { id: id(), type: 'output', content: '  "technical": [' },
        { id: id(), type: 'success', content: '    "Python", "Kotlin", "Git", "Next.js"' },
        { id: id(), type: 'output', content: '  ]' },
        { id: id(), type: 'system', content: '}' },
      ];

    case 'contact':
      return [
        { id: id(), type: 'warning', content: '── Contact ────────────────────────────────────' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'output', content: '  📧 Email' },
        { id: id(), type: 'link', content: '     chanpreet.singh.cv@gmail.com', href: 'mailto:chanpreet.singh.cv@gmail.com' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'output', content: '  💼 LinkedIn' },
        { id: id(), type: 'link', content: '     linkedin.com/in/chanpreet-singh-259003259', href: 'https://www.linkedin.com/in/chanpreet-singh-259003259' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'output', content: '  🐙 GitHub' },
        { id: id(), type: 'link', content: '     github.com/Jagga-tech', href: 'https://github.com/Jagga-tech' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'output', content: '  📍 Location' },
        { id: id(), type: 'success', content: '     Hayward, CA (Bay Area)' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'system', content: '  Open to full-time PM opportunities!' },
      ];

    case 'about --verbose':
      return [
        { id: id(), type: 'warning', content: '── About Chanpreet Singh ──────────────────────' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'output', content: '  I\'m a Product Manager and AI Builder based in the' },
        { id: id(), type: 'output', content: '  Bay Area. I study at Cal State East Bay and spend' },
        { id: id(), type: 'output', content: '  most of my time shipping products that sit at the' },
        { id: id(), type: 'output', content: '  intersection of AI and real user needs.' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'output', content: '  I founded Alovia AI — a content protection platform' },
        { id: id(), type: 'output', content: '  that\'s live and serving users. I lead the tech side' },
        { id: id(), type: 'output', content: '  of HackHayward, our campus hackathon. And I serve' },
        { id: id(), type: 'output', content: '  as an OpenAI Student Ambassador, running workshops' },
        { id: id(), type: 'output', content: '  and building AI culture on campus.' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'output', content: '  My approach to product: Talk to users. Scope tight.' },
        { id: id(), type: 'output', content: '  Ship fast. Measure everything. Iterate relentlessly.' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'output', content: '  I\'ve paused projects when the scope got too complex' },
        { id: id(), type: 'output', content: '  (Univibe) and shipped others end-to-end (PantryPal).' },
        { id: id(), type: 'output', content: '  I believe the best PMs know when to build and when' },
        { id: id(), type: 'output', content: '  to stop.' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'success', content: '  Currently: Looking for full-time PM roles where' },
        { id: id(), type: 'success', content: '  I can own product decisions and ship with velocity.' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'system', content: '  Let\'s talk → chanpreet.singh.cv@gmail.com' },
      ];

    case 'open linkedin':
      if (typeof window !== 'undefined') {
        window.open('https://www.linkedin.com/in/chanpreet-singh-259003259', '_blank');
      }
      return [{ id: id(), type: 'success', content: 'Opening LinkedIn in a new tab...' }];

    case 'open github':
      if (typeof window !== 'undefined') {
        window.open('https://github.com/Jagga-tech', '_blank');
      }
      return [{ id: id(), type: 'success', content: 'Opening GitHub in a new tab...' }];

    case 'open resume':
      if (typeof window !== 'undefined') {
        window.open('/resume.pdf', '_blank');
      }
      return [{ id: id(), type: 'success', content: 'Opening resume PDF...' }];

    case 'sudo hire chanpreet':
      return [
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'success', content: '  ✅ Permission granted.' },
        { id: id(), type: 'success', content: '  Hiring process initiated...' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'output', content: '  > Deploying Chanpreet to your team...' },
        { id: id(), type: 'output', content: '  > Loading product instincts... done.' },
        { id: id(), type: 'output', content: '  > Loading AI expertise... done.' },
        { id: id(), type: 'output', content: '  > Loading shipping velocity... done.' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'success', content: '  🎉 Chanpreet has joined the team!' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'system', content: '  (Seriously though — reach out! chanpreet.singh.cv@gmail.com)' },
      ];

    case 'sudo rm -rf chanpreet':
      return [
        { id: id(), type: 'error', content: '  ❌ ERROR: Operation not permitted.' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'output', content: '  Chanpreet is protected by:' },
        { id: id(), type: 'warning', content: '    → Relentless work ethic' },
        { id: id(), type: 'warning', content: '    → Unreasonable optimism' },
        { id: id(), type: 'warning', content: '    → An unhealthy amount of coffee' },
        { id: id(), type: 'output', content: '' },
        { id: id(), type: 'output', content: '  rm: cannot remove \'chanpreet\': Permission denied' },
        { id: id(), type: 'system', content: '  Nice try though. 😄' },
      ];

    case 'matrix':
      return [{ id: id(), type: 'system', content: '__MATRIX__' }];

    default:
      return [
        { id: id(), type: 'error', content: `  Command not found: ${cmd}` },
        { id: id(), type: 'system', content: '  Type "help" to see available commands.' },
      ];
  }
}

// ─── Line Renderer ───────────────────────────────────────────────────
function TerminalLineView({ line }: { line: { type: LineType; content: string; href?: string } }) {
  const color = (() => {
    switch (line.type) {
      case 'input': return 'var(--dim)';
      case 'error': return 'var(--red)';
      case 'success': return 'var(--green)';
      case 'warning': return 'var(--yellow)';
      case 'system': return 'var(--cyan)';
      case 'ascii': return 'var(--cyan)';
      case 'link': return 'var(--cyan)';
      default: return 'var(--text)';
    }
  })();

  return (
    <div style={{
      color,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      minHeight: (line.content ?? '') === '' ? '1.6em' : undefined,
      lineHeight: '1.6',
    }}>
      {line.type === 'link' && line.href ? (
        <a href={line.href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)' }}>
          {line.content}
        </a>
      ) : (
        line.content ?? ''
      )}
    </div>
  );
}

// ─── Matrix Rain Component ───────────────────────────────────────────
function MatrixRain({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789CHANPREET';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    let frame = 0;
    const maxFrames = 200;

    const draw = () => {
      ctx.fillStyle = 'rgba(13, 13, 13, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.95 ? '#00e5ff' : '#00ff88';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      frame++;
      if (frame < maxFrames) {
        requestAnimationFrame(draw);
      } else {
        onDone();
      }
    };

    const animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [onDone]);

  return (
    <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#0d0d0d' }} />
  );
}

// ─── Main Terminal ───────────────────────────────────────────────────
export default function Terminal() {
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [homeVisible, setHomeVisible] = useState(false);
  const [homeIndex, setHomeIndex] = useState(0);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [booted, setBooted] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [tabHint, setTabHint] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [bootLines, homeIndex, lines, scrollToBottom]);

  // Boot sequence → then reveal home lines one by one
  useEffect(() => {
    let i = 0;
    const bootTimer = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setBootLines(prev => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(bootTimer);
        setHomeVisible(true);
      }
    }, 100);
    return () => clearInterval(bootTimer);
  }, []);

  // Animate home lines appearing
  useEffect(() => {
    if (!homeVisible) return;
    if (homeIndex >= HOME_LINES.length) {
      setBooted(true);
      return;
    }
    const timer = setTimeout(() => {
      setHomeIndex(prev => prev + 1);
    }, 25);
    return () => clearTimeout(timer);
  }, [homeVisible, homeIndex]);

  // Focus input when booted
  useEffect(() => {
    if (booted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [booted]);

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    setLines(prev => [...prev, {
      id: Date.now() + Math.random(),
      type: 'input' as LineType,
      content: `${PROMPT}${cmd}`,
    }]);

    if (!trimmed) return;

    setHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    if (trimmed === 'clear') {
      setLines([]);
      return;
    }

    if (trimmed === 'matrix') {
      setShowMatrix(true);
      return;
    }

    const output = getOutput(trimmed);
    output.forEach((line, i) => {
      setTimeout(() => {
        setLines(prev => [...prev, line]);
      }, i * 30);
    });
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    setTabHint('');

    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const current = input.trim().toLowerCase();
      if (!current) return;
      const matches = COMMANDS.filter(c => c.startsWith(current));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        setTabHint(matches.join('  '));
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex]);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= history.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
      return;
    }

    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }, [input, history, historyIndex, executeCommand]);

  const handleContainerClick = useCallback(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <>
      {showMatrix && (
        <MatrixRain onDone={() => {
          setShowMatrix(false);
          setLines(prev => [...prev, {
            id: Date.now(),
            type: 'success',
            content: '  Wake up, recruiter... The Matrix has you.',
          }]);
        }} />
      )}

      <div
        onClick={handleContainerClick}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          padding: '16px',
          overflow: 'hidden',
        }}
      >
        {/* Single scrollable area: boot → home (fixed) → terminal output */}
        <div
          ref={scrollRef}
          style={{ flex: 1, overflowY: 'auto', paddingBottom: '8px' }}
        >
          {/* Boot lines */}
          {bootLines.map((line, i) => (
            <div key={`boot-${i}`} style={{ color: 'var(--cyan)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {line}
            </div>
          ))}

          {/* Permanent home section */}
          {homeVisible && HOME_LINES.slice(0, homeIndex).map((line, i) => (
            <TerminalLineView key={`home-${i}`} line={line} />
          ))}

          {/* Separator between home and commands */}
          {booted && lines.length > 0 && (
            <div style={{ color: 'var(--dim)', lineHeight: '1.6', margin: '4px 0' }}>
              ────────────────────────────────────────────────
            </div>
          )}

          {/* Command output (this is what clear wipes) */}
          {lines.map(line => (
            <TerminalLineView key={line.id} line={line} />
          ))}
        </div>

        {/* Tab hint */}
        {tabHint && (
          <div style={{ color: 'var(--dim)', fontSize: '12px', padding: '2px 0', whiteSpace: 'pre-wrap' }}>
            {tabHint}
          </div>
        )}

        {/* Input area */}
        {booted && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 0',
            borderTop: '1px solid #1a1a1a',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              inset: '-2px 0',
              background: 'linear-gradient(180deg, transparent, rgba(0, 229, 255, 0.03), transparent)',
              pointerEvents: 'none',
            }} />
            <span style={{ color: 'var(--cyan)', whiteSpace: 'nowrap', userSelect: 'none', flexShrink: 0 }}>
              {PROMPT}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text)',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                lineHeight: 'inherit',
                caretColor: 'var(--cyan)',
                padding: 0,
                margin: 0,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
