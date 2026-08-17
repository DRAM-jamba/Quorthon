export type Theme = "dark" | "light";
export type Font = "default" | "alternative";

export function saveTheme(theme: Theme): void {
  localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme); // actually applies it
}
export function loadTheme(): Theme {
  return (localStorage.getItem("theme") as Theme) ?? "dark";
}

export function saveFont(font: Font): void {
  localStorage.setItem("font", font);
  document.documentElement.setAttribute("data-font", font);
}
export function loadFont(): Font {
  return (localStorage.getItem("font") as Font) ?? "default";
}