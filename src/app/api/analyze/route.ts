import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { url } = await request.json();

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Determine product based on URL keywords (mock logic)
  let product = {
    id: "prod_" + Math.random().toString(36).substr(2, 9),
    title: "Premium Wireless Noise Cancelling Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    basePrice: 349.99,
  };

  if (url.toLowerCase().includes("iphone")) {
    product = {
      id: "iphone_15_pro",
      title: "Apple iPhone 15 Pro Max (256GB) - Natural Titanium",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
      basePrice: 1199.00,
    };
  } else if (url.toLowerCase().includes("macbook")) {
    product = {
      id: "macbook_pro_14",
      title: "Apple MacBook Pro 14\" M3 Pro Chip",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      basePrice: 1999.00,
    };
  } else if (url.toLowerCase().includes("camera")) {
    product = {
      id: "sony_a7iv",
      title: "Sony Alpha 7 IV Full-frame Mirrorless Camera",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
      basePrice: 2498.00,
    };
  }

  // Randomize current price and score to simulate real-time analysis
  const discountFactor = Math.random() * 0.3; // 0% to 30% discount simulation
  const isGoodDeal = Math.random() > 0.4;

  let currentPrice, score, status, analysis;

  if (isGoodDeal) {
    currentPrice = product.basePrice * (1 - discountFactor);
    score = 85 + Math.floor(Math.random() * 15); // 85-99
    status = "BUY";
    analysis = "Price is significantly lower than the 30-day average. High stock levels detected at competing retailers forcing price drops.";
  } else {
    currentPrice = product.basePrice * (1 + (Math.random() * 0.1)); // 0% to 10% markup
    score = 30 + Math.floor(Math.random() * 40); // 30-69
    status = score < 50 ? "HIGH" : "WAIT";
    analysis = "Price is currently inflated due to high demand. Historical data suggests a drop within the next 14 days.";
  }

  return NextResponse.json({
    id: product.id,
    title: product.title,
    price: currentPrice,
    originalPrice: product.basePrice,
    currency: "USD",
    image: product.image,
    score,
    status,
    analysis,
    scrapedAt: new Date().toISOString(),
  });
}
