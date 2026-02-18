
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc,
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  orderBy,
  serverTimestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../firebase';
import { Project, Task, Invite, UserProfile, Role, TaskStatus } from '../types';

export const dbService = {
  // --- User Profiles ---
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const docSnap = await getDoc(doc(db, 'users', uid));
    return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
  },

  async createUserProfile(profile: UserProfile): Promise<void> {
    await setDoc(doc(db, 'users', profile.uid), {
      ...profile,
      createdAt: serverTimestamp()
    });
  },

  // --- Companies & Invites ---
  async createCompany(name: string, userId: string): Promise<string> {
    const companyRef = await addDoc(collection(db, 'companies'), {
      name,
      createdBy: userId,
      createdAt: serverTimestamp()
    });
    return companyRef.id;
  },

  async checkInvite(email: string): Promise<Invite | null> {
    const q = query(
      collection(db, 'invites'), 
      where('email', '==', email), 
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    if (!snap.empty) return { id: snap.docs[0].id, ...snap.docs[0].data() } as Invite;
    return null;
  },

  async acceptInvite(inviteId: string): Promise<void> {
    await updateDoc(doc(db, 'invites', inviteId), { status: 'accepted' });
  },

  async sendInvite(email: string, companyId: string, role: Role, invitedBy: string): Promise<void> {
    await addDoc(collection(db, 'invites'), {
      email,
      companyId,
      role,
      invitedBy,
      status: 'pending',
      createdAt: serverTimestamp()
    });
  },

  // --- Real-time Subscriptions (The Heart of the UI) ---
  subscribeProjects(companyId: string, callback: (projects: Project[]) => void) {
    const q = query(
      collection(db, 'projects'), 
      where('companyId', '==', companyId), 
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
    });
  },

  subscribeTasks(companyId: string, filters: QueryConstraint[], callback: (tasks: Task[]) => void) {
    const q = query(
      collection(db, 'tasks'), 
      where('companyId', '==', companyId), 
      ...filters,
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Task)));
    });
  },

  subscribeMembers(companyId: string, callback: (members: UserProfile[]) => void) {
    const q = query(collection(db, 'users'), where('companyId', '==', companyId));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ ...d.data() } as UserProfile)));
    });
  },

  // --- Mutations ---
  async createProject(name: string, description: string, companyId: string, userId: string): Promise<void> {
    await addDoc(collection(db, 'projects'), {
      name, description, companyId, createdBy: userId, createdAt: serverTimestamp()
    });
  },

  async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<void> {
    await addDoc(collection(db, 'tasks'), { ...task, createdAt: serverTimestamp() });
  },

  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
    await updateDoc(doc(db, 'tasks', taskId), { status });
  },

  async deleteProject(projectId: string): Promise<void> {
    await deleteDoc(doc(db, 'projects', projectId));
  }
};
