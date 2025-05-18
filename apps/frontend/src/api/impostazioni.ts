export async function getUtentiStudio() {
  const res = await fetch('/api/studio/utenti');
  if (!res.ok) throw new Error('Errore nel recupero utenti');
  return await res.json();
}
