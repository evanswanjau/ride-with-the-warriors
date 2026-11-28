import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineHistory } from 'react-icons/ai';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useDashboard } from '../hooks/useDashboard';
import { useAdminShell } from '../useAdminShell';
import PageHeader from '../ui/PageHeader';
import RangeToggle from '../ui/RangeToggle';
import { axisTick, rangeAxis, sliceRange, tooltipStyle, type ChartRange } from '../ui/chartRange';
import { ErrorBanner } from '../ui/Feedback';
import { formatDate } from '../ui/format';

const labelStyle = { fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ad-t3)' } as const;

export default function OverviewPage() {
    const navigate = useNavigate();
    const { dark, year } = useAdminShell();
    const { data: d, error, reload, totals: t } = useDashboard(year);
    const [range, setRange] = useState<ChartRange>('30d');
    const tt = tooltipStyle(dark);
    const funnel = d?.financials?.conversionFunnel ?? [];
    const female = d?.demographics?.genderBreakdown?.find(g => g.label?.toLowerCase() === 'female')?.pct ?? 0;

    return (
        <>
            {error && <ErrorBanner message={error} onAction={reload} />}
            <PageHeader eyebrow="Command View" title="Overview" />

            <div className="ad-kpi-grid">
                <div className="ad-kpi">
                    <div className="ad-kpi-label">Gross Revenue</div>
                    <div className="ad-kpi-value green">KES {t.revenue.toLocaleString()}</div>
                    <div className="ad-kpi-trend up"><AiOutlineArrowUp /> Includes Raffle</div>
                </div>
                <div className="ad-kpi">
                    <div className="ad-kpi-label">Confirmed Entries</div>
                    <div className="ad-kpi-value">{t.totalPaid}</div>
                    <div className="ad-kpi-trend up"><AiOutlineArrowUp /> {t.totalRegs} total attempts</div>
                </div>
                <div className="ad-kpi">
                    <div className="ad-kpi-label">Raffle Tickets Sold</div>
                    <div className="ad-kpi-value amber">{t.rafflePaid}</div>
                    <div className="ad-kpi-trend">KES {t.raffleRevenue.toLocaleString()} revenue</div>
                </div>
                <div className="ad-kpi">
                    <div className="ad-kpi-label">Needs Attention</div>
                    <div className="ad-kpi-value red">{t.staleUnpaid}</div>
                    <div className="ad-kpi-trend down"><AiOutlineArrowDown /> Unpaid &gt; 48 hours</div>
                </div>
            </div>

            <div className="ad-chart-2">
                <div className="ad-panel">
                    <div className="ad-panel-head">
                        <div>
                            <div className="ad-panel-title">Daily Revenue</div>
                            <div className="ad-panel-val">KES {t.revenue.toLocaleString()}</div>
                        </div>
                        <RangeToggle value={range} onChange={setRange} />
                    </div>
                    <div className="ad-panel-body">
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={sliceRange(d?.dailyStats, range)}>
                                <defs>
                                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4caf50" stopOpacity={0.22} />
                                        <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="var(--ad-border)" />
                                <XAxis dataKey="date" tick={axisTick} axisLine={false} tickLine={false} {...rangeAxis(range)} />
                                <YAxis tick={axisTick} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
                                <Tooltip contentStyle={tt} />
                                <Area type="monotone" dataKey="revenue" stroke="#4caf50" strokeWidth={2} fill="url(#revGrad)" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="ad-panel">
                    <div className="ad-panel-head">
                        <div>
                            <div className="ad-panel-title">Conversion Funnel</div>
                            <div className="ad-panel-val">{t.convRate}%</div>
                        </div>
                    </div>
                    <div className="ad-panel-body">
                        {funnel.map((row, i) => (
                            <div key={row.label} className="ad-funnel-row">
                                <span className="ad-funnel-label">{row.label}</span>
                                <div className="ad-funnel-bar-wrap">
                                    <div className="ad-funnel-bar" style={{ width: `${i === 0 ? 100 : Math.round((row.count / (funnel[0]?.count || 1)) * 100)}%` }} />
                                </div>
                                <span className="ad-funnel-count">{row.count}</span>
                            </div>
                        ))}
                        <div className="ad-insight" style={{ marginTop: 16 }}>
                            <strong>{t.convRate}%</strong> of registrations convert to confirmed paid entries. The biggest drop is at payment.
                        </div>
                    </div>
                </div>
            </div>

            <div className="ad-chart-3">
                <div className="ad-panel">
                    <div className="ad-panel-head"><div className="ad-panel-title">Circuit Distribution</div></div>
                    <div className="ad-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        <div style={{ marginBottom: 16 }}>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie data={d?.byCircuit || []} dataKey="value" cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={4} startAngle={90} endAngle={-270}>
                                        {(d?.byCircuit || []).map((c, i) => <Cell key={i} fill={c.color} stroke="none" />)}
                                    </Pie>
                                    <Tooltip contentStyle={tt} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="ad-pie-legend">
                            {(d?.byCircuit || []).map(c => (
                                <div key={c.name} className="ad-pie-legend-row">
                                    <div className="ad-pie-legend-dot" style={{ background: c.color }} />
                                    <span className="ad-pie-legend-label">{c.name}</span>
                                    <span className="ad-pie-legend-val">{c.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="ad-panel">
                    <div className="ad-panel-head"><div className="ad-panel-title">Kit Sizes</div></div>
                    <div className="ad-panel-body">
                        <ResponsiveContainer width="100%" height={210}>
                            <BarChart data={d?.demographics?.tshirtBreakdown || []} layout="vertical" margin={{ left: 0, right: 10 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="size" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fill: 'var(--ad-t3)', letterSpacing: '0.1em' }} />
                                <Tooltip contentStyle={tt} />
                                <Bar dataKey="count" fill="var(--ad-pl)" barSize={8} radius={0} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="ad-panel">
                    <div className="ad-panel-head"><div className="ad-panel-title">Gender Split</div></div>
                    <div className="ad-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {(d?.demographics?.genderBreakdown || []).map(g => (
                            <div key={g.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={labelStyle}>{g.label}</span>
                                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: 'var(--ad-t1)' }}>{g.count}</span>
                                </div>
                                <div className="ad-gender-bar-wrap">
                                    <div className="ad-gender-bar" style={{ width: `${g.pct}%`, background: g.color }} />
                                </div>
                            </div>
                        ))}
                        <div className="ad-insight" style={{ marginTop: 8 }}>
                            Minimum lady-per-team rules are on track. <strong>Female participation at {female}%</strong>.
                        </div>
                    </div>
                </div>
            </div>

            <div className="ad-chart-2">
                <div className="ad-panel">
                    <div className="ad-panel-head">
                        <div className="ad-panel-title">Recent Activity Stream</div>
                        <AiOutlineHistory style={{ color: 'var(--ad-t3)', fontSize: '1.1rem' }} />
                    </div>
                    <div className="ad-panel-body">
                        <div className="ad-feed">
                            {(d?.activityFeed || []).map((item, i) => (
                                <div key={i} className="ad-feed-item">
                                    <div className="ad-feed-dot" style={{ background: item.type === 'PAYMENT' ? 'var(--ad-pl)' : item.type === 'REGISTRATION' ? 'var(--ad-accent)' : '#38bdf8' }} />
                                    <div style={{ flex: 1 }}>
                                        <div className="ad-feed-title">{item.title}</div>
                                        <div className="ad-feed-sub">{item.subtitle} · {formatDate(item.date)}</div>
                                    </div>
                                    <span className={`ad-badge ${item.status === 'PAID' || item.status === 'CONFIRMED' ? 'ad-badge-paid' : 'ad-badge-unpaid'}`}>{item.status}</span>
                                </div>
                            ))}
                            {!d?.activityFeed?.length && (
                                <div className="ad-feed-sub" style={{ padding: '20px 0', textAlign: 'center' }}>No recent activity</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="ad-panel">
                    <div className="ad-panel-head"><div className="ad-panel-title">Action Required</div></div>
                    <div className="ad-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="ad-stale">
                            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ad-red)', marginBottom: 4 }}>Stale Unpaid</div>
                            <div className="ad-stale-num">{t.staleUnpaid}</div>
                            <div className="ad-stale-desc">Entries stuck in UNPAID for over 48 hours. Consider automated follow-up email.</div>
                            <button className="ad-stale-btn" onClick={() => navigate(`/admin/registrations?status=UNPAID${year ? `&year=${year}` : ''}`)}>Review Now &rarr;</button>
                        </div>
                        <div className="ad-insight">
                            <strong>Raffle draw</strong> is scheduled for 05 Jul 2026. <strong>{t.rafflePaid} tickets sold</strong> — target is 300.
                        </div>
                        <div className="ad-insight">
                            <strong>Registration Pace</strong> is at <strong>{t.avgPerDay} per day</strong> average over the last 30 days.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
