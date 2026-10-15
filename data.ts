import { supabase } from '@/lib/supabase';
import type {
  AidProgram,
  AidProgramWithRelations,
  AidFinancing,
  Alert,
  Beneficiary,
  Action,
  AccessibilityType,
  DocumentItem,
  Profile,
  Requirement,
  SavedAid,
  Solution,
  Source,
  Territory,
  SearchCriteria,
  MatchResult,
  AidStatus,
  AdminLevel,
} from '@/types';

// ============================================================
// Catalog fetchers
// ============================================================

export async function fetchTerritories(parentId?: string | null): Promise<Territory[]> {
  let query = supabase.from('territories').select('*').eq('active', true).order('name');
  if (parentId === undefined) {
    // no filter
  } else if (parentId === null) {
    query = query.is('parent_id', null);
  } else {
    query = query.eq('parent_id', parentId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data as Territory[];
}

export async function fetchAllTerritories(): Promise<Territory[]> {
  const { data, error } = await supabase
    .from('territories')
    .select('*')
    .eq('active', true)
    .order('name');
  if (error) throw supabaseError(error);
  return data as Territory[];
}

export async function fetchBeneficiaries(): Promise<Beneficiary[]> {
  const { data, error } = await supabase
    .from('beneficiaries')
    .select('*')
    .eq('active', true)
    .order('name');
  if (error) throw supabaseError(error);
  return data as Beneficiary[];
}

export async function fetchAccessibilityTypes(): Promise<AccessibilityType[]> {
  const { data, error } = await supabase
    .from('accessibility_types')
    .select('*')
    .eq('active', true)
    .order('name');
  if (error) throw supabaseError(error);
  return data as AccessibilityType[];
}

export async function fetchActions(): Promise<Action[]> {
  const { data, error } = await supabase
    .from('actions')
    .select('*')
    .eq('active', true)
    .order('name');
  if (error) throw supabaseError(error);
  return data as Action[];
}

export async function fetchSolutions(): Promise<Solution[]> {
  const { data, error } = await supabase
    .from('solutions')
    .select('*')
    .eq('active', true)
    .order('name');
  if (error) throw error;
  return data as Solution[];
}

// ============================================================
// Aid queries
// ============================================================

async function fetchAidRelations(aids: AidProgram[]): Promise<Map<string, AidProgramWithRelations>> {
  if (aids.length === 0) return new Map();
  const aidIds = new Set(aids.map((a) => a.id));

  const [
    aidBenRes, aidActRes, aidAccRes, aidTerRes, aidFinRes, aidSolRes, aidReqRes, aidDocRes, aidSrcRes, terrRes,
  ] = await Promise.all([
    supabase.from('aid_beneficiaries').select('aid_id, beneficiary:beneficiaries(*)'),
    supabase.from('aid_actions').select('aid_id, action:actions(*)'),
    supabase.from('aid_accessibility_types').select('aid_id, accessibility_type:accessibility_types(*)'),
    supabase.from('aid_territories').select('aid_id, territory:territories(*)'),
    supabase.from('aid_financing').select('*'),
    supabase.from('aid_solutions').select('aid_id, solution:solutions(*)'),
    supabase.from('requirements').select('*').order('sort_order'),
    supabase.from('documents').select('*').order('sort_order'),
    supabase.from('sources').select('*'),
    supabase.from('territories').select('*').eq('active', true),
  ]);

  const terrMap = new Map((terrRes.data as Territory[] ?? []).map((t) => [t.id, t]));

  const groupBy = <T,>(rows: T[] | null, key: keyof T): Map<string, T[]> => {
    const m = new Map<string, T[]>();
    for (const r of rows ?? []) {
      const k = String(r[key]);
      if (!aidIds.has(k)) continue;
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(r);
    }
    return m;
  };

  const benMap = groupBy(aidBenRes.data as { aid_id: string; beneficiary: Beneficiary }[] | null, 'aid_id');
  const actMap = groupBy(aidActRes.data as { aid_id: string; action: Action }[] | null, 'aid_id');
  const accMap = groupBy(aidAccRes.data as { aid_id: string; accessibility_type: AccessibilityType }[] | null, 'aid_id');
  const terMap = groupBy(aidTerRes.data as { aid_id: string; territory: Territory }[] | null, 'aid_id');
  const finMap = groupBy(aidFinRes.data as AidFinancing[] | null, 'aid_id');
  const solMap = groupBy(aidSolRes.data as { aid_id: string; solution: Solution }[] | null, 'aid_id');
  const reqMap = groupBy(aidReqRes.data as Requirement[] | null, 'aid_id');
  const docMap = groupBy(aidDocRes.data as DocumentItem[] | null, 'aid_id');
  const srcMap = groupBy(aidSrcRes.data as Source[] | null, 'aid_id');

  const result = new Map<string, AidProgramWithRelations>();
  for (const aid of aids) {
    result.set(aid.id, {
      ...aid,
      territory: aid.territory_id ? terrMap.get(aid.territory_id) ?? null : null,
      beneficiaries: (benMap.get(aid.id) ?? []).map((r) => r.beneficiary),
      actions: (actMap.get(aid.id) ?? []).map((r) => r.action),
      accessibility_types: (accMap.get(aid.id) ?? []).map((r) => r.accessibility_type),
      territories: (terMap.get(aid.id) ?? []).map((r) => r.territory),
      aid_financing: finMap.get(aid.id) ?? [],
      solutions: (solMap.get(aid.id) ?? []).map((r) => r.solution),
      requirements: reqMap.get(aid.id) ?? [],
      documents: docMap.get(aid.id) ?? [],
      sources: srcMap.get(aid.id) ?? [],
    });
  }
  return result;
}

function supabaseError(error: unknown): Error {
  if (error && typeof error === 'object') {
    const e = error as Record<string, unknown>;
    const parts = [
      e.message ? `message: ${e.message}` : '',
      e.details ? `details: ${e.details}` : '',
      e.hint ? `hint: ${e.hint}` : '',
      e.code ? `code: ${e.code}` : '',
    ].filter(Boolean);
    return new Error(parts.join(' | ') || JSON.stringify(error));
  }
  return new Error(String(error));
}

export async function fetchAllAids(): Promise<AidProgramWithRelations[]> {
  const { data, error } = await supabase
    .from('aid_programs')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw supabaseError(error);
  const aids = (data as AidProgram[]).filter((a) => !a.archived);
  const relMap = await fetchAidRelations(aids);
  return aids.map((a) => relMap.get(a.id)!).filter(Boolean);
}

export async function fetchAllAidsAdmin(): Promise<AidProgramWithRelations[]> {
  const { data, error } = await supabase
    .from('aid_programs')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw supabaseError(error);
  const aids = data as AidProgram[];
  const relMap = await fetchAidRelations(aids);
  return aids.map((a) => relMap.get(a.id)!).filter(Boolean);
}

export async function fetchAidBySlug(slug: string): Promise<AidProgramWithRelations | null> {
  const { data, error } = await supabase
    .from('aid_programs')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw supabaseError(error);
  if (!data) return null;
  const relMap = await fetchAidRelations([data as AidProgram]);
  return relMap.get((data as AidProgram).id) ?? null;
}

export async function fetchAidById(id: string): Promise<AidProgramWithRelations | null> {
  const { data, error } = await supabase
    .from('aid_programs')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw supabaseError(error);
  if (!data) return null;
  const relMap = await fetchAidRelations([data as AidProgram]);
  return relMap.get((data as AidProgram).id) ?? null;
}

export async function fetchAidsByStatus(status: AidStatus): Promise<AidProgramWithRelations[]> {
  const { data, error } = await supabase
    .from('aid_programs')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });
  if (error) throw supabaseError(error);
  const aids = (data as AidProgram[]).filter((a) => !a.archived);
  const relMap = await fetchAidRelations(aids);
  return aids.map((a) => relMap.get(a.id)!).filter(Boolean);
}

