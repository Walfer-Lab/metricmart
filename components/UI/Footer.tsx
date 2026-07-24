"use client";
import Logo from "@/public/LOGO_MAIN.png";
import Image from "next/image";

const Footer = ()=> {
    return (
        <div className="w-full border-t-2 border-t-gray-200 px-2 gap-2 py-4 flex flex-col sm:flex-row items-center justify-around mt-5">
            <div className="flex flex-row items-center">
                <Image src={Logo} alt="pdflovers" width={150} height={25} className="cursor-pointer"/>
                <p className="text-sm font-general font-medium text-gray-600">by <a href="https://walferlab.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-500 hover:underline">WalferLab</a></p>
            </div>
                
            <p className="text-xs font-general text-gray-500 text-center font-medium">@2026 metricmart. All rights reserved.</p>
        </div>
    )
}
export default Footer;