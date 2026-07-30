'use client';

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import ProductCard from '@/components/UI/ProductCard';
import ProductCardSkeleton from '@/components/UI/ProductCardSkeleton';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PAGE_SIZE = 10;

// Rename your original component so we can wrap it
function FeedContent() {
  const searchParams = useSearchParams();
  const tag = searchParams.get('tag') || null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // Use refs for values needed inside the observer callback
  // to avoid recreating the observer on every state change
  const isFetchingRef = useRef(false);
  const offsetRef = useRef(0);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(true);
  const tagRef = useRef(tag);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchProducts = useCallback(async (currentOffset: number, currentTag: string | null, isReset: boolean = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    loadingRef.current = true;
    setLoading(true);

    const { data, error } = await supabase.rpc('get_main_feed', {
      p_limit: PAGE_SIZE,
      p_offset: currentOffset,
      p_tag: currentTag,
    });

    if (!error && data) {
      setProducts((prev) => (isReset ? data : [...prev, ...data]));
      const more = data.length === PAGE_SIZE;
      hasMoreRef.current = more;
      setHasMore(more);
      offsetRef.current = currentOffset + PAGE_SIZE;
    }

    loadingRef.current = false;
    setLoading(false);
    isFetchingRef.current = false;
  }, []);

  // Reset feed when tag changes
  useEffect(() => {
    tagRef.current = tag;
    offsetRef.current = 0;
    hasMoreRef.current = true;
    setProducts([]);
    setHasMore(true);
    fetchProducts(0, tag, true);
  }, [tag, fetchProducts]);

  // Infinite Scroll Observer — created only once, reads state via refs
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreRef.current &&
          !loadingRef.current &&
          !isFetchingRef.current
        ) {
          fetchProducts(offsetRef.current, tagRef.current);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    const currentTarget = observerTarget.current;
    
    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [fetchProducts]); 

  return (
    <div className="w-full">
      {tag && (
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">
            Showing category: <span className="text-blue-600">"{tag}"</span>
          </h1>
        </div>
      )}

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
        <div className="text-center py-16 text-gray-500 font-medium">No products found {tag ? `in "${tag}"` : ''}.</div>
      )}

      <div ref={observerTarget} className="h-4 w-full" />
    </div>
  );
}

export default function MainProductFeed() {
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
      <FeedContent />
    </Suspense>
  );
}