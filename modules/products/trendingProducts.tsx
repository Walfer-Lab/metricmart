import { createClient } from '@supabase/supabase-js';
import ProductCard from '@/components/UI/ProductCard';
import { HugeiconsIcon } from '@hugeicons/react';
import { Fire02Icon } from '@hugeicons/core-free-icons';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        next: { revalidate: 3600 },
      });
    },
  },
});

export default async function TrendingProducts() {
  const { data: trendingProducts, error } = await supabase
    .rpc('get_trending_products');

  if (error) {
    console.error('Error fetching trending products:', error);
    return null;
  }

  if (!trendingProducts || trendingProducts.length === 0) {
    return null; 
  }

  return (  
    <section>
      <p className="flex flex-row items-center gap-1 text-lg text-zinc-800 font-general font-bold mb-4">
        <HugeiconsIcon icon={Fire02Icon} size={20} strokeWidth={2} />
        Trending Products
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full">
        {trendingProducts.map((product:any) => {
          const firstImage = Array.isArray(product.image_urls) && product.image_urls.length > 0 
            ? product.image_urls[0] 
            : null;

          return (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              discount={product.discount > 0 ? `${product.discount}%` : null}
              image={firstImage}
            />
          );
        })}
      </div>
    </section>
  );
}