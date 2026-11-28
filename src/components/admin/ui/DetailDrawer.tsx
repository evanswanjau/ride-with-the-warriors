import type { ReactNode } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

export interface DrawerField {
    label: string;
    val: string;
    mono?: boolean;
}

/** `children`: actions shown under the fields. */
export default function DetailDrawer({ title, fields, onClose, children }: { title: string; fields: DrawerField[]; onClose: () => void; children?: ReactNode }) {
    return (
        <>
            <div className="ad-drawer-overlay" onClick={onClose} />
            <aside className="ad-drawer">
                <div className="ad-drawer-head">
                    <span className="ad-drawer-title">{title}</span>
                    <button className="ad-drawer-close" onClick={onClose}><AiOutlineClose /></button>
                </div>
                <div className="ad-drawer-body">
                    {fields.map(f => (
                        <div key={f.label}>
                            <div className="ad-drawer-field-label">{f.label}</div>
                            <div className={`ad-drawer-field-val${f.mono ? ' ad-mono' : ''}`}>{f.val}</div>
                        </div>
                    ))}
                </div>
                {children && <div className="ad-drawer-actions">{children}</div>}
            </aside>
        </>
    );
}
