import { Document, buildMetadata } from "@/src/lib/seo";
import type { Locale } from "@/src/i18n";

export { viewport } from "@/src/lib/seo";
export const dynamicParams = false;
export const generateStaticParams = () => [{ locale: "en" }, { locale: "tr" }, { locale: "ar" }];
export const generateMetadata = ({ params }: { params: { locale: Locale } }) => buildMetadata(params.locale);

export default function Layout({ children, params }: { children: React.ReactNode; params: { locale: Locale } }) {
  return <Document locale={params.locale}>{children}</Document>;
}
