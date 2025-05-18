import { useEffect, useState } from "react";

export function useStudiByEmail(email: string | null) {
  const [studi, setStudi] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;

    setLoading(true);
    setErrore(null);

    fetch(`/api/studi-utente-by-email?email=${encodeURIComponent(email)}`)
      .then(async res => {
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg);
        }
        return res.json();
      })
      .then(data => setStudi(data))
      .catch(err => setErrore(err.message))
      .finally(() => setLoading(false));
  }, [email]);

  return { studi, loading, errore };
}
