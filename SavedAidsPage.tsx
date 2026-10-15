import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Trash2, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchSavedAids, fetchAidById, unsaveAid } from '@/lib/data';
import type { AidProgramWithRelations } from '@/types';
import { StatusBadge, AdminLevelBadge, DemoBadge } from '@/components/Badges';
import { CardListSkeleton } from '@/components/Skeleton';

interface SavedAidsPageProps {
  onNavigate: (page: string, params?: Record<string, unknown>) => void;
}

export function SavedAidsPage({ onNavigate }: SavedAidsPageProps) {
  const { user } = useAuth();
  const [aids, setAids] = useState<AidProgramWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoadError(false);
        const saved = await fetchSavedAids(user.id);
        const aidDetails = await Promise.all(
          saved.map((s) => fetchAidById(s.aid_id))
        );
        setAids(aidDetails.filter(Boolean) as AidProgramWithRelations[]);
      } catch (err) {
        console.error('Error loading saved aids:', err);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleRemove = async (aidId: string) => {
    if (!user) return;
    const { error } = await unsaveAid(user.id, aidId);
    if (!error) {
      setAids((prev) => prev.filter((a) => a.id !== aidId));
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Inicia sesión para ver tus ayudas guardadas
          </h2>
          <button
            onClick={() => onNavigate('login')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 animate-slide-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Bookmark className="w-7 h-7 text-teal-600" aria-hidden="true" />
            Mis ayudas guardadas
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Las ayudas que has guardado para consultar más tarde.
          </p>
        </div>
        <CardListSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 animate-slide-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Bookmark className="w-7 h-7 text-teal-600" aria-hidden="true" />
          Mis ayudas guardadas
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Las ayudas que has guardado para consultar más tarde.
        </p>
      </div>

      {loadError ? (
        <div className="bg-red-50 rounded-xl border border-red-200 p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">No se han podido cargar tus ayudas</h3>
          <p className="text-sm text-red-700">Comprueba tu conexión y vuelve a intentarlo.</p>
        </div>
      ) : aids.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No tienes ayudas guardadas
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Busca ayudas y guarda las que te interesen para consultarlas aquí.
          </p>
          <button
            onClick={() => onNavigate('search')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100"
          >
            Buscar ayudas
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {aids.map((aid, idx) => (
            <div
              key={aid.id}
              className="bg-white rounded-xl border border-slate-200 p-5 card-lift hover:border-teal-300 animate-slide-up"
              style={{ animationDelay: `${Math.min(idx * 0.08, 0.32)}s` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <StatusBadge status={aid.status} />
                    <AdminLevelBadge level={aid.administration_level} />
                    {aid.is_demo && <DemoBadge />}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    <a
                      href={`#/ayuda/${aid.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('aid-detail', { slug: aid.slug });
                      }}
                      className="hover:text-teal-700 transition-colors"
                    >
                      {aid.title}
                    </a>
                  </h3>
                  {aid.organism && (
                    <p className="text-sm text-slate-500 mt-1">{aid.organism}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleRemove(aid.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    aria-label="Eliminar de guardados"
                  >
                    <Trash2 className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1.5 text-sm text-teal-600">
                  <BookmarkCheck className="w-4 h-4" aria-hidden="true" />
                  Guardada
                </span>
                <button
                  onClick={() => onNavigate('aid-detail', { slug: aid.slug })}
                  className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:gap-2 transition-all"
                >
                  Ver ficha
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
