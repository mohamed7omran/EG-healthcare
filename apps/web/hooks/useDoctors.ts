import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/axios'; 
import { Doctor } from '@/types';

const fetchDoctors = async (): Promise<Doctor[]> => {
  const response = await client.get('/doctors');
  return response.data;
};

export const useDoctors = () => {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctors,
  });
};

const fetchDoctorById = async (id: string): Promise<Doctor> => {
    const response = await client.get(`/doctors/${id}`);
    return response.data;
  };
  
  export const useDoctor = (id: string) => {
    return useQuery({
      queryKey: ['doctor', id],
      queryFn: () => fetchDoctorById(id),
      enabled: !!id,
    });
  };