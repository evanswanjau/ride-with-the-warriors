import { useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useDashboard } from '../hooks/useDashboard';
import { useAdminShell } from '../useAdminShell';
import PageHeader from '../ui/PageHeader';
import RangeToggle from '../ui/RangeToggle';
import { axisTick, legendStyle, rangeAxis, sliceRange, tooltipStyle, type ChartRange } from '../ui/chartRange';
import { ErrorBanner } from '../ui/Feedback';

const RAFFLE_TARGET = 300;
const rowLabel = { fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ad-t3)' } as const;

export default function AnalyticsPage() {
    const { dark } = useAdminShell();
    const { data: d, error, reload, totals: t } = useDashboard();
    const [regRange, setRegRange] = useState<ChartRange>('30d');
    const [statusRange, setStatusRange] = useState<ChartRange>('30d');
    const tt = tooltipStyle(dark);

    return (
        <>
            {error && <ErrorBanner message={error} onAction={reload} />}
            <PageHeader eyebrow="Deep Dive" title="Analytics" />

            <div className="ad-panel">
                <div className="ad-panel-head">
                    <div>
                        <div className="ad-panel-title">Registrations vs Paid</div>
                        <div className="ad-panel-val">Daily volume comparison</div>
                    </div>
                    <RangeToggle value={regRange} onChange={setRegRange} />
                </div>
                <div className="ad-panel-body">
                    <ResponsiveContainer width="100%" height={280}>
                        <ComposedChart data={sliceRange(d?.dailyStats, regRange)}>
                            <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="var(--ad-border)" />
                            <XAxis dataKey="date" tick={axisTick} axisLine={false} tickLine={false} {...rangeAxis(regRange)} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={axisTick} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={axisTick} tickFormatter={v => `${v / 1000}k`} />
                            <Tooltip contentStyle={tt} />
                            <Legend wrapperStyle={legendStyle} />
                            <Bar yAxisId="left" dataKey="registrations" fill="rgba(76,175,80,0.25)" barSize={12} radius={0} name="Registrations" />
                            <Line yAxisId="left" type="monotone" dataKey="paid" stroke="#4caf50" strokeWidth={2} dot={false} name="Paid" />
                            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} dot={false} name="Revenue (KES)" strokeDasharray="4 2" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="ad-chart-2">
                <div className="ad-panel">
                    <div className="ad-panel-head">
                        <div className="ad-panel-title">Status Breakdown</div>
                        <RangeToggle value={statusRange} onChange={setStatusRange} />
                    </div>
                    <div className="ad-panel-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={sliceRange(d?.statusTrend, statusRange)}>
                                <defs>
                                    <linearGradient id="gPaid" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4caf50" stopOpacity={0.2} /><stop offset="95%" stopColor="#4caf50" stopOpacity={0} /></linearGradient>
                                    <linearGradient id="gUnpaid" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="var(--ad-border)" />
                                <XAxis dataKey="date" tick={axisTick} axisLine={false} tickLine={false} {...rangeAxis(statusRange)} />
                                <YAxis axisLine={false} tickLine={false} tick={axisTick} />
                                <Tooltip contentStyle={tt} />
                                <Legend wrapperStyle={legendStyle} />
                                <Area type="monotone" dataKey="paid" stroke="#4caf50" strokeWidth={2} fill="url(#gPaid)" dot={false} name="Paid" />
                                <Area type="monotone" dataKey="unpaid" stroke="#f59e0b" strokeWidth={2} fill="url(#gUnpaid)" dot={false} name="Unpaid" />
                                <Area type="monotone" dataKey="cancelled" stroke="#ef4444" strokeWidth={1.5} fill="none" dot={false} name="Cancelled" strokeDasharray="3 3" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="ad-panel">
                    <div className="ad-panel-head"><div className="ad-panel-title">Hourly Registration Intensity</div></div>
                    <div className="ad-panel-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={d?.hourlyIntensity || []}>
                                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="var(--ad-border)" />
                                <XAxis dataKey="hour" tick={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fill: 'var(--ad-t3)' }} axisLine={false} tickLine={false} interval={3} />
                                <YAxis axisLine={false} tickLine={false} tick={axisTick} />
                                <Tooltip contentStyle={tt} />
                                <Bar dataKey="registrations" radius={0} barSize={8}>
                                    {(d?.hourlyIntensity || []).map((entry, i) => (
                                        <Cell key={i} fill={entry.registrations > 12 ? '#4caf50' : entry.registrations > 6 ? 'rgba(76,175,80,0.5)' : 'rgba(76,175,80,0.18)'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="ad-insight" style={{ marginTop: 12 }}>Distribution of registrations by hour of day (all-time history).</div>
                    </div>
                </div>
            </div>

            <div className="ad-chart-3">
                <div className="ad-panel">
                    <div className="ad-panel-head"><div className="ad-panel-title">Age Distribution</div></div>
                    <div className="ad-panel-body">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={d?.ageDistribution || []}>
                                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="var(--ad-border)" />
                                <XAxis dataKey="band" tick={axisTick} axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tick={axisTick} />
                                <Tooltip contentStyle={tt} />
                                <Bar dataKey="count" fill="var(--ad-pl)" barSize={20} radius={0} />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="ad-insight" style={{ marginTop: 12 }}>Age demographic based on provided Date of Birth records.</div>
                    </div>
                </div>

                <div className="ad-panel">
                    <div className="ad-panel-head"><div className="ad-panel-title">Revenue by Circuit</div></div>
                    <div className="ad-panel-body">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={d?.revenueByCircuit || []} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={axisTick} width={90} />
                                <Tooltip contentStyle={tt} formatter={v => `KES ${Number(v).toLocaleString()}`} />
                                <Bar dataKey="value" barSize={10} radius={0}>
                                    {(d?.revenueByCircuit || []).map((c, i) => <Cell key={i} fill={c.color} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="ad-panel">
                    <div className="ad-panel-head">
                        <div>
                            <div className="ad-panel-title">Raffle Ticket Pace</div>
                            <div className="ad-panel-val">{t.rafflePaid} / {RAFFLE_TARGET}</div>
                        </div>
                    </div>
                    <div className="ad-panel-body">
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ height: 8, background: 'var(--ad-raised)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${Math.min(100, (t.rafflePaid / RAFFLE_TARGET) * 100)}%`, background: 'var(--ad-accent)', transition: 'width 1s' }} />
                            </div>
                            <div style={{ ...rowLabel, display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.62rem', letterSpacing: '0.14em' }}>
                                <span>0</span><span style={{ color: 'var(--ad-accent)' }}>{Math.round((t.rafflePaid / RAFFLE_TARGET) * 100)}%</span><span>{RAFFLE_TARGET}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                { l: 'Paid Tickets', v: t.rafflePaid },
                                { l: 'Unpaid Tickets', v: t.raffleUnpaid },
                                { l: 'Target', v: RAFFLE_TARGET },
                                { l: 'Total Revenue', v: `KES ${t.raffleRevenue.toLocaleString()}` },
                            ].map(r => (
                                <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--ad-border)', paddingBottom: 8 }}>
                                    <span style={rowLabel}>{r.l}</span>
                                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: 'var(--ad-t1)' }}>{r.v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
