import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  adminCreateAid,
  adminUpdateAid,
  adminSetAidRelations,
  adminReplaceRequirements,
  adminReplaceDocuments,
  adminReplaceFinancing,
  fetchAllTerritories,
  fetchBeneficiaries,
  fetchActions,
  fetchAccessibilityTypes,
  fetchSolutions,
  slugify,
} from '@/lib/data';
import type {
  AidProgramWithRelations,
  Territory,
  Beneficiary,
  Action,
  AccessibilityType,
  Solution,
  AidStatus,
  AdminLevel,
} from '@/types';

interface AdminAidFormProps {
  aid: AidProgramWithRelations | null;
  onCancel: () => void;
  onSaved: () => void;
}

interface RequirementRow {
  requirement_text: string;
  sort_order: number;
}

interface DocumentRow {
  document_name: string;
  description: string | null;
  sort_order: number;
}

interface FinancingRow {
  amount: number | null;
  percentage: number | null;
  min_amount: number | null;
  max_amount: number | null;
  amount_unit: string | null;
  financing_description: string | null;
}

export function AdminAidForm({ aid, onCancel, onSaved }: AdminAidFormProps) {
  const isEdit = !!aid;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedOk, setSavedOk] = useState(false);

  // Catalogs
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [actionsList, setActionsList] = useState<Action[]>([]);
  const [accessibilityTypes, setAccessibilityTypes] = useState<AccessibilityType[]>([]);
  const [solutionsList, setSolutionsList] = useState<Solution[]>([]);

  // Basic fields
  const [title, setTitle] = useState(aid?.title ?? '');
  const [description, setDescription] = useState(aid?.description ?? '');
  const [shortDescription, setShortDescription] = useState(aid?.short_description ?? '');
  const [administrationLevel, setAdministrationLevel] = useState<AdminLevel>(
    aid?.administration_level ?? 'estatal'
  );
  const [administrationName, setAdministrationName] = useState(aid?.administration_name ?? '');
  const [organism, setOrganism] = useState(aid?.organism ?? '');
  const [status, setStatus] = useState<AidStatus>(aid?.status ?? 'abierta');
  const [callNumber, setCallNumber] = useState(aid?.call_number ?? '');
  const [publicationDate, setPublicationDate] = useState(aid?.publication_date ?? '');
  const [openingDate, setOpeningDate] = useState(aid?.opening_date ?? '');
  const [closingDate, setClosingDate] = useState(aid?.closing_date ?? '');
  const [indefiniteDeadline, setIndefiniteDeadline] = useState(aid?.indefinite_deadline ?? false);
  const [territoryId, setTerritoryId] = useState(aid?.territory_id ?? '');
  const [beneficiaryDescription, setBeneficiaryDescription] = useState(
    aid?.beneficiary_description ?? ''
  );
  const [eligibleExpenses, setEligibleExpenses] = useState(aid?.eligible_expenses ?? '');
  const [applicationUrl, setApplicationUrl] = useState(aid?.application_url ?? '');
  const [officialUrl, setOfficialUrl] = useState(aid?.official_url ?? '');
  const [sourceUrl, setSourceUrl] = useState(aid?.source_url ?? '');
  const [contactInformation, setContactInformation] = useState(aid?.contact_information ?? '');
  const [notes, setNotes] = useState(aid?.notes ?? '');
  const [isDemo, setIsDemo] = useState(aid?.is_demo ?? false);

  // Relations
  const [selectedBeneficiaryIds, setSelectedBeneficiaryIds] = useState<string[]>(
    aid?.beneficiaries?.map((b) => b.id) ?? []
  );
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>(
    aid?.actions?.map((a) => a.id) ?? []
  );
  const [selectedAccessibilityTypeIds, setSelectedAccessibilityTypeIds] = useState<string[]>(
    aid?.accessibility_types?.map((t) => t.id) ?? []
  );
  const [selectedSolutionIds, setSelectedSolutionIds] = useState<string[]>(
    aid?.solutions?.map((s) => s.id) ?? []
  );
  const [selectedTerritoryIds, setSelectedTerritoryIds] = useState<string[]>(
    aid?.territories?.map((t) => t.id) ?? []
  );

  // Requirements
  const [requirements, setRequirements] = useState<RequirementRow[]>(
    aid?.requirements
      ?.sort((a, b) => a.sort_order - b.sort_order)
      .map((r) => ({ requirement_text: r.requirement_text, sort_order: r.sort_order })) ?? []
  );

  // Documents
  const [documents, setDocuments] = useState<DocumentRow[]>(
    aid?.documents
      ?.sort((a, b) => a.sort_order - b.sort_order)
      .map((d) => ({
        document_name: d.document_name,
        description: d.description,
        sort_order: d.sort_order,
      })) ?? []
  );

  // Financing
  const [financing, setFinancing] = useState<FinancingRow[]>(
    aid?.aid_financing?.map((f) => ({
      amount: f.amount,
      percentage: f.percentage,
      min_amount: f.min_amount,
      max_amount: f.max_amount,
      amount_unit: f.amount_unit,
      financing_description: f.financing_description,
    })) ?? []
  );

  useEffect(() => {
    (async () => {
      const [terr, ben, act, acc, sol] = await Promise.all([
        fetchAllTerritories(),
        fetchBeneficiaries(),
        fetchActions(),
        fetchAccessibilityTypes(),
        fetchSolutions(),
      ]);
      setTerritories(terr);
      setBeneficiaries(ben);
      setActionsList(act);
      setAccessibilityTypes(acc);
      setSolutionsList(sol);
    })().catch(console.error);
  }, []);

  const toggleId = (list: string[], id: string, setter: (v: string[]) => void) => {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  const addRequirement = () =>
    setRequirements((prev) => [...prev, { requirement_text: '', sort_order: prev.length }]);

  const addDocument = () =>
    setDocuments((prev) => [
      ...prev,
      { document_name: '', description: null, sort_order: prev.length },
    ]);

  const addFinancing = () =>
    setFinancing((prev) => [
      ...prev,
      { amount: null, percentage: null, min_amount: null, max_amount: null, amount_unit: null, financing_description: null },
    ]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedOk(false);

    if (!title.trim()) {
      setError('El título es obligatorio.');
      setSaving(false);
      return;
    }

    const slug = aid?.slug ?? slugify(title);

    const aidData = {
      title: title.trim(),
      slug,
      description: description || null,
      short_description: shortDescription || null,
      administration_level: administrationLevel,
      administration_name: administrationName || null,
      organism: organism || null,
      status,
      call_number: callNumber || null,
      publication_date: publicationDate || null,
      opening_date: openingDate || null,
      closing_date: closingDate || null,
      indefinite_deadline: indefiniteDeadline,
      territory_id: territoryId || null,
      beneficiary_description: beneficiaryDescription || null,
      eligible_expenses: eligibleExpenses || null,
      application_url: applicationUrl || null,
      official_url: officialUrl || null,
      source_url: sourceUrl || null,
      contact_information: contactInformation || null,
      notes: notes || null,
      last_verified_at: aid?.last_verified_at ?? null,
      is_demo: isDemo,
      archived: aid?.archived ?? false,
      normative_reference: aid?.normative_reference ?? null,
      duplicated_from: aid?.duplicated_from ?? null,
      external_id: aid?.external_id ?? null,
      aid_type: aid?.aid_type ?? null,
    };

    try {
      let aidId: string;

      if (isEdit && aid) {
        const { error: updError } = await adminUpdateAid(aid.id, aidData);
        if (updError) throw new Error(updError);
        aidId = aid.id;
      } else {
        const { id, error: createError } = await adminCreateAid(aidData);
        if (createError || !id) throw new Error(createError ?? 'Error al crear la ayuda');
        aidId = id;
      }

      // Relations
      const relResults = await Promise.all([
        adminSetAidRelations(aidId, 'aid_beneficiaries', selectedBeneficiaryIds, 'beneficiary_id'),
        adminSetAidRelations(aidId, 'aid_actions', selectedActionIds, 'action_id'),
        adminSetAidRelations(aidId, 'aid_accessibility_types', selectedAccessibilityTypeIds, 'accessibility_type_id'),
        adminSetAidRelations(aidId, 'aid_solutions', selectedSolutionIds, 'solution_id'),
        adminSetAidRelations(aidId, 'aid_territories', selectedTerritoryIds, 'territory_id'),
      ]);
      for (const r of relResults) {
        if (r.error) throw new Error(r.error);
      }

      // Requirements
      const validReqs = requirements.filter((r) => r.requirement_text.trim());
      const { error: reqError } = await adminReplaceRequirements(
        aidId,
        validReqs.map((r, i) => ({ requirement_text: r.requirement_text.trim(), sort_order: i }))
      );
      if (reqError) throw new Error(reqError);

      // Documents
      const validDocs = documents.filter((d) => d.document_name.trim());
      const { error: docError } = await adminReplaceDocuments(
        aidId,
        validDocs.map((d, i) => ({
          document_name: d.document_name.trim(),
          description: d.description || null,
          sort_order: i,
        }))
      );
      if (docError) throw new Error(docError);

      // Financing
      const { error: finError } = await adminReplaceFinancing(aidId, financing);
      if (finError) throw new Error(finError);

      setSavedOk(true);
      setTimeout(() => onSaved(), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la ayuda');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Volver al panel
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
        {isEdit ? 'Editar ayuda' : 'Crear ayuda'}
      </h1>

      {error && (
        <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {savedOk && (
        <div className="mb-4 flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-green-700">Ayuda guardada correctamente.</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic info */}
        <FormSection title="Información básica">
          <FormField label="Título" required>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </FormField>

          <FormField label="Descripción breve">
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              maxLength={200}
              className="form-input"
              placeholder="Resumen en una línea"
            />
          </FormField>

          <FormField label="Descripción completa">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="form-input"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Nivel de administración">
              <select
                value={administrationLevel}
                onChange={(e) => setAdministrationLevel(e.target.value as AdminLevel)}
                className="form-input"
              >
                <option value="europeo">Europeo</option>
                <option value="estatal">Estatal</option>
                <option value="autonomico">Autonómico</option>
                <option value="provincial">Provincial</option>
                <option value="municipal">Municipal</option>
              </select>
            </FormField>

            <FormField label="Estado">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AidStatus)}
                className="form-input"
              >
                <option value="abierta">Abierta</option>
                <option value="proxima">Próxima</option>
                <option value="cerrada">Cerrada</option>
                <option value="permanente">Permanente</option>
                <option value="suspendida">Suspendida</option>
              </select>
            </FormField>

            <FormField label="Nombre de la administración">
              <input
                type="text"
                value={administrationName}
                onChange={(e) => setAdministrationName(e.target.value)}
                className="form-input"
              />
            </FormField>

            <FormField label="Organismo">
              <input
                type="text"
                value={organism}
                onChange={(e) => setOrganism(e.target.value)}
                className="form-input"
              />
            </FormField>

            <FormField label="Territorio principal">
              <select
                value={territoryId}
                onChange={(e) => setTerritoryId(e.target.value)}
                className="form-input"
              >
                <option value="">—</option>
                {territories.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Número de convocatoria">
              <input
                type="text"
                value={callNumber}
                onChange={(e) => setCallNumber(e.target.value)}
                className="form-input"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Fecha de publicación">
              <input
                type="date"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                className="form-input"
              />
            </FormField>
            <FormField label="Fecha de apertura">
              <input
                type="date"
                value={openingDate}
                onChange={(e) => setOpeningDate(e.target.value)}
                className="form-input"
              />
            </FormField>
            <FormField label="Fecha de cierre">
              <input
                type="date"
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                disabled={indefiniteDeadline}
                className="form-input"
              />
            </FormField>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={indefiniteDeadline}
              onChange={(e) => setIndefiniteDeadline(e.target.checked)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            Plazo indefinido/permanente
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={isDemo}
              onChange={(e) => setIsDemo(e.target.checked)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            Marcar como ayuda DEMO (ejemplo demostrativo)
          </label>
        </FormSection>

        {/* Beneficiary info */}
        <FormSection title="Beneficiarios y gastos">
          <FormField label="Descripción de beneficiarios">
            <textarea
              value={beneficiaryDescription}
              onChange={(e) => setBeneficiaryDescription(e.target.value)}
              rows={2}
              className="form-input"
            />
          </FormField>

          <FormField label="Gastos subvencionables">
            <textarea
              value={eligibleExpenses}
              onChange={(e) => setEligibleExpenses(e.target.value)}
              rows={3}
              className="form-input"
            />
          </FormField>

          <CheckboxGrid
            label="Tipos de beneficiario"
            items={beneficiaries}
            selected={selectedBeneficiaryIds}
            onToggle={(id) => toggleId(selectedBeneficiaryIds, id, setSelectedBeneficiaryIds)}
          />
        </FormSection>

        {/* Actions & accessibility */}
        <FormSection title="Actuaciones y accesibilidad">
          <CheckboxGrid
            label="Actuaciones"
            items={actionsList}
            selected={selectedActionIds}
            onToggle={(id) => toggleId(selectedActionIds, id, setSelectedActionIds)}
          />

          <CheckboxGrid
            label="Tipos de accesibilidad"
            items={accessibilityTypes}
            selected={selectedAccessibilityTypeIds}
            onToggle={(id) =>
              toggleId(selectedAccessibilityTypeIds, id, setSelectedAccessibilityTypeIds)
            }
          />

          <CheckboxGrid
            label="Soluciones"
            items={solutionsList}
            selected={selectedSolutionIds}
            onToggle={(id) => toggleId(selectedSolutionIds, id, setSelectedSolutionIds)}
          />

          <CheckboxGrid
            label="Territorios adicionales"
            items={territories}
            selected={selectedTerritoryIds}
            onToggle={(id) => toggleId(selectedTerritoryIds, id, setSelectedTerritoryIds)}
          />
        </FormSection>

        {/* Financing */}
        <FormSection title="Financiación">
          {financing.map((f, i) => (
            <div key={i} className="bg-slate-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Opción {i + 1}</span>
                <button
                  type="button"
                  onClick={() => setFinancing((prev) => prev.filter((_, idx) => idx !== i))}
                  className="text-slate-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <FormField label="Porcentaje %">
                  <input
                    type="number"
                    step="0.1"
                    value={f.percentage ?? ''}
                    onChange={(e) =>
                      setFinancing((prev) =>
                        prev.map((x, idx) =>
                          idx === i ? { ...x, percentage: e.target.value ? Number(e.target.value) : null } : x
                        )
                      )
                    }
                    className="form-input"
                  />
                </FormField>
                <FormField label="Importe">
                  <input
                    type="number"
                    value={f.amount ?? ''}
                    onChange={(e) =>
                      setFinancing((prev) =>
                        prev.map((x, idx) =>
                          idx === i ? { ...x, amount: e.target.value ? Number(e.target.value) : null } : x
                        )
                      )
                    }
                    className="form-input"
                  />
                </FormField>
                <FormField label="Importe mín.">
                  <input
                    type="number"
                    value={f.min_amount ?? ''}
                    onChange={(e) =>
                      setFinancing((prev) =>
                        prev.map((x, idx) =>
                          idx === i ? { ...x, min_amount: e.target.value ? Number(e.target.value) : null } : x
                        )
                      )
                    }
                    className="form-input"
                  />
                </FormField>
                <FormField label="Importe máx.">
                  <input
                    type="number"
                    value={f.max_amount ?? ''}
                    onChange={(e) =>
                      setFinancing((prev) =>
                        prev.map((x, idx) =>
                          idx === i ? { ...x, max_amount: e.target.value ? Number(e.target.value) : null } : x
                        )
                      )
                    }
                    className="form-input"
                  />
                </FormField>
              </div>
              <FormField label="Descripción de financiación">
                <textarea
                  value={f.financing_description ?? ''}
                  onChange={(e) =>
                    setFinancing((prev) =>
                      prev.map((x, idx) =>
                        idx === i ? { ...x, financing_description: e.target.value || null } : x
                      )
                    )
                  }
                  rows={2}
                  className="form-input"
                />
              </FormField>
            </div>
          ))}
          <button
            type="button"
            onClick={addFinancing}
            className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            <Plus className="w-4 h-4" />
            Añadir opción de financiación
          </button>
        </FormSection>

        {/* Requirements */}
        <FormSection title="Requisitos">
          {requirements.map((r, i) => (
            <div key={i} className="flex items-start gap-2">
              <input
                type="text"
                value={r.requirement_text}
                onChange={(e) =>
                  setRequirements((prev) =>
                    prev.map((x, idx) =>
                      idx === i ? { ...x, requirement_text: e.target.value } : x
                    )
                  )
                }
                placeholder="Descripción del requisito..."
                className="form-input flex-1"
              />
              <button
                type="button"
                onClick={() => setRequirements((prev) => prev.filter((_, idx) => idx !== i))}
                className="p-2.5 text-slate-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRequirement}
            className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            <Plus className="w-4 h-4" />
            Añadir requisito
          </button>
        </FormSection>

        {/* Documents */}
        <FormSection title="Documentación">
          {documents.map((d, i) => (
            <div key={i} className="flex items-start gap-2">
              <input
                type="text"
                value={d.document_name}
                onChange={(e) =>
                  setDocuments((prev) =>
                    prev.map((x, idx) =>
                      idx === i ? { ...x, document_name: e.target.value } : x
                    )
                  )
                }
                placeholder="Nombre del documento..."
                className="form-input flex-1"
              />
              <button
                type="button"
                onClick={() => setDocuments((prev) => prev.filter((_, idx) => idx !== i))}
                className="p-2.5 text-slate-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addDocument}
            className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            <Plus className="w-4 h-4" />
            Añadir documento
          </button>
        </FormSection>

        {/* Links and contact */}
        <FormSection title="Enlaces y contacto">
          <div className="grid grid-cols-1 gap-4">
            <FormField label="URL oficial">
              <input
                type="url"
                value={officialUrl}
                onChange={(e) => setOfficialUrl(e.target.value)}
                placeholder="https://..."
                className="form-input"
              />
            </FormField>
            <FormField label="URL de solicitud">
              <input
                type="url"
                value={applicationUrl}
                onChange={(e) => setApplicationUrl(e.target.value)}
                placeholder="https://..."
                className="form-input"
              />
            </FormField>
            <FormField label="URL de la fuente">
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://..."
                className="form-input"
              />
            </FormField>
            <FormField label="Información de contacto">
              <textarea
                value={contactInformation}
                onChange={(e) => setContactInformation(e.target.value)}
                rows={2}
                className="form-input"
              />
            </FormField>
            <FormField label="Notas internas">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="form-input"
              />
            </FormField>
          </div>
        </FormSection>

        {/* Actions */}
        <div className="flex gap-3 sticky bottom-0 bg-white py-4 border-t border-slate-200 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold bg-teal-600 text-white hover:bg-teal-700 disabled:bg-slate-300 transition-colors"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEdit ? 'Guardar cambios' : 'Crear ayuda'}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function CheckboxGrid({
  label,
  items,
  selected,
  onToggle,
}: {
  label: string;
  items: { id: string; name: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto p-1">
        {items.map((item) => {
          const isSelected = selected.includes(item.id);
          return (
            <label
              key={item.id}
              className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg border transition-colors ${
                isSelected
                  ? 'bg-teal-50 border-teal-200 text-teal-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(item.id)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <span className="text-xs">{item.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
