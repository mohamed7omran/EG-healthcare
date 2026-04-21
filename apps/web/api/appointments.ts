// src/api/appointments.ts
import { client } from '@/lib/axios';
import { Appointment } from '@/types';

export const getAppointments = async (): Promise<Appointment[]> => {
  const { data } = await client.get('/appointments'); // 
  return data;
};

export const createAppointment = async (payload: Partial<Appointment>) => {
  const { data } = await client.post('/appointments', payload); // [cite: 120]
  return data;
};

// وبالمثل لـ Update و Delete [cite: 135, 138]