import { AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { AidProgramWithRelations, AidStatus, AdminLevel } from '@/types';
import { formatDate, statusLabel, adminLevelLabel } from '@/lib/data';

const STATUS_STYLES: Record<AidStatus, string> = {
  abierta: 'bg-green-100 text-green-800 border-green-200',
  proxima: 'bg-blue-100 text-blue-800 border-blue-200',
  cerrada: 'bg-slate-100 text-slate-600 border-slate-200',
  permanente: 'bg-teal-100 text-teal-800 border-teal-200',
  suspendida: 'bg-red-100 text-red-800 border-red-200',
  vigente: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  en_tramitacion: 'bg-amber-100 text-amber-800 border-amber-200',
  resuelta: 'bg-blue-100 text-blue-800 border-blue-200',
  marco_estatal: 'bg-sky-100 text-sky-800 border-sky-200',
  revisar: 'bg-orange-100 text-orange-800 border-orange-200',
};

export function StatusBadge({ status }: { status: AidStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}

const ADMIN_LEVEL_STYLES: Record<AdminLevel, string> = {
  europeo: 'bg-blue-50 text-blue-700 border-blue-200',
  estatal: 'bg-teal-50 text-teal-700 border-teal-200',
  autonomico: 'bg-sky-50 text-sky-700 border-sky-200',
  provincial: 'bg-amber-50 text-amber-700 border-amber-200',
  municipal: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export function AdminLevelBadge({ level }: { level: AdminLevel }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${ADMIN_LEVEL_STYLES[level]}`}
    >
      {adminLevelLabel(level)}
    </span>
  );
}

export function DemoBadge() {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-orange-50 text-orange-700 border-orange-200">
      DEMO
    </span>
  );
}

interface AidQualityProps {
  aid: AidProgramWithRelations;
  compact?: boolean;
}

export function AidQuality({ aid, compact = false }: AidQualityProps) {
  const hasOfficialSource = Boolean(
    aid.official_url || aid.source_url || aid.sources?.some((source) => source.verified && source.url)
  );
  const hasVerification = Boolean(
    aid.last_verified_at || aid.sources?.some((source) => source.verified)
  );
  const hasDeadline = Boolean(aid.indefinite_deadline || aid.opening_date || aid.closing_date);
  const hasFinancing = Boolean(
    aid.aid_financing?.some(
      (financing) =>
        financing.amount !== null ||
        financing.percentage !== null ||
        financing.min_amount !== null ||
        financing.max_amount !== null ||
        financing.financing_description
    )
  );
  const checks = [hasOfficialSource, hasVerification, hasDeadline, hasFinancing];
  const score = checks.filter(Boolean).length;
  const isStrong = score >= 3;

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
          isStrong ? 'text-teal-700' : 'text-amber-700'
        }`}
        title={`${score} de 4 datos clave disponibles`}
      >
        {isStrong ? <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" /> : <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />}
        {isStrong ? 'Información contrastada' : 'Información parcial'}
      </span>
    );
  }

  const items = [
    { label: 'Fuente oficial enlazada', complete: hasOfficialSource },
    {
      label: aid.last_verified_at
        ? `Revisada el ${formatDate(aid.last_verified_at)}`
        : 'Revisión pendiente',
      complete: hasVerification,
    },
    { label: 'Plazo indicado', complete: hasDeadline },
    { label: 'Cuantía o porcentaje indicado', complete: hasFinancing },
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-4" aria-label="Calidad de la información">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {isStrong ? (
              <ShieldCheck className="w-5 h-5 text-teal-700" aria-hidden="true" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-700" aria-hidden="true" />
            )}
            <h2 className="text-sm font-semibold text-slate-900">
              {isStrong ? 'Información contrastada' : 'Información pendiente de completar'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {score} de 4 datos clave disponibles. Confirma siempre las condiciones en la convocatoria oficial.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">{score}/4</span>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-xs text-slate-600">
            {item.complete ? (
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" aria-hidden="true" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" aria-hidden="true" />
            )}
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
