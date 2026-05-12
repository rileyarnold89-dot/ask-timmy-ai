import { DOMAIN_FEED_PRODUCTS, findFeedProductByName, isFeedIntent } from '../data/domain-feed-products.js';
import { DEER_NUTRITION_PRINCIPLES } from '../data/deer-nutrition-principles.js';

const byId = Object.fromEntries(DOMAIN_FEED_PRODUCTS.map(p => [p.id, p]));

export const FEED_QUICK_START_BUTTONS = [
  { label: '🌱 Pick a Food Plot', prompt: 'I need help picking a food plot.' },
  { label: '📅 When Should I Plant?', prompt: 'I need help with planting dates.' },
  { label: '🧪 Fertilizer Help', prompt: 'I need help with fertilizer or liquid products.' },
  { label: '🦌 Feed & Mineral Help', prompt: 'I want to build a feed and mineral program.' },
  { label: '🌾 Bedding / Habitat Help', prompt: 'I need help with bedding, screening, or habitat.' },
  { label: '🛒 Help Me Buy', prompt: 'I need help choosing what to buy.' }
];

export const FEED_PROGRAM_QUESTIONS = [
  {
    id: 'state',
    question: 'What state are you feeding in?',
    type: 'text'
  },
  {
    id: 'goal',
    question: 'What is your main goal?',
    type: 'single-select',
    options: [
      'Trail camera inventory',
      'Fast attraction',
      'Year-round nutrition',
      'Spring/summer mineral support',
      'Post-rut recovery',
      'Low-maintenance block site',
      'Bulk feed site'
    ]
  },
  {
    id: 'siteUse',
    question: 'About how many deer do you regularly see using this site?',
    type: 'single-select',
    options: [
      'Light use: 1–3 deer at a time',
      'Moderate use: 4–8 deer at a time',
      'Heavy use: 9–15 deer at a time',
      'Very heavy use: 16+ deer at a time',
      'Not sure / help me estimate'
    ]
  },
  {
    id: 'duration',
    question: 'How long do you want the program to run?',
    type: 'single-select',
    options: ['2 weeks', '30 days', '60 days', '90 days', 'Seasonal program', 'Year-round program']
  },
  {
    id: 'style',
    question: 'What style do you prefer?',
    type: 'single-select',
    options: ['Feeder-ready feed', 'Ground feeding', 'Mineral site', 'Block / low-maintenance', 'Attractant / corn topper', 'Not sure']
  }
];

export function shouldHandleFeed(message = '') {
  return isFeedIntent(message);
}

export function estimateSiteUse(answer = '') {
  const a = String(answer).toLowerCase();
  if (a.includes('16') || a.includes('very heavy')) return 'very heavy';
  if (a.includes('9') || a.includes('heavy')) return 'heavy';
  if (a.includes('4') || a.includes('moderate')) return 'moderate';
  if (a.includes('few') || a.includes('couple') || a.includes('1') || a.includes('light')) return 'light';
  if (a.includes('every day') || a.includes('multiple deer groups') || a.includes('disappears quickly')) return 'heavy';
  return 'standard';
}

export function getHelpEstimatingSiteUse() {
  return [
    'No problem. Use camera activity instead of guessing your whole herd size:',
    '1. If you only see a few deer every couple days, call it light use.',
    '2. If you get deer almost every day, call it moderate use.',
    '3. If multiple deer groups use the site, call it heavy use.',
    '4. If feed, mineral, or blocks disappear quickly, call it heavy to very heavy use.'
  ].join('\n');
}

function productLine(product) {
  if (!product) return '';
  const link = product.productUrl ? `\nProduct: ${product.productUrl}` : '';
  const dealer = product.dealerOnly ? '\nBest next step: Find a Domain Outdoor dealer for availability.' : '';
  return `${product.name}: ${product.timmyShortAnswer}${link}${dealer}`;
}

function selectProducts(goal = '', style = '') {
  const g = String(goal).toLowerCase();
  const s = String(style).toLowerCase();

  if (g.includes('bulk')) return [byId['pre-game-125lb-tub'], byId['recharge'], byId['bad-habit']];
  if (g.includes('mineral') || s.includes('mineral')) return [byId['recharge'], byId['pre-game'], byId['stockpile-20lb']];
  if (g.includes('post-rut') || g.includes('recovery')) return [byId['pre-game'], byId['recharge'], byId['stockpile-20lb']];
  if (g.includes('low-maintenance') || s.includes('block')) return [byId['stockpile-xl-33lb'], byId['stockpile-20lb'], byId['recharge']];
  if (g.includes('fast') || s.includes('attractant') || s.includes('corn topper')) return [byId['bad-habit'], byId['pre-game'], byId['stockpile-20lb']];
  if (g.includes('year-round')) return [byId['pre-game'], byId['recharge'], byId['stockpile-20lb']];
  return [byId['pre-game'], byId['recharge'], byId['bad-habit']];
}

