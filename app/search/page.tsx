import SearchFeedContent from "@/modules/search/SearchFeed";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Search templates, courses and guides",
}

const SearchPage = () => {
    return (
        <div>
            <Suspense fallback={null}>
                <SearchFeedContent />
            </Suspense>
        </div>
    );
};

export default SearchPage;