import puppeteer from "puppeteer";

export async function cercaFornitoreConPuppeteer(piva: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto("https://www.ufficiocamerale.it", { waitUntil: "networkidle2" });

    await page.type("#search_input", piva);
    await page.click("button[type='submit']");

    // Attende max 10s e stampa tutto il body HTML risultante
    await new Promise(resolve => setTimeout(resolve, 5000));
    const content = await page.content();
    console.log("📄 HTML visibile dopo ricerca:\n", content.slice(0, 3000));

    await browser.close();
    return null;
  } catch (error) {
    console.error("❌ Errore Puppeteer:", (error as Error).message);
    await browser.close();
    return null;
  }
}