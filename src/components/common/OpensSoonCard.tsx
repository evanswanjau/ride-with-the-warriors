interface Props {
    title: string;
    text: string;
    emailSubject: string;
}

/** Friendly "not open yet" card shown above a disabled form. Not an error. */
const OpensSoonCard = ({ title, text, emailSubject }: Props) => (
    <div
        role="status"
        style={{
            border: '1px solid rgba(76,175,80,0.45)',
            background: 'rgba(76,175,80,0.08)',
            padding: '20px 22px',
            marginBottom: 24,
            textAlign: 'left',
        }}
    >
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            {title}
        </h2>
        <p style={{ margin: '0 0 16px', lineHeight: 1.55, opacity: 0.85 }}>{text}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a
                href={`mailto:info@airbornefraternity.org?subject=${emailSubject}`}
                style={{ padding: '10px 20px', background: 'var(--color-primary, #2d6a2d)', color: '#fff', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.85rem' }}
            >
                Email us
            </a>
            <a
                href="https://wa.me/254703752118"
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '10px 20px', border: '1px solid currentColor', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.85rem', color: 'inherit' }}
            >
                WhatsApp
            </a>
        </div>
    </div>
);

export default OpensSoonCard;
