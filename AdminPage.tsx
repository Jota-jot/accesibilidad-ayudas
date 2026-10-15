import { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  X,
  ArrowLeft,
  Eye,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  fetchAllAids,
  adminDeleteAid,
  adminUpdateAid,
  adminLevelLabel,
} from '@/lib/data';
import type { AidProgramWithRelations, AidStatus } from '@/types';
import { DemoBadge } from '@/components/Badges';
import { AdminAidForm } from '@/components/AdminAidForm';

interface AdminPageProps {
  onNavigate: (page: string, params?: Record<string, unknown>) => void;
}

type AdminView = 'list' | 'create' | 'edit';

export function AdminPage({ onNavigate }: AdminPageProps) {
  const { isAdmin, loading: authLoading } = useAuth();
  const [view, setView] = useState<AdminView>('list');
  const [aids, setAids] = useState<AidProgramWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [editingAid, setEditingAid] = useState<AidProgramWithRelations | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) loadAids();
  }, [isAdmin]);

  async function loadAids() {
    setLoading(true);
    try {
      const data = await fetchAllAids();
      setAids(data);
    } catch (err) {
      console.error('Error loading aids:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredAids = aids.filter((a) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !a.title.toLowerCase().includes(q) &&
        !a.organism?.toLowerCase().includes(q) &&
        !a.administration_name?.toLowerCase().includes(q)
      )
        return false;
    }
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    setActionError(null);
    const { error } = await adminDeleteAid(id);
    if (error) {
      setActionError(error);
    } else {
      setAids((prev) => prev.filter((a) => a.id !== id));
      setDeleteConfirm(null);
    }
  };

  const handleQuickStatusChange = async (id: string, status: AidStatus) => {
    setActionError(null);
    const { error } = await adminUpdateAid(id, { status });
    if (error) {
      setActionError(error);
    } else {
      setAids((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    }
  };

  const handleVerify = async (id: string) => {
    setActionError(null);
    const { error } = await adminUpdateAid(id, { last_verified_at: new Date().toISOString() });
    if (error) {
      setActionError(error);
    } else {
      setAids((prev) =>
        prev.map((a) => (a.id === id ? { ...a, last_verified_at: new Date().toISOString() } : a))
      );
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Acceso restringido
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Necesitas permisos de administrador para acceder a este panel.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (view === 'create' || view === 'edit') {
    return (
      <AdminAidForm
        aid={view === 'edit' ? editingAid : null}
        onCancel={() => {
          setView('list');
          setEditingAid(null);
        }}
        onSaved={() => {
          setView('list');
          setEditingAid(null);
          loadAids();
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Shield className="w-7 h-7 text-teal-600" aria-hidden="true" />
            Panel de administración
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona las ayudas, su estado y verificación.
          </p>
        </div>
        <button
          onClick={() => setView('create')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Crear ayuda
        </button>
      </div>

      {actionError && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
          <X className="w-5 h-5 text-red-600 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-red-700">{actionError}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Buscar por título, organismo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
        >
          <option value="">Todos los estados</option>
          <option value="abierta">Abierta</option>
          <option value="proxima">Próxima</option>
          <option value="cerrada">Cerrada</option>
          <option value="permanente">Permanente</option>
          <option value="suspendida">Suspendida</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredAids.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-sm text-slate-500">No se encontraron ayudas.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wide px-4 py-3">
                    Título
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wide px-4 py-3 hidden md:table-cell">
                    Estado
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">
                    Nivel
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">
                    Verificación
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wide px-4 py-3">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAids.map((aid) => (
                  <tr key={aid.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {aid.is_demo && <DemoBadge />}
                        <span className="text-sm font-medium text-slate-900">
                          {aid.title}
                        </span>
                      </div>
                      {aid.organism && (
                        <p className="text-xs text-slate-500 mt-0.5">{aid.organism}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <select
                        value={aid.status}
                        onChange={(e) =>
                          handleQuickStatusChange(aid.id, e.target.value as AidStatus)
                        }
                        className="text-xs px-2 py-1 rounded border border-slate-300 focus:ring-1 focus:ring-teal-500 outline-none bg-white"
                      >
                        <option value="abierta">Abierta</option>
                        <option value="proxima">Próxima</option>
                        <option value="cerrada">Cerrada</option>
                        <option value="permanente">Permanente</option>
                        <option value="suspendida">Suspendida</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-slate-600">
                        {adminLevelLabel(aid.administration_level)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {aid.last_verified_at ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          Verificada
                        </span>
                      ) : (
                        <button
                          onClick={() => handleVerify(aid.id)}
                          className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                        >
                          Marcar verificada
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onNavigate('aid-detail', { slug: aid.slug })}
                          className="p-1.5 rounded text-slate-400 hover:text-teal-600 hover:bg-teal-50"
                          aria-label="Ver ficha"
                        >
                          <Eye className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingAid(aid);
                            setView('edit');
                          }}
                          className="p-1.5 rounded text-slate-400 hover:text-teal-600 hover:bg-teal-50"
                          aria-label="Editar"
                        >
                          <Edit2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(aid.id)}
                          className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              ¿Eliminar esta ayuda?
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Esta acción no se puede deshacer. Se eliminarán también todos los datos asociados
              (requisitos, documentos, financiación, fuentes y relaciones).
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
