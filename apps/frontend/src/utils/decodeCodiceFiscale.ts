export async function decodeCodiceFiscale(cf: string): Promise<null | {
  sesso: string;
  giorno: string;
  mese: string;
  anno: string;
  luogo_nascita: string;
  provincia: string;
  nazione: string;
}> {
  const mesi: { [key: string]: string } = {
    A: "01", B: "02", C: "03", D: "04", E: "05", H: "06",
    L: "07", M: "08", P: "09", R: "10", S: "11", T: "12"
  };

  try {
    const anno = parseInt(cf.slice(6, 8), 10);
    const mese = mesi[cf[8]];
    let giorno = parseInt(cf.slice(9, 11), 10);
    const sesso = giorno > 40 ? "F" : "M";
    if (giorno > 40) giorno -= 40;
    const codiceComune = cf.slice(11, 15);

    const res = await fetch(`/api/comuni-by-codice-catastale?codice=${codiceComune}`);
    if (!res.ok) return null;
    const luogo = await res.json();

    return {
      sesso,
      giorno: giorno.toString().padStart(2, "0"),
      mese,
      anno: (anno >= 0 && anno <= 24 ? "20" : "19") + anno.toString().padStart(2, "0"),
      luogo_nascita: luogo.luogo_nascita,
      provincia: luogo.provincia,
      nazione: luogo.nazione,
    };
  } catch (err) {
    return null;
  }
}
