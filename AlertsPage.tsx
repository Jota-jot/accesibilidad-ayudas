import { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  MapPin,
  Users,
  Wrench,
  Accessibility,
  AlertCircle,
  Power,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CardListSkeleton } from '@/components/Skeleton';
import {
  fetchAlerts,
  createAlert,
  deleteAlert,
  toggleAlert,
  fetchAllTerritories,
  fetchBeneficiaries,
  fetchActions,
  fetchAccessibilityTypes,
} from '@/lib/data';
import type { Alert, Territory, Beneficiary, Action, AccessibilityType } from '@/types';

interface AlertsPageProps {
  onNavigate: (page: string) => void;
}

export function AlertsPage({ onNavigate }: AlertsPageProps) {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [actionsList, setActionsList] = useState<Action[]>([]);
  const [accessibilityTypes, setAccessibilityTypes] = useState<AccessibilityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [territoryId, setTerritoryId] = useState('');
  const [beneficiaryId, setBeneficiaryId] = useState('');
  const [actionId, setActionId] = useState('');
  const [accessibilityTypeId, setAccessibilityTypeId] = useState('');
  const [keywords, setKeywords] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const [al, terr, ben, act, acc] = await Promise.all([
          fetchAlerts(user.id),
          fetchAllTerritories(),
          fetchBeneficiaries(),
          fetchActions(),
          fetchAccessibilityTypes(),
        ]);
        setAlerts(al);
        setTerritories(terr);
        setBeneficiaries(ben);
        setActionsList(act);
        setAccessibilityTypes(acc);
      } catch (err) {
        console.error('Error loading alerts:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;
    setError(null);

    const { error } = await createAlert({
      name: name.trim(),
      territory_id: territoryId || null,
      beneficiary_id: beneficiaryId || null,
      action_id: actionId || null,
      accessibility_type_id: accessibilityTypeId || null,
      keywords: keywords.trim() || null,
      active: true,
    });

    if (error) {
      setError(error);
      return;
    }

    // Refresh
    const refreshed = await fetchAlerts(user.id);
    setAlerts(refreshed);
    setShowForm(false);
    setName('');
    setTerritoryId('');
    setBeneficiaryId('');
    setActionId('');
    setAccessibilityTypeId('');
    setKeywords('');
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteAlert(id);
    if (!error) {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    const { error } = await toggleAlert(id, !active);
    if (!error) {
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, active: !active } : a)));
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Inicia sesión para gestionar tus alertas
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
            <Bell className="w-7 h-7 text-teal-600" aria-hidden="true" />
            Mis alertas
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Recibe avisos cuando aparezcan ayudas que coincidan con tus criterios.
          </p>
        </div>
        <CardListSkeleton count={2} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6 animate-slide-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Bell className="w-7 h-7 text-teal-600" aria-hidden="true" />
            Mis alertas
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Recibe avisos cuando aparezcan ayudas que coincidan con tus criterios.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Nueva alerta
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 animate-scale-in"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Crear nueva alerta</h2>

          {error && (
            <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nombre de la alerta
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Ayudas para ascensor en Madrid"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Territorio
                </label>
                <select
                  value={territoryId}
                  onChange={(e) => setTerritoryId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                >
                  <option value="">Cualquiera</option>
                  {territories.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Beneficiario
                </label>
                <select
                  value={beneficiaryId}
                  onChange={(e) => setBeneficiaryId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                >
                  <option value="">Cualquiera</option>
                  {beneficiaries.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Actuación
                </label>
                <select
                  value={actionId}
                  onChange={(e) => setActionId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                >
                  <option value="">Cualquiera</option>
                  {actionsList.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tipo de accesibilidad
                </label>
                <select
                  value={accessibilityTypeId}
                  onChange={(e) => setAccessibilityTypeId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                >
                  <option value="">Cualquiera</option>
                  {accessibilityTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Palabras clave <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Ej: ascensor, rampa, baño accesible..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors"
            >
              Crear alerta
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {alerts.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No tienes alertas</h3>
          <p className="text-sm text-slate-500 mb-4">
            Crea una alerta para recibir avisos cuando aparezcan nuevas ayudas compatibles.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Crear alerta
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-xl border p-5 transition-all ${
                alert.active ? 'border-slate-200' : 'border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{alert.name}</h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        alert.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {alert.active ? 'Activa' : 'Pausada'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    {alert.territory_id && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        {territories.find((t) => t.id === alert.territory_id)?.name ?? 'Territorio'}
                      </span>
                    )}
                    {alert.beneficiary_id && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" aria-hidden="true" />
                        {beneficiaries.find((b) => b.id === alert.beneficiary_id)?.name ?? 'Beneficiario'}
                      </span>
                    )}
                    {alert.action_id && (
                      <span className="flex items-center gap-1">
                        <Wrench className="w-3.5 h-3.5" aria-hidden="true" />
                        {actionsList.find((a) => a.id === alert.action_id)?.name ?? 'Actuación'}
                      </span>
                    )}
                    {alert.accessibility_type_id && (
                      <span className="flex items-center gap-1">
                        <Accessibility className="w-3.5 h-3.5" aria-hidden="true" />
                        {accessibilityTypes.find((t) => t.id === alert.accessibility_type_id)?.name ?? 'Accesibilidad'}
                      </span>
                    )}
                    {alert.keywords && (
                      <span className="text-slate-400">"{alert.keywords}"</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggle(alert.id, alert.active)}
                    className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                    aria-label={alert.active ? 'Pausar alerta' : 'Activar alerta'}
                  >
                    <Power className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    aria-label="Eliminar alerta"
                  >
                    <Trash2 className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