function timelineFor(duration = '', goal = '', products = []) {
  const d = String(duration).toLowerCase();
  const primary = products[0]?.name || 'Pre Game';
  const support = products[1]?.name || 'Recharge';
  const boost = products[2]?.name || 'Bad Habit';

  if (d.includes('2 week')) {
    return [
      `Days 1–3: Start the site with ${primary}. Keep the setup simple and consistent.`,
      `Days 4–7: Add ${support} nearby if mineral/recovery support fits the goal.`,
      `Days 8–14: Use ${boost} as a site refresher if camera activity slows or you want a quick attraction bump.`
    ];
  }

  if (d.includes('60')) {
    return [
      `Weeks 1–2: Establish the site with ${primary}. Focus on consistency, not overcomplicating the setup.`,
      `Weeks 3–4: Add or maintain ${support} as the mineral/recovery piece.`,
      `Weeks 5–6: Refresh activity with ${boost} when deer traffic slows or when you want to build camera inventory.`,
      `Weeks 7–8: Evaluate how fast product disappears and move up or down in program intensity.`
    ];
  }

  if (d.includes('90') || d.includes('season')) {
    return [
      `Month 1: Build the habit with ${primary}. The goal is steady use and repeat visits.`,
      `Month 2: Layer in ${support} so the program supports more than just attraction.`,
      `Month 3: Use ${boost} or Stockpile as the maintenance/refresh piece depending on how often you can visit the site.`
    ];
  }

  if (d.includes('year')) {
    return [
      `Spring: Prioritize ${support} for mineral support and recovery as natural demand increases.`,
      `Summer: Use ${primary} for consistent nutrition and inventory where it fits your setup.`,
      `Pre-season: Add ${boost} or Stockpile to build camera activity and site consistency.`,
      `Fall/Winter: Keep the program simple: maintain the base feed, use blocks for low-maintenance attraction, and adjust based on site use.`
    ];
  }

  return [
    `Week 1: Start the site with ${primary}.`,
    `Week 2: Keep ${primary} consistent and add ${support} nearby if mineral support is part of the goal.`,
    `Week 3: Use ${boost} as a refresher or attraction boost.`,
    `Week 4: Review camera activity and product disappearance. Increase program intensity if the site is getting heavy use.`
  ];
}

export function buildFeedProgram({ state = '', goal = 'Trail camera inventory', siteUse = 'Moderate use: 4–8 deer at a time', duration = '30 days', style = 'Not sure' } = {}) {
  if (String(siteUse).toLowerCase().includes('not sure')) {
    return getHelpEstimatingSiteUse();
  }

  const intensity = estimateSiteUse(siteUse);
  const products = selectProducts(goal, style).filter(Boolean);
  const productNames = products.map(p => p.name).join(' + ');
  const timeline = timelineFor(duration, goal, products);

  return [
    `${duration} ${goal} Program${state ? ` for ${state}` : ''}`,
    `Site use level: ${intensity}.`,
    `Recommended Domain setup: ${productNames}.`,
    '',
    'Why this setup fits:',
    products.map(p => `• ${p.name}: ${p.primaryRole}`).join('\n'),
    '',
    'Timeline:',
    timeline.map(step => `• ${step}`).join('\n'),
    '',
    'Product notes:',
    products.map(productLine).join('\n\n')
  ].join('\n');
}

export function answerFeedProductQuestion(message = '') {
  const product = findFeedProductByName(message);
  if (!product) {
    return [
      'I can help with Domain feed, mineral, and attractant products.',
      'Tell me your goal: trail camera inventory, fast attraction, year-round nutrition, mineral support, recovery, low-maintenance block site, or bulk feed site.',
      'The main feed-side options are Pre Game, Bad Habit, Stockpile, Stockpile XL, Recharge, and Pre Game 125lb Tub.'
    ].join('\n');
  }

  const parts = [
    product.timmyShortAnswer,
    '',
    `Best use: ${product.bestUses.join(', ')}`,
    `Best season: ${product.bestSeason}`,
    `Pairs well with: ${product.pairsWith.length ? product.pairsWith.join(', ') : 'No primary pairing needed'}`,
    `Package sizes: ${product.packageSizes.join(', ')}`,
    product.howToUse ? `How to use: ${product.howToUse}` : null,
    product.productUrl ? `Product link: ${product.productUrl}` : product.availabilityNotes
  ].filter(Boolean);

  return parts.join('\n');
}
