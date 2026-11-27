import type { ReactNode } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

interface PaginationProps {
    page: number;
    pages: number;
    onPage: (page: number) => void;
    /** "Showing 1–20 of 54" by default. */
    info?: ReactNode;
    limit?: number;
    total?: number;
    spaced?: boolean;
}

export default function Pagination({ page, pages, onPage, info, limit = 0, total = 0, spaced }: PaginationProps) {
    const lastPage = Math.max(1, pages);
    return (
        <div className="ad-pagination" style={spaced ? { marginTop: 20 } : undefined}>
            <span className="ad-page-info">
                {info ?? <>Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}</>}
            </span>
            <div className="ad-page-btns">
                <button className="ad-page-btn" onClick={() => onPage(Math.max(1, page - 1))} disabled={page <= 1}><AiOutlineLeft /> Prev</button>
                <span className="ad-page-cur">Page {page} / {pages}</span>
                <button className="ad-page-btn" onClick={() => onPage(Math.min(lastPage, page + 1))} disabled={page >= lastPage}>Next <AiOutlineRight /></button>
            </div>
        </div>
    );
}
