import { getMantenimiento } from "@services/mantenimiento.service";

export const useGetMantenimiento = () => {
  const fetchMantenimiento = async () => {
    try {
      const mantenimientoData = await getMantenimiento();
      return mantenimientoData;
    } catch (error) {
      console.error("Error consiguiendo el mantenimiento:", error);
    }
  };
  return { fetchMantenimiento };
};

export default useGetMantenimiento;
