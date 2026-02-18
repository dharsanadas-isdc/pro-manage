
export type Role = 'Owner' | 'Admin' | 'Member';
export type TaskStatus = 'todo' | 'inprogress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  companyId: string;
  role: Role;
  createdAt: any;
}

export interface Company {
  id: string;
  name: string;
  createdBy: string;
  createdAt: any;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  companyId: string;
  createdBy: string;
  createdAt: any;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  companyId: string;
  assignedTo: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: any;
}

export interface Invite {
  id: string;
  email: string;
  companyId: string;
  role: Role;
  invitedBy: string;
  status: 'pending' | 'accepted';
  createdAt: any;
}

export interface AuthState {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}
