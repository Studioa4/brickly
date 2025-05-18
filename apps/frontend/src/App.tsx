
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import CreaUtente from "./pages/superadmin/CreaUtente";
import PrivateSuperadminRoute from "./components/PrivateSuperadminRoute";
import SuperadminBootstrap from "./pages/superadmin/SuperadminBootstrap";
import RequireAuth from "./components/RequireAuth";
import LayoutSwitcher from "./components/LayoutSwitcher";
import AppLayout from "./components/AppLayout";

import Dashboard from "./pages/Dashboard";
import Catasto from "./pages/catasto";
import Anagrafiche from "./pages/anagrafiche";
import FornitoriTable from "./pages/fornitoritable";
import Provinceecomuni from "./pages/province-e-comuni";
import Tabellefiscali from "./pages/tabelle-fiscali";
import Datigenerali from "./pages/dati-generali";
import Struttura from "./pages/struttura";
import Risorseefondi from "./pages/risorse-e-fondi";
import Altridati from "./pages/altri-dati";
import UnitaImmobiliari from "./pages/unita-immobiliari";
import Registroanagrafe from "./pages/registro-anagrafe";
import Dossier from "./pages/dossier";
import Tabelle from "./pages/tabelle";
import Esercizi from "./pages/esercizi";
import Pianodeiconti from "./pages/piano-dei-conti";
import Fatturedaregistrare from "./pages/fatture-da-registrare";
import Fatturedaconfermare from "./pages/fatture-da-confermare";
import Registrocronologico from "./pages/registro-cronologico";
import Movimentidariconciliare from "./pages/movimenti-da-riconciliare";
import Movimentidaconfermare from "./pages/movimenti-da-confermare";
import Versamentidadepositare from "./pages/versamenti-da-depositare";
import Stampe from "./pages/stampe";
import Rendiconto from "./pages/rendiconto";
import Ripartospese from "./pages/riparto-spese";
import Rendicontoindividuale from "./pages/rendiconto-individuale";
import Preventivo from "./pages/preventivo";
import Scadenzario from "./pages/scadenzario";
import Preventivoindividuale from "./pages/preventivo-individuale";
import Situazionepatrimoniale from "./pages/situazione-patrimoniale";
import Riepilogofinanziario from "./pages/riepilogo-finanziario";
import Notaesplicativasintetica from "./pages/nota-esplicativa-sintetica";
import Impianti from "./pages/impianti";
import Sesamo from "./pages/sesamo";
import Interventi from "./pages/interventi";
import Contatori from "./pages/contatori";
import F24 from "./pages/f24";
import CU from "./pages/cu";
import Detrazionifiscali from "./pages/detrazioni-fiscali";
import Mod770 from "./pages/mod-770";
import QuadroACK from "./pages/quadro-ac---k";
import IndiciISA from "./pages/indici-isa";
import Avvisidiscadenza from "./pages/avvisi-di-scadenza";
import Pianidirientro from "./pages/piani-di-rientro";
import Whatsapp from "./pages/whatsapp";
import Email from "./pages/email";
import PEC from "./pages/pec";
import Blog from "./pages/blog";
import Registroverbali from "./pages/registro-verbali";
import Impostazioni from "@/pages/impostazioni";
import ImpostazioniStudi from './pages/impostazioni/studi';
import ImpostazioniStudio from './pages/impostazioni/studio';
import Fatturazione from "./pages/fatturazione";
import Stampeinsequenza from "./pages/stampe-in-sequenza";
import ImpostazioniUtente from "./pages/impostazioni/utente";
import ResetPasswordRequest from './pages/ResetPasswordRequest';
import ResetPassword from './pages/ResetPassword';

