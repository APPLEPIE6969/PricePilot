import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Mock product database based on ID patterns
  let product = {
    id,
    title: "Premium Wireless Noise Cancelling Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    price: 349.99,
    originalPrice: 349.99,
    score: 85,
    status: "BUY",
    analysis: "Price is significantly lower than the 30-day average.",
    currency: "USD",
  };

  if (id.includes("iphone")) {
    product = {
      ...product,
      title: "Apple iPhone 15 Pro Max (256GB) - Natural Titanium",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
      price: 1099.00,
      originalPrice: 1199.00,
      score: 92,
      status: "BUY",
      analysis: "Rare price drop detected. High likelihood of stockout.",
    };
  } else if (id.includes("macbook")) {
    product = {
      ...product,
      title: "Apple MacBook Pro 14\" M3 Pro Chip",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      price: 1999.00,
      originalPrice: 1999.00,
      score: 45,
      status: "WAIT",
      analysis: "Price is stable. Seasonal sales expected in 2 weeks.",
    };
  } else if (id.includes("sony")) {
    product = {
      ...product,
      title: "Sony Alpha 7 IV Full-frame Mirrorless Camera",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
      price: 2698.00,
      originalPrice: 2498.00,
      score: 20,
      status: "HIGH",
      analysis: "Price is 8% above average. Do not buy.",
    };
  }

  return NextResponse.json(product);
}
