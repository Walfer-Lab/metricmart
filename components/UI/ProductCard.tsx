'use client';

import { Fire02Icon, Sad02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ProductCard = ({ id, title, image, price, discount }: any) => {
    const [imgError, setImgError] = useState(false);

    return (
        <Link href={`/a/${id}`}>
            <div className="flex flex-col cursor-pointer">

                <div className="relative border border-gray-200 rounded-xl overflow-hidden aspect-square flex items-center justify-center bg-gray-200 max-w-64">
                    {imgError || !image ? (
                       <div className="font-general font-medium text-gray-400 flex flex-col items-center gap-1 shrink-0">
                        <HugeiconsIcon icon={Sad02Icon} size={20} />
                        <span>IMAGE NOT FOUND</span>
                       </div>
                    ) : (
                        <Image 
                            src={image}
                            alt={title}
                            width={400}
                            height={400}
                            loading="lazy"
                            quality={320}
                            className="object-cover object-center shrink-0"
                            onError={() => setImgError(true)} 
                        />
                    )}
                </div>
                <p className="text-sm font-general tracking-tight font-medium text-black line-clamp-2 pt-2 ">
                    {title}
                </p>

                <p className="flex items-center gap-3 mt-1">
                    <span className="text-md font-general font-semibold text-black/80 tracking-wide">
                        ₹{price}
                    </span>
                    
                    {discount && (
                        <span className="text-xs font-general font-medium bg-emerald-100 px-2 py-1 rounded-full text-emerald-700">
                            {discount} OFF
                        </span>
                    )}
                </p>
            </div>
        </Link>
    );
};

export default ProductCard;