import type { MetadataRoute } from "next"
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Ridefolio — Motorcycle knowledge & ownership",
    short_name: "Ridefolio",
    description: "Understand your ride. Own its story.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F7F8F6",
    theme_color: "#176B5B",
    lang: "en-IN",
    categories: ["lifestyle", "utilities"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
