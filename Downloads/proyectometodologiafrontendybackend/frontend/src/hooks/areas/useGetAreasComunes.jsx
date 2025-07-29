import { useEffect, useState } from "react";
import { getAreasComunes } from "@services/commonArea.service.js";

export default function useGetAreasComunes() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAreas() {
      try {
        const data = await getAreasComunes();
        setAreas(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAreas();
  }, []);

  return { areas, loading, error };
}
