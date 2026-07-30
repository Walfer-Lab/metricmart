import ImageCarousel from "@/components/Products/ImageCarousel";
import ProductDetails from "@/components/Products/ProductsDetails";
import { createClient } from "@/utils/SupabaseServer";
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('title, description, image_urls')
    .eq('id', id)
    .single();

  if (!product) {
    return {
      title: 'Product Not Found | Metricmart',
      description: 'The requested product could not be found.',
    };
  }

  const title = `${product.title} | Metricmart`;
  const description =
    product.description ||
    `Get ${product.title} now at a discount on Metricmart.`;
  const image =
    Array.isArray(product.image_urls) && product.image_urls.length > 0
      ? product.image_urls[0]
      : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_IN',
      ...(image && {
        images: [{ url: image, width: 1200, height: 630, alt: product.title }],
      }),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();

  // 2. Fetch using your exact new table schema
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      description,
      category,
      price,
      asset_url,
      image_urls,
      properties,
      discount,
      views,
      is_live,
      created_at,
      sellers ( id )
    `)
    .eq('id', id)
    .single();

  if (error || !product || !product.is_live) {
    notFound();
  }

  const hasDiscount = product.discount && product.discount > 0;
  const finalPrice = hasDiscount 
    ? Number(product.price) * (1 - product.discount / 100) 
    : Number(product.price);

  return (
        <main className="flex flex-col items-center p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 max-w-4xl w-full justify-center">
                <ImageCarousel images={product.image_urls || []} />
                <ProductDetails
                    title={product.title}
                    description={product.description}
                    price={product.price ? `₹${product.price}` : undefined}
                    discount={product.discount && Number(product.discount) > 0 ? product.discount : undefined}
                    properties={product.properties || []}
                    productId={product.id}
                />
            </div>
        </main>
    );
};