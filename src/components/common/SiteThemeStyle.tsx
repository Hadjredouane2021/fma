import { getSiteTheme } from "@/lib/site-settings-cache";

export async function SiteThemeStyle() {
  const theme = await getSiteTheme();
  const css = `
:root {
  --fma-burgundy: ${theme.light.brand} !important;
  --fma-blue: ${theme.light.blue} !important;
  --fma-mauve: ${theme.light.mauve} !important;
  --fma-taupe: ${theme.light.gold} !important;
  --fma-graphite: ${theme.light.graphite} !important;
  --fma-pale: ${theme.light.pale} !important;
}
.dark {
  --fma-burgundy: ${theme.dark.brand} !important;
  --fma-blue: ${theme.dark.blue} !important;
  --fma-mauve: ${theme.dark.mauve} !important;
  --fma-taupe: ${theme.dark.gold} !important;
  --fma-graphite: ${theme.dark.graphite} !important;
  --fma-pale: ${theme.dark.pale} !important;
}`;
  return <style id="fma-site-theme-vars" dangerouslySetInnerHTML={{ __html: css }} />;
}
