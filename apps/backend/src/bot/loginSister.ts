import puppeteer from "puppeteer";

export async function loginSister({
  username,
  password,
  pin
}: {
  username: string;
  password: string;
  pin: string;
}) {
  const browser = await puppeteer.launch({
    headless: false, // visibile per debug
    defaultViewport: null,
    args: ["--start-maximized"]
  });

  const page = await browser.newPage();

  await page.goto("https://iampe.agenziaentrate.gov.it/sam/UI/Login?realm=/agenziaentrate#tab-4", {
    waitUntil: "networkidle2"
  });

  console.log("✅ Pagina di login caricata");

  // 🔍 Attendi che i campi siano presenti nel DOM
  await page.waitForSelector('input[name="IDToken1"]'); // Username
  await page.waitForSelector('input[name="IDToken2"]'); // Password
  await page.waitForSelector('input[name="IDToken3"]'); // PIN

  // ✍️ Inserisci credenziali
  await page.type('input[name="IDToken1"]', username, { delay: 50 });
  await page.type('input[name="IDToken2"]', password, { delay: 50 });
  await page.type('input[name="IDToken3"]', pin, { delay: 50 });

  console.log("🔐 Credenziali inserite, clicco su 'Accedi'");

  // 🖱️ Clic sul bottone Accedi
  await Promise.all([
    page.click('input[name="Login.Submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" })
  ]);

  console.log("✅ Login effettuato");

  return { browser, page }; // Ritorniamo browser e pagina per proseguire con il flusso
}
