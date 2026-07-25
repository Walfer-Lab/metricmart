'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
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

export default function SearchProductFeed() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // NEW: State to track the active filter
  const [sortBy, setSortBy] = useState('relevance');

  const cachedEmbeddingRef = useRef<number[] | null>(null);
  const isFetchingRef = useRef(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchSearchResults = useCallback(async (
    currentOffset: number, 
    searchQuery: string, 
    currentSort: string,
    isReset: boolean = false,
    signal?: AbortSignal
  ) => {
    if (isFetchingRef.current || !searchQuery.trim()) return;
    isFetchingRef.current = true;
    setLoading(true);

    let queryEmbedding = cachedEmbeddingRef.current;

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

    if (signal?.aborted) {
      isFetchingRef.current = false;
      return;
    }

    // UPDATED: Pass the new p_sort_by parameter to the database
    const { data, error } = await supabase.rpc('get_ai_search_results', {
      p_search_query: searchQuery,
      p_embedding: queryEmbedding,
      p_limit: PAGE_SIZE,
      p_offset: currentOffset,
      p_sort_by: currentSort 
    });

    if (signal?.aborted) {
      isFetchingRef.current = false;
      return;
    }

    if (!error && data) {
      setProducts((prev) => (isReset ? data : [...prev, ...data]));
      setHasMore(data.length === PAGE_SIZE);
      setOffset(currentOffset + PAGE_SIZE);
    }

    setLoading(false);
    isFetchingRef.current = false;
  }, []);

  // UPDATED: Reset feed whenever the `query` OR the `sortBy` changes
  useEffect(() => {
    const abortController = new AbortController();
    
    setProducts([]);
    setOffset(0);
    setHasMore(true);
    
    // Only clear cached AI vector if the actual query word changed (saves API calls!)
    if (cachedEmbeddingRef.current && query !== searchParams.get('q')) {
      cachedEmbeddingRef.current = null;
    }

    if (query.trim()) {
      fetchSearchResults(0, query, sortBy, true, abortController.signal);
    } else {
      setLoading(false);
    }

    return () => abortController.abort();
  }, [query, sortBy, fetchSearchResults, searchParams]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !isFetchingRef.current && query.trim()) {
          fetchSearchResults(offset, query, sortBy);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => { if (observerTarget.current) observer.unobserve(observerTarget.current); };
  }, [offset, query, hasMore, loading, sortBy, fetchSearchResults]);

  if (!query.trim()) {
    return <div className="text-center py-16 text-gray-500 font-medium">Type something in the search bar to begin.</div>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      
      {/* Header Row: Contains Results Count and Filters */}
      <div className="flex justify-between items-center w-full">
        <h2 className="text-lg font-semibold text-gray-800">
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