/** Vite `base` without trailing slash (empty at site root). */
export const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "");
