import { chromium } from "playwright";

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

export async function cercaFornitoreConPlaywright(piva: string): Promise<FornitoreWeb | null> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto("https://www.ufficiocamerale.it", { waitUntil: "domcontentloaded" });

    await page.fill("#search_input", piva);
    await page.click("button[type='submit']");

    await page.waitForSelector("h1.entry-title", { timeout: 15000 });

    const ragione_sociale = await page.locator("h1.entry-title").textContent() || "";

    const paragrafi = await page.locator(".entry-content p").allTextContents();

    const findValue = (label: string): string =>
      paragrafi.find(r => r.includes(label))?.split(":")[1]?.trim() || "";

    const codice_fiscale = findValue("Codice Fiscale");
    const pec = findValue("PEC");

    const indirizzoFull = findValue("Indirizzo");
    const [indirizzo, capComune] = indirizzoFull.split(/\d{5}/);
    const cap = indirizzoFull.match(/\d{5}/)?.[0] || "";
    const comune = capComune?.trim().split(" ")[0] || "";
    const provincia = capComune?.trim().split(" ")[1]?.replace("(", "").replace(")", "") || "";

    await browser.close();

    return {
      ragione_sociale: ragione_sociale.trim(),
      codice_fiscale,
      partita_iva: piva,
      indirizzo: indirizzo?.trim(),
      cap,
      citta: comune,
      provincia,
      pec
    };
  } catch (error) {
    console.error("❌ Errore Playwright:", (error as Error).message);
    await browser.close();
    return null;
  }
}