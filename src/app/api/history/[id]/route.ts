import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const currentPrice = parseFloat(searchParams.get("current") || "0");
  const days = 30;

  // Base price for history generation
  let basePrice = currentPrice > 0 ? currentPrice : 100 + Math.random() * 500;

  const history = [];
  let price = basePrice * (1 + (Math.random() * 0.2 - 0.1)); // Start slightly off

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Random walk
    const change = (Math.random() - 0.5) * (basePrice * 0.05);
    price += change;

    // Ensure price stays positive
    if (price < 0) price = 10;

    // Force the last point to match currentPrice if provided
    if (i === 0 && currentPrice > 0) {
      price = currentPrice;
    }

    history.push({
      date: date.toISOString().split("T")[0],
      price: parseFloat(price.toFixed(2)),
    });
  }

  return NextResponse.json(history);
}
