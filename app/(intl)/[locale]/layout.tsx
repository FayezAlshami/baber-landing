import { Document, buildMetadata } from "@/src/lib/seo";
import { asLocale } from "@/src/i18n";

export { viewport } from "@/src/lib/seo";
export const dynamicParams = false;
export const generateStaticParams = () => [{ locale: "en" }, { locale: "tr" }, { locale: "ar" }];

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
  return buildMetadata(asLocale((await params).locale));
}

export default async function Layout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = asLocale((await params).locale);
  return <Document locale={locale}>{children}</Document>;
}
