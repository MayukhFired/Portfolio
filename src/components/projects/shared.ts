export const projects = [
  {
    id: 1,
    title: 'Quick Dash',
    category: 'Delivery Platform',
    desc: 'A hyperlocal delivery platform that helps local shops deliver products directly to customers — no need to step out. Fast, simple, and built for neighbourhoods.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    color: '#34d399',
    status: 'LIVE',
    icon: '🛵',
    image: '/projects/quick_dash.png',
    github: 'https://github.com/MayukhFired/Quick-Dash-Final',
    live: 'https://quick-dash-final.netlify.app',
  },
  {
    id: 2,
    title: 'Samvidhan',
    category: 'Civic Education',
    desc: 'An interactive platform to learn and explore the Indian Constitution — covering fundamental rights, duties, DPSP, and a quiz generator to test your legal literacy.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    color: '#f97316',
    status: 'LIVE',
    icon: '⚖️',
    image: '/projects/Constituition.png',
    github: 'https://github.com/MayukhFired/Constituition',
    live: 'https://constituition.netlify.app',
  },
  {
    id: 3,
    title: 'MCP Shield',
    category: 'VS Code Extension',
    desc: 'A VS Code extension that protects your codebase from malicious MCP tool activity. Monitors what MCP tools do in the background and blocks unauthorized actions.',
    tags: ['TypeScript', 'JavaScript'],
    color: '#a78bfa',
    status: 'OPEN SOURCE',
    icon: '🛡️',
    image: '',
    github: 'https://github.com/MayukhFired/mcp-shield',
    live: '#',
  },
];

export type Project = typeof projects[number];

export const STATUS_COLOR: Record<string, string> = {
  LIVE:           '#34d399',
  BETA:           '#fbbf24',
  'OPEN SOURCE':  '#22d3ee',
};
