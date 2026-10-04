"use client";

import I18nProvider, { useI18n } from "./I18nProvider";
import Header from "./Header";
import Hero from "./Hero";
import BookingDemo from "./BookingDemo";
import Pricing from "./Pricing";
import Intro from "./Intro";
import SmoothScroll from "./SmoothScroll";
import Atmosphere from "./Atmosphere";
import {
  Brand,
  Compare,
  Faq,
  Features,
  FinalCta,
  Footer,
  Growth,
  Insights,
  MobileCta,
  Platform,
  Problem,
  Process,
  Proof,
  Seo,
  Showcase,
  Team,
  Testimonials,
} from "./Sections";
import type { Dict, Locale } from "@/src/i18n";

function Page() {
  const { switching } = useI18n();
  return (
    <>
      <Atmosphere />
      <div className={`locale-fade ${switching ? "is-switching" : ""}`}>
        <SmoothScroll />
        <Intro />
        <Header />
        <main id="main">
          <Hero />
          <Proof />
          <Problem />
          <Platform />
          <BookingDemo />
          <Features />
          <Team />
          <Showcase />
          <Seo />
          <Insights />
          <Growth />
          <Brand />
          <Process />
          <Compare />
          <Testimonials />
          <Pricing />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
        <MobileCta />
      </div>
    </>
  );
}

export default function Landing({ locale, dict }: { locale: Locale; dict: Dict }) {
  return (
    <I18nProvider initialLocale={locale} initialDict={dict}>
      <Page />
    </I18nProvider>
  );
}
