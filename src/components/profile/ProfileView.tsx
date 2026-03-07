import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import {
    AiOutlineArrowLeft,
    AiOutlineCheck,
    AiOutlineShareAlt,
    AiOutlineCheckCircle,
    AiOutlineHourglass,
    AiOutlineCreditCard,
    AiOutlineTeam,
    AiOutlineDown,
    AiOutlineStar,
    AiOutlineUser,
    AiOutlineDownload
} from 'react-icons/ai';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { CIRCUITS } from '../../constants';
import logo from '../../assets/images/logo.png';
import { calculateAge, getCategoryColor, getContrastText } from '../../utils';

interface ProfileViewProps {
    registration: any;
    onBack: () => void;
}

const ProfileView = ({ registration, onBack }: ProfileViewProps) => {
    const navigate = useNavigate();
    const [showAllMembers, setShowAllMembers] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const circuit = CIRCUITS.find(c => c.id === registration.circuitId) || CIRCUITS[0];
    const pricing = registration.pricing;
    const payload = registration.payload;
    const categoryColor = getCategoryColor(registration.id);
    const contrastText = getContrastText(categoryColor);

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const formatPaymentTimestamp = (raw: any) => {
        if (!raw) return '';
        const d = raw.toString();
        if (d.length === 14) {
            const dt = new Date(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T${d.slice(8, 10)}:${d.slice(10, 12)}:${d.slice(12, 14)}`);
            const ord = (n: number) => { const s = ['th', 'st', 'nd', 'rd'] as const; const v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
            return `${ord(dt.getDate())} ${dt.toLocaleDateString('en-GB', { month: 'short' })} ${dt.getFullYear()}, ${dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
        }
        return d;
    };

    const handleDownloadPDF = async () => {
        const ticketElement = document.getElementById('ticket-container');
        if (!ticketElement) return;
        try {
            const dataUrl = await toPng(ticketElement, { cacheBust: true, pixelRatio: 2, backgroundColor: '#ffffff' });
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 10;
            const imgWidth = pageWidth - (margin * 2);
            const img = new Image();
            img.src = dataUrl;
            await new Promise(resolve => { img.onload = resolve; });
            const imgHeight = (img.height * imgWidth) / img.width;
            pdf.addImage(dataUrl, 'PNG', margin, margin, imgWidth, imgHeight);
            pdf.save(`RideWithWarriors_Ticket_${registration.id}_${registration.firstName}_${registration.lastName}.pdf`);
        } catch (error) { console.error('Error generating PDF:', error); }
    };

    const handleShare = async () => {
        const shareData = { title: 'Ride with the Warriors Registration', text: `View my registration for ${circuit.title} - ${registration.id}`, url: window.location.href };
        try {
            if (navigator.share) { await navigator.share(shareData); }
            else { await navigator.clipboard.writeText(window.location.href); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); }
        } catch (err) { console.error('Error sharing:', err); }
    };

    const getParticipantInfo = () => {
        let payloadObj = registration.payload;
        if (typeof payloadObj === 'string') { try { payloadObj = JSON.parse(payloadObj); } catch { payloadObj = null; } }
        const riderDetails = payloadObj?.riderDetails || payloadObj;
        const teamDetails = payloadObj?.teamDetails;
        const familyDetails = payloadObj?.familyDetails;
        let specificMember = null;
        if (registration.type === 'team' && teamDetails?.members) {
            specificMember = teamDetails.members.find((m: any) => m.idNumber === registration.idNumber || (m.firstName === registration.firstName && m.lastName === registration.lastName));
        } else if (registration.type === 'family' && familyDetails?.riders) {
            for (const cat of ['cubs', 'champs', 'tigers']) {
                const found = familyDetails.riders[cat]?.find((r: any) => r.firstName === registration.firstName && r.lastName === registration.lastName);
                if (found) { specificMember = found; break; }
            }
        }
        const info = {
            name: `${registration.firstName} ${registration.lastName}`,
            email: registration.email || riderDetails?.email || specificMember?.email || 'N/A',
            phone: registration.phoneNumber || riderDetails?.phoneNumber || specificMember?.phoneNumber || 'N/A',
            emergencyContact: registration.emergencyContactName || riderDetails?.emergencyContactName || specificMember?.emergencyContactName || familyDetails?.guardian?.emergencyContactName || 'N/A',
            emergencyPhone: registration.emergencyPhone || riderDetails?.emergencyPhone || specificMember?.emergencyPhone || familyDetails?.guardian?.emergencyPhone || 'N/A',
            tshirtSize: registration.tshirtSize || riderDetails?.tshirtSize || specificMember?.tshirtSize || 'N/A',
            subtitle: '',
            details: [] as any[]
        };
        if (registration.type === 'individual') {
            info.details = [
                { label: 'ID/Passport', value: registration.idNumber || riderDetails?.idNumber },
                { label: 'DOB / Age', value: `${registration.dob || riderDetails?.dob} (${calculateAge(registration.dob || riderDetails?.dob) || 'N/A'})` },
                { label: 'Gender', value: registration.gender || riderDetails?.gender }
            ];
        } else if (registration.type === 'team') {
            info.subtitle = registration.teamName || teamDetails?.teamName || 'Team Member';
            info.details = [
                { label: 'Role', value: registration.isCaptain ? 'Captain' : 'Rider' },
                { label: 'ID/Passport', value: registration.idNumber || specificMember?.idNumber },
                { label: 'DOB / Age', value: `${registration.dob || specificMember?.dob} (${calculateAge(registration.dob || specificMember?.dob) || 'N/A'})` },
                { label: 'Gender', value: registration.gender || specificMember?.gender }
            ];
        } else if (registration.type === 'family') {
            info.subtitle = registration.guardianName ? `${registration.guardianName}'s Family` : 'Family Group';
            info.details = [
                { label: 'Guardian', value: registration.guardianName || familyDetails?.guardian?.fullName },
                { label: 'Category', value: registration.category },
                { label: 'DOB / Age', value: `${registration.dob || specificMember?.dob} (${calculateAge(registration.dob || specificMember?.dob) || 'N/A'})` },
                { label: 'Gender', value: registration.gender || specificMember?.gender }
            ];
        }
        return info;
    };

    const info = getParticipantInfo();
    const isPaid = registration.status === 'PAID' || registration.status === 'CONFIRMED';

    return (
        <div className="selection:bg-primary selection:text-white font-sans print:p-0 print:bg-white">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

                :root, [data-theme="dark"] {
                    --color-primary: #2d6a2d;
                    --color-primary-dark: #1e4d1e;
                    --color-primary-light: #4caf50;
                    --pv-bg:          #0a0a0a;
                    --pv-card:        #141414;
                    --pv-card-alt:    #0e0e0e;
                    --pv-border:      rgba(255,255,255,0.07);
                    --pv-border-2:    rgba(255,255,255,0.13);
                    --pv-text-1:      #ffffff;
                    --pv-text-2:      rgba(255,255,255,0.58);
                    --pv-text-3:      rgba(255,255,255,0.32);
                    --pv-divider:     rgba(255,255,255,0.05);
                    --pv-raised:      #111111;
                    --pv-input-bg:    #0a0a0a;
                    /* status */
                    --pv-paid-bg:     rgba(45,106,45,0.08);
                    --pv-paid-bd:     rgba(45,106,45,0.22);
                    --pv-paid-text:   #4caf50;
                    --pv-pending-bg:  rgba(245,158,11,0.08);
                    --pv-pending-bd:  rgba(245,158,11,0.22);
                    --pv-pending-text:#f59e0b;
                    --pv-fail-bg:     rgba(220,38,38,0.08);
                    --pv-fail-bd:     rgba(220,38,38,0.22);
                    --pv-fail-text:   #ef4444;
                    /* ticket (always light for PDF) */
                    --tk-bg:          #ffffff;
                    --tk-alt:         #f8f8f8;
                    --tk-border:      #e5e5e5;
                    --tk-text-1:      #111111;
                    --tk-text-2:      #555555;
                    --tk-text-3:      #999999;
                    --tk-divider:     #eeeeee;
                }
                [data-theme="light"] {
                    --color-primary: #245924;
                    --color-primary-dark: #1a421a;
                    --color-primary-light: #2d6a2d;
                    --pv-bg:          #f5f2eb;
                    --pv-card:        #ffffff;
                    --pv-card-alt:    #f9f7f3;
                    --pv-border:      rgba(0,0,0,0.09);
                    --pv-border-2:    rgba(0,0,0,0.15);
                    --pv-text-1:      #111111;
                    --pv-text-2:      rgba(20,20,20,0.60);
                    --pv-text-3:      rgba(20,20,20,0.38);
                    --pv-divider:     rgba(0,0,0,0.05);
                    --pv-raised:      #edeae2;
                    --pv-input-bg:    #f9f7f3;
                    --pv-paid-bg:     rgba(36,89,36,0.07);
                    --pv-paid-bd:     rgba(36,89,36,0.18);
                    --pv-paid-text:   #245924;
                    --pv-pending-bg:  rgba(180,120,0,0.07);
                    --pv-pending-bd:  rgba(180,120,0,0.18);
                    --pv-pending-text:#92400e;
                    --pv-fail-bg:     rgba(185,28,28,0.06);
                    --pv-fail-bd:     rgba(185,28,28,0.18);
                    --pv-fail-text:   #b91c1c;
                }

                .pv-page {
                    font-family: 'Barlow', sans-serif;
                    background: var(--pv-bg);
                    color: var(--pv-text-1);
                    min-height: 100vh;
                    transition: background 0.3s, color 0.3s;
                }
                .pv-inner { max-width: 1200px; margin: 0 auto; padding: 32px 24px 80px; }

                /* ── Shared label system ── */
                .pv-label-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
                .pv-label-line { height: 1px; width: 32px; background: var(--color-primary); flex-shrink: 0; }
                .pv-eyebrow {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.62rem; font-weight: 700;
                    letter-spacing: 0.26em; text-transform: uppercase;
                    color: var(--color-primary-light);
                }
                .pv-micro {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.62rem; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase;
                    color: var(--pv-text-3);
                }

                /* ── Topbar ── */
                .pv-topbar {
                    display: flex; flex-direction: column; gap: 16px;
                    margin-bottom: 28px;
                }
                @media (min-width: 640px) {
                    .pv-topbar { flex-direction: row; align-items: center; justify-content: space-between; }
                }

                .pv-back-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: none; border: none; cursor: pointer;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.75rem; font-weight: 700;
                    letter-spacing: 0.16em; text-transform: uppercase;
                    color: var(--pv-text-3);
                    transition: color 0.2s;
                    padding: 0;
                }
                .pv-back-btn:hover { color: var(--color-primary-light); }
                .pv-back-btn svg { transition: transform 0.2s; }
                .pv-back-btn:hover svg { transform: translateX(-3px); }

                .pv-topbar-actions { display: flex; align-items: center; gap: 10px; }

                /* ghost action button */
                .pv-action-btn {
                    position: relative; overflow: hidden;
                    display: inline-flex; align-items: center; gap: 7px;
                    padding: 10px 18px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.72rem; font-weight: 800;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    border: none; cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
                }
                .pv-action-btn::before {
                    content: ''; position: absolute; top: 0; left: -80%;
                    width: 60%; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 50%, transparent 80%);
                    transform: skewX(-20deg); pointer-events: none;
                }
                .pv-action-btn:hover::before { left: 140%; transition: left 0.5s cubic-bezier(0.25,0.46,0.45,0.94); }
                .pv-action-btn:hover { transform: translateY(-2px); }
                .pv-action-btn.ghost {
                    background: var(--pv-card);
                    border: 1px solid var(--pv-border-2);
                    color: var(--pv-text-2);
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
                }
                .pv-action-btn.ghost:hover { border-color: var(--color-primary); color: var(--color-primary-light); }
                .pv-action-btn.primary {
                    background: var(--color-primary); color: #fff;
                }
                .pv-action-btn.primary:hover { box-shadow: 0 8px 24px rgba(45,106,45,0.35); background: var(--color-primary-dark); }

                /* ── TICKET CARD (always light for PDF readability) ── */
                #ticket-container {
                    background: var(--tk-bg);
                    border: 1px solid var(--tk-border);
                    overflow: hidden;
                    display: flex; flex-direction: column;
                    position: relative;
                    margin-bottom: 16px;
                }
                @media (min-width: 768px) {
                    #ticket-container { flex-direction: row; }
                }
                /* chamfer only on the outer corners */
                #ticket-container { clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%); }

                /* Main left area */
                .tk-main {
                    flex: 3;
                    padding: 36px 40px;
                    display: flex; flex-direction: column; justify-content: space-between;
                    border-bottom: 1px solid var(--tk-border);
                }
                @media (min-width: 768px) {
                    .tk-main { border-bottom: none; border-right: 1px solid var(--tk-border); }
                }
                @media (max-width: 640px) { .tk-main { padding: 24px 22px; } }

                .tk-top-row {
                    display: flex; flex-direction: column; gap: 16px;
                    margin-bottom: 28px;
                }
                @media (min-width: 640px) {
                    .tk-top-row { flex-direction: row; align-items: flex-start; justify-content: space-between; }
                }

                .tk-logo-group { display: flex; align-items: center; gap: 12px; }
                .tk-logo-box {
                    width: 40px; height: 40px; flex-shrink: 0; overflow: hidden;
                    display: flex; align-items: center; justify-content: center;
                    background: var(--tk-alt);
                    border: 1px solid var(--tk-border);
                    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
                }
                .tk-logo-box img { width: 28px; height: 28px; object-fit: contain; }
                .tk-logo-title {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 1rem; font-weight: 900;
                    letter-spacing: 0.08em; text-transform: uppercase;
                    color: var(--tk-text-1); line-height: 1.1;
                }
                .tk-logo-sub {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.58rem; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase;
                    color: var(--tk-text-3); margin-top: 3px;
                }

                .tk-pass-id-block { text-align: right; }
                .tk-pass-id-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.58rem; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase;
                    color: var(--tk-text-3); margin-bottom: 4px;
                }
                .tk-pass-id {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 700;
                    color: var(--tk-text-1); line-height: 1;
                }

                .tk-name-block { margin-bottom: 20px; }
                .tk-name-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.58rem; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase;
                    color: var(--tk-text-3); margin-bottom: 6px;
                }
                .tk-name {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(2.4rem, 6vw, 3.8rem);
                    letter-spacing: 0.03em; line-height: 0.9;
                    color: var(--tk-text-1); text-transform: uppercase;
                }
                .tk-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
                .tk-badge {
                    padding: 4px 12px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.6rem; font-weight: 800;
                    letter-spacing: 0.18em; text-transform: uppercase;
                    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
                }
                .tk-badge-neutral {
                    background: var(--tk-alt);
                    border: 1px solid var(--tk-border);
                    color: var(--tk-text-2);
                }

                /* event meta strip */
                .tk-meta-strip {
                    padding-top: 20px;
                    border-top: 1px solid var(--tk-border);
                    display: flex; flex-wrap: wrap; gap: 0;
                }
                .tk-meta-cell {
                    flex: 1; min-width: 110px;
                    padding: 12px 0;
                    border-right: 1px solid var(--tk-border);
                    padding-right: 20px;
                }
                .tk-meta-cell:last-child { border-right: none; }
                .tk-meta-cell:not(:first-child) { padding-left: 20px; }
                .tk-meta-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.58rem; font-weight: 700;
                    letter-spacing: 0.2em; text-transform: uppercase;
                    color: var(--tk-text-3); margin-bottom: 5px;
                }
                .tk-meta-value {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.85rem; font-weight: 800;
                    letter-spacing: 0.06em; text-transform: uppercase;
                    color: var(--tk-text-1);
                }

                /* QR sidebar */
                .tk-sidebar {
                    width: 100%;
                    padding: 28px 32px;
                    background: var(--tk-alt);
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: space-between; gap: 20px;
                }
                @media (min-width: 768px) { .tk-sidebar { width: 260px; flex-shrink: 0; } }

                .tk-status {
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    padding: 9px 20px; width: 100%;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.72rem; font-weight: 800;
                    letter-spacing: 0.18em; text-transform: uppercase;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
                }
                .tk-status.paid { background: rgba(45,106,45,0.1); border: 1px solid rgba(45,106,45,0.25); color: #1e4d1e; }
                .tk-status.pending { background: rgba(180,120,0,0.08); border: 1px solid rgba(180,120,0,0.22); color: #92400e; }

                .tk-qr-box {
                    padding: 12px; background: #fff;
                    border: 1px solid var(--tk-border);
                    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
                }

                /* accent bottom bar */
                .tk-accent-bar {
                    position: absolute; bottom: 0; left: 0; width: 100%; height: 3px;
                }

                /* ── Details card ── */
                .pv-details-card {
                    background: var(--pv-card);
                    border: 1px solid var(--pv-border);
                    padding: 44px 40px;
                    clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%);
                    margin-bottom: 16px;
                }
                @media (max-width: 640px) { .pv-details-card { padding: 28px 22px; } }

                .pv-details-grid {
                    display: grid; grid-template-columns: 1fr;
                    gap: 44px;
                }
                @media (min-width: 768px) {
                    .pv-details-grid { grid-template-columns: 1fr 1fr; }
                }

                .pv-section-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.6rem; letter-spacing: 0.03em;
                    color: var(--pv-text-1); margin-bottom: 24px;
                }
                .pv-col-divider {
                    display: none;
                }
                @media (min-width: 768px) {
                    .pv-col-divider {
                        display: block;
                        position: absolute; top: 0; left: 0; bottom: 0;
                        width: 1px; background: var(--pv-border);
                    }
                }

                .pv-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
                .pv-field { }
                .pv-field-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.62rem; font-weight: 700;
                    letter-spacing: 0.2em; text-transform: uppercase;
                    color: var(--pv-text-3); margin-bottom: 5px;
                }
                .pv-field-value { font-size: 0.9rem; font-weight: 600; color: var(--pv-text-1); word-break: break-all; }
                .pv-field-value.accent { color: var(--color-primary-light); }
                .pv-field-value.mono { font-family: 'JetBrains Mono', monospace; }
                .pv-field-value.large { font-size: 1.1rem; font-weight: 800; color: var(--color-primary-light); }
                .pv-rule { border: none; border-top: 1px solid var(--pv-divider); margin: 24px 0; }

                /* line items */
                .pv-line-item {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 12px 0;
                    border-bottom: 1px solid var(--pv-divider);
                    font-size: 0.88rem; color: var(--pv-text-2);
                }
                .pv-line-item:last-child { border-bottom: none; }
                .pv-line-item span:last-child { font-weight: 700; color: var(--pv-text-1); }
                .pv-total-row {
                    display: flex; align-items: center; justify-content: space-between;
                    padding-top: 16px; margin-top: 4px;
                    border-top: 1px solid var(--pv-border-2);
                }
                .pv-total-label {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.3rem; letter-spacing: 0.03em; color: var(--pv-text-1);
                }
                .pv-total-value {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.8rem; letter-spacing: 0.02em; color: var(--color-primary-light);
                }

                /* payment card */
                .pv-payment-card {
                    margin-top: 20px;
                    padding: 20px 22px;
                    border: 1px solid var(--pv-border);
                    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
                }
                .pv-payment-card.paid { background: var(--pv-paid-bg); border-color: var(--pv-paid-bd); }
                .pv-payment-card.pending { background: var(--pv-pending-bg); border-color: var(--pv-pending-bd); }
                .pv-payment-card.failed { background: var(--pv-fail-bg); border-color: var(--pv-fail-bd); }

                .pv-payment-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
                .pv-payment-icon {
                    width: 32px; height: 32px; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.9rem; color: #fff;
                    clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%);
                }
                .pv-payment-icon.paid { background: var(--color-primary); }
                .pv-payment-icon.pending { background: #d97706; }
                .pv-payment-icon.failed { background: #dc2626; }
                .pv-payment-status-label {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.68rem; font-weight: 800;
                    letter-spacing: 0.2em; text-transform: uppercase;
                }
                .pv-payment-status-label.paid { color: var(--pv-paid-text); }
                .pv-payment-status-label.pending { color: var(--pv-pending-text); }
                .pv-payment-status-label.failed { color: var(--pv-fail-text); }

                .pv-pay-btn {
                    position: relative; overflow: hidden;
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    width: 100%; padding: 13px;
                    background: var(--color-primary); color: #fff;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 0.78rem; font-weight: 800;
                    letter-spacing: 0.16em; text-transform: uppercase;
                    border: none; cursor: pointer; margin-top: 16px;
                    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
                    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
                }
                .pv-pay-btn::before {
                    content: ''; position: absolute; top: 0; left: -80%;
                    width: 60%; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.42) 50%, transparent 80%);
                    transform: skewX(-20deg); pointer-events: none;
                }
                .pv-pay-btn:hover::before { left: 140%; transition: left 0.5s cubic-bezier(0.25,0.46,0.45,0.94); }
                .pv-pay-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(45,106,45,0.35); background: var(--color-primary-dark); }

                .pv-no-payment {
                    margin-top: 20px; padding: 20px;
                    background: var(--pv-raised);
                    border: 1px solid var(--pv-border);
                    display: flex; flex-direction: column; align-items: center; gap: 14px;
                    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
                }

                /* ── Team roster ── */
                .pv-roster-card {
                    background: var(--pv-card);
                    border: 1px solid var(--pv-border);
                    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);
                    overflow: hidden;
                    margin-bottom: 16px;
                }
                .pv-roster-toggle {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 28px 32px;
                    background: none; border: none; cursor: pointer; width: 100%;
                    transition: background 0.2s;
                }
                .pv-roster-toggle:hover { background: var(--pv-raised); }
                .pv-roster-toggle-left { display: flex; align-items: center; gap: 20px; }
                .pv-roster-icon {
                    width: 52px; height: 52px; flex-shrink: 0;
                    background: rgba(45,106,45,0.1);
                    border: 1px solid rgba(45,106,45,0.2);
                    display: flex; align-items: center; justify-content: center;
                    color: var(--color-primary-light); font-size: 1.4rem;
                    transition: background 0.2s;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
                }
                .pv-roster-toggle:hover .pv-roster-icon { background: rgba(45,106,45,0.18); }
                .pv-roster-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.5rem; letter-spacing: 0.03em;
                    color: var(--pv-text-1); line-height: 1;
                }
                .pv-roster-sub { font-size: 0.78rem; color: var(--pv-text-3); margin-top: 2px; font-weight: 600; }
                .pv-roster-chevron {
                    width: 40px; height: 40px; flex-shrink: 0;
                    border: 1px solid var(--pv-border);
                    display: flex; align-items: center; justify-content: center;
                    color: var(--pv-text-3);
                    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
                }

                .pv-roster-grid {
                    display: grid; grid-template-columns: 1fr;
                    gap: 2px; padding: 2px;
                    border-top: 1px solid var(--pv-border);
                }
                @media (min-width: 640px) { .pv-roster-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (min-width: 1024px) { .pv-roster-grid { grid-template-columns: repeat(3, 1fr); } }

                .pv-member-card {
                    background: var(--pv-card-alt);
                    padding: 22px 24px;
                    transition: background 0.2s, border-color 0.2s;
                    border: 1px solid transparent;
                }
                .pv-member-card:hover { background: var(--pv-card); border-color: var(--color-primary); }

                .pv-member-top { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
                .pv-member-avatar {
                    width: 44px; height: 44px; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.1rem;
                    clip-path: polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 0 100%);
                }
                .pv-member-avatar.captain { background: var(--color-primary); color: #fff; }
                .pv-member-avatar.regular { background: var(--pv-raised); border: 1px solid var(--pv-border); color: var(--pv-text-3); }

                .pv-member-name { font-size: 0.9rem; font-weight: 800; color: var(--pv-text-1); text-transform: uppercase; letter-spacing: 0.04em; line-height: 1.1; }
                .pv-member-regid { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--color-primary-light); margin-top: 2px; }

                .pv-member-meta {
                    display: grid; grid-template-columns: repeat(3, 1fr);
                    gap: 12px; padding-top: 14px;
                    border-top: 1px solid var(--pv-border);
                }
                .pv-member-meta-label { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--pv-text-3); margin-bottom: 3px; font-family: 'Barlow Condensed', sans-serif; }
                .pv-member-meta-value { font-size: 0.8rem; font-weight: 700; color: var(--pv-text-2); text-transform: uppercase; }

                @media print {
                    @page { size: auto; margin: 10mm; }
                    nav, footer, .no-print, button { display: none !important; }
                    body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    .pv-page { background: white !important; }
                    #ticket-container { flex-direction: row !important; }
                    .tk-sidebar { width: 260px !important; display: flex !important; }
                }
            `}</style>

            <div className="pv-page">
                <div className="pv-inner">

                    {/* ── Top bar ── */}
                    <div className="pv-topbar no-print">
                        <button onClick={onBack} className="pv-back-btn">
                            <AiOutlineArrowLeft />
                            Back to Search
                        </button>
                        <div className="pv-topbar-actions">
                            <button onClick={handleShare} className="pv-action-btn ghost">
                                {copySuccess ? <AiOutlineCheck /> : <AiOutlineShareAlt />}
                                {copySuccess ? 'Copied!' : 'Share'}
                            </button>
                            <button onClick={handleDownloadPDF} className="pv-action-btn primary">
                                <AiOutlineDownload />
                                Download PDF
                            </button>
                        </div>
                    </div>

                    {/* ── Ticket ── */}
                    <div id="ticket-container">
                        {/* Main area */}
                        <div className="tk-main">
                            <div>
                                {/* Logo + Pass ID */}
                                <div className="tk-top-row">
                                    <div className="tk-logo-group">
                                        <div className="tk-logo-box">
                                            <img src={logo} alt="RWTW" />
                                        </div>
                                        <div>
                                            <div className="tk-logo-title">Ride With The Warriors</div>
                                            <div className="tk-logo-sub">Official Participant Pass 2026</div>
                                        </div>
                                    </div>
                                    <div className="tk-pass-id-block">
                                        <div className="tk-pass-id-label">Pass ID</div>
                                        <div className="tk-pass-id">{registration.id}</div>
                                    </div>
                                </div>

                                {/* Name + badges */}
                                <div className="tk-name-block">
                                    <div className="tk-name-label">Participant Name</div>
                                    <div className="tk-name">{registration.firstName} {registration.lastName}</div>
                                    <div className="tk-badges">
                                        <span className="tk-badge" style={{ backgroundColor: categoryColor, color: contrastText }}>
                                            Category: {registration.category || 'Rider'}
                                        </span>
                                        <span className="tk-badge tk-badge-neutral">Type: {registration.type}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Event meta strip */}
                            <div className="tk-meta-strip">
                                {[
                                    { label: 'Circuit', value: circuit.title },
                                    { label: 'Distance', value: circuit.distance },
                                    { label: 'Date', value: circuit.date },
                                    { label: 'Start Time', value: circuit.time },
                                ].map((m, i) => (
                                    <div key={i} className="tk-meta-cell">
                                        <div className="tk-meta-label">{m.label}</div>
                                        <div className="tk-meta-value">{m.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* QR sidebar */}
                        <div className="tk-sidebar">
                            <div style={{ width: '100%' }}>
                                <div className="tk-pass-id-label" style={{ textAlign: 'center', marginBottom: 10 }}>Security Status</div>
                                <div className={`tk-status ${isPaid ? 'paid' : 'pending'}`}>
                                    {isPaid ? <AiOutlineCheckCircle /> : <AiOutlineHourglass />}
                                    {registration.status}
                                </div>
                            </div>

                            <div className="tk-qr-box">
                                <QRCodeCanvas
                                    value={`${window.location.host === 'localhost:5173' || window.location.host.includes('vercel.app') ? window.location.origin : 'https://ridewiththewarriors.com'}/profile/${registration.id}`}
                                    size={160} level="H" includeMargin={true}
                                    imageSettings={{ src: logo, height: 32, width: 32, excavate: true }}
                                />
                            </div>
                        </div>

                        {/* Accent bar */}
                        <div className="tk-accent-bar" style={{ backgroundColor: categoryColor }} />
                    </div>

                    {/* ── Details card ── */}
                    <div className="pv-details-card no-print">
                        <div className="pv-details-grid">
                            {/* Contact info */}
                            <div>
                                <div className="pv-label-row">
                                    <div className="pv-label-line" />
                                    <span className="pv-eyebrow">Contact Information</span>
                                </div>
                                <div className="pv-section-title">Rider Details</div>

                                <div className="pv-field-grid">
                                    <div className="pv-field">
                                        <div className="pv-field-label">Email Address</div>
                                        <div className="pv-field-value" style={{ fontSize: '0.82rem' }}>{info.email}</div>
                                    </div>
                                    <div className="pv-field">
                                        <div className="pv-field-label">Primary Phone</div>
                                        <div className="pv-field-value">{info.phone}</div>
                                    </div>
                                </div>

                                <hr className="pv-rule" />

                                <div className="pv-field-grid">
                                    <div className="pv-field">
                                        <div className="pv-field-label">T-Shirt Size</div>
                                        <div className="pv-field-value large">{info.tshirtSize}</div>
                                    </div>
                                    {info.details.map((detail, idx) => (
                                        <div key={idx} className="pv-field">
                                            <div className="pv-field-label">{detail.label}</div>
                                            <div className="pv-field-value" style={{ textTransform: 'capitalize' }}>{detail.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <hr className="pv-rule" />

                                <div className="pv-field-grid">
                                    <div className="pv-field">
                                        <div className="pv-field-label">Emergency Contact</div>
                                        <div className="pv-field-value">{info.emergencyContact}</div>
                                    </div>
                                    <div className="pv-field">
                                        <div className="pv-field-label">Emergency Phone</div>
                                        <div className="pv-field-value accent mono">{info.emergencyPhone}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction summary */}
                            <div style={{ position: 'relative', paddingLeft: 0 }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 1, background: 'var(--pv-border)' }} className="hidden md:block" />
                                <div style={{ paddingLeft: 0 }} className="md:pl-10">
                                    <div className="pv-label-row">
                                        <div className="pv-label-line" />
                                        <span className="pv-eyebrow">Transaction Summary</span>
                                    </div>
                                    <div className="pv-section-title">Payment Record</div>

                                    {pricing?.lineItems?.map((item: any, idx: number) => (
                                        <div key={idx} className="pv-line-item">
                                            <span>{item.label}</span>
                                            <span>KES {item.amount.toLocaleString()}</span>
                                        </div>
                                    ))}

                                    <div className="pv-total-row">
                                        <span className="pv-total-label">Total Price</span>
                                        <span className="pv-total-value">KES {pricing?.totalAmount?.toLocaleString() || 0}</span>
                                    </div>

                                    {/* Payment card */}
                                    {registration.latestPayment ? (() => {
                                        const st = registration.latestPayment.status;
                                        const cls = st === 'PAID' ? 'paid' : st === 'FAILED' ? 'failed' : 'pending';
                                        const label = st === 'PAID' ? 'Payment Confirmed' : st === 'FAILED' ? 'Payment Failed' : 'Payment Pending';
                                        return (
                                            <div className={`pv-payment-card ${cls}`}>
                                                <div className="pv-payment-header">
                                                    <div className={`pv-payment-icon ${cls}`}><AiOutlineCreditCard /></div>
                                                    <span className={`pv-payment-status-label ${cls}`}>{label}</span>
                                                </div>
                                                <div className="pv-field-grid">
                                                    {registration.latestPayment.mpesaReceiptNumber && (
                                                        <div className="pv-field" style={{ gridColumn: '1 / -1' }}>
                                                            <div className="pv-field-label">Transaction Code</div>
                                                            <div className="pv-field-value mono">{registration.latestPayment.mpesaReceiptNumber}</div>
                                                        </div>
                                                    )}
                                                    {registration.latestPayment.transactionDate && (
                                                        <div className="pv-field">
                                                            <div className="pv-field-label">Payment Timestamp</div>
                                                            <div className="pv-field-value" style={{ fontSize: '0.8rem' }}>{formatPaymentTimestamp(registration.latestPayment.transactionDate)}</div>
                                                        </div>
                                                    )}
                                                    <div className="pv-field">
                                                        <div className="pv-field-label">Amount</div>
                                                        <div className="pv-field-value accent">KES {(registration.latestPayment.amount || 0).toLocaleString()}</div>
                                                    </div>
                                                    {registration.latestPayment.phone && (
                                                        <div className="pv-field">
                                                            <div className="pv-field-label">Phone</div>
                                                            <div className="pv-field-value mono" style={{ fontSize: '0.8rem' }}>{registration.latestPayment.phone}</div>
                                                        </div>
                                                    )}
                                                    {st === 'FAILED' && registration.latestPayment.failureReason && (
                                                        <div className="pv-field" style={{ gridColumn: '1 / -1' }}>
                                                            <div className="pv-field-label" style={{ color: 'var(--pv-fail-text)' }}>Reason</div>
                                                            <div className="pv-field-value" style={{ color: 'var(--pv-fail-text)', fontSize: '0.82rem' }}>{registration.latestPayment.failureReason}</div>
                                                        </div>
                                                    )}
                                                </div>
                                                {st !== 'PAID' && !isPaid && (
                                                    <button onClick={() => navigate(`/payment/${registration.id}`, { state: { amount: registration.totalAmount || pricing?.totalAmount || registration.latestPayment.amount || 0, email: registration.email || '', phoneNumber: registration.phoneNumber || registration.latestPayment.phone || '' } })} className="pv-pay-btn">
                                                        <AiOutlineCreditCard />
                                                        {st === 'FAILED' ? 'Retry Payment' : 'Complete Payment'}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })() : (!isPaid ? (
                                        <div className="pv-no-payment">
                                            <span className="pv-micro">No payment recorded yet</span>
                                            <button onClick={() => navigate(`/payment/${registration.id}`, { state: { amount: registration.totalAmount || pricing?.totalAmount || 0, email: registration.email || '', phoneNumber: registration.phoneNumber || '' } })} className="pv-pay-btn" style={{ marginTop: 0 }}>
                                                <AiOutlineCreditCard /> Pay Now
                                            </button>
                                        </div>
                                    ) : null)}

                                    <p className="pv-micro" style={{ textAlign: 'center', marginTop: 20 }}>
                                        Registered on {formatDate(registration.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Team Roster ── */}
                    {registration.type === 'team' && (
                        <div className="no-print">
                            <div className="pv-roster-card">
                                <button className="pv-roster-toggle" onClick={() => setShowAllMembers(!showAllMembers)}>
                                    <div className="pv-roster-toggle-left">
                                        <div className="pv-roster-icon"><AiOutlineTeam /></div>
                                        <div>
                                            <div className="pv-roster-title">Team Roster</div>
                                            <div className="pv-roster-sub">{payload.teamDetails.members.length} Registered Riders</div>
                                        </div>
                                    </div>
                                    <div className="pv-roster-chevron">
                                        <AiOutlineDown style={{ transition: 'transform 0.3s', transform: showAllMembers ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                                    </div>
                                </button>

                                {showAllMembers && (
                                    <div className="pv-roster-grid">
                                        {payload.teamDetails.members.map((member: any, idx: number) => (
                                            <div key={idx} className="pv-member-card">
                                                <div className="pv-member-top">
                                                    <div className={`pv-member-avatar ${member.isCaptain ? 'captain' : 'regular'}`}>
                                                        {member.isCaptain ? <AiOutlineStar /> : <AiOutlineUser />}
                                                    </div>
                                                    <div>
                                                        <div className="pv-member-name">{member.firstName} {member.lastName}</div>
                                                        <div className="pv-member-regid">{member.regId || `${registration.id}-${idx + 1}`}</div>
                                                    </div>
                                                </div>
                                                <div className="pv-member-meta">
                                                    <div>
                                                        <div className="pv-member-meta-label">Gender</div>
                                                        <div className="pv-member-meta-value">{member.gender}</div>
                                                    </div>
                                                    <div>
                                                        <div className="pv-member-meta-label">Age</div>
                                                        <div className="pv-member-meta-value">{calculateAge(member.dob)} yrs</div>
                                                    </div>
                                                    <div>
                                                        <div className="pv-member-meta-label">T-shirt</div>
                                                        <div className="pv-member-meta-value">{member.tshirtSize}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ProfileView;