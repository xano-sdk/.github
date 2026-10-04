// Renders the SVGs behind profile/README.md, one light and one dark copy of each.
// GitHub shows them through <img>, so they carry no web fonts and no script.
// Run: node scripts/build-assets.mjs

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'profile', 'assets');
mkdirSync(OUT, { recursive: true });

const SANS = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif`;
const MONO = `ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace`;

const THEMES = {
  dark: {
    bg: '#0B0C10',
    panel: '#13151B',
    border: '#262A35',
    text: '#F4F6FA',
    muted: '#9AA3B5',
    faint: '#5C6476',
    grid: '#FFFFFF',
    gridOpacity: 0.035,
    glow: 0.55,
    pillBg: '#1565FF22',
  },
  light: {
    bg: '#F6F8FC',
    panel: '#FFFFFF',
    border: '#DDE3EE',
    text: '#0B0C10',
    muted: '#4B5468',
    faint: '#8A93A6',
    grid: '#0B0C10',
    gridOpacity: 0.045,
    glow: 0.28,
    pillBg: '#1565FF14',
  },
};

const BLUE = '#1565FF';
const BLUE_LIGHT = '#4599FF';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The Xano mark, drawn in a 100x100 box.
const xanoMark = (fill, id) => `
  <path d="M0.010,15.510L29.298,15.510L64.700,48.383L64.604,51.567L30.601,84.490L0.000,84.490L36.622,50.003Z" fill="${fill}"/>
  <path d="M69.555,53.580L98.182,79.819L99.806,84.490L73.522,84.490L56.031,67.900L57.009,64.834Z" fill="url(#${id})"/>
  <path d="M74.391,15.510L100.000,15.510L97.932,20.805L69.255,47.365L54.904,33.298Z" fill="url(#${id})"/>`;

const blueGradient = (id, x1 = 0, x2 = 1) =>
  `<linearGradient id="${id}" x1="${x1}" y1="0" x2="${x2}" y2="1"><stop offset="0" stop-color="${BLUE}"/><stop offset="1" stop-color="${BLUE_LIGHT}"/></linearGradient>`;

const grid = (t, w, h, step = 32) => `
  <pattern id="grid" width="${step}" height="${step}" patternUnits="userSpaceOnUse">
    <path d="M ${step} 0 L 0 0 0 ${step}" fill="none" stroke="${t.grid}" stroke-opacity="${t.gridOpacity}" stroke-width="1"/>
  </pattern>`;

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">\n${body}\n</svg>\n`;

function write(name, theme, content) {
  writeFileSync(join(OUT, `${name}-${theme}.svg`), content);
}

// ---------------------------------------------------------------- hero

