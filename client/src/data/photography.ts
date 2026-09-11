/**
 * Aperture Blue design system data: clear, humane studio operations with cool editorial precision.
 */
export type Package = {
  id: "mini" | "portrait" | "editorial" | "wedding";
  name: string;
  eyebrow: string;
  price: number;
  retainer: number;
  duration: number;
  durationLabel: string;
  location: "outdoor" | "studio" | "hybrid";
  locationLabel: string;
  bestFor: string;
  includes: string[];
};

export const packages: Package[] = [
  {
    id: "mini",
    name: "Light Study",
    eyebrow: "A quick, considered portrait",
    price: 420,
    retainer: 175,
    duration: 45,
    durationLabel: "45 minutes",
    location: "outdoor",
    locationLabel: "Outdoor, golden hour",
    bestFor: "solo portraits, couples, small rituals",
    includes: ["45-minute session", "20 hand-edited images", "Private gallery delivery"],
  },
  {
    id: "portrait",
    name: "The Whole Story",
    eyebrow: "Room to settle into the frame",
    price: 760,
    retainer: 350,
    duration: 90,
    durationLabel: "90 minutes",
    location: "studio",
    locationLabel: "Daylight studio",
    bestFor: "families, milestones, creative portraits",
    includes: ["90-minute session", "55 hand-edited images", "Planning call + wardrobe notes"],
  },
  {
    id: "editorial",
    name: "Directed Editorial",
    eyebrow: "A visual world with a point of view",
    price: 1180,
    retainer: 425,
    duration: 90,
    durationLabel: "90 minutes",
    location: "hybrid",
    locationLabel: "Studio or on-location",
    bestFor: "artists, founders, personal campaigns",
    includes: ["Creative treatment", "90-minute set", "75 hand-edited images"],
  },
  {
    id: "wedding",
    name: "Wedding Day",
    eyebrow: "Coverage that stays close to the feeling",
    price: 4200,
    retainer: 1200,
    duration: 480,
    durationLabel: "8 hours",
    location: "hybrid",
    locationLabel: "Venue + outdoor portrait reserve",
    bestFor: "small weddings and all-day celebrations",
    includes: ["8 hours of coverage", "Two-part planning session", "Golden-hour portrait reserve"],
  },
];

export const sunsetTable = [
  "17:21", "17:54", "18:28", "19:56", "20:24", "20:33",
  "20:22", "19:53", "19:09", "18:20", "16:46", "16:35",
];

export const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

export const getPackage = (id: string | null | undefined) =>
  packages.find((item) => item.id === id) ?? packages[0];

export const formatMinutes = (minutes: number) => {
  const hour = Math.floor(minutes / 60) % 24;
  const min = minutes % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(min).padStart(2, "0")} ${suffix}`;
};

export const getGoldenHour = (monthIndex: number, day: number) => {
  const [hours, minutes] = sunsetTable[monthIndex].split(":").map(Number);
  const lightlyVariedSunset = hours * 60 + minutes + ((day % 5) - 2) * 3;
  return { start: lightlyVariedSunset - 65, end: lightlyVariedSunset };
};
