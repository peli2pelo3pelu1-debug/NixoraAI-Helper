import React, { useState, useMemo } from 'react';
import {
  Search,
  Shuffle,
  Send,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import {
  TOTAL_IDEAS,
  IDEA_CATEGORIES,
  getIdeasSlice,
  getIdeaById,
  NixoraIdea,
} from '../lib/ideaGenerator';

interface IdeasExplorerProps {
  onSendIdeaToAI: (idea: NixoraIdea) => void;
}

const PAGE_SIZE = 12;

export const IdeasExplorer: React.FC<IdeasExplorerProps> = ({ onSendIdeaToAI }) => {
  const [category, setCategory] = useState<string>('Todas');
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [randomSpotlight, setRandomSpotlight] = useState<NixoraIdea | null>(null);

  const { items, totalMatched } = useMemo(
    () => getIdeasSlice({ page, pageSize: PAGE_SIZE, category, query }),
    [page, category, query]
  );

  const totalPages = Math.max(1, Math.ceil(totalMatched / PAGE_SIZE));

  const handleCategoryChange = (nextCat: string) => {
    setCategory(nextCat);
    setPage(1);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setPage(1);
  };

  const handleRandomIdea = () => {
    const randomId = Math.floor(Math.random() * TOTAL_IDEAS) + 1;
    setRandomSpotlight(getIdeaById(randomId));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24 lg:p-10 lg:pb-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-50 lg:text-2xl">
              Biblioteca de 50,000 Ideas para NixoraAI
            </h2>
            <p className="mt-1 text-xs text-slate-400 lg:text-sm">
              Explora {TOTAL_IDEAS.toLocaleString('es-ES')} ideas numeradas para el servidor nixora.play.hosting o envía cualquiera a la IA para desarrollarla.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRandomIdea}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-500 whitespace-nowrap"
          >
            <Shuffle className="h-3.5 w-3.5" />
            Idea aleatoria (1–50,000)
          </button>
        </div>

        {/* Random Spotlight */}
        {randomSpotlight && (
          <div className="rounded-xl border border-violet-500/40 bg-[#151828] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-violet-300 tabular-nums">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span className="font-mono font-semibold">{randomSpotlight.code}</span>
                  <span aria-hidden="true">·</span>
                  <span>{randomSpotlight.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{randomSpotlight.focus}</span>
                </div>
                <h3 className="font-display text-base font-bold text-slate-50">
                  {randomSpotlight.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-300">
                  {randomSpotlight.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSendIdeaToAI(randomSpotlight)}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-violet-500 whitespace-nowrap"
              >
                <Send className="h-3.5 w-3.5" />
                Desarrollar con NixoraAI
              </button>
            </div>
          </div>
        )}

        {/* Search & Category Controls */}
        <div className="space-y-3 rounded-xl border border-slate-800 bg-[#121521] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Buscar por palabra clave o ir directo a un número (ej. #24500, redstone, pvp)..."
                className="min-h-[42px] w-full rounded-lg border border-slate-700 bg-[#0B0D14] py-2 pl-9 pr-3 text-xs text-slate-100 placeholder:text-slate-500 focus:border-violet-500 focus:outline-none lg:text-sm"
              />
            </div>
            <div className="text-xs text-slate-400 tabular-nums whitespace-nowrap">
              {totalMatched.toLocaleString('es-ES')} resultados
            </div>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {['Todas', ...IDEA_CATEGORIES].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  category === cat
                    ? 'bg-violet-600 text-white'
                    : 'bg-[#0B0D14] text-slate-400 hover:text-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ideas Grid */}
        {items.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-[#121521] p-10 text-center">
            <p className="font-display text-sm font-semibold text-slate-200">
              No se encontraron ideas con «{query}»
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('Todas');
                setPage(1);
              }}
              className="mt-3 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-500"
            >
              Ver las 50,000 ideas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((idea) => (
              <div
                key={idea.id}
                className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#121521] p-4 transition-colors hover:border-violet-500/40"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 tabular-nums">
                    <span className="font-mono font-semibold text-violet-300">
                      {idea.code}
                    </span>
                    <span className="truncate">{idea.category}</span>
                  </div>
                  <h3 className="font-display text-sm font-bold leading-snug text-slate-100">
                    {idea.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-400">
                    {idea.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-800/70 pt-3">
                  <span className="truncate text-[11px] text-slate-500">
                    {idea.focus}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSendIdeaToAI(idea)}
                    className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-lg bg-violet-600/20 px-3 py-1.5 text-xs font-semibold text-violet-200 transition-colors hover:bg-violet-600 hover:text-white whitespace-nowrap"
                  >
                    <Send className="h-3 w-3" />
                    Usar en IA
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#121521] px-4 py-3 text-xs text-slate-300 tabular-nums">
            <span>
              Página <strong>{page.toLocaleString('es-ES')}</strong> de{' '}
              <strong>{totalPages.toLocaleString('es-ES')}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-slate-700 bg-[#0B0D14] px-3 py-1.5 font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-slate-700 bg-[#0B0D14] px-3 py-1.5 font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-40"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
