export async function fetchCondominiStudio(idStudio: string) {
  try {
    const res = await fetch(`/api/condomini?studio_id=${idStudio}`);
    if (!res.ok) throw new Error("Errore nel recupero condomìni dello studio");
    const data = await res.json();
    return data; // array di condomìni
  } catch (err) {
    console.error("Errore fetch condomìni studio:", err);
    return [];
  }
}
