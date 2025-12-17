export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'TO DO' | 'PAUSED' | 'COMPLETED' | 'IN PROGRESS';

export interface Project {
  id: string;
  work: string;
  priority: Priority;
  status: Status;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}
