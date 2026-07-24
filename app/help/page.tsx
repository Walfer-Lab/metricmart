"use client";
import { useState } from "react";
import { ArrowDown01Icon, InstagramIcon, MailLove01Icon, MessageFavourite02Icon, MessengerIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const faqs = [
  {
    question: "How do I purchase a digital product?",
    answer: "Simply browse our marketplace, select the product you want, and read through the instructions on the product page. Once you're ready, proceed to checkout to complete your purchase.",
  },
  {
    question: "How do I get my files after paying?",
    answer: "Immediately after a successful payment, you will receive an active download link on your screen. This link is valid for exactly one hour. Please make sure to download and save your files to your device right away.",
  },
  {
    question: "Why shouldn't I clear my browser cookies during checkout?",
    answer: "Your temporary download access is tied to your browser session. Deleting your cookies before the download is complete will instantly erase your session data, and you will lose access to the download link. Please wait until your files are safely saved on your device before clearing your browser history or cookies.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We use Razorpay for secure checkout. You can pay using credit or debit cards, UPI, Pay Later options, net banking, and various digital wallets.",
  },
  {
    question: "I couldn't download the file or I accidentally lost my PDF. What do I do?",
    answer: "Don't worry, we can help! If your 1-hour window expired, your download failed, or you accidentally lost the file, please contact us through our Help page. Note: You must provide your exact payment details (such as the transaction ID or receipt) when you contact us so we can quickly verify your purchase and restore your access.",
  },
  {
    question: "Can I sell my own digital products on metricmart.in?",
    answer: "Yes! metricmart.in is a digital marketplace. Creators and sellers can list their own digital assets with us—including templates, courses, guides, eBooks, and more.",
  }
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleMail = () => {
    window.open("mailto:support@metricmart.in", "_blank");
  };

  const handleInstagram = () => {
    window.open("https://www.instagram.com/metricmart.in/", "_blank");
  };

  const handleMessenger = () => {
    window.open("https://m.me/walferlab", "_blank");
  };

  const handleMessageFavourite = () => {
    window.open("https://m.me/pdflovers_", "_blank");
  };

  return (
    <main className="flex flex-col items-center p-4">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <h1 className="text-4xl text-black/80 font-general font-black mb-2">Need help?</h1>
        <p className="text-sm text-gray-400 font-general font-semibold">
          We&apos;re here to help you make the most of metricmart
        </p>
      </div>

      <div className="w-full max-w-2xl flex flex-col divide-y-2 divide-gray-200 ring-2 ring-gray-200 rounded-xl overflow-hidden relative">
        
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              onClick={() => toggleFaq(index)}
              className="flex flex-col bg-gray-100 p-4 cursor-pointer transition-colors duration-200 hover:bg-gray-200"
            >
              <div className="flex items-center justify-between">
                <p 
                  className={`text-sm font-general transition-colors duration-200 ${
                    isOpen ? "text-gray-900 font-semibold" : "text-gray-800 font-medium"
                  }`}
                >
                  {faq.question}
                </p>
                <div
                  className={`transform transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-gray-900" : "rotate-0 text-gray-500"
                  }`}
                >
                  <HugeiconsIcon icon={ArrowDown01Icon} size={20} />
                </div>
              </div>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0 mt-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-sm text-gray-600 font-general font-medium">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full flex flex-col gap-6 items-center mt-10">
        <p className="text-2xl text-gray-500 font-general font-semibold">
          Send us your{' '}
          <span className="relative inline-block text-gray-800">
            message
            {/* Freehand SVG Underline */}
            <svg
              className="absolute left-0 w-full h-3 -bottom-2 text-blue-500"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M2,8 C20,2 60,0 98,7" />
            </svg>
          </span>{' '}
          now
        </p>

        <div className="flex flex-row gap-4">
          <HugeiconsIcon icon={MailLove01Icon} onClick={()=>handleMail()} size={20} strokeWidth={2} className="text-blue-500 bg-gray-100 p-2 w-12 h-12 rounded-2xl cursor-pointer" />
          <HugeiconsIcon icon={InstagramIcon} onClick={()=>handleInstagram()} size={20} strokeWidth={2} className="text-blue-500 bg-gray-100 p-2 w-12 h-12 rounded-2xl cursor-pointer" />
          <HugeiconsIcon icon={MessengerIcon} onClick={()=>handleMessenger()} size={20} strokeWidth={2} className="text-blue-500 bg-gray-100 p-2 w-12 h-12 rounded-2xl cursor-pointer" />
          <HugeiconsIcon icon={MessageFavourite02Icon} onClick={()=>handleMessageFavourite()} size={20} strokeWidth={2} className="text-blue-500 bg-gray-100 p-2 w-12 h-12 rounded-2xl cursor-pointer" />
        </div>
      </div>      

      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 my-10">
        <div className="p-4 rounded-2xl bg-gray-100 hover:bg-gray-200">
          <HugeiconsIcon icon={NewsIcon} size={26} strokeWidth={2} className="text-blue-400" />
          <p className="text-sm text-gray-700 font-general font-semibold pt-1">Latest Updates</p>
          <p className="text-xs text-blue-500 font-cabinet font-medium hover:underline cursor-pointer">Read Blog</p>
        </div>
        <div className="p-4 rounded-2xl bg-gray-100 hover:bg-gray-200">
          <HugeiconsIcon icon={Agreement02Icon} size={26} strokeWidth={2} className="text-blue-400" />
          <p className="text-sm text-gray-700 font-general font-semibold pt-1">Partership</p>
          <p className="text-xs text-blue-500 font-cabinet font-medium hover:underline cursor-pointer">Join us</p>
        </div>
        <div className="p-4 rounded-2xl bg-gray-100 hover:bg-gray-200">
          <HugeiconsIcon icon={Briefcase01Icon} size={26} strokeWidth={2} className="text-blue-400" />
          <p className="text-sm text-gray-700 font-general font-semibold pt-1">Carrer</p>
          <p className="text-xs text-blue-500 font-cabinet font-medium hover:underline cursor-pointer">Join Team</p>
        </div>
        <div className="p-4 rounded-2xl bg-gray-100 hover:bg-gray-200">
          <HugeiconsIcon icon={Building03Icon} size={26} strokeWidth={2} className="text-blue-400" />
          <p className="text-sm text-gray-700 font-general font-semibold pt-1">About us</p>
          <p className="text-xs text-blue-500 font-cabinet font-medium hover:underline cursor-pointer">Know more</p>
        </div>
      </div> */}
    </main>
  );
}