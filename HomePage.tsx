import { useState, useEffect } from 'react';
import {
  Home as HomeIcon,
  Building2,
  Building,
  MapPin,
  Users,
  Wrench,
  Search,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Accessibility,
  Sparkles,
} from 'lucide-react';
import type { Territory, Beneficiary, Action } from '@/types';
import { fetchAllTerritories, fetchTerritories, fetchBeneficiaries, fetchActions } from '@/lib/data';
import type { SearchCriteria } from '@/types';

interface HomePageProps {
  onSearch: (criteria: SearchCriteria) => void;
  onNavigate: (page: string) => void;
}

type WizardStep = 'what' | 'where' | 'who' | 'action' | 'results';

const WHAT_OPTIONS = [
  { value: 'vivienda', label: 'Mi vivienda', icon: HomeIcon },
  { value: 'edificio', label: 'Mi edificio', icon: Building2 },
  { value: 'espacio-publico', label: 'Un espacio público', icon: MapPin },
  { value: 'municipio', label: 'Un municipio', icon: Building },
  { value: 'proyecto', label: 'Un proyecto', icon: Sparkles },
  { value: 'empresa-entidad', label: 'Una empresa/entidad', icon: Building },
  { value: 'otro', label: 'Otro', icon: Accessibility },
];

export function HomePage({ onSearch, onNavigate }: HomePageProps) {
  const [step, setStep] = useState<WizardStep>('what');
  const [communities, setCommunities] = useState<Territory[]>([]);
  const [provinces, setProvinces] = useState<Territory[]>([]);
  const [municipalities, setMunicipalities] = useState<Territory[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [actions, setActions] = useState<Action[]>([]);

  const [what, setWhat] = useState<string>('');
  const [euScope, setEuScope] = useState<boolean>(false);
  const [communityId, setCommunityId] = useState<string>('');
  const [provinceId, setProvinceId] = useState<string>('');
  const [municipalityId, setMunicipalityId] = useState<string>('');
  const [beneficiaryId, setBeneficiaryId] = useState<string>('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const [allTerrs, bens, acts] = await Promise.all([
        fetchAllTerritories(),
        fetchBeneficiaries(),
        fetchActions(),
      ]);
      setCommunities(allTerrs.filter((t) => t.type === 'comunidad'));
      setBeneficiaries(bens);
      setActions(acts);
    })().catch(console.error);
  }, []);

  useEffect(() => {
    if (communityId) {
      fetchTerritories(communityId)
        .then((provs) => setProvinces(provs))
        .catch(console.error);
    } else {
      setProvinces([]);
    }
    setProvinceId('');
    setMunicipalityId('');
    setMunicipalities([]);
  }, [communityId]);

  useEffect(() => {
    if (provinceId) {
      fetchTerritories(provinceId)
        .then((muns) => setMunicipalities(muns))
        .catch(console.error);
    } else {
      setMunicipalities([]);
    }
    setMunicipalityId('');
  }, [provinceId]);

  const toggleAction = (id: string) => {
    setSelectedActions((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSearch = () => {
    const territoryId = euScope ? null : (municipalityId || provinceId || communityId || null);
    onSearch({
      territoryId,
      beneficiaryId: beneficiaryId || null,
      actionIds: selectedActions.length > 0 ? selectedActions : undefined,
    });
  };

  const canProceedWhat = !!what;
  const canProceedWhere = euScope || !!communityId;
  const canProceedWho = !!beneficiaryId;
  const canSearch = selectedActions.length > 0;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 via-teal-700 to-teal-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative">
          <div className="max-w-3xl animate-slide-up">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Encuentra las ayudas disponibles para hacer accesible una vivienda, edificio,
              municipio o proyecto.
            </h1>
            <p className="mt-4 text-lg text-teal-50 leading-relaxed">
              Buscador de ayudas y subvenciones para accesibilidad en España. Filtra por
              territorio, tipo de beneficiario y actuación.
            </p>
          </div>
        </div>
      </section>

      {/* Wizard */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 animate-scale-in">
          {/* Progress indicator */}
          <ol className="flex items-center justify-between mb-8" role="list">
            {[
              { key: 'what', label: 'Qué' },
              { key: 'where', label: 'Dónde' },
              { key: 'who', label: 'Quién' },
              { key: 'action', label: 'Actuación' },
            ].map((s, i) => {
              const stepOrder = ['what', 'where', 'who', 'action', 'results'];
              const currentIdx = stepOrder.indexOf(step);
              const isActive = currentIdx === i;
              const isDone = currentIdx > i;
              return (
                <li key={s.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-teal-600 text-white'
                          : isDone
                            ? 'bg-teal-100 text-teal-700'
                            : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:block ${
                        isActive ? 'text-teal-700' : isDone ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < 3 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${isDone ? 'bg-teal-200' : 'bg-slate-100'}`}
                    />
                  )}
                </li>
              );
            })}
          </ol>

          {/* Step: What */}
          {step === 'what' && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                ¿Qué necesitas hacer accesible?
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Selecciona el tipo de proyecto o espacio.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {WHAT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = what === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setWhat(opt.value)}
                      aria-pressed={selected}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        selected
                          ? 'border-teal-600 bg-teal-50 text-teal-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Icon className="w-7 h-7" aria-hidden="true" />
                      <span className="text-sm font-medium text-center">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setStep('where')}
                  disabled={!canProceedWhat}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Step: Where */}
          {step === 'where' && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">¿Dónde?</h2>
              <p className="text-sm text-slate-500 mb-6">
                Selecciona el ámbito territorial. Si buscas ayudas europeas o estatales,
                puedes omitir la comunidad autónoma.
              </p>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={euScope}
                    onChange={(e) => {
                      setEuScope(e.target.checked);
                      if (e.target.checked) {
                        setCommunityId('');
                        setProvinceId('');
                        setMunicipalityId('');
                      }
                    }}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  Toda la Unión Europea / España (ayudas europeas y estatales)
                </label>
                {!euScope && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Comunidad Autónoma
                  </label>
                  <select
                    value={communityId}
                    onChange={(e) => setCommunityId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                  >
                    <option value="">Selecciona una comunidad autónoma...</option>
                    {communities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                )}
                {provinces.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Provincia <span className="text-slate-400 font-normal">(opcional)</span>
                    </label>
                    <select
                      value={provinceId}
                      onChange={(e) => {
                        setProvinceId(e.target.value);
                        setMunicipalityId('');
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                    >
                      <option value="">Todas las provincias</option>
                      {provinces.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {provinceId && municipalities.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Municipio <span className="text-slate-400 font-normal">(opcional)</span>
                    </label>
                    <select
                      value={municipalityId}
                      onChange={(e) => setMunicipalityId(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                    >
                      <option value="">Todos los municipios</option>
                      {municipalities.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep('what')}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  Atrás
                </button>
                <button
                  onClick={() => setStep('who')}
                  disabled={!canProceedWhere}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Step: Who */}
          {step === 'who' && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">¿Quién solicita la ayuda?</h2>
              <p className="text-sm text-slate-500 mb-6">
                Selecciona el tipo de beneficiario.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {beneficiaries.map((b) => {
                  const selected = beneficiaryId === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setBeneficiaryId(b.id)}
                      aria-pressed={selected}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                        selected
                          ? 'border-teal-600 bg-teal-50 text-teal-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Users className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                      <span>{b.name}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep('where')}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  Atrás
                </button>
                <button
                  onClick={() => setStep('action')}
                  disabled={!canProceedWho}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Step: Action */}
          {step === 'action' && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">¿Qué necesitas hacer?</h2>
              <p className="text-sm text-slate-500 mb-6">
                Selecciona una o varias actuaciones.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                {actions.map((a) => {
                  const selected = selectedActions.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      onClick={() => toggleAction(a.id)}
                      aria-pressed={selected}
                      className={`flex items-start gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                        selected
                          ? 'border-teal-600 bg-teal-50 text-teal-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Wrench className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{a.name}</span>
                      {selected && (
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 ml-auto" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep('who')}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  Atrás
                </button>
                <button
                  onClick={handleSearch}
                  disabled={!canSearch}
                  className="flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-bold bg-teal-600 text-white hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors shadow-sm"
                >
                  <Search className="w-4 h-4" aria-hidden="true" />
                  Buscar ayudas
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Info section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center animate-slide-up stagger-1">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-teal-600" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Busca ayudas</h3>
            <p className="text-sm text-slate-500">
              Encuentra subvenciones y ayudas para accesibilidad filtrando por territorio,
              tipo de beneficiario y actuación.
            </p>
          </div>
          <div className="text-center animate-slide-up stagger-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-teal-600" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Verifica requisitos</h3>
            <p className="text-sm text-slate-500">
              Consulta los requisitos, la documentación necesaria y la financiación disponible
              de cada ayuda.
            </p>
          </div>
          <div className="text-center animate-slide-up stagger-5">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7 text-teal-600" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Fuente oficial</h3>
            <p className="text-sm text-slate-500">
              Cada ayuda remite a la convocatoria oficial publicada por la administración
              competente.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('search')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            Ir al buscador avanzado
          </button>
        </div>
      </section>
    </div>
  );
}
