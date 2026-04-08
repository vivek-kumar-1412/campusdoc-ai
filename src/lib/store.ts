import { useState, useEffect, useCallback } from "react";

export type UserRole = "startup" | "mentor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface SharedProjectData {
  projectName: string;
  companyName: string;
  date: string;
  amount: string;
  partiesInvolved: string;
}

export interface GeneratedDocument {
  id: string;
  title: string;
  type: "mou" | "invoice" | "work-order" | "purchase-order";
  content: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  status: "draft" | "pending" | "approved";
  projectId: string;
  overrides?: Partial<SharedProjectData>;
}

export interface UploadedTemplate {
  id: string;
  name: string;
  type: "template" | "reference";
  fileType: "docx" | "pdf";
  uploadedAt: string;
  content?: string;
}

export interface Project {
  id: string;
  name: string;
  sharedData: SharedProjectData;
}

const STORAGE_KEYS = {
  user: "campusdoc_user",
  documents: "campusdoc_documents",
  templates: "campusdoc_templates",
  projects: "campusdoc_projects",
};

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setToStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() =>
    getFromStorage(STORAGE_KEYS.user, null)
  );

  const login = useCallback((email: string, _password: string, role: UserRole = "startup") => {
    const u: User = {
      id: crypto.randomUUID(),
      name: email.split("@")[0],
      email,
      role,
    };
    setUser(u);
    setToStorage(STORAGE_KEYS.user, u);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.user);
  }, []);

  return { user, login, logout };
}

export function useDocuments() {
  const [documents, setDocuments] = useState<GeneratedDocument[]>(() =>
    getFromStorage(STORAGE_KEYS.documents, [])
  );

  useEffect(() => {
    setToStorage(STORAGE_KEYS.documents, documents);
  }, [documents]);

  const addDocument = useCallback((doc: GeneratedDocument) => {
    setDocuments((prev) => [doc, ...prev]);
  }, []);

  const updateDocument = useCallback((id: string, updates: Partial<GeneratedDocument>) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString(), version: d.version + 1 } : d
      )
    );
  }, []);

  return { documents, addDocument, updateDocument };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() =>
    getFromStorage(STORAGE_KEYS.projects, [])
  );

  useEffect(() => {
    setToStorage(STORAGE_KEYS.projects, projects);
  }, [projects]);

  const addProject = useCallback((project: Project) => {
    setProjects((prev) => [project, ...prev]);
  }, []);

  const updateProjectSharedData = useCallback(
    (projectId: string, data: Partial<SharedProjectData>) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? { ...p, sharedData: { ...p.sharedData, ...data } }
            : p
        )
      );
    },
    []
  );

  return { projects, addProject, updateProjectSharedData };
}

export function useTemplates() {
  const [templates, setTemplates] = useState<UploadedTemplate[]>(() =>
    getFromStorage(STORAGE_KEYS.templates, [])
  );

  useEffect(() => {
    setToStorage(STORAGE_KEYS.templates, templates);
  }, [templates]);

  const addTemplate = useCallback((t: UploadedTemplate) => {
    setTemplates((prev) => [t, ...prev]);
  }, []);

  return { templates, addTemplate };
}

export const DOCUMENT_TYPES = [
  { value: "mou", label: "Memorandum of Understanding" },
  { value: "invoice", label: "Invoice" },
  { value: "work-order", label: "Work Order" },
  { value: "purchase-order", label: "Purchase Order" },
] as const;
