
import express from "express";
import { supabaseBancheDati } from "../supabaseClient";

const router = express.Router();

function validaCodiceFiscale(cf: string): boolean {
  if (!/^[A-Z0-9]{16}$/.test(cf)) return false;

  const pari = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
    '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4,
    'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
    'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14,
    'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19,
    'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24,
    'Z': 25
  };

  const dispari = {
    '0': 1, '1': 0, '2': 5, '3': 7, '4': 9,
    '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
    'A': 1, 'B': 0, 'C': 5, 'D': 7, 'E': 9,
    'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
    'K': 2, 'L': 4, 'M': 18, 'N': 20, 'O': 11,
    'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14,
    'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24,
    'Z': 23
  };

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    const c = cf.charAt(i);
    sum += (i % 2 === 0)
      ? dispari[c as keyof typeof dispari]
      : pari[c as keyof typeof pari];
  }

  const expectedCheckChar = chars.charAt(sum % 26);
  return cf.charAt(15) === expectedCheckChar;
}

router.post("/utenti/verifica-codice-fiscale", async (req, res) => {
  const codiceFiscalePulito = (req.body.codice_fiscale || "")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Z0-9]/g, "")
    .trim();

  if (!validaCodiceFiscale(codiceFiscalePulito)) {
    return res.status(400).json({ valid: false, error: "Codice fiscale non valido" });
  }

  try {
    const { data, error } = await supabaseBancheDati
      .from("anagrafiche")
      .select("codice_fiscale, nome, cognome")
      .eq("codice_fiscale", codiceFiscalePulito)
      .maybeSingle();

    if (error) {
      console.error("❌ Supabase error:", error);
      return res.status(500).json({ valid: true, found: false, anagrafiche: [] });
    }

    if (!data) {
      return res.json({ valid: true, found: false, anagrafiche: [] });
    }

    return res.json({ valid: true, found: true, anagrafiche: [data] });
  } catch (err) {
    console.error("Errore backend:", err);
    return res.status(500).json({ valid: false, error: "Errore interno" });
  }
});

export default router;
