export type StationSlug =
  | 'panel'
  | 'lets_read'
  | 'vr'
  | 'forest_product'
  | 'photo_story';

export type StationStatus = 'not_started' | 'in_progress' | 'submitted' | 'approved';

export type ApprovalType = 'panel_code' | 'wfd_code' | 'qr_scan';

export interface Participant {
  id: string;
  display_name: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface StationProgress {
  id: string;
  participant_id: string;
  station_slug: string;
  status: StationStatus;
  answers: Record<string, string> | null;
  submitted_at: string | null;
  approved_at: string | null;
  created_at: string;
}

export interface FacilitatorCode {
  id: string;
  code: string;
  code_type: string;
  is_active: boolean;
}

export interface StationConfig {
  slug: StationSlug;
  name: string;
  subtitle: string;
  iconName: string;
  color: string;
  approvalType: ApprovalType;
  description: string;
  instructions: string[];
  questions?: { id: string; prompt: string; placeholder: string }[];
}

export interface ProgressMap {
  [slug: string]: StationProgress | null;
}
