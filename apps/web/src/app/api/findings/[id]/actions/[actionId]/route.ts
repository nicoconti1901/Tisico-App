import { NextRequest } from 'next/server';
import { forwardJson } from '@/lib/api-proxy';

type Params = { params: Promise<{ id: string; actionId: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id, actionId } = await params;
  return forwardJson(request, `/findings/${id}/actions/${actionId}`, 'PATCH');
}