// ============================================================
// Matching engine
// ============================================================

/**
 * Build a set of territory IDs that are compatible with a given selection.
 * Includes the territory itself, all its ancestors (estatal applies to sub-regions)
 * and all its descendants (a Madrid aid shows up when searching all of Spain).
 */
function buildCompatibleTerritoryIds(
  selectedId: string,
  allTerritories: Territory[]
): Set<string> {
  const byId = new Map(allTerritories.map((t) => [t.id, t]));
  const compatible = new Set<string>();

  // Add the selected territory itself
  compatible.add(selectedId);

  // Add all ancestors (so estatal aids match when user selects a community)
  let current = byId.get(selectedId);
  while (current?.parent_id) {
    compatible.add(current.parent_id);
    current = byId.get(current.parent_id);
  }

  // Add all descendants (so Madrid-specific aids show when user selects España)
  const addDescendants = (parentId: string) => {
    for (const t of allTerritories) {
      if (t.parent_id === parentId) {
        compatible.add(t.id);
        addDescendants(t.id);
      }
    }
  };
  addDescendants(selectedId);

  return compatible;
}

/**
 * Rule-based matching engine. Scores each aid against the search criteria.
 * A result appears as compatible when territory, beneficiary, action, and/or
 * accessibility type match. Returns results sorted by score (descending).
 *
 * Territory matching is hierarchy-aware: selecting "Comunidad de Madrid" matches
 * estatal aids (territory = España) because España is an ancestor of Madrid.
 */
