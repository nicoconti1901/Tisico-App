import { NextRequest } from 'next/server';
import { forwardJson } from '@/lib/api-proxy';

export async function GET(request: NextRequest) {
  return forwardJson(request, '/findings/assignable-users');
}
