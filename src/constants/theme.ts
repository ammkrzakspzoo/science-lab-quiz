/**
 * Visual preset: CANDY_SWEET.
 * The `name` field stays exactly as in the preset file.
 * Colour roles are the brief's science-lab overrides of the preset palette
 * (lab white / beaker olive / action blue / soft green / ink).
 */
export const theme = {
  name: 'candy-sweet',

  colors: {
    bg: {
      primary: '#F6F6ED',   // lab white canvas
      secondary: '#FFFFFF', // raised surfaces
      tertiary: '#EDF1E2',  // pale green-tinted fill
      accent: '#C7DDB0',    // soft green panels
    },
    lab: {
      olive: '#ABAA2A',     // beaker olive, plates & progress segments
      oliveDeep: '#7A7A1C', // darkened olive — safe for text on white
      action: '#2829E0',    // primary action blue
      actionDeep: '#1B1C9B',
      green: '#C7DDB0',     // soft green
      greenDeep: '#4F7A3A', // readable green for small text
      ink: '#242418',       // main ink
    },
    text: {
      primary: '#242418',
      secondary: 'rgba(36, 36, 24, 0.80)',
      tertiary: 'rgba(36, 36, 24, 0.65)',
      onAction: '#F6F6ED',
      onDark: '#F6F6ED',
    },
    ui: {
      border: '#C7DDB0',
      borderStrong: '#ABAA2A',
      divider: 'rgba(36, 36, 24, 0.10)',
      overlay: 'rgba(36, 36, 24, 0.35)',
      glass: 'rgba(255, 255, 255, 0.92)',
      headerBacking: 'rgba(36, 36, 24, 0.30)',
    },
  },

  gradients: {
    loader: ['#242418', '#1B1C9B', '#2829E0'],
    menu: ['#FFFFFF', '#F6F6ED', '#C7DDB0'],
    quiz: ['#F6F6ED', '#FFFFFF', '#F6F6ED'],
    explanation: ['#C7DDB0', '#F6F6ED', '#FFFFFF'],
    results: ['#FFFFFF', '#C7DDB0', '#F6F6ED'],
    badges: ['#F6F6ED', '#DCE9CC', '#C7DDB0'],
    stats: ['#FFFFFF', '#F6F6ED', '#EDF1E2'],
    settings: ['#F6F6ED', '#FFFFFF', '#EDF1E2'],
    action: ['#2829E0', '#242418'],
    controls: ['#C7DDB0', '#F6F6ED'],
    plate: ['#FFFFFF', '#EDF1E2'],
  },

  typography: {
    hero: { fontSize: 40, fontWeight: '700' as const, lineHeight: 44, letterSpacing: -0.5 },
    title: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34, letterSpacing: 0 },
    question: { fontSize: 24, fontWeight: '700' as const, lineHeight: 31, letterSpacing: 0 },
    cardTitle: { fontSize: 20, fontWeight: '700' as const, lineHeight: 27, letterSpacing: 0 },
    subtitle: { fontSize: 18, fontWeight: '700' as const, lineHeight: 25, letterSpacing: 0 },
    explanation: { fontSize: 17, fontWeight: '400' as const, lineHeight: 25, letterSpacing: 0 },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22, letterSpacing: 0 },
    bodyStrong: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22, letterSpacing: 0 },
    support: { fontSize: 15, fontWeight: '400' as const, lineHeight: 21, letterSpacing: 0 },
    caption: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18, letterSpacing: 0.3 },
    micro: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16, letterSpacing: 0.8 },
    button: { fontSize: 18, fontWeight: '700' as const, lineHeight: 24, letterSpacing: 0.6 },
    buttonSmall: { fontSize: 15, fontWeight: '700' as const, lineHeight: 24, letterSpacing: 0.4 },
    counter: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28, letterSpacing: 0 },
    score: { fontSize: 40, fontWeight: '700' as const, lineHeight: 44, letterSpacing: -1 },
  },

  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },

  radius: { sm: 12, md: 14, lg: 18, xl: 24, pill: 100 },

  shadows: {
    card: {
      shadowColor: '#242418',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    raised: {
      shadowColor: '#242418',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 14,
      elevation: 5,
    },
    button: {
      shadowColor: '#2829E0',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 4,
    },
    panelUp: {
      shadowColor: '#242418',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 8,
    },
  },

  animation: {
    press: { tension: 180, friction: 18 },
    bounce: { tension: 200, friction: 12 },
    fast: { duration: 150 },
    smooth: { duration: 180 },
    screen: { duration: 200 },
  },
} as const;

export type Theme = typeof theme;
