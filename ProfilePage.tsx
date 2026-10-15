import { useState } from 'react';
import { User, Mail, Phone, Building2, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/lib/data';
import type { UserType } from '@/types';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

const USER_TYPES: { value: UserType; label: string }[] = [
  { value: 'particular', label: 'Particular' },
  { value: 'profesional', label: 'Profesional' },
  { value: 'entidad', label: 'Entidad' },
  { value: 'administracion', label: 'Administración' },
];

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [userType, setUserType] = useState<UserType>(profile?.user_type ?? 'particular');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [companyName, setCompanyName] = useState(profile?.company_name ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Inicia sesión para ver tu perfil
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const { error } = await updateProfile(user.id, {
      full_name: fullName || null,
      user_type: userType,
      phone: phone || null,
      company_name: companyName || null,
    });

    if (error) {
      setError(error);
    } else {
      setSaved(true);
      await refreshProfile();
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <User className="w-7 h-7 text-teal-600" aria-hidden="true" />
          Mi perfil
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Gestiona tu información personal y tipo de usuario.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 animate-slide-up">
        {/* Email (read-only) */}
        <div className="mb-6 pb-6 border-b border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Correo electrónico
          </label>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Mail className="w-4 h-4" aria-hidden="true" />
            {user.email}
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {saved && (
          <div className="mb-4 flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-green-700">Perfil actualizado correctamente.</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nombre completo
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Tipo de usuario
            </label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value as UserType)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
            >
              {USER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Teléfono
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Tu teléfono"
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          {(userType === 'profesional' || userType === 'entidad' || userType === 'administracion') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nombre de la empresa/entidad
              </label>
              <div className="relative">
                <Building2
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Nombre de tu empresa o entidad"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 disabled:bg-slate-300 transition-colors"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" aria-hidden="true" />
                Guardar cambios
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
