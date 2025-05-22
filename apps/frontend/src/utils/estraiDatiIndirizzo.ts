export function estraiDatiDaAddressComponents(components) {
  const dati = {
    cap: "",
    comune: "",
    provincia: "",
    stato: "",
  };

  for (const component of components) {
    if (component.types.includes("postal_code")) {
      dati.cap = component.long_name;
    }
    if (component.types.includes("locality")) {
      dati.comune = component.long_name;
    }
    if (component.types.includes("administrative_area_level_2")) {
      dati.provincia = component.short_name;
    }
    if (component.types.includes("country")) {
      dati.stato = component.long_name; // es: "Italia", "France", "Germany"
    }
  }

  return dati;
}
