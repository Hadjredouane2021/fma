import { PageSpinner } from "@/components/common/PageSpinner";
import { getSiteSpinner } from "@/lib/site-spinner";

export default async function LocaleLoading() {
  const spinner = await getSiteSpinner();
  return <PageSpinner imageUrl={spinner.imageUrl} />;
}
