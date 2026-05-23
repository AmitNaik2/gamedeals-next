import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const res = await fetch('https://www.gamerpower.com/api/giveaways?type=loot&sort-by=date');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json([], { status: 500 });
  }
}
