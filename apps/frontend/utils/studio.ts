export function getNomeStudio(): string | null {
  return localStorage.getItem("studio_nome");
}
