import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  Wrench,
  Accessibility,
  FileText,
  CheckCircle2,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  AlertCircle,
  Info,
  Euro,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Lightbulb,
  Send,
  FileCheck,
} from 'lucide-react';
import type { AidProgramWithRelations, ItemCategory } from '@/types';
import { fetchAidBySlug, formatCurrency, formatDate, adminLevelLabel } from '@/lib/data';
import { useAuth } from '@/context/AuthContext';
import { saveAid, unsaveAid, isAidSaved } from '@/lib/data';
import { AidQuality, StatusBadge, AdminLevelBadge, DemoBadge } from '@/components/Badges';
import { AidDetailSkeleton } from '@/components/Skeleton';

interface AidDetailPageProps {
  slug: string;
  onNavigate: (page: string, params?: Record<string, unknown>) => void;
}

const CATEGORY_META: Record<ItemCategory, { label: string; icon: typeof CheckCircle2; color: string; bg: string; border: string }> = {
  obligatorio: {
    label: 'Obligatorio',
    icon: AlertCircle,
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
  puede_ser_necesario: {
    label: 'Puede ser necesario',
    icon: AlertTriangle,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  recomendado: {
    label: 'Recomendado',
    icon: Lightbulb,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
};

export function AidDetailPage({ slug, onNavigate }: AidDetailPageProps) {
  const { user } = useAuth();
  const [aid, setAid] = useState<AidProgramWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAidBySlug(slug);
        setAid(data);
        if (data && user) {
          const isSaved = await isAidSaved(user.id, data.id);
          setSaved(isSaved);
        }
      } catch (err) {
        console.error('Error loading aid:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, user]);

  const handleSaveToggle = async () => {
    if (!user || !aid) return;
    setSaveError(null);
    if (saved) {
      const { error } = await unsaveAid(user.id, aid.id);
      if (error) {
        setSaveError(error);
      } else {
        setSaved(false);
      }
    } else {
      const { error } = await saveAid(user.id, aid.id);
      if (error) {
        setSaveError(error);
      } else {
        setSaved(true);
      }
    }
  };

  if (loading) {
    return <AidDetailSkeleton />;
  }

  if (!aid) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Ayuda no encontrada</h2>
          <p className="text-sm text-slate-500 mb-4">
            No se ha encontrado la ayuda que buscas.
          </p>
          <button
            onClick={() => onNavigate('search')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Volver al buscador
          </button>
        </div>
      </div>
    );
  }

  const financing = aid.aid_financing?.[0];
  const primaryUrl = aid.official_url || aid.application_url || null;
  const secondaryUrl = aid.source_url || null;

  // Determine deadline text
  let deadlineText = 'Consultar convocatoria oficial';
  let deadlineUncertain = true;
  if (aid.indefinite_deadline) {
    deadlineText = 'Plazo permanente';
    deadlineUncertain = false;
  } else if (aid.closing_date) {
    if (aid.opening_date) {
      deadlineText = `Del ${formatDate(aid.opening_date)} al ${formatDate(aid.closing_date)}`;
    } else {
      deadlineText = `Hasta el ${formatDate(aid.closing_date)}`;
    }
    deadlineUncertain = false;
  } else if (aid.opening_date) {
    deadlineText = `Desde el ${formatDate(aid.opening_date)}`;
    deadlineUncertain = false;
  }

  // Determine financing summary
  const hasFinancing = financing && (
    financing.percentage !== null ||
    financing.amount !== null ||
    financing.min_amount !== null ||
    financing.max_amount !== null ||
    financing.financing_description
  );

  // Build financing summary text
  let financingSummary = '';
  if (financing) {
    const parts: string[] = [];
    if (financing.percentage !== null) parts.push(`${financing.percentage}%`);
    if (financing.max_amount !== null) parts.push(`hasta ${formatCurrency(financing.max_amount)}`);
    if (financing.amount !== null) parts.push(formatCurrency(financing.amount));
    if (financing.min_amount !== null && financing.max_amount === null) parts.push(`mín. ${formatCurrency(financing.min_amount)}`);
    financingSummary = parts.join(' · ');
  }

  // Categorize documents
  const docsByCategory = (aid.documents ?? []).reduce(
    (acc, d) => {
      const cat = d.document_type ?? 'obligatorio';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(d);
      return acc;
    },
    {} as Record<ItemCategory, typeof aid.documents>
  );

  const sortedDocs = (['obligatorio', 'puede_ser_necesario', 'recomendado'] as ItemCategory[])
    .map((cat) => ({ cat, docs: (docsByCategory[cat] ?? []).sort((a, b) => a.sort_order - b.sort_order) }))
    .filter((g) => g.docs.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => onNavigate('search')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Volver al buscador
      </button>

      {/* A. RESUMEN */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6 animate-slide-up">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <StatusBadge status={aid.status} />
            <AdminLevelBadge level={aid.administration_level} />
            {aid.is_demo && <DemoBadge />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            {aid.title}
          </h1>
          {aid.organism && (
            <p className="text-base text-slate-600 mt-2 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-400" aria-hidden="true" />
              {aid.organism}
            </p>
          )}

          {/* Key facts row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <KeyFact
              icon={Clock}
              label="Plazo"
              value={deadlineText}
              uncertain={deadlineUncertain}
            />
            <KeyFact
              icon={MapPin}
              label="Territorio"
              value={aid.territory?.name ?? 'Estatal (toda España)'}
            />
            <KeyFact
              icon={Building2}
              label="Administración"
              value={adminLevelLabel(aid.administration_level)}
            />
            {hasFinancing && financingSummary ? (
              <KeyFact
                icon={Euro}
                label="Cuantía"
                value={financingSummary}
              />
            ) : (
              <KeyFact
                icon={ShieldCheck}
                label="Verificación"
                value={aid.last_verified_at ? formatDate(aid.last_verified_at) : 'Sin verificar'}
              />
            )}
          </div>

          <div className="mt-6">
            <AidQuality aid={aid} />
          </div>

          {/* En pocas palabras */}
          {aid.short_description && (
            <div className="mt-6 bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                En pocas palabras
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {aid.short_description}
              </p>
            </div>
          )}

          {/* Save button */}
          {user ? (
            <div className="mt-5">
              <button
                onClick={handleSaveToggle}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  saved
                    ? 'bg-teal-50 text-teal-700 border border-teal-200'
                    : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {saved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" aria-hidden="true" />
                    Ayuda guardada
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" aria-hidden="true" />
                    Guardar esta ayuda
                  </>
                )}
              </button>
              {saveError && (
                <p className="text-xs text-red-600 mt-2">{saveError}</p>
              )}
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-400">
              <button
                onClick={() => onNavigate('login')}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Inicia sesión
              </button>{' '}
              para guardar esta ayuda.
            </p>
          )}
        </div>
      </div>

      {/* B. ¿PARA QUIÉN ES? */}
      <Section title="¿Para quién es?" icon={Users}>
        {aid.beneficiaries && aid.beneficiaries.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {aid.beneficiaries.map((b) => (
              <span
                key={b.id}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-slate-100 text-slate-700"
              >
                {b.name}
              </span>
            ))}
          </div>
        ) : aid.beneficiary_description ? (
          <p className="text-sm text-slate-600 leading-relaxed">{aid.beneficiary_description}</p>
        ) : (
          <EmptyHint />
        )}
        {aid.beneficiary_description && aid.beneficiaries && aid.beneficiaries.length > 0 && (
          <p className="text-sm text-slate-500 leading-relaxed mt-3">
            {aid.beneficiary_description}
          </p>
        )}
      </Section>

      {/* C. ¿QUÉ CUBRE? */}
      <Section title="¿Qué cubre?" icon={Wrench}>
        {aid.eligible_expenses && (
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-4">
            {aid.eligible_expenses}
          </p>
        )}
        {aid.actions && aid.actions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {aid.actions.map((a) => (
              <span
                key={a.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-teal-50 text-teal-700"
              >
                <Wrench className="w-3.5 h-3.5" aria-hidden="true" />
                {a.name}
              </span>
            ))}
          </div>
        ) : null}
        {aid.accessibility_types && aid.accessibility_types.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {aid.accessibility_types.map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-cyan-50 text-cyan-700"
              >
                <Accessibility className="w-3.5 h-3.5" aria-hidden="true" />
                {t.name}
              </span>
            ))}
          </div>
        )}
        {!aid.eligible_expenses && (!aid.actions || aid.actions.length === 0) && (!aid.accessibility_types || aid.accessibility_types.length === 0) && (
          <EmptyHint />
        )}
      </Section>

      {/* D. ¿CUÁNTO? */}
      {hasFinancing && (
        <Section title="¿Cuánto?" icon={Euro}>
          <div className="space-y-3">
            {financing!.percentage !== null && (
              <FinancingRow label="Porcentaje" value={`${financing!.percentage}%`} />
            )}
            {financing!.amount !== null && (
              <FinancingRow label="Importe" value={formatCurrency(financing!.amount)} />
            )}
            {financing!.min_amount !== null && (
              <FinancingRow label="Importe mínimo" value={formatCurrency(financing!.min_amount)} />
            )}
            {financing!.max_amount !== null && (
              <FinancingRow label="Importe máximo" value={formatCurrency(financing!.max_amount)} />
            )}
            {financing!.financing_description && (
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-lg p-4 mt-2">
                {financing!.financing_description}
              </p>
            )}
          </div>
        </Section>
      )}

      {/* E. ¿QUÉ NECESITAS? */}
      <Section title="¿Qué necesitas preparar?" icon={FileCheck}>
        {aid.requirements && aid.requirements.length > 0 ? (
          <div className="mb-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Requisitos
            </h3>
            <ul className="space-y-2">
              {aid.requirements
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((r) => {
                  const cat = r.requirement_type ?? 'obligatorio';
                  const meta = CATEGORY_META[cat];
                  const Icon = meta.icon;
                  return (
                    <li key={r.id} className="flex items-start gap-3 text-sm text-slate-600">
                      <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${meta.color}`} aria-hidden="true" />
                      <span>{r.requirement_text}</span>
                    </li>
                  );
                })}
            </ul>
          </div>
        ) : null}

        {sortedDocs.length > 0 ? (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Documentación habitual
            </h3>
            <div className="space-y-4">
              {sortedDocs.map((group) => {
                const meta = CATEGORY_META[group.cat];
                const Icon = meta.icon;
                return (
                  <div key={group.cat}>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.bg} ${meta.color} border ${meta.border} mb-2`}>
                      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                      {meta.label}
                    </div>
                    <ul className="space-y-2 ml-1">
                      {group.docs.map((d) => (
                        <li key={d.id} className="flex items-start gap-3 text-sm text-slate-600">
                          <FileText className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                          <div>
                            <span>{d.document_name}</span>
                            {d.description && (
                              <p className="text-xs text-slate-400 mt-0.5">{d.description}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {(!aid.requirements || aid.requirements.length === 0) && sortedDocs.length === 0 && (
          <EmptyHint />
        )}
      </Section>

      {/* F. ¿DÓNDE LO SOLICITO? */}
      {(primaryUrl || secondaryUrl || aid.organism || aid.contact_information) && (
        <Section title="¿Dónde lo solicito?" icon={Send}>
          {primaryUrl ? (
            <a
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-bold bg-teal-600 text-white hover:bg-teal-700 transition-colors mb-4"
            >
              {aid.application_url && !aid.official_url ? 'Ir a la solicitud oficial' : 'Ir a la convocatoria oficial'}
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          ) : (
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                No hay un enlace directo disponible. Consulta la convocatoria en la página del organismo:
                <span className="font-medium text-slate-800"> {aid.organism ?? aid.administration_name ?? 'No especificado'}</span>
              </p>
            </div>
          )}

          {secondaryUrl && (
            <a
              href={secondaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-800"
            >
              Ver fuente adicional
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          )}

          {(aid.organism || aid.contact_information) && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1 text-sm text-slate-500">
              {aid.organism && (
                <p className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  Organismo responsable: <span className="text-slate-700 font-medium">{aid.organism}</span>
                </p>
              )}
              {aid.contact_information && (
                <p className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  {aid.contact_information}
                </p>
              )}
            </div>
          )}
        </Section>
      )}

      {/* G. FUENTE OFICIAL */}
      {aid.sources && aid.sources.length > 0 && (
        <Section title="Fuente oficial" icon={Info}>
          <div className="space-y-2">
            {aid.sources.map((s) => (
              <div key={s.id} className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-900">{s.name}</span>
                  {s.verified && (
                    <span className="inline-flex items-center gap-1 text-xs text-teal-600">
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      Verificada
                    </span>
                  )}
                </div>
                {s.url && (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1 break-all"
                  >
                    {s.url}
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  </a>
                )}
                {s.document_reference && (
                  <p className="text-xs text-slate-400 mt-1">
                    Referencia: {s.document_reference}
                  </p>
                )}
                {s.publication_date && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    Publicado: {formatDate(s.publication_date)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* H. ¿QUÉ HAGO AHORA? */}
      <div className="bg-teal-50 rounded-2xl border border-teal-200 p-6 mt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2">¿Qué hago ahora?</h3>
        {sortedDocs.length > 0 && (
          <p className="text-sm text-slate-600 mb-4">
            Antes de solicitarla, prepara la documentación indicada arriba.
          </p>
        )}
        {primaryUrl ? (
          <a
            href={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-bold bg-teal-600 text-white hover:bg-teal-700 transition-colors"
          >
            {aid.application_url && !aid.official_url ? 'Ir a la solicitud oficial' : 'Ir a la convocatoria oficial'}
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        ) : (
          <p className="text-sm text-slate-600 bg-white rounded-lg p-4 border border-teal-100">
            Consulta la convocatoria oficial en la página del organismo responsable para
            iniciar la solicitud.
          </p>
        )}
      </div>

      {/* Notes */}
      {aid.notes && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 mt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-amber-800 leading-relaxed">{aid.notes}</p>
          </div>
        </div>
      )}

      {/* Last updated */}
      {aid.updated_at && (
        <p className="text-xs text-slate-400 text-center mt-6">
          Información actualizada el {formatDate(aid.updated_at)}
        </p>
      )}
    </div>
  );
}

function KeyFact({
  icon: Icon,
  label,
  value,
  uncertain,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  uncertain?: boolean;
}) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
        {label}
      </div>
      <p className={`text-sm font-medium ${uncertain ? 'text-slate-500 italic' : 'text-slate-900'}`}>
        {value}
      </p>
    </div>
  );
}

function FinancingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function EmptyHint() {
  return (
    <p className="text-sm text-slate-400 italic">Consulta la convocatoria oficial.</p>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-4 animate-slide-up">
      <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-teal-600" aria-hidden="true" />}
        {title}
      </h2>
      {children}
    </section>
  );
}
