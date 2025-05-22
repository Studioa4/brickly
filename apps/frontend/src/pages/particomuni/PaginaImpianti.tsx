import CondominioContextWrapper from "@/components/shared/CondominioContextWrapper";
import ContenutoImpianti from "./ContenutoImpianti";

export default function PaginaImpianti() {
  return (
    <CondominioContextWrapper
      renderContent={(condominio) => (
        <ContenutoImpianti condominio={condominio} />
      )}
    />
  );
}
