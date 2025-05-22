import CondominioContextWrapper from "@/components/shared/CondominioContextWrapper";
import ContenutoStruttura from "./ContenutoStruttura";

export default function StrutturaCondominio() {
  return (
    <CondominioContextWrapper
      renderContent={(condominio) => (
        <ContenutoStruttura condominio={condominio} />
      )}
    />
  );
}
