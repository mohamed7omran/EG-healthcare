import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axios";
import { Patient } from "@/types";

const fetchDoctorPatients = async (doctorId: string): Promise<Patient[]> => {
  const response = await client.get(
    `/appointments/doctors/${doctorId}/patients`,
  );
  return response.data;
};

export const useDoctorPatients = (doctorId: string) => {
  return useQuery({
    queryKey: ["doctor-patients", doctorId],
    queryFn: () => fetchDoctorPatients(doctorId),
    enabled: !!doctorId,
  });
};