export function matchAids(
  aids: AidProgramWithRelations[],
  criteria: SearchCriteria,
  allTerritories?: Territory[]
): MatchResult[] {
  const compatibleTerritoryIds = criteria.territoryId && allTerritories
    ? buildCompatibleTerritoryIds(criteria.territoryId, allTerritories)
    : criteria.territoryId
      ? new Set([criteria.territoryId])
      : null;

  const results: MatchResult[] = [];

  for (const aid of aids) {
    const matchedCriteria: string[] = [];
    let totalCriteria = 0;

    // Territory match (hierarchy-aware)
    // 'europeo' aids always match any territory (broadest level)
    // 'estatal' aids always match any territory within Spain
    if (compatibleTerritoryIds) {
      totalCriteria++;
      const isAlwaysVisible = aid.administration_level === 'europeo' || aid.administration_level === 'estatal';
      const aidTerritoryIds = [
        ...(aid.territory_id ? [aid.territory_id] : []),
        ...(aid.territories?.map((t) => t.id) ?? []),
      ];
      const hasMatch = isAlwaysVisible || aidTerritoryIds.some((id) => compatibleTerritoryIds.has(id));
      if (hasMatch) {
        matchedCriteria.push('territorio');
      }
    }

    // Beneficiary match
    if (criteria.beneficiaryId) {
      totalCriteria++;
      const beneficiaryIds = aid.beneficiaries?.map((b) => b.id) ?? [];
      if (beneficiaryIds.includes(criteria.beneficiaryId)) {
        matchedCriteria.push('beneficiario');
      }
    }

    // Actions match (at least one selected action)
    if (criteria.actionIds && criteria.actionIds.length > 0) {
      totalCriteria++;
      const actionIds = aid.actions?.map((a) => a.id) ?? [];
      const hasMatch = criteria.actionIds.some((id) => actionIds.includes(id));
      if (hasMatch) {
        matchedCriteria.push('actuación');
      }
    }

    // Accessibility type match
    if (criteria.accessibilityTypeId) {
      totalCriteria++;
      const typeIds = aid.accessibility_types?.map((t) => t.id) ?? [];
      if (typeIds.includes(criteria.accessibilityTypeId)) {
        matchedCriteria.push('tipo de accesibilidad');
      }
    }

    // Status filter
    if (criteria.status) {
      totalCriteria++;
      if (aid.status === criteria.status) {
        matchedCriteria.push('estado');
      }
    }

    // Admin level filter
    if (criteria.adminLevel) {
      totalCriteria++;
      if (aid.administration_level === criteria.adminLevel) {
        matchedCriteria.push('nivel de administración');
      }
    }

    // Text search
    if (criteria.query && criteria.query.trim()) {
      totalCriteria++;
      const q = criteria.query.toLowerCase();
      const searchableText = [
        aid.title,
        aid.description,
        aid.short_description,
        aid.organism,
        aid.administration_name,
        aid.beneficiary_description,
        aid.eligible_expenses,
        ...(aid.beneficiaries?.map((b) => b.name) ?? []),
        ...(aid.actions?.map((a) => a.name) ?? []),
        ...(aid.accessibility_types?.map((t) => t.name) ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (searchableText.includes(q)) {
        matchedCriteria.push('búsqueda de texto');
      }
    }

    // If no criteria specified, return all with full score
    if (totalCriteria === 0) {
      results.push({ aid, score: 100, matchedCriteria: [], totalCriteria: 0 });
      continue;
    }

    const score = Math.round((matchedCriteria.length / totalCriteria) * 100);

    // Only include results that match at least one criterion, OR when no criteria are specified
    if (matchedCriteria.length > 0) {
      results.push({ aid, score, matchedCriteria, totalCriteria });
    }
  }

  // Sort by score descending, then by title
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.aid.title.localeCompare(b.aid.title);
  });

  return results;
}

