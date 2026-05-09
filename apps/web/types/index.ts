export type UserRole = 'patient' | 'doctor';





export interface Diagnosis {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  condition: string;
  description: string;
  treatment: string;
  status: 'ongoing' | 'resolved' | 'follow-up';
}

// export interface Patient {
//   id: string;
//   name: string;
//   age: number;
//   gender: 'male' | 'female' | 'other';
//   avatar: string;
//   medicalSummary: string;
//   assignedDoctorId: string;
// }



export interface ChatMessage {
  id: string;
  senderId: string;
  senderRole: UserRole;
  content: string;
  timestamp: Date;
}

export interface AIAnalysisResult {
  id: string;
  patientId?: string;
  diagnosisSummary: string;
  riskLevel: 'low' | 'moderate' | 'high';
  recommendations: string[];
  analyzedAt: Date;
}

export interface ChatbotMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}
// =======================================================================================

export interface Patient {
  patientID: string;
  id?: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  avatar?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  medicalHistory?: string;
  medicalSummary?:
    | string
    | {
    bloodType?: string;
    allergies?: string;
    lastVisit?: string;
    nextAppointment?: string;
  };
  patientStats?: {
    totalVisits?: number;
    completed?: number;
    upcoming?: number;
  };
  currentCondition?: string;
  medications?: string;
  createdAt: string;
  updatedAt: string;
}

// export interface Doctor {
//   doctorID: number;
//   name: string;
//   specialty: string;
//   experience: string;
//   about?: string;
//   availability?: { day: string; from: string; to: string }[];
//   patientReviews?: { patientName: string; rating: number; comment?: string }[];
// }
export interface DoctorReview {
  id: string;
  patientId: string;
  patientName: string;
  rating: number;
  comment: string;
  date: Date;
}
export interface Doctor {
  doctorID: number;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  availability?: { day: string; from: string; to: string }[];
  avatar: string;
  bio: string;
  reviews?: DoctorReview[];
}

// export interface Appointment {
//   appointmentID: number;
//   doctor: Doctor;
//   patient: Patient;
//   date: string; // ISO date or YYYY-MM-DD
//   time: string; // hh:mm
//   status: 'Pending' | 'Completed' | 'Cancelled';
//   createdAt: string;
//   updatedAt: string;
// }
export interface Appointment {
  appointmentID: number;
  patientId: string;
  patientName: string;
  doctor: Doctor;
  patient: Patient;
  date: string;
  time: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  type: string;
  report?: string | null;
}