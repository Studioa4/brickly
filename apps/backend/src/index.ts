import checkCFRouter from "./routes/checkCodiceFiscale";
import dotenv from 'dotenv';
dotenv.config();
import anagraficheRouter from './routes/anagrafiche';
import express from 'express';
import cors from 'cors';
import permessiRouter from './routes/permessi-moduli';
import testDbRouter from './routes/test-db';
import loginRouter from './routes/login';
import passwordRouter from './routes/password';
import registerRouter from './routes/register';
import createUserRouter from './routes/create-user';
import utentiRouter from './routes/utenti';
import updateUtenteRouter from './routes/update-utente';
import bootstrapCheck from './routes/bootstrap-check';
import bootstrapCreate from './routes/bootstrap-create';
import forceBootstrap from './routes/force-bootstrap';
import bootstrapCheckRouter from './routes/bootstrap-check';
import bootstrapCreateRouter from './routes/bootstrap-create';
import profileRouter from './routes/profile';
import studiUtenteRouter from './routes/studi-utente';
import condominiRouter from './routes/condomini';
import fornitoriRouter from './routes/fornitori';
import fornitoriImportaLinkRouter from "./routes/fornitori-importa-da-link";
import studioUtenti from './routes/studioUtenti';
import utentiStudioRouter from './routes/utenti-studio'; // ✅ nuova route
import studiRouter from './routes/studi';
import fornitoriBDRouter from './routes/fornitori-bd';
import anagraficheCopiaRouter from './routes/anagrafiche-copia-da-bd';
import studiUtenteEmailRouter from './routes/studi-utente-by-email';
import preferenzeRouter from "./routes/preferenze.routes";
import preferenzeRoutes from "./routes/preferenze";
import authMiddleware from "./middleware/authMiddleware"; // percorso corretto
import meRouter from "./routes/me.routes";
// ➕ nuove rotte per recupero password
import testTokenRouter from './routes/testToken';
import passwordRecoveryRouter from './routes/passwordRecovery';
import resetPasswordRouter from './routes/resetPassword';
import verificaUtenteRouter from './routes/verificaCodiceFiscaleCompleta';
import anagraficheBD from './routes/anagraficheBancheDati';
import anagraficheOp from './routes/anagraficheOperativo';
import condominiEmailRouter from './routes/condomini-email';
import partiComuniRoutes from "./routes/partiComuni";
import impiantiRoutes from "./routes/impianti";
import anagraficheBDRoute from "./routes/anagrafiche-banche-dati";
import comuniRoute from "./routes/comuni-by-codice-catastale";
import checkAnagraficaCFRoute from "./routes/anagrafiche-banche-dati-check-cf";
import edraRoutes from "./routes/edra";

const app = express();

// ✅ CORS per Codespaces
const corsOrigin =
  process.env.NODE_ENV === "production"
    ? "https://app.brickly.cloud"
    : "https://upgraded-couscous-wrx49w9gpxrj25q56-5173.app.github.dev";

app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json());

// 🔐 Mock user temporaneo
app.use((req, res, next) => {
  req.utente = {
    id: 'mock-id',
    is_superadmin: true,
    id_studio_corrente: 'mock-studio-id',
  };
  next();
});
app.use("/api/pub/condomini/check-cf", checkCFRouter); // completamente pubblico

// ✅ Route pubblica: verifica codice fiscale condominio

app.use('/api/password', passwordRouter);
app.use('/api', studiUtenteEmailRouter);
app.use('/api/login', loginRouter);
app.use('/api/permessi-moduli', permessiRouter);
app.use('/api/test-db', testDbRouter);
app.use('/api/register', registerRouter);
app.use('/api/superadmin/bootstrap-check', bootstrapCheckRouter);
app.use('/api/superadmin/utenti', utentiRouter);
app.use('/api/superadmin/create-user', createUserRouter);
app.use('/api/anagrafiche', anagraficheRouter);
app.use('/api/superadmin/utenti', updateUtenteRouter);
app.use('/superadmin/bootstrap-check', bootstrapCheck);
app.use('/superadmin/bootstrap-create', bootstrapCreate);
app.use('/api/superadmin/bootstrap-create', bootstrapCreateRouter);
app.use('/api/superadmin/force-bootstrap', forceBootstrap);
app.use('/api/profile', profileRouter);

// 👇 route NON protetta: solo se ?email è presente
app.use('/api/condomini', (req, res, next) => {
  const url = req.url || '';
  if (req.method === 'GET' && req.query.email) {
    console.log("✅ BYPASS authMiddleware per /api/condomini?email");
    return condominiRouter(req, res, next);
  }
  next();
});

// 👇 tutte le altre passano da authMiddleware
app.use('/api/condomini', authMiddleware, condominiRouter);

app.use('/api/studi-utente-by-email', studiUtenteEmailRouter);
app.use('/api', studiRouter);
app.use('/api/fornitori', fornitoriRouter);
app.use("/api/preferenze", preferenzeRouter);
app.use('/api/fornitori', fornitoriImportaLinkRouter);
app.use('/api/studi-utente', studiUtenteRouter);
app.use('/api/studio', studioUtenti);
app.use('/api', fornitoriBDRouter);
app.use('/api', anagraficheCopiaRouter);
app.use("/api", preferenzeRoutes);
app.use("/api", anagraficheBD);
app.use("/api", anagraficheOp);
app.use('/api/utenti-studio', utentiStudioRouter);
app.use('/api', utentiStudioRouter); // ✅ nuova route registrata
app.use("/api/preferenze", authMiddleware, preferenzeRouter);
app.get('/', (req, res) => {
  res.send('Backend Brickly attivo');
});
app.use("/api/me", authMiddleware, meRouter);
// ➕ nuove rotte con prefisso corretto
app.use('/api', passwordRecoveryRouter);
app.use('/api/reset-password', resetPasswordRouter);
app.use("/api", verificaUtenteRouter);
app.use('/api/condomini-email', condominiEmailRouter); // ✅ route pubblica
app.use('/api/test-token', authMiddleware, testTokenRouter);
app.use("/api/parti-comuni", partiComuniRoutes);
app.use("/api/impianti", impiantiRoutes);
app.use("/api/anagrafiche-banche-dati", anagraficheBDRoute);
app.use("/api/comuni-by-codice-catastale", comuniRoute);
app.use("/api/anagrafiche-banche-dati/check-cf", checkAnagraficaCFRoute);
app.use("/api", edraRoutes); // 👈 questo collega le rotte a /api/*

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend in ascolto su http://localhost:${PORT}`);
});