function hero(t) {
  const W = 1280;
  const H = 460;
  const term = { x: 772, y: 84, w: 444, h: 300 };
  const lines = [
    [{ c: '#5C6476', s: '$ ' }, { c: '#F4F6FA', s: 'npx @xano/sdk init my-app' }],
    [{ c: '#5C6476', s: '$ ' }, { c: '#F4F6FA', s: 'npm run xano:deploy' }],
    [{ c: '#9AA3B5', s: '→ Deploying ./xano/index.ts → Xano Engine' }],
    [{ c: '#3DDC97', s: '✓ ' }, { c: '#F4F6FA', s: 'Xano Engine deployed' }],
    [{ c: '#9AA3B5', s: '\u00A0\u00A0http://127.0.0.1:53358' }],
    [],
    [{ c: '#5C6476', s: '$ ' }, { c: '#F4F6FA', s: 'npm run xano:deploy:ephemeral' }],
    [{ c: '#3DDC97', s: '✓ ' }, { c: '#F4F6FA', s: 'Live on Xano cloud' }],
  ];
  const termLines = lines
    .map((parts, i) => {
      if (!parts.length) return '';
      const spans = parts.map((p) => `<tspan fill="${p.c}">${esc(p.s)}</tspan>`).join('');
      return `<text x="${term.x + 28}" y="${term.y + 84 + i * 26}" font-family="${MONO}" font-size="15.5">${spans}</text>`;
    })
    .join('\n    ');

  return svg(
    W,
    H,
    `  <defs>
    ${blueGradient('blue')}
    ${blueGradient('blueText', 0, 1)}
    ${grid(t, W, H)}
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(980 220) rotate(90) scale(320 520)">
      <stop offset="0" stop-color="${BLUE}" stop-opacity="${t.glow}"/>
      <stop offset="1" stop-color="${BLUE}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fadeGrid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.bg}" stop-opacity="0"/>
      <stop offset="1" stop-color="${t.bg}" stop-opacity="1"/>
    </linearGradient>
    <clipPath id="frame"><rect width="${W}" height="${H}" rx="20"/></clipPath>
  </defs>
  <g clip-path="url(#frame)">
    <rect width="${W}" height="${H}" fill="${t.bg}"/>
    <rect width="${W}" height="${H}" fill="url(#grid)"/>
    <rect y="${H * 0.45}" width="${W}" height="${H * 0.55}" fill="url(#fadeGrid)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
  </g>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="19.5" stroke="${t.border}"/>

  <g transform="translate(64 64) scale(0.44)">${xanoMark(t.text, 'blue')}</g>
  <text x="118" y="96" font-family="${SANS}" font-size="24" font-weight="700" fill="${t.text}" letter-spacing="-0.3">Xano SDK</text>

  <text x="64" y="176" font-family="${SANS}" font-size="54" font-weight="800" fill="${t.text}" letter-spacing="-1.6">AI builds software.</text>
  <text x="64" y="244" font-family="${SANS}" font-size="54" font-weight="800" fill="url(#blueText)" letter-spacing="-1.6">Xano makes it trustworthy.</text>

  <text font-family="${SANS}" font-size="21" fill="${t.muted}">
    <tspan x="64" y="300">Write your backend in TypeScript, or let an agent write it.</tspan>
    <tspan x="64" y="330">Run it on your machine, then ship it to Xano's cloud.</tspan>
  </text>

  <g font-family="${MONO}" font-size="14" font-weight="600" letter-spacing="1.2">
    <rect x="64" y="368" width="108" height="34" rx="17" fill="${t.pillBg}" stroke="${BLUE}" stroke-opacity="0.45"/>
    <text x="118" y="390" text-anchor="middle" fill="${BLUE_LIGHT}">SDK</text>
    <rect x="184" y="368" width="128" height="34" rx="17" fill="${t.pillBg}" stroke="${BLUE}" stroke-opacity="0.45"/>
    <text x="248" y="390" text-anchor="middle" fill="${BLUE_LIGHT}">ENGINE</text>
    <rect x="324" y="368" width="128" height="34" rx="17" fill="${t.pillBg}" stroke="${BLUE}" stroke-opacity="0.45"/>
    <text x="388" y="390" text-anchor="middle" fill="${BLUE_LIGHT}">STUDIO</text>
    <rect x="464" y="368" width="128" height="34" rx="17" fill="${t.pillBg}" stroke="${BLUE}" stroke-opacity="0.45"/>
    <text x="528" y="390" text-anchor="middle" fill="${BLUE_LIGHT}">CLOUD</text>
  </g>

  <g>
    <rect x="${term.x}" y="${term.y}" width="${term.w}" height="${term.h}" rx="14" fill="#0E1015" stroke="${t === THEMES.dark ? '#2C3140' : '#1F2430'}"/>
    <path d="M${term.x + 14} ${term.y}h${term.w - 28}a14 14 0 0 1 14 14v26h-${term.w}v-26a14 14 0 0 1 14 -14z" fill="#171A21"/>
    <circle cx="${term.x + 24}" cy="${term.y + 20}" r="6" fill="#FF5F57"/>
    <circle cx="${term.x + 44}" cy="${term.y + 20}" r="6" fill="#FEBC2E"/>
    <circle cx="${term.x + 64}" cy="${term.y + 20}" r="6" fill="#28C840"/>
    <text x="${term.x + term.w / 2}" y="${term.y + 25}" text-anchor="middle" font-family="${MONO}" font-size="13" fill="#5C6476">my-app</text>
    ${termLines}
    <rect x="${term.x + 28}" y="${term.y + 84 + 8 * 26 - 16}" width="10" height="20" fill="${BLUE_LIGHT}">
      <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.5;0.5;1" dur="1.1s" repeatCount="indefinite"/>
    </rect>
  </g>`,
  );
}

// ---------------------------------------------------------------- product cards

