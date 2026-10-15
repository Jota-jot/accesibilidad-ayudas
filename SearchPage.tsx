import { useState, useEffect, useMemo } from 'react';
import {
  Search as SearchIcon,
  Filter,
  X,
  MapPin,
  Users,
  Wrench,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import type {
  AidProgramWithRelations,
  Territory,
  Beneficiary,
  Action,
  AccessibilityType,
  SearchCriteria,
  AidStatus,
  AdminLevel,
  MatchResult,
} from '@/types';
import {
  fetchAllAids,
  fetchAllTerritories,
  fetchBeneficiaries,
  fetchActions,
  fetchAccessibilityTypes,
  matchAids,
} from '@/lib/data';
import { AidQuality, StatusBadge, AdminLevelBadge, DemoBadge } from '@/components/Badges';
import { SearchResultsSkeleton } from '@/components/Skeleton';

interface SearchPageProps {
  initialCriteria: SearchCriteria | null;
  onNavigate: (page: string, params?: Record<string, unknown>) => void;
}

export function SearchPage({ initialCriteria, onNavigate }: SearchPageProps) {
  const [aids, setAids] = useState<AidProgramWithRelations[]>([]);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [actionsList, setActionsList] = useState<Action[]>([]);
  const [accessibilityTypes, setAccessibilityTypes] = useState<AccessibilityType[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [query, setQuery] = useState(initialCriteria?.query ?? '');
  const [territoryId, setTerritoryId] = useState(initialCriteria?.territoryId ?? '');
  const [beneficiaryId, setBeneficiaryId] = useState(initialCriteria?.beneficiaryId ?? '');
  const [actionIds, setActionIds] = useState<string[]>(initialCriteria?.actionIds ?? []);
  const [accessibilityTypeId, setAccessibilityTypeId] = useState(
    initialCriteria?.accessibilityTypeId ?? ''
  );
  const [status, setStatus] = useState<string>(initialCriteria?.status ?? '');
  const [adminLevel, setAdminLevel] = useState<string>(initialCriteria?.adminLevel ?? '');
  const [showFilters, setShowFilters] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [aidData, terrData, benData, actData, accData] = await Promise.all([
          fetchAllAids(),
          fetchAllTerritories(),
          fetchBeneficiaries(),
          fetchActions(),
          fetchAccessibilityTypes(),
        ]);
        setAids(aidData);
        setTerritories(terrData);
        setBeneficiaries(benData);
        setActionsList(actData);
        setAccessibilityTypes(accData);
      } catch (err) {
        let msg: string;
        if (err instanceof Error) {
          msg = err.message;
        } else if (err && typeof err === 'object') {
          const e = err as Record<string, unknown>;
          msg = [e.message, e.details, e.hint, e.code].filter(Boolean).join(' | ');
        } else {
          msg = String(err);
        }
        console.error('Error loading search data:', err);
        setLoadError(msg || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const criteria: SearchCriteria = useMemo(
    () => ({
      query: query.trim() || undefined,
      territoryId: territoryId || null,
      beneficiaryId: beneficiaryId || null,
      actionIds: actionIds.length > 0 ? actionIds : undefined,
      accessibilityTypeId: accessibilityTypeId || null,
      status: (status as AidStatus) || null,
      adminLevel: (adminLevel as AdminLevel) || null,
    }),
    [query, territoryId, beneficiaryId, actionIds, accessibilityTypeId, status, adminLevel]
  );

  const results: MatchResult[] = useMemo(
    () => matchAids(aids, criteria, territories),
    [aids, criteria, territories]
  );

  const hasActiveFilters =
    query || territoryId || beneficiaryId || actionIds.length > 0 || accessibilityTypeId || status || adminLevel;

  const toggleAction = (id: string) => {
    setActionIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setQuery('');
    setTerritoryId('');
    setBeneficiaryId('');
    setActionIds([]);
    setAccessibilityTypeId('');
    setStatus('');
    setAdminLevel('');
  };

  if (loadError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-sm font-semibold text-red-700 mb-2">Error al cargar las ayudas</p>
          <p className="text-xs text-red-600 font-mono mb-4">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-700 bg-white border border-red-300 hover:bg-red-50"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Buscar ayudas</h1>
          <p className="text-sm text-slate-500 mt-1">
            Encuentra ayudas y subvenciones para accesibilidad. Combina filtros para afinar tu búsqueda.
          </p>
        </div>
        <div className="flex gap-6">
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                  <div className="skeleton h-3 w-16 mb-2" />
                  <div className="skeleton h-9 w-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <SearchResultsSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 animate-slide-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Buscar ayudas</h1>
        <p className="text-sm text-slate-500 mt-1">
          Encuentra ayudas y subvenciones para accesibilidad. Combina filtros para afinar tu búsqueda.
        </p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <SearchIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Buscar por nombre, organismo, actuación, palabras clave..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar ayudas por texto"
            className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border transition-colors lg:hidden ${
            showFilters
              ? 'bg-teal-50 border-teal-300 text-teal-700'
              : 'bg-white border-slate-300 text-slate-600'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
          Filtros
        </button>
      </div>

      <div className="flex gap-6">
        {/* Filters sidebar */}
        <aside
          className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 flex-shrink-0`}
        >
          <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4" aria-hidden="true" />
                Filtros
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="space-y-5">
              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                  Estado
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  aria-label="Filtrar por estado"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                >
                  <option value="">Todos</option>
                  <option value="abierta">Abierta</option>
                  <option value="proxima">Próxima</option>
                  <option value="vigente">Programa vigente</option>
                  <option value="marco_estatal">Marco estatal</option>
                  <option value="en_tramitacion">En tramitación</option>
                  <option value="resuelta">Resuelta</option>
                  <option value="revisar">Revisar</option>
                  <option value="permanente">Permanente</option>
                  <option value="cerrada">Cerrada</option>
                  <option value="suspendida">Suspendida</option>
                </select>
              </div>

              {/* Admin level */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                  Administración
                </label>
                <select
                  value={adminLevel}
                  onChange={(e) => setAdminLevel(e.target.value)}
                  aria-label="Filtrar por nivel de administración"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                >
                  <option value="">Todas</option>
                  <option value="europeo">Europeo</option>
                  <option value="estatal">Estatal</option>
                  <option value="autonomico">Autonómico</option>
                  <option value="provincial">Provincial</option>
                  <option value="municipal">Municipal</option>
                </select>
              </div>

              {/* Territory */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                  Territorio
                </label>
                <select
                  value={territoryId}
                  onChange={(e) => setTerritoryId(e.target.value)}
                  aria-label="Filtrar por territorio"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                >
                  <option value="">Todo el territorio</option>
                  {territories.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Beneficiary */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                  Beneficiario
                </label>
                <select
                  value={beneficiaryId}
                  onChange={(e) => setBeneficiaryId(e.target.value)}
                  aria-label="Filtrar por beneficiario"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                >
                  <option value="">Todos</option>
                  {beneficiaries.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Accessibility type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                  Tipo de accesibilidad
                </label>
                <select
                  value={accessibilityTypeId}
                  onChange={(e) => setAccessibilityTypeId(e.target.value)}
                  aria-label="Filtrar por tipo de accesibilidad"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                >
                  <option value="">Todos</option>
                  {accessibilityTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                  Actuaciones
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {actionsList.map((a) => {
                    const selected = actionIds.includes(a.id);
                    return (
                      <label
                        key={a.id}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleAction(a.id)}
                          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                        />
                        <span className={selected ? 'text-teal-700 font-medium' : 'text-slate-600'}>
                          {a.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-600" role="status" aria-live="polite">
                <span className="font-semibold text-slate-900">{results.length}</span>{' '}
                {results.length === 1 ? 'ayuda encontrada' : 'ayudas encontradas'}
              </p>
              {hasActiveFilters && results.length > 0 && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Ordenadas por coincidencia con tu búsqueda. La coincidencia es orientativa y no garantiza elegibilidad.
                </p>
              )}
            </div>
          </div>

          {results.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <SearchIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No se han encontrado ayudas
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Prueba a cambiar los filtros o ampliar tu búsqueda.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, idx) => (
                <div
                  key={result.aid.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${Math.min(idx * 0.06, 0.48)}s` }}
                >
                  <AidCard
                    result={result}
                    onNavigate={onNavigate}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AidCard({
  result,
  onNavigate,
}: {
  result: MatchResult;
  onNavigate: (page: string, params?: Record<string, unknown>) => void;
}) {
  const { aid, score, matchedCriteria } = result;

  const financing = aid.aid_financing?.[0];
  const territoryName = aid.territory?.name ?? 'Estatal';

  return (
    <article
      className="bg-white rounded-xl border border-slate-200 p-5 card-lift hover:border-teal-300"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <StatusBadge status={aid.status} />
            <AdminLevelBadge level={aid.administration_level} />
            {aid.is_demo && <DemoBadge />}
            <AidQuality aid={aid} compact />
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
        {score > 0 && score < 100 && (
          <div className="flex-shrink-0 text-right">
            <div className={`text-lg font-bold ${score >= 75 ? 'text-teal-600' : score >= 50 ? 'text-amber-500' : 'text-slate-400'}`}>
              {score}%
            </div>
            <div className="text-[10px] text-slate-400">orientativo</div>
          </div>
        )}
      </div>

      {aid.short_description && (
        <p className="text-sm text-slate-600 line-clamp-2 mb-3">{aid.short_description}</p>
      )}

      <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
          {territoryName}
        </span>
        {aid.beneficiaries && aid.beneficiaries.length > 0 && (
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" aria-hidden="true" />
            {aid.beneficiaries.slice(0, 2).map((b) => b.name).join(', ')}
            {aid.beneficiaries.length > 2 && ` +${aid.beneficiaries.length - 2}`}
          </span>
        )}
        {aid.actions && aid.actions.length > 0 && (
          <span className="flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5" aria-hidden="true" />
            {aid.actions.slice(0, 2).map((a) => a.name).join(', ')}
            {aid.actions.length > 2 && ` +${aid.actions.length - 2}`}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2 text-sm">
          {financing?.financing_description ? (
            <span className="text-slate-600 line-clamp-1">
              {financing.financing_description}
            </span>
          ) : (
            <span className="text-slate-400 italic">Consultar convocatoria oficial.</span>
          )}
        </div>
        <span className="flex items-center gap-1 text-sm font-medium text-teal-600 flex-shrink-0">
          Ver ficha
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </span>
      </div>

      {matchedCriteria.length > 0 && score < 100 && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
          <span className="text-[10px] text-slate-400 mr-1 self-center">Coincide en:</span>
          {matchedCriteria.map((c) => (
            <span
              key={c}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-600"
            >
              {c}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
