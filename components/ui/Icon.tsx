import {
  ArrowRight,
  Bell,
  CalendarBlank,
  CaretDown,
  CaretRight,
  ChartBar,
  ChatCircle,
  Check,
  Clock,
  CreditCard,
  Crown,
  EnvelopeSimple,
  Gift,
  Globe,
  GoogleLogo,
  InstagramLogo,
  Layout,
  Lightning,
  List,
  MagnifyingGlass,
  MapPin,
  Minus,
  Phone,
  Plus,
  Repeat,
  Scissors,
  ShieldCheck,
  Sparkle,
  Star,
  Storefront,
  Tag,
  TiktokLogo,
  Tray,
  TrendUp,
  User,
  Users,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon, IconWeight } from "@phosphor-icons/react";

/** Our icon names, mapped onto Phosphor (SSR build, no context needed). */
const icons = {
  check: Check,
  x: X,
  minus: Minus,
  arrow: ArrowRight,
  chevron: CaretRight,
  down: CaretDown,
  menu: List,
  globe: Globe,
  calendar: CalendarBlank,
  clock: Clock,
  scissors: Scissors,
  user: User,
  users: Users,
  pin: MapPin,
  store: Storefront,
  chart: ChartBar,
  bell: Bell,
  card: CreditCard,
  gift: Gift,
  crown: Crown,
  star: Star,
  tag: Tag,
  plus: Plus,
  repeat: Repeat,
  search: MagnifyingGlass,
  layout: Layout,
  shield: ShieldCheck,
  zap: Lightning,
  message: ChatCircle,
  phone: Phone,
  inbox: Tray,
  trend: TrendUp,
  mail: EnvelopeSimple,
  sparkle: Sparkle,
  instagram: InstagramLogo,
  tiktok: TiktokLogo,
  google: GoogleLogo,
  whatsapp: WhatsappLogo,
} satisfies Record<string, PhosphorIcon>;

export type IconName = keyof typeof icons;

const BRANDS = new Set<IconName>(["whatsapp", "instagram", "tiktok", "google"]);

/**
 * Phosphor icons in a refined light weight by default. `weight` picks another style
 * (e.g. "duotone" for feature tiles); a heavier `strokeWidth` maps to a bolder weight so
 * existing call sites keep their emphasis.
 */
export default function Icon({
  name,
  className = "h-5 w-5",
  strokeWidth,
  weight,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
  weight?: IconWeight;
}) {
  const Glyph = icons[name];
  const resolved: IconWeight =
    weight ??
    (BRANDS.has(name) ? "regular" : strokeWidth && strokeWidth >= 2.2 ? "bold" : strokeWidth && strokeWidth >= 2 ? "regular" : "light");
  return <Glyph weight={resolved} className={className} aria-hidden="true" focusable="false" />;
}
