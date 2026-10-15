export type TerritoryType = 'pais' | 'comunidad' | 'provincia' | 'municipio';

export interface Territory {
  id: string;
  name: string;
  slug: string;
  type: TerritoryType;
  parent_id: string | null;
  code: string | null;
  active: boolean;
}

export interface Beneficiary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
}

export interface AccessibilityType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
}

export interface Action {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
}

export interface Solution {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
}

export type AidStatus = 'abierta' | 'proxima' | 'cerrada' | 'permanente' | 'suspendida' | 'vigente' | 'en_tramitacion' | 'resuelta' | 'marco_estatal' | 'revisar';
export type AdminLevel = 'europeo' | 'estatal' | 'autonomico' | 'provincial' | 'municipal';
export type SourceType =
  | 'boe'
  | 'organismo_estatal'
  | 'comunidad_autonoma'
  | 'diputacion'
  | 'ayuntamiento'
  | 'diario_oficial'
  | 'portal_institucional'
  | 'otra_fuente_oficial';

export interface AidFinancing {
  id: string;
  aid_id: string;
  amount: number | null;
  percentage: number | null;
  min_amount: number | null;
  max_amount: number | null;
  amount_unit: string | null;
  financing_description: string | null;
}

export type ItemCategory = 'obligatorio' | 'puede_ser_necesario' | 'recomendado';

export interface Requirement {
  id: string;
  aid_id: string;
  requirement_text: string;
  sort_order: number;
  requirement_type: ItemCategory;
}

export interface DocumentItem {
  id: string;
  aid_id: string;
  document_name: string;
  description: string | null;
  sort_order: number;
  document_type: ItemCategory;
}

export interface Source {
  id: string;
  name: string;
  source_type: SourceType;
  url: string | null;
  publication_date: string | null;
  document_reference: string | null;
  verified: boolean;
  last_checked_at: string | null;
  aid_id: string | null;
}

export interface AidProgram {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  administration_level: AdminLevel;
  administration_name: string | null;
  organism: string | null;
  status: AidStatus;
  call_number: string | null;
  publication_date: string | null;
  opening_date: string | null;
  closing_date: string | null;
  indefinite_deadline: boolean;
  territory_id: string | null;
  beneficiary_description: string | null;
  eligible_expenses: string | null;
  application_url: string | null;
  official_url: string | null;
  source_url: string | null;
  contact_information: string | null;
  notes: string | null;
  last_verified_at: string | null;
  is_demo: boolean;
  archived: boolean;
  normative_reference: string | null;
  duplicated_from: string | null;
  external_id: string | null;
  aid_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface AidProgramWithRelations extends AidProgram {
  territory?: Territory | null;
  beneficiaries?: Beneficiary[];
  actions?: Action[];
  accessibility_types?: AccessibilityType[];
  solutions?: Solution[];
  territories?: Territory[];
  aid_financing?: AidFinancing[];
  requirements?: Requirement[];
  documents?: DocumentItem[];
  sources?: Source[];
}

export type UserType = 'particular' | 'profesional' | 'entidad' | 'administracion' | 'administrador';

export interface Profile {
  id: string;
  full_name: string | null;
  user_type: UserType;
  phone: string | null;
  company_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavedAid {
  id: string;
  user_id: string;
  aid_id: string;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  name: string;
  territory_id: string | null;
  beneficiary_id: string | null;
  action_id: string | null;
  accessibility_type_id: string | null;
  keywords: string | null;
  active: boolean;
  created_at: string;
}

export interface SearchCriteria {
  query?: string;
  territoryId?: string | null;
  beneficiaryId?: string | null;
  actionIds?: string[];
  accessibilityTypeId?: string | null;
  status?: AidStatus | null;
  adminLevel?: AdminLevel | null;
}

export interface MatchResult {
  aid: AidProgramWithRelations;
  score: number;
  matchedCriteria: string[];
  totalCriteria: number;
}
