import { fetchJson } from './api-client';

export type StageStats = {
  total_stages?: number;
  root_stages?: number;
  leaf_stages?: number;
};

export type MetadataStatistics = {
  stages?: StageStats;
};

export function fetchMetadataStatistics() {
  return fetchJson<MetadataStatistics>('/metadata/statistics');
}
