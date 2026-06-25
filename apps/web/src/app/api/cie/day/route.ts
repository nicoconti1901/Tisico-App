import { NextRequest } from 'next/server';
import { forwardJson } from '@/lib/api-proxy';

export async function GET(request: NextRequest) {
  const group = request.nextUrl.searchParams.get('group');
  const date = request.nextUrl.searchParams.get('date');
  return forwardJson(request, `/cie/day?group=${group}&date=${date}`);
}
