import { getAdminTheme } from "@/lib/site-settings-cache";

export async function AdminThemeStyle() {
  const theme = await getAdminTheme();
  const css = `
.admin-theme {
  --primary: ${theme.light.primary} !important;
  --accent: ${theme.light.accent} !important;
  --sidebar: ${theme.light.sidebar} !important;
  --background: ${theme.light.background} !important;
}
.dark .admin-theme {
  --primary: ${theme.dark.primary} !important;
  --accent: ${theme.dark.accent} !important;
  --sidebar: ${theme.dark.sidebar} !important;
  --background: ${theme.dark.background} !important;
}`;
  return <style id="fma-admin-theme-vars" dangerouslySetInnerHTML={{ __html: css }} />;
}
