// src/hooks/useAppointments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAppointments, createAppointment } from '@/api/appointments';

export const useAppointmentsData = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['appointments'],
    queryFn: getAppointments,
  });

  const createMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  return { ...query, createMutation };
};