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
      <main className="flex flex-col gap-6">
      <CategoriesTags />
      <TrendingProducts />

      <div className="flex flex-row w-full bg-linear-to-r from-blue-500 via-blue-500 to-blue-300 rounded-2xl px-4 py-5 items-center justify-between overflow-hidden">
        <div className="flex flex-col">
          <p className="text-xl font-general font-bold text-white">Start selling with us</p>
          <p className="font-general font-medium text-gray-100 text-sm pt-1.5 pb-3.5">Join a community of creators and earn passive income by sharing your knowledge with the world.</p>
          <Link href="https://sellers.metricmart.in/" className="font-general font-medium text-white text-md w-fit px-3 py-1.5 bg-black border-0 rounded-lg hover:bg-black/80 ">Become a seller</Link>
        </div>
        <div className="shrink-0">
            <Image src={Coin} alt="coin" className="w-26 h-auto drop-shadow-2xl drop-shadow-black/70" />
        </div>
      </div>
      </main>
    </div>
  );
}
