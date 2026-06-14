import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { loadSiteData, saveSiteData, resetSiteData, getAdminPassword, setAdminPassword } from '../data/db';
import { serializeSiteData } from '../data/siteData';
import { publishToGitHub, type PublishResult } from '../utils/githubPublisher';
import type { SiteData, Idea, Skill, Hobby, TimelineItem, Tool, FoodSpot } from '../data/siteData';

/*
 * ============================================================
 * Logic Layer — State management & business rules
 * ============================================================
 * This Context sits between the UI components (presentation layer)
 * and the storage abstraction (data layer in data/db.ts).
 *
 * All data mutations flow through here, enforcing business rules
 * like authentication, validation, and auto-sorting.
 * ============================================================
 */

interface EditableDataContextType {
  data: SiteData;
  isAdmin: boolean;
  showAdminPanel: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  toggleAdminPanel: () => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
  // Profile
  updateBrand: (brand: Partial<SiteData['profile']['brand']>) => void;
  updateBio: (bio: string) => void;
  // Skills CRUD
  updateSkills: (skills: Skill[]) => void;
  // Hobbies CRUD
  updateHobbies: (hobbies: Hobby[]) => void;
  // Timeline CRUD
  updateTimeline: (timeline: TimelineItem[]) => void;
  // Honors CRUD
  updateHonors: (honors: string[]) => void;
  // Tools CRUD
  updateTools: (tools: Tool[]) => void;
  // Ideas CRUD
  addIdea: (idea: Omit<Idea, 'id'>) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  // FoodSpots CRUD
  addFoodSpot: (spot: Omit<FoodSpot, 'id'>) => void;
  updateFoodSpot: (id: string, updates: Partial<FoodSpot>) => void;
  deleteFoodSpot: (id: string) => void;
  resetData: () => void;
  publishToGitHub: (token: string, message?: string) => Promise<PublishResult>;
}

const EditableDataContext = createContext<EditableDataContextType | null>(null);

export function EditableDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(loadSiteData);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Auto-persist on every change (data layer handles storage I/O)
  useEffect(() => { saveSiteData(data); }, [data]);

  const login = useCallback((password: string) => {
    if (password === getAdminPassword()) { setIsAdmin(true); return true; }
    return false;
  }, []);

  const logout = useCallback(() => { setIsAdmin(false); setShowAdminPanel(false); }, []);

  const toggleAdminPanel = useCallback(() => { setShowAdminPanel((p) => !p); }, []);

  const changePassword = useCallback((oldPassword: string, newPassword: string) => {
    if (oldPassword !== getAdminPassword()) return false;
    try { setAdminPassword(newPassword); return true; } catch { return false; }
  }, []);

  const updateBrand = useCallback((brand: Partial<SiteData['profile']['brand']>) => {
    setData((prev) => ({ ...prev, profile: { ...prev.profile, brand: { ...prev.profile.brand, ...brand } } }));
  }, []);

  const updateBio = useCallback((bio: string) => {
    setData((prev) => ({ ...prev, profile: { ...prev.profile, bio } }));
  }, []);

  const updateSkills = useCallback((skills: Skill[]) => {
    setData((prev) => ({ ...prev, profile: { ...prev.profile, skills } }));
  }, []);

  const updateHobbies = useCallback((hobbies: Hobby[]) => {
    setData((prev) => ({ ...prev, profile: { ...prev.profile, hobbies } }));
  }, []);

  const updateTimeline = useCallback((timeline: TimelineItem[]) => {
    setData((prev) => ({ ...prev, profile: { ...prev.profile, timeline } }));
  }, []);

  const updateHonors = useCallback((honors: string[]) => {
    setData((prev) => ({ ...prev, profile: { ...prev.profile, honors } }));
  }, []);

  const updateTools = useCallback((tools: Tool[]) => {
    setData((prev) => ({ ...prev, tools }));
  }, []);

  const addIdea = useCallback((idea: Omit<Idea, 'id'>) => {
    const newIdea: Idea = { ...idea, id: `idea-${Date.now()}` };
    setData((prev) => ({ ...prev, ideas: [...prev.ideas, newIdea] }));
  }, []);

  const updateIdea = useCallback((id: string, updates: Partial<Idea>) => {
    setData((prev) => ({ ...prev, ideas: prev.ideas.map((i) => i.id === id ? { ...i, ...updates } : i) }));
  }, []);

  const deleteIdea = useCallback((id: string) => {
    setData((prev) => ({ ...prev, ideas: prev.ideas.filter((i) => i.id !== id) }));
  }, []);

  const addFoodSpot = useCallback((spot: Omit<FoodSpot, 'id'>) => {
    const newSpot: FoodSpot = { ...spot, id: `food-${Date.now()}` };
    setData((prev) => ({ ...prev, foodSpots: [...prev.foodSpots, newSpot] }));
  }, []);

  const updateFoodSpot = useCallback((id: string, updates: Partial<FoodSpot>) => {
    setData((prev) => ({ ...prev, foodSpots: prev.foodSpots.map((s) => s.id === id ? { ...s, ...updates } : s) }));
  }, []);

  const deleteFoodSpot = useCallback((id: string) => {
    setData((prev) => ({ ...prev, foodSpots: prev.foodSpots.filter((s) => s.id !== id) }));
  }, []);

  const resetData = useCallback(() => {
    resetSiteData();
    setData(loadSiteData());
  }, []);

  const publish = useCallback(async (token: string, message?: string): Promise<PublishResult> => {
    const tsContent = serializeSiteData(data);
    return publishToGitHub(token, tsContent, message);
  }, [data]);

  return (
    <EditableDataContext.Provider value={{
      data, isAdmin, showAdminPanel, login, logout, toggleAdminPanel, changePassword,
      updateBrand, updateBio, updateSkills, updateHobbies, updateTimeline, updateHonors,
      updateTools, addIdea, updateIdea, deleteIdea,
      addFoodSpot, updateFoodSpot, deleteFoodSpot, resetData, publishToGitHub: publish,
    }}>
      {children}
    </EditableDataContext.Provider>
  );
}

export function useEditableData() {
  const ctx = useContext(EditableDataContext);
  if (!ctx) throw new Error('useEditableData must be used within EditableDataProvider');
  return ctx;
}
