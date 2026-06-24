import { NextRequest } from 'next/server';
import { forwardMultipart, forwardJson } from '@/lib/api-proxy';

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return forwardMultipart(request, `/findings/${id}/attachments`);
}
