import { PageSpinner } from "@/components/common/PageSpinner";
import { getSiteSpinner } from "@/lib/site-spinner";

export default async function AdminLoading() {
  const spinner = await getSiteSpinner();
  return <PageSpinner className="min-h-[40vh]" imageUrl={spinner.imageUrl} />;
}
