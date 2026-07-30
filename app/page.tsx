import CategoriesTags from "@/modules/features/CategoriesTags";
import Coin from "@/public/icon/coin.png"
import TrendingProducts from "@/modules/products/trendingProducts";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title : "Discover templates, courses and guides"
}

export default function Home() {
  return (
    <div className="p-4">
      <main className="flex flex-col gap-8">
      <div className="relative w-full bg-linear-to-br from-blue-400 to-blue-500/80 rounded-xl px-4 py-3.5 justify-center overflow-hidden shadow-md shadow-blue-500/20">
        {/* decorative glow */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />

        <div className="relative flex flex-col">
          <p className="text-base font-general font-bold text-white tracking-wide leading-snug">
            Start selling with us!
          </p>
          <p className="font-general font-medium text-blue-50/90 text-sm pt-0.5 pb-2.5 leading-snug max-w-[220px] sm:max-w-none">
            Have templates, guides or courses? Turn them into passive income.
          </p>
          <Link
            href="https://sellers.metricmart.in/"
            className="font-general font-medium text-white text-sm w-fit px-3.5 py-1.5 bg-black rounded-lg transition-colors hover:bg-black/80"
          > 
            Become a seller
          </Link>
        </div>
      </div>
      <CategoriesTags />
      <TrendingProducts />

      </main>
    </div>
  );
}
