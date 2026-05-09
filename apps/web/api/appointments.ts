// src/api/appointments.ts
import { client } from "@/lib/axios";
import { Appointment, Patient } from "@/types";

type AppointmentFilters = {
  doctorID?: string;
  patientID?: string;
};

export const getAppointments = async (
  filters?: AppointmentFilters,
): Promise<Appointment[]> => {
  const { data } = await client.get<Appointment[]>("/appointments", {
    params: filters,
  });
  return data;
};

export const createAppointment = async (
  payload: Partial<Appointment>,
): Promise<Appointment> => {
  const { data } = await client.post<Appointment>("/appointments", payload);
  return data;
};

export const updateAppointment = async ({
  appointmentID,
  payload,
}: {
  appointmentID: number;
  payload: Partial<Appointment>;
}): Promise<Appointment> => {
  const { data } = await client.patch<Appointment>(
    `/appointments/${appointmentID}`,
    payload,
  );
  return data;
};

export const getDoctorAppointments = async (
  doctorId: string,
): Promise<Appointment[]> => {
  const { data } = await client.get<Appointment[]>(
    `/appointments/doctors/${doctorId}`,
  );
  return data;
};

export const getDoctorPatients = async (doctorId: string): Promise<Patient[]> => {
  const { data } = await client.get<Patient[]>(
    `/appointments/doctors/${doctorId}/patients`,
  );
  return data;
};