import AppLoader from "@/components/ui/AppLoader";
import { useAuth } from "@/context/AuthContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DatiGeneraliCondominio from "@/pages/condomini/DatiGeneraliCondominio";
import PaginaCondomini from "@/pages/condomini/PaginaCondomini";
const App = () => {
  const { loading: authLoading } = useAuth();

  if (authLoading) return <AppLoader />;

  return (
    <>
    <Routes>
      {/* ✅ PUBBLICHE */}
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password-request" element={<ResetPasswordRequest />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/superadmin/crea-utente"
        element={
          <PrivateSuperadminRoute>
            <CreaUtente />
          </PrivateSuperadminRoute>
        }
      />
      <Route path="/superadmin-bootstrap" element={<SuperadminBootstrap />} />

      {/* 🔐 PROTETTE */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="catasto" element={<Catasto />} />
        <Route path="anagrafiche" element={<Anagrafiche />} />
        <Route path="fornitori" element={<FornitoriTable />} />
        <Route path="province-e-comuni" element={<Provinceecomuni />} />
        <Route path="tabelle-fiscali" element={<Tabellefiscali />} />
        <Route path="dati-generali" element={<Datigenerali />} />
        <Route path="struttura" element={<Struttura />} />
        <Route path="risorse-e-fondi" element={<Risorseefondi />} />
        <Route path="altri-dati" element={<Altridati />} />
        <Route path="unita-immobiliari" element={<UnitaImmobiliari />} />
        <Route path="registro-anagrafe" element={<Registroanagrafe />} />
        <Route path="dossier" element={<Dossier />} />
        <Route path="tabelle" element={<Tabelle />} />
        <Route path="esercizi" element={<Esercizi />} />
        <Route path="piano-dei-conti" element={<Pianodeiconti />} />
        <Route path="fatture-da-registrare" element={<Fatturedaregistrare />} />
        <Route path="fatture-da-confermare" element={<Fatturedaconfermare />} />
        <Route path="registro-cronologico" element={<Registrocronologico />} />
        <Route path="movimenti-da-riconciliare" element={<Movimentidariconciliare />} />
        <Route path="movimenti-da-confermare" element={<Movimentidaconfermare />} />
        <Route path="versamenti-da-depositare" element={<Versamentidadepositare />} />
        <Route path="stampe" element={<Stampe />} />
        <Route path="rendiconto" element={<Rendiconto />} />
        <Route path="riparto-spese" element={<Ripartospese />} />
        <Route path="rendiconto-individuale" element={<Rendicontoindividuale />} />
        <Route path="preventivo" element={<Preventivo />} />
        <Route path="scadenzario" element={<Scadenzario />} />
        <Route path="preventivo-individuale" element={<Preventivoindividuale />} />
        <Route path="situazione-patrimoniale" element={<Situazionepatrimoniale />} />
        <Route path="riepilogo-finanziario" element={<Riepilogofinanziario />} />
        <Route path="nota-esplicativa-sintetica" element={<Notaesplicativasintetica />} />
        <Route path="impianti" element={<Impianti />} />
        <Route path="sesamo" element={<Sesamo />} />
        <Route path="interventi" element={<Interventi />} />
        <Route path="contatori" element={<Contatori />} />
        <Route path="f24" element={<F24 />} />
        <Route path="cu" element={<CU />} />
        <Route path="detrazioni-fiscali" element={<Detrazionifiscali />} />
        <Route path="mod-770" element={<Mod770 />} />
        <Route path="quadro-ac---k" element={<QuadroACK />} />
        <Route path="indici-isa" element={<IndiciISA />} />
        <Route path="avvisi-di-scadenza" element={<Avvisidiscadenza />} />
        <Route path="piani-di-rientro" element={<Pianidirientro />} />
        <Route path="whatsapp" element={<Whatsapp />} />
        <Route path="email" element={<Email />} />
        <Route path="pec" element={<PEC />} />
        <Route path="blog" element={<Blog />} />
        <Route path="registro-verbali" element={<Registroverbali />} />
        <Route path="/impostazioni/utente" element={<Navigate to="/impostazioni?tab=utente" replace />} />
        <Route path="/impostazioni" element={<Impostazioni />} />
        <Route path="/impostazioni/studio" element={<ImpostazioniStudio />} />
        <Route path="/impostazioni/studi" element={<ImpostazioniStudi />} />
        <Route path="fatturazione" element={<Fatturazione />} />
        <Route path="stampe-in-sequenza" element={<Stampeinsequenza />} />
        <Route path="/condomini/dati-generali" element={<DatiGeneraliCondominio />} />
        <Route path="/condomini" element={<PaginaCondomini />} />
      </Route>
    </Routes>

    <ToastContainer
  position="top-right"
  autoClose={2000} // durata: 2 secondi
  hideProgressBar={false}
  closeOnClick
  pauseOnHover
  draggable
  newestOnTop={false}
  theme="light"
/>
</>
  );
};


export default App;
