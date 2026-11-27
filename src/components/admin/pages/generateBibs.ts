import type { BibJobProgress } from '../../../adminTypes';
import { adminApi } from '../api/adminApi';
import type { Query } from '../api/http';

/**
 * Builds the bib PDF on the server: start a job, follow its progress
 * (server-sent events), then download the file.
 */
export async function generateBibsPdf(filters: Query, onProgress: (p: BibJobProgress) => void): Promise<Blob> {
    const { jobId, total } = await adminApi.bibs.start(filters);
    onProgress({ pct: 0, processed: 0, total });

    const res = await adminApi.bibs.progress(jobId);
    const reader = res.body?.getReader();
    if (!reader) throw new Error('Progress stream unavailable');
    const decoder = new TextDecoder();
    let buffer = '';
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        let finished = false;
        for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            let event: { type?: string; pct?: number; processed?: number; total?: number; message?: string };
            try {
                event = JSON.parse(line.slice(6));
            } catch {
                continue; // keep-alive or partial line
            }
            if (event.type === 'progress') onProgress({ pct: event.pct ?? 0, processed: event.processed ?? 0, total: event.total ?? total });
            else if (event.type === 'done') { onProgress({ pct: 100, processed: total, total }); finished = true; }
            else if (event.type === 'error') throw new Error(event.message || 'Generation failed');
        }
        if (finished) {
            await reader.cancel();
            break;
        }
    }
    return adminApi.bibs.download(jobId);
}

/** e.g. RWTW_Bibs_Under_18_Paid_2027-02-10.pdf */
export function bibsFileName(status: string, category: string): string {
    const statusLabel = status === 'PAID' ? 'Paid' : status === 'UNPAID' ? 'Unpaid' : 'All';
    const catSlug = category ? `_${category.replace(/[^a-zA-Z0-9]+/g, '_')}` : '';
    return `RWTW_Bibs${catSlug}_${statusLabel}_${new Date().toISOString().split('T')[0]}.pdf`;
}
