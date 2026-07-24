"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SellerIllustration from "@/public/seller.png";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

const SellerNotification = ({ onClose }:any) => {
    return (
        <div className="fixed right-2 bottom-2 z-40 w-fit max-w-64 rounded-2xl flex flex-col items-center gap-2 bg-linear-to-r p-2 from-black/95 to-black/80 shadow-2xl shadow-black">
            
            <button 
                onClick={onClose}
                className=" absolute right-3 top-3 p-1 rounded-lg  text-black/80 cursor-pointer transition-all duration-150"
            >
                <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={2} />
            </button>

            <Image 
                src={SellerIllustration} 
                alt="Sell"
                width={250}
                height={250} 
                className="bg-white rounded-xl p-2"
            />
            <p className="text-white font-cabinet text-xs tracking-wider">Sell your PDFs, Ebooks, courses, and template at <span className="text-blue-500 font-bold">PdfLovers</span> and earn money </p>
            <Link href="https://sellers.pdflovers.app/" className="bg-white rounded-lg px-4 py-1.5 text-black font-general font-medium text-sm mb-2">Become a seller</Link>
        </div>
    );
};

const SellerModal = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasClosedModal = document.cookie.includes("sellerModalClosed=true");
        
        if (!hasClosedModal) {
            setIsVisible(true);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        document.cookie = "sellerModalClosed=true; max-age=86400; path=/";
    };

    if (!isVisible) return null;

    return (
        <SellerNotification onClose={handleClose} />
    );
};

export default SellerModal;