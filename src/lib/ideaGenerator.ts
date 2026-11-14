export interface NixoraIdea {
  id: number;
  code: string;
  category: string;
  title: string;
  description: string;
  aiPrompt: string;
  focus: string;
}

export const TOTAL_IDEAS = 50000;

// 10 categories * 20 contexts * 25 mechanics * 10 focuses = 50,000 unique deterministic ideas
export const IDEA_CATEGORIES = [
  'Construcción y Parcelas',
  'Economía y Tiendas',
  'PvP y Combate',
  'Eventos y Torneos',
  'Redstone y Granjas',
  'Clanes y Facciones',
  'Seguridad y Moderación',
  'Lore y Misiones',
  'Optimización y Cliente',
  'Minijuegos y Comunidad',
] as const;

const CONTEXTS = [
  'en el Spawn Principal de Nixora',
  'para la modalidad Survival Amatista',
  'en el Mundo de Recursos semanales',
  'para jugadores nuevos del servidor',
  'en las Islas de Skyblock Nixora',
  'para la Arena PvP y duelos 1v1',
  'en el Mercado Central de aldeanos',
  'para las Mazmorras de Cristal',
  'durante el reinicio del Nether',
  'en el End y batalla del Dragón',
  'para las Parcelas Creativas',
  'en eventos nocturnos de fin de semana',
  'para rangos veteranos y constructores',
  'en zonas seguras y puestos de intercambio',
  'para bases subterráneas de clanes',
  'en puertos marítimos y rutas comerciales',
  'para granjas automáticas compartidas',
  'en torres de observación y portales',
  'durante temporadas competitivas mensuales',
  'para la integración entre PC y móvil',
];

const MECHANICS = [
  'sistema de recompensas por racha diaria',
  'desafío cooperativo contra oleadas de mobs',
  'búsqueda del tesoro con pistas en libros escritos',
  'intercambio seguro mediante cofres protegidos',
  'circuito compacto de redstone sin generar lag',
  'torneo eliminatorio por equipos de 3 jugadores',
  'protección automática contra griefing y TNT',
  'estación de teletransporte con cristales de amatista',
  'subasta silenciosa de objetos raros y encantados',
  'mural de misiones semanales con puntos de clan',
  'diseño arquitectónico simétrico con iluminación oculta',
  'registro rápido de evidencias ante jugadores molestos',
  'taller de encantamientos optimizado por niveles',
  'ruta de parkour cronometrada con podio oficial',
  'sistema de roles y permisos para miembros de confianza',
  'almacén clasificador automático con filtros de tolvas',
  'evento de pesca legendaria con trofeos únicos',
  'guía interactiva de comandos esenciales del servidor',
  'protocolo de recuperación tras pérdida de inventario',
  'arena de práctica con kits equilibrados sin pérdida',
  'museo comunitario de cabezas y reliquias históricas',
  'faro de mejoras temporales por votación del servidor',
  'bóveda de emergencia conectada entre dimensiones',
  'ajuste gráfico y de chunks para máxima fluidez',
  'ceremonia de inauguración con fuegos artificiales',
];

const FOCUSES = [
  'enfoque rápido de 15 minutos',
  'diseño amigable para principiantes',
  'versión competitiva avanzada',
  'bajo costo de recursos iniciales',
  'estética temática de amatista oscura',
  'modo cooperativo para amigos',
  'reglas justas anti-abusos',
  'rendimiento estable a altos FPS',
  'pensado para jugar desde móvil o PC',
  'escalable para todo el servidor',
];

export function getIdeaById(id: number): NixoraIdea {
  const clamped = Math.max(1, Math.min(TOTAL_IDEAS, Math.floor(id)));
  const zeroBased = clamped - 1;

  // Dimensions: 10 categories x 20 contexts x 25 mechanics x 10 focuses = 50,000
  const focusIdx = zeroBased % FOCUSES.length;
  const mechIdx = Math.floor(zeroBased / 10) % MECHANICS.length;
  const ctxIdx = Math.floor(zeroBased / (10 * 25)) % CONTEXTS.length;
  const catIdx = Math.floor(zeroBased / (10 * 25 * 20)) % IDEA_CATEGORIES.length;

  const category = IDEA_CATEGORIES[catIdx];
  const context = CONTEXTS[ctxIdx];
  const mechanic = MECHANICS[mechIdx];
  const focus = FOCUSES[focusIdx];

  const title = `${capitalize(mechanic)} ${context}`;
  const description = `Propuesta de ${category.toLowerCase()} orientada a ${focus} dentro de nixora.play.hosting.`;
  const aiPrompt = `Desarrolla paso a paso la Idea #${String(clamped).padStart(5, '0')} para nixora.play.hosting: "${title}" (${category}, ${focus}). Incluye materiales o comandos útiles y cómo aprovecharla sin causar lag.`;

  return {
    id: clamped,
    code: `#${String(clamped).padStart(5, '0')}`,
    category,
    title,
    description,
    aiPrompt,
    focus,
  };
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getIdeasSlice(params: {
  page: number;
  pageSize: number;
  category?: string;
  query?: string;
}): { items: NixoraIdea[]; totalMatched: number } {
  const { page, pageSize, category, query } = params;
  const cleanQuery = (query || '').trim().toLowerCase();

  // Direct numeric jump like "12345" or "#12345"
  if (cleanQuery && /^#?\d+$/.test(cleanQuery)) {
    const targetId = Number(cleanQuery.replace('#', ''));
    if (targetId >= 1 && targetId <= TOTAL_IDEAS) {
      return { items: [getIdeaById(targetId)], totalMatched: 1 };
    }
  }

  // If no text query, compute exact O(1) category slice!
  if (!cleanQuery) {
    if (!category || category === 'Todas') {
      const startId = (page - 1) * pageSize + 1;
      const items: NixoraIdea[] = [];
      for (let id = startId; id < startId + pageSize && id <= TOTAL_IDEAS; id++) {
        items.push(getIdeaById(id));
      }
      return { items, totalMatched: TOTAL_IDEAS };
    }

    const catIdx = IDEA_CATEGORIES.indexOf(category as (typeof IDEA_CATEGORIES)[number]);
    if (catIdx !== -1) {
      const perCategory = TOTAL_IDEAS / IDEA_CATEGORIES.length; // 5000
      const baseId = catIdx * perCategory + 1;
      const startId = baseId + (page - 1) * pageSize;
      const endCatId = (catIdx + 1) * perCategory;
      const items: NixoraIdea[] = [];
      for (let id = startId; id < startId + pageSize && id <= endCatId; id++) {
        items.push(getIdeaById(id));
      }
      return { items, totalMatched: perCategory };
    }
  }

  // Keyword scan across 50,000 ideas (fast ~5ms string check in JS)
  const matched: NixoraIdea[] = [];
  const skip = (page - 1) * pageSize;
  let totalMatched = 0;

  const catIdxFilter =
    category && category !== 'Todas'
      ? IDEA_CATEGORIES.indexOf(category as (typeof IDEA_CATEGORIES)[number])
      : -1;

  const startScan = catIdxFilter >= 0 ? catIdxFilter * 5000 + 1 : 1;
  const endScan = catIdxFilter >= 0 ? (catIdxFilter + 1) * 5000 : TOTAL_IDEAS;

  for (let id = startScan; id <= endScan; id++) {
    const idea = getIdeaById(id);
    if (
      idea.title.toLowerCase().includes(cleanQuery) ||
      idea.category.toLowerCase().includes(cleanQuery) ||
      idea.focus.toLowerCase().includes(cleanQuery) ||
      idea.code.includes(cleanQuery)
    ) {
      if (totalMatched >= skip && matched.length < pageSize) {
        matched.push(idea);
      }
      totalMatched++;
    }
  }

  return { items: matched, totalMatched };
}
