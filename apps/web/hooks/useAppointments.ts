// src/hooks/useAppointments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAppointments,
  createAppointment,
  getDoctorPatients,
  updateAppointment,
} from "@/api/appointments";
import { toast } from "sonner";

type UseAppointmentsDataOptions = {
  patientID?: string;
  doctorID?: string;
  enabled?: boolean;
};

const getErrorMessage = (err: unknown, fallback: string) => {
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: unknown }).response === "object" &&
    (err as { response?: { data?: { message?: string } } }).response?.data
      ?.message
  ) {
    return (err as { response?: { data?: { message?: string } } }).response!
      .data!.message as string;
  }

  return fallback;
};

export const useAppointmentsData = (options?: UseAppointmentsDataOptions) => {
  const queryClient = useQueryClient();
  const { patientID, doctorID, enabled = true } = options ?? {};

  const {
    data: appointments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["appointments", { patientID, doctorID }],
    queryFn: () => getAppointments({ patientID, doctorID }),
    enabled,
    retry: (failureCount, error) => {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      if (status && status >= 400 && status < 500) return false;
      return failureCount < 1;
    },
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment created successfully!");
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to create appointment"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment updated successfully!");
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to update appointment"));
    },
  });

  return {
    appointments,
    isLoading,
    isError,
    error,
    refetch,

    createAppointment: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    updateAppointment: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};

export const useDoctorPatientsAppointments = (doctorId: string) => {
  return useQuery({
    queryKey: ["doctor-patients-appointments", doctorId],
    enabled: !!doctorId,
    queryFn: async () => {
      const patients = await getDoctorPatients(doctorId);

      const appointmentsByPatient = await Promise.all(
        patients.map((patient) => getAppointments({ patientID: patient.patientID })),
      );

      return appointmentsByPatient.flat();
    },
  });
};
