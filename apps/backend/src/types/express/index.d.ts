declare namespace Express {
  export interface Request {
    utente?: {
      id: string;
      email?: string;
      nome?: string;
      cognome?: string;
      is_superadmin?: boolean;
      id_studio_corrente?: string;
    };
  }
}