// ============================================================
// Saved aids
// ============================================================

export async function fetchSavedAids(userId: string): Promise<SavedAid[]> {
  const { data, error } = await supabase
    .from('saved_aids')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as SavedAid[];
}

export async function saveAid(userId: string, aidId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('saved_aids')
    .insert({ user_id: userId, aid_id: aidId });
  return { error: error?.message ?? null };
}

export async function unsaveAid(userId: string, aidId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('saved_aids')
    .delete()
    .eq('user_id', userId)
    .eq('aid_id', aidId);
  return { error: error?.message ?? null };
}

export async function isAidSaved(userId: string, aidId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('saved_aids')
    .select('id')
    .eq('user_id', userId)
    .eq('aid_id', aidId)
    .maybeSingle();
  if (error) return false;
  return !!data;
}

// ============================================================
// Alerts
// ============================================================

export async function fetchAlerts(userId: string): Promise<Alert[]> {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Alert[];
}

export async function createAlert(
  alert: Omit<Alert, 'id' | 'user_id' | 'created_at'>
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('alerts').insert(alert);
  return { error: error?.message ?? null };
}

export async function deleteAlert(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('alerts').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function toggleAlert(id: string, active: boolean): Promise<{ error: string | null }> {
  const { error } = await supabase.from('alerts').update({ active }).eq('id', id);
  return { error: error?.message ?? null };
}

// ============================================================
// Profile
// ============================================================

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'full_name' | 'user_type' | 'phone' | 'company_name'>>
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
  return { error: error?.message ?? null };
}

// ============================================================
// Admin: Aid CRUD
// ============================================================

export async function adminCreateAid(
  aid: Omit<AidProgram, 'id' | 'created_at' | 'updated_at'>
): Promise<{ id: string | null; error: string | null }> {
  const { data, error } = await supabase
    .from('aid_programs')
    .insert(aid)
    .select('id')
    .maybeSingle();
  return { id: data?.id ?? null, error: error?.message ?? null };
}

export async function adminUpdateAid(
  id: string,
  updates: Partial<AidProgram>
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('aid_programs').update(updates).eq('id', id);
  return { error: error?.message ?? null };
}

