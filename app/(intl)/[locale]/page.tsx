import Landing from "@/components/Landing";
import { DICTS } from "@/src/lib/seo";
import { asLocale } from "@/src/i18n";

export default async function Page({ params }: PageProps<"/[locale]">) {
  const locale = asLocale((await params).locale);
  return <Landing locale={locale} dict={DICTS[locale]} />;
}
