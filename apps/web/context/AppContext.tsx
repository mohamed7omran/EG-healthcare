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
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  aiResults: AIAnalysisResult[];
  addAIResult: (result: AIAnalysisResult) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = (uid: string) => `user_role_${uid}`;

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [role, setRole] = useState<UserRole>("patient");
  const {
    data: appointments = [],
    isLoading: isAppointmentsLoading,
    createMutation,
  } = useAppointmentsData();
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(mockChatMessages);
  const [aiResults, setAIResults] = useState<AIAnalysisResult[]>(
    mockAIAnalysisResults,
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      // if (firebaseUser) {
      //   const storedRole = localStorage.getItem(ROLE_STORAGE_KEY(firebaseUser.uid));
      //   setRole((storedRole === 'doctor' ? 'doctor' : 'patient') as UserRole);
      // }
      if (firebaseUser) {
        try {
          const { data } = await client.get(
            `/users/by-firebase/${firebaseUser.uid}`,
          );

          setRole("doctor");
        } catch (err) {
          console.error("Failed to load role", err);
          setRole("doctor");
        }
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const currentUserId = user?.uid ?? "";

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const addAppointment = (payload: any) => {
    createMutation.mutate(payload);
  };

  // const updateAppointment = (id: string, updates: Partial<Appointment>) => {
  //   setAppointments(prev =>
  //     prev.map(apt => (apt.id === id ? { ...apt, ...updates } : apt))
  //   );
  // };

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
        updateAppointment: () => {},
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