export async function adminDeleteAid(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('aid_programs').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function adminArchiveAid(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('aid_programs').update({ archived: true }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function adminUnarchiveAid(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('aid_programs').update({ archived: false }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function adminDuplicateAid(
  sourceAid: AidProgramWithRelations
): Promise<{ id: string | null; error: string | null }> {
  const { id: _id, created_at: _c, updated_at: _u, ...rest } = sourceAid;
  void _id; void _c; void _u;

  const newSlug = `${sourceAid.slug}-copia-${Date.now().toString(36)}`;
  const newTitle = `${sourceAid.title} (copia)`;

  const { data, error } = await supabase
    .from('aid_programs')
    .insert({
      ...rest,
      title: newTitle,
      slug: newSlug,
      status: 'proxima' as const,
      archived: false,
      duplicated_from: sourceAid.id,
      last_verified_at: null,
    })
    .select('id')
    .maybeSingle();

  return { id: data?.id ?? null, error: error?.message ?? null };
}

export async function adminSetAidRelations(
  aidId: string,
  table: string,
  ids: string[],
  idColumn: string
): Promise<{ error: string | null }> {
  // Delete existing
  const { error: delError } = await supabase.from(table).delete().eq('aid_id', aidId);
  if (delError) return { error: delError.message };

  if (ids.length === 0) return { error: null };

  const rows = ids.map((id) => ({ aid_id: aidId, [idColumn]: id }));
  const { error: insError } = await supabase.from(table).insert(rows);
  return { error: insError?.message ?? null };
}

export async function adminReplaceRequirements(
  aidId: string,
  requirements: { requirement_text: string; sort_order: number }[]
): Promise<{ error: string | null }> {
  const { error: delError } = await supabase.from('requirements').delete().eq('aid_id', aidId);
  if (delError) return { error: delError.message };

  if (requirements.length === 0) return { error: null };

  const rows = requirements.map((r) => ({ aid_id: aidId, ...r }));
  const { error: insError } = await supabase.from('requirements').insert(rows);
  return { error: insError?.message ?? null };
}

export async function adminReplaceDocuments(
  aidId: string,
  documents: { document_name: string; description: string | null; sort_order: number }[]
): Promise<{ error: string | null }> {
  const { error: delError } = await supabase.from('documents').delete().eq('aid_id', aidId);
  if (delError) return { error: delError.message };

  if (documents.length === 0) return { error: null };

  const rows = documents.map((d) => ({ aid_id: aidId, ...d }));
  const { error: insError } = await supabase.from('documents').insert(rows);
  return { error: insError?.message ?? null };
}

export async function adminReplaceFinancing(
  aidId: string,
  financing: {
    amount: number | null;
    percentage: number | null;
    min_amount: number | null;
    max_amount: number | null;
    amount_unit: string | null;
    financing_description: string | null;
  }[]
): Promise<{ error: string | null }> {
  const { error: delError } = await supabase.from('aid_financing').delete().eq('aid_id', aidId);
  if (delError) return { error: delError.message };

  if (financing.length === 0) return { error: null };

  const rows = financing.map((f) => ({ aid_id: aidId, ...f }));
  const { error: insError } = await supabase.from('aid_financing').insert(rows);
  return { error: insError?.message ?? null };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '';
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function statusLabel(status: AidStatus): string {
  const labels: Record<AidStatus, string> = {
    abierta: 'Abierta',
    proxima: 'Próxima',
    cerrada: 'Cerrada',
    permanente: 'Permanente',
    suspendida: 'Suspendida',
    vigente: 'Programa vigente',
    en_tramitacion: 'En tramitación',
    resuelta: 'Resuelta',
    marco_estatal: 'Marco estatal',
    revisar: 'Revisar',
  };
  return labels[status] ?? status;
}

export function adminLevelLabel(level: AdminLevel): string {
  const labels: Record<AdminLevel, string> = {
    europeo: 'Europeo',
    estatal: 'Estatal',
    autonomico: 'Autonómico',
    provincial: 'Provincial',
    municipal: 'Municipal',
  };
  return labels[level] ?? level;
}