const icons = {
  xano: (t) => `<g transform="translate(0 0) scale(0.56)">${xanoMark(t.text, 'blue')}</g>`,
  sdk: () => `
    <rect x="0" y="0" width="56" height="56" rx="12" fill="url(#blue)"/>
    <text x="28" y="37" text-anchor="middle" font-family="${MONO}" font-size="22" font-weight="700" fill="#FFFFFF">TS</text>`,
  engine: () => `
    <rect x="2" y="6" width="52" height="34" rx="5" stroke="url(#blue)" stroke-width="3.5"/>
    <path d="M-2 48h60" stroke="url(#blue)" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M17 18l-6 5 6 5M39 18l6 5-6 5" stroke="${BLUE_LIGHT}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
  studio: () => `
    <circle cx="28" cy="28" r="9" fill="url(#blue)"/>
    <circle cx="6" cy="8" r="5" stroke="${BLUE_LIGHT}" stroke-width="3"/>
    <circle cx="50" cy="8" r="5" stroke="${BLUE_LIGHT}" stroke-width="3"/>
    <circle cx="6" cy="48" r="5" stroke="${BLUE_LIGHT}" stroke-width="3"/>
    <circle cx="50" cy="48" r="5" stroke="${BLUE_LIGHT}" stroke-width="3"/>
    <path d="M10 12l11 10M46 12L35 22M10 44l11-10M46 44L35 34" stroke="${BLUE_LIGHT}" stroke-width="2.5" stroke-linecap="round"/>`,
};

const CARDS = [
  {
    key: 'xano',
    eyebrow: 'THE PLATFORM',
    title: 'Xano',
    body: [
      'A hosted backend for business-critical systems.',
      'Postgres, APIs, auth, tasks, realtime, MCP',
      'servers and AI agents, run for you.',
    ],
    foot: 'SOC 2 Type II · ISO 27001 · HIPAA · GDPR',
    footMono: false,
    cta: 'xano.com',
  },
  {
    key: 'sdk',
    eyebrow: 'YOUR BACKEND, AS CODE',
    title: 'Xano SDK',
    body: [
      'Tables, endpoints, functions, tasks and agents',
      'as typed TypeScript in your repo. Review it in',
      'a PR, deploy it with one command.',
    ],
    foot: '$ npx @xano/sdk init my-app',
    footMono: true,
    cta: 'View repo',
  },
  {
    key: 'engine',
    eyebrow: 'XANO, ON YOUR MACHINE',
    title: 'Xano Engine',
    body: [
      'The platform on your laptop. No account, no',
      'network, the same visual builder, and your',
      'data kept between deploys.',
    ],
    foot: '$ npm run xano:deploy',
    footMono: true,
    cta: 'Learn more',
  },
  {
    key: 'studio',
    eyebrow: 'AGENT CONTROL PLANE',
    title: 'Xano Studio',
    body: [
      'Run Claude Code, Codex and other agents on your',
      'computer. Direct them, review their work, and',
      'publish it to your Xano workspace.',
    ],
    foot: 'Built on the Xano SDK and the Xano Engine',
    footMono: false,
    cta: null,
    badge: 'COMING SOON',
  },
];

function card(t, c) {
  const W = 640;
  const H = 320;
  const body = c.body
    .map((line, i) => `<tspan x="40" y="${172 + i * 30}">${esc(line)}</tspan>`)
    .join('');
  const badge = c.badge
    ? `<rect x="${W - 40 - 150}" y="40" width="150" height="32" rx="16" fill="url(#blue)"/>
    <text x="${W - 40 - 75}" y="61" text-anchor="middle" font-family="${MONO}" font-size="13" font-weight="700" letter-spacing="1.2" fill="#FFFFFF">${c.badge}</text>`
    : '';
  const cta = c.cta
    ? `<text x="${W - 40}" y="${H - 38}" text-anchor="end" font-family="${SANS}" font-size="18" font-weight="600" fill="${BLUE_LIGHT}">${esc(c.cta)} →</text>`
    : '';
  return svg(
    W,
    H,
    `  <defs>
    ${blueGradient('blue')}
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${W} 0) rotate(135) scale(340)">
      <stop offset="0" stop-color="${BLUE}" stop-opacity="${t.glow * 0.5}"/>
      <stop offset="1" stop-color="${BLUE}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="frame"><rect width="${W}" height="${H}" rx="18"/></clipPath>
  </defs>
  <g clip-path="url(#frame)">
    <rect width="${W}" height="${H}" fill="${t.panel}"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
  </g>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="17.5" stroke="${t.border}"/>
  <g transform="translate(40 40)">${icons[c.key](t)}</g>
  ${badge}
  <text x="40" y="128" font-family="${MONO}" font-size="13" font-weight="600" letter-spacing="1.6" fill="${BLUE_LIGHT}">${esc(c.eyebrow)}</text>
  <text x="112" y="80" font-family="${SANS}" font-size="32" font-weight="800" letter-spacing="-0.6" fill="${t.text}">${esc(c.title)}</text>
  <text font-family="${SANS}" font-size="19" fill="${t.muted}">${body}</text>
  <path d="M40 ${H - 74}H${W - 40}" stroke="${t.border}"/>
  <text x="40" y="${H - 38}" font-family="${c.footMono ? MONO : SANS}" font-size="${c.footMono ? 16 : 15}" fill="${c.footMono ? t.text : t.faint}">${esc(c.foot)}</text>
  ${cta}`,
  );
}

// ---------------------------------------------------------------- flow

function flow(t) {
  const W = 1280;
  const H = 280;
  const nodes = [
    { label: 'Xano Studio', verb: 'Agents write it', sub: 'Claude Code, Codex, …' },
    { label: 'Xano SDK', verb: 'TypeScript defines it', sub: 'typed, reviewed in a PR' },
    { label: 'Xano Engine', verb: 'Your machine runs it', sub: 'no account, no network' },
    { label: 'Xano', verb: 'The cloud runs it', sub: 'ephemerals and workspaces' },
  ];
  const nw = 248;
  const gap = (W - 64 * 2 - nw * nodes.length) / (nodes.length - 1);
  const ny = 64;
  const nh = 152;
  const boxes = nodes
    .map((n, i) => {
      const x = 64 + i * (nw + gap);
      const last = i === nodes.length - 1;
      return `
  <g>
    <rect x="${x}" y="${ny}" width="${nw}" height="${nh}" rx="16" fill="${last ? 'url(#blue)' : t.panel}" stroke="${last ? 'none' : t.border}"/>
    <text x="${x + 24}" y="${ny + 40}" font-family="${MONO}" font-size="13" font-weight="600" letter-spacing="1.4" fill="${last ? '#FFFFFF' : BLUE_LIGHT}" fill-opacity="${last ? 0.85 : 1}">0${i + 1}</text>
    <text x="${x + 24}" y="${ny + 76}" font-family="${SANS}" font-size="24" font-weight="800" letter-spacing="-0.4" fill="${last ? '#FFFFFF' : t.text}">${esc(n.label)}</text>
    <text x="${x + 24}" y="${ny + 106}" font-family="${SANS}" font-size="17" font-weight="600" fill="${last ? '#FFFFFF' : t.text}" fill-opacity="${last ? 0.95 : 0.85}">${esc(n.verb)}</text>
    <text x="${x + 24}" y="${ny + 130}" font-family="${SANS}" font-size="15" fill="${last ? '#FFFFFF' : t.muted}" fill-opacity="${last ? 0.8 : 1}">${esc(n.sub)}</text>
  </g>`;
    })
    .join('');
  const arrows = nodes
    .slice(0, -1)
    .map((_, i) => {
      const x1 = 64 + i * (nw + gap) + nw + 6;
      const x2 = x1 + gap - 12;
      const y = ny + nh / 2;
      return `
  <path class="flow" d="M${x1} ${y}H${x2 - 6}" stroke="${BLUE_LIGHT}" stroke-width="2.5" stroke-dasharray="4 6" stroke-linecap="round"/>
  <path d="M${x2 - 10} ${y - 6}l7 6-7 6" stroke="${BLUE_LIGHT}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    })
    .join('');
  return svg(
    W,
    H,
    `  <defs>
    ${blueGradient('blue')}
    <style>
      .flow { animation: dash 1.2s linear infinite; }
      @keyframes dash { to { stroke-dashoffset: -20; } }
      @media (prefers-reduced-motion: reduce) { .flow { animation: none; } }
    </style>
  </defs>
  <rect width="${W}" height="${H}" rx="20" fill="${t.bg}"/>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="19.5" stroke="${t.border}"/>
  ${boxes}
  ${arrows}
  <text x="${W / 2}" y="${H - 28}" text-anchor="middle" font-family="${SANS}" font-size="16" fill="${t.faint}">One codebase from the first prompt to production. Every step is code you can read.</text>`,
  );
}

for (const [name, t] of Object.entries(THEMES)) {
  write('hero', name, hero(t));
  write('flow', name, flow(t));
  for (const c of CARDS) write(`card-${c.key}`, name, card(t, c));
}

console.log(`wrote ${2 * (2 + CARDS.length)} SVGs to ${OUT}`);
