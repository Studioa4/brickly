import axios from "axios";
import * as cheerio from "cheerio";


export interface FornitoreWeb {
  ragione_sociale: string;
  codice_fiscale: string;
  partita_iva: string;
  indirizzo: string;
  cap: string;
  citta: string;
  provincia: string;
  pec: string;
}

export async function cercaFornitoreDaWeb(piva: string): Promise<FornitoreWeb | null> {
  try {
    const searchUrl = "https://www.ufficiocamerale.it/";
    const form = new URLSearchParams();
    form.append("piva", piva);

    const response = await axios.post<string>(searchUrl, form.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0"
      },
      maxRedirects: 0,
      validateStatus: () => true
    });

    const redirectUrl = response.headers.location;

    const finalUrl = redirectUrl
      ? redirectUrl
      : `https://www.ufficiocamerale.it/${piva}`; // fallback

    const pageRes = await axios.get<string>(finalUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(pageRes.data);

    const ragione_sociale = $("h1.entry-title").text().trim();

    const dettagli = $(".entry-content p")
      .map((_, el) => $(el).text().trim())
      .get();

    const cf = dettagli.find((r: string) => r.includes("Codice Fiscale"))?.split(":")[1]?.trim() || "";
    const pec = dettagli.find((r: string) => r.includes("PEC"))?.split(":")[1]?.trim() || "";

    const indirizzoFull = dettagli.find((r: string) => r.includes("Indirizzo"))?.split(":")[1]?.trim() || "";
    const [indirizzo, capComune] = indirizzoFull.split(/\d{5}/);
    const cap = indirizzoFull.match(/\d{5}/)?.[0] || "";
    const comune = capComune?.trim().split(" ")[0] || "";
    const provincia = capComune?.trim().split(" ")[1]?.replace("(", "").replace(")", "") || "";

    return {
      ragione_sociale,
      codice_fiscale: cf,
      partita_iva: piva,
      indirizzo: indirizzo?.trim(),
      cap,
      citta: comune,
      provincia,
      pec
    };
  } catch (error: any) {
    console.error("Errore scraping:", error.message);
    return null;
  }
}