import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';

export async function GET(): Promise<Response> {
  try {
    const summaryPath = path.join(process.cwd(), 'history', 'summary.json');
    const raw = await readFile(summaryPath, 'utf8');
    const data = JSON.parse(raw);

    return Response.json(data, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to load status summary',
      },
      {
        status: 500,
      }
    );
  }
}
