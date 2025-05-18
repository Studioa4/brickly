export type Azione = 'read' | 'create' | 'update' | 'delete' | 'export';

export type ModuloPermessi =
  | 'condomini'
  | 'contabilita'
  | 'comunicazioni'
  | 'fornitori'
  | 'fatture'
  | 'report'
  | 'catasto';

export type PermessiUtente = {
  [modulo in ModuloPermessi]?: Azione[];
};

export function haPermesso(
  permessi: PermessiUtente | undefined,
  modulo: ModuloPermessi,
  azione: Azione
): boolean {
  return permessi?.[modulo]?.includes(azione) ?? false;
}
