import { NextRequest } from 'next/server';
import { forwardJson } from '@/lib/api-proxy';

type Params = { params: Promise<{ id: string; attachmentId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { id, attachmentId } = await params;
  return forwardJson(request, `/findings/${id}/attachments/${attachmentId}/url`);
}
