import { NextRequest, NextResponse } from 'next/server';
import products from '@/../public/data/products.json';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const term = (searchParams.get('term') || '').toLowerCase();
  const max = parseFloat(searchParams.get('max') || '0');
  const brand = (searchParams.get('brand') || '').toLowerCase();

  let results = (products as any[]).filter(p => 
    (!term || p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)) &&
    (!brand || p.brand.toLowerCase().includes(brand))
  );

  if (!isNaN(max) && max > 0) {
    results = results.filter(p => p.price <= max);
  }

  return NextResponse.json({ results });
}
