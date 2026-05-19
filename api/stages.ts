import { fetchJson } from './api-client';

export type Stage = {
  stage_id: string;
  stage_name: string;
  parent_stage_id?: string | null;
  stage_path: string;
  depth_level: number;
  children_count: number;
  formtype_count: number;
  is_root: boolean;
  is_leaf: boolean;
  visibility_scope: 'public' | 'private' | 'restricted' | string;
  updated_at?: string;
  created_at?: string;
};
export async function createStage(data: { stage_name: string; parent_stage_id?: string | null; visibility_scope: string }) {
  return fetchJson<Stage>('/stages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important for your auth cookies!
    body: JSON.stringify(data),
  });
}


export type StageNode = Stage & {
  children?: StageNode[];
};

export function fetchStages(limit?: number) {
  return fetchJson<Stage[]>(limit ? `/stages?limit=${limit}` : '/stages');
}

export function fetchStageTree() {
  return fetchJson<StageNode[]>('/stages/tree');
}

export async function updateStage(
  stageId: string,
  data: { stage_name: string; visibility_scope: string }
) {
  return fetchJson<Stage>(`/stages/${stageId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
}

export async function deleteStage(stageId: string) {
  return fetchJson<{ message: string }>(`/stages/${stageId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}
