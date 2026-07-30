'use client';

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import ProductCard from '@/components/UI/ProductCard';
import ProductCardSkeleton from '@/components/UI/ProductCardSkeleton';
import { HugeiconsIcon } from '@hugeicons/react';
import { AiSearch02Icon } from '@hugeicons/core-free-icons';
import Filters from "@/modules/features/Filters"; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PAGE_SIZE = 10;

function SearchFeedContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  // FIX: Use refs for ALL background tracking so the observer doesn't loop
  const offsetRef = useRef(0);
  const hasMoreRef = useRef(true);
  const isFetchingRef = useRef(false);
  const loadingRef = useRef(false);
  
  const cachedEmbeddingRef = useRef<number[] | null>(null);
  const lastQueryRef = useRef<string>('');
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchSearchResults = useCallback(async (
    currentOffset: number, 
    searchQuery: string, 
    currentSort: string,
    isReset: boolean = false
  ) => {
    if (isFetchingRef.current || !searchQuery.trim()) return;
    
    isFetchingRef.current = true;
    loadingRef.current = true;
    setLoading(true);

    let queryEmbedding = cachedEmbeddingRef.current;

    // FIX: Only clear cached AI vector if the actual query text changed
    if (isReset && lastQueryRef.current !== searchQuery) {
      cachedEmbeddingRef.current = null;
      queryEmbedding = null;
    }

    if (!queryEmbedding && isReset) {
      try {
        const { data: embeddingData } = await supabase.functions.invoke(
          'generate-query-embedding',
          { body: { query: searchQuery } }
        );
        if (embeddingData?.embedding) {
          queryEmbedding = embeddingData.embedding;
          cachedEmbeddingRef.current = queryEmbedding;
        }
      } catch (err) {
        console.error("AI Embedding failed, falling back to keywords:", err);
      }
    }

    lastQueryRef.current = searchQuery;

    const { data, error } = await supabase.rpc('get_ai_search_results', {
      p_search_query: searchQuery,
      p_embedding: queryEmbedding,
      p_limit: PAGE_SIZE,
      p_offset: currentOffset,
      p_sort_by: currentSort 
    });

    if (!error && data) {
      setProducts((prev) => (isReset ? data : [...prev, ...data]));
      const more = data.length === PAGE_SIZE;
      hasMoreRef.current = more;
      offsetRef.current = currentOffset + PAGE_SIZE;
    }

    loadingRef.current = false;
    setLoading(false);
    isFetchingRef.current = false;
  }, []);

  // Initial Load & Reset Feed when Query or Sort changes
  useEffect(() => {
    if (query.trim()) {
      offsetRef.current = 0;
      hasMoreRef.current = true;
      setProducts([]); 
      fetchSearchResults(0, query, sortBy, true);
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query, sortBy, fetchSearchResults]); 
  // Notice searchParams is NOT in the dependency array above to prevent infinite resets

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Read directly from refs to guarantee fresh data without triggering re-renders
        if (
          entries[0].isIntersecting && 
          hasMoreRef.current && 
          !loadingRef.current && 
          !isFetchingRef.current && 
          query.trim()
        ) {
          fetchSearchResults(offsetRef.current, query, sortBy);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);
    
    return () => { 
      if (currentTarget) observer.unobserve(currentTarget); 
    };
  }, [query, sortBy, fetchSearchResults]);

  if (!query.trim()) {
    return <div className="text-center py-16 text-gray-500 font-medium">Type something in the search bar to begin.</div>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      
      {/* Header Row: Contains Results Count and Filters */}
      <div className="flex justify-between items-center w-full">
        <h2 className="text-md font-medium text-gray-600 truncate">
          Search results for "{query}"
        </h2>
        <Filters currentSort={sortBy} onSortChange={setSortBy} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product, index) => (
          <ProductCard
            key={`${product.id}-${index}`}
            id={product.id}
            title={product.title}
            price={product.price}
            discount={product.discount > 0 ? `${product.discount}%` : null}
            image={Array.isArray(product.image_urls) && product.image_urls.length > 0 ? product.image_urls[0] : null}
          />
        ))}

        {loading && Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <ProductCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>

      {!loading && products.length === 0 && (
        <div className="text-center py-16 text-gray-600 font-general font-medium flex flex-col items-center gap-4">
            <HugeiconsIcon icon={AiSearch02Icon} size={25} />
            <p>No results found for "{query}"</p>
        </div>
      )}

      <div ref={observerTarget} className="h-4 w-full" />
    </div>
  );
}

// Export wrapped in Suspense to satisfy Next.js App Router requirements
export default function SearchProductFeed() {
  return (
    <Suspense fallback={
      <div className="w-full">
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <ProductCardSkeleton key={`fallback-${i}`} />
          ))}
         </div>
      </div>
    }>
      <SearchFeedContent />
    </Suspense>
  );
}