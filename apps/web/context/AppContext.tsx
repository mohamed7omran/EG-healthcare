"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { UserRole, Appointment, ChatMessage, AIAnalysisResult } from "@/types";
import { mockChatMessages, mockAIAnalysisResults } from "@/data/mockData";
import { useAppointmentsData } from "@/hooks/useAppointments";
import { client } from "@/lib/axios";

interface AppContextType {
  user: User | null;
  authLoading: boolean;
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUserId: string;
  signOut: () => Promise<void>;
  appointments: Appointment[];
  isAppointmentsLoading: boolean;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (
    appointmentID: number,
    updates: Partial<Appointment>,
    options?: { onSuccess?: () => void; onError?: () => void },
  ) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  aiResults: AIAnalysisResult[];
  addAIResult: (result: AIAnalysisResult) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = (uid: string) => `user_role_${uid}`;
const normalizeRole = (value: string | undefined): UserRole => {
  if (!value) return "patient";
  return value.trim().toLowerCase() === "doctor" ? "doctor" : "patient";
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [role, setRole] = useState<UserRole>("patient");
  const [roleLoading, setRoleLoading] = useState(true);
  const currentUserId = user?.uid ?? "";
  const {
    appointments = [],
    isLoading: isAppointmentsLoading,
    createAppointment,
    updateAppointment,
  } = useAppointmentsData({
    patientID: role === "patient" ? currentUserId : undefined,
    doctorID: role === "doctor" ? currentUserId : undefined,
    enabled: !!currentUserId && !authLoading && !roleLoading,
  });
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(mockChatMessages);
  const [aiResults, setAIResults] = useState<AIAnalysisResult[]>(
    mockAIAnalysisResults,
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        setRoleLoading(true);
        const cachedRole = localStorage.getItem(
          ROLE_STORAGE_KEY(firebaseUser.uid),
        );
        if (cachedRole) {
          setRole(normalizeRole(cachedRole));
        }

        try {
          const { data } = await client.get(`/users/${firebaseUser.uid}`);
          const resolvedRole = normalizeRole(data?.role);
          setRole(resolvedRole);
          localStorage.setItem(
            ROLE_STORAGE_KEY(firebaseUser.uid),
            resolvedRole,
          );
        } catch (err) {
          console.error("Failed to load role", err);
          if (!cachedRole) {
            setRole("patient");
          }
        } finally {
          setRoleLoading(false);
        }
      } else {
        setRole("patient");
        setRoleLoading(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const addAppointment = (appointment: Appointment) => {
    createAppointment(appointment);
  };
  const addChatMessage = (message: ChatMessage) => {
    setChatMessages((prev) => [...prev, message]);
  };

  const addAIResult = (result: AIAnalysisResult) => {
    setAIResults((prev) => [...prev, result]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        authLoading,
        role,
        setRole,
        currentUserId,
        signOut,
        appointments,
        isAppointmentsLoading,
        addAppointment,
        updateAppointment: (appointmentID, updates, options) =>
          updateAppointment(
            { appointmentID, payload: updates },
            {
              onSuccess: options?.onSuccess,
              onError: options?.onError,
            },
          ),
        chatMessages,
        addChatMessage,
        aiResults,
        addAIResult,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
