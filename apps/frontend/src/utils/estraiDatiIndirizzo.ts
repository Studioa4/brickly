// src/utils/estraiDatiIndirizzo.ts

export function estraiDatiDaAddressComponents(components: any[]) {
  let cap = "";
  let comune = "";
  let provincia = "";

  for (const comp of components) {
    if (comp.types.includes("postal_code")) cap = comp.long_name;
    if (comp.types.includes("locality")) comune = comp.long_name;
    if (comp.types.includes("administrative_area_level_2")) provincia = comp.short_name;
  }

  return { cap, comune, provincia };
}