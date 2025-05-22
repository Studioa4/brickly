import puppeteer from 'puppeteer';

export async function avviaBrowserSister() {
  const browser = await puppeteer.launch({
    headless: false, // se usi xvfb è ok lasciarlo così
    defaultViewport: null,
    args: ['--no-sandbox', '--start-maximized'],
    executablePath: puppeteer.executablePath()
  });

  const page = await browser.newPage();
  await page.goto(
    'https://iampe.agenziaentrate.gov.it/sam/UI/Login?realm=/agenziaentrate#tab-4',
    { waitUntil: 'networkidle2' }
  );

  console.log('✅ Pagina di login Sister caricata');

  // 🔐 Inserisci le credenziali
  await page.type('input[name="IDToken1"]', 'INSERISCI_USERNAME');
  await page.type('input[name="IDToken2"]', 'INSERISCI_PASSWORD');
  await page.type('input[name="IDToken3"]', 'INSERISCI_PIN');

  console.log('⌨️  Credenziali inserite');

  // ▶️ Click sul bottone Accedi
  await Promise.all([
    page.click('input[name="Login.Submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);

  console.log('✅ Login completato');
  return { browser, page };
}
