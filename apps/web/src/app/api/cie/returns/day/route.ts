import { NextRequest } from 'next/server';
import { forwardJson } from '@/lib/api-proxy';

export async function POST(request: NextRequest) {
  return forwardJson(request, '/cie/returns/day');
}
