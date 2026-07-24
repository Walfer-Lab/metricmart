import FeedProducts from "@/modules/products/FeedProducts";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Discover Products",
    description: "Discover new products",
}

const Discover = ()=> {
    return (
        <div className="">
            <p className="font-general text-center text-lg font-medium my-3"></p>
            <Suspense fallback={null}>
                <FeedProducts />
            </Suspense>
        </div>
    )
}
export default Discover;