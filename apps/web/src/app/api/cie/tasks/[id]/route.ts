import { NextRequest } from 'next/server';
import { forwardJson } from '@/lib/api-proxy';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return forwardJson(request, `/cie/tasks/${id}`, 'PATCH');
}
