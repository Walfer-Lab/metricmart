"use client";

import Image from "next/image";
import Planner from "@/public/Category_Images/planner.png";
import Template from "@/public/Category_Images/template.png";
import Courses from "@/public/Category_Images/courses.png";
import AudioBook from "@/public/Category_Images/audiobook.png";
import CodeSnippets from "@/public/Category_Images/codesnippets.png";
import Guides from "@/public/Category_Images/guides.png";
import Hacks from "@/public/Category_Images/hacks.png";
import Notes from "@/public/Category_Images/notes.png";
import Business from "@/public/Category_Images/business.png";
import Comic from "@/public/Category_Images/comic.png";
import Language from "@/public/Category_Images/language.png";
import Finance from "@/public/Category_Images/finance.png";
import Explore from "@/public/Category_Images/explore.png";
import Link from "next/link";

const CategoriesConstants = [
   { label:"Notes", icon:Notes, link:"/discover?q=notes" },
   { label:"Programs", icon:CodeSnippets, link:"/discover?q=programs" },
   { label:"Courses", icon:Courses, link:"/discover?q=courses" },
   { label:"Finance", icon:Finance, link:"/discover?q=finance" },
   { label:"Languages", icon:Language, link:"/discover?q=languages" },
   { label:"Templates", icon:Template, link:"/discover?q=design" },
   { label:"Comics", icon:Comic, link:"/discover?q=comic" },
   { label:"Planners", icon:Planner, link:"/discover?q=planner" },
   { label:"Hacks", icon:Hacks, link:"/discover?q=hacks" },
   { label:"Business", icon:Business, link:"/discover?q=business" },
   { label:"AudioBook", icon:AudioBook, link:"/discover?q=audiobook" },
   { label:"Guides", icon:Guides, link:"/discover?q=guides" },
   { label:"Explore more", icon:Explore, link:"/discover" },
]

const CategoriesTags = () => {

    return (
        <div className="w-full flex flex-row overflow-x-scroll scrollbar-none gap-4 sm:gap-6">

           { CategoriesConstants.map((item, index) => (
            <Link href={item.link}>
            <div className="flex flex-col items-center gap-1">
               <div className="p-3 rounded-full border border-gray-300 w-16 sm:w-18 h-16 sm:h-18 bg-gray-100">
                  <Image src={item.icon} alt="" width={50} height={50} className="object-center" />
               </div>
               <p className="text-sm font-medium text-gray-600 font-general text-center whitespace-nowrap">
                  {item.label}
               </p>
           </div>
            </Link>
           ))}
        </div>
    );
};

export default CategoriesTags;