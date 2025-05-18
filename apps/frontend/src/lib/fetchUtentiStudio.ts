export async function fetchUtentiStudio(idStudio: string) {
  try {
    const res = await fetch(`/api/utenti-studio?studio_id=${idStudio}`);
    if (!res.ok) throw new Error("Errore nel recupero utenti studio");
    const data = await res.json();
    return data; // array di utenti
  } catch (err) {
    console.error("Errore fetch utenti studio:", err);
    return [];
  }
}
