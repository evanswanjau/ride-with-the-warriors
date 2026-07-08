import { useState, useEffect, useMemo } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import '../styles/results.css';
import '../styles/pages.css';
import resultsData from '../assets/results.json';

interface RiderResult {
    id: string;
    bibNumber: string;
    name: string;
    circuit: string;
    category: string;
    time: string;
    position: number | string | null;
    status: string;
}

interface TeamStanding {
    id: string;
    circuit: 'Blitz' | 'Recon';
    teamName: string;
    position: string;
    average: string;
    legTimes: string[];
}

interface TeamRosterRider {
    id: string;
    circuit: 'Blitz' | 'Recon';
    teamName: string;
    riderCode: string;
    name: string;
    position: number | string | null;
    time: string;
    status: string;
}

type GenderFilter = 'All' | 'Male' | 'Female';
type CircuitFilter = 'All' | 'Blitz' | 'Recon' | 'Corporate';
type ResultType = 'Individual' | 'Team';

// The raw category keys look like "BLITZ I FEMALE", "RECON MALE", "CORPORATE FEMALE".
// Circuit is always the first word.
const getCircuitFromCategory = (category: string): CircuitFilter | 'Other' => {
    if (/^BLITZ/i.test(category)) return 'Blitz';
    if (/^RECON/i.test(category)) return 'Recon';
    if (/^CORPORATE/i.test(category)) return 'Corporate';
    return 'Other';
};

// Check the female pattern first since "Women's" contains "men".
const getCategoryGender = (category: string): 'Male' | 'Female' | 'Other' => {
    if (/women|ladies|female/i.test(category)) return 'Female';
    if (/\bmen'?s?\b|male/i.test(category)) return 'Male';
    return 'Other';
};

const TEAM_KEYS: Record<string, 'Blitz' | 'Recon'> = {
    'BLITZ TEAM': 'Blitz',
    'RECON TEAM': 'Recon',
};

const ResultsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCircuit, setSelectedCircuit] = useState<CircuitFilter>('All');
    const [selectedType, setSelectedType] = useState<ResultType>('Individual');
    const [selectedGender, setSelectedGender] = useState<GenderFilter>('All');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [teamView, setTeamView] = useState<'Overall' | 'Detailed'>('Overall');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Parse the raw JSON once into three clean shapes: individual rider rows,
    // team standings rows, and team roster rows (each rider's leg within a team).
    const { individualResults, individualCategories, teamStandings, teamRoster } = useMemo(() => {
        const data = resultsData as Record<string, any>;
        const individualResults: RiderResult[] = [];
        const individualCategories: string[] = [];
        const teamStandings: TeamStanding[] = [];
        const teamRoster: TeamRosterRider[] = [];

        Object.keys(data).forEach(category => {
            if (category in TEAM_KEYS) {
                const circuit = TEAM_KEYS[category];
                const categoryData = data[category];

                (categoryData.overall_standings || []).forEach((team: any, index: number) => {
                    teamStandings.push({
                        id: `${category}-standing-${index}`,
                        circuit,
                        teamName: team.team_name,
                        position: team.position,
                        average: team.average,
                        legTimes: team.leg_times || [],
                    });
                });

                (categoryData.detailed_summary || []).forEach((rider: any, index: number) => {
                    teamRoster.push({
                        id: `${category}-rider-${index}`,
                        circuit,
                        teamName: rider.team,
                        riderCode: rider.rider_code || '',
                        name: `${rider.first_name} ${rider.last_name}`,
                        position: rider.position,
                        time: rider.time || '0.00',
                        status: rider.position === 'DQ' ? 'DQ' : (rider.position ? 'Finished' : 'DNS'),
                    });
                });
                return;
            }

            const categoryData = data[category];
            if (Array.isArray(categoryData)) {
                individualCategories.push(category);
                categoryData.forEach((rider: any, index: number) => {
                    individualResults.push({
                        id: `${category}-${index}`,
                        bibNumber: rider.bib_number || '',
                        name: `${rider.first_name} ${rider.last_name}`,
                        circuit: getCircuitFromCategory(category),
                        category,
                        time: rider.time || '0.00',
                        position: rider.position,
                        status: rider.position === 'DQ' ? 'DQ' : (rider.position ? 'Finished' : 'DNS'),
                    });
                });
            }
        });

        return { individualResults, individualCategories, teamStandings, teamRoster };
    }, []);

    const circuitsWithTeams = useMemo(() => {
        const set = new Set(teamStandings.map(t => t.circuit));
        return set;
    }, [teamStandings]);

    // Corporate has no team results, so force Individual if it's selected there.
    useEffect(() => {
        if (selectedCircuit === 'Corporate' && selectedType === 'Team') {
            setSelectedType('Individual');
        }
    }, [selectedCircuit, selectedType]);

    const handleReset = () => {
        setSearchQuery('');
        setSelectedCircuit('All');
        setSelectedType('Individual');
        setSelectedGender('All');
        setSelectedCategory('All');
        setCurrentPage(1);
    };

    const handleCircuitChange = (circuit: CircuitFilter) => {
        setSelectedCircuit(circuit);
        setSelectedCategory('All');
        setCurrentPage(1);
    };

    const handleTypeChange = (type: ResultType) => {
        setSelectedType(type);
        setSelectedCategory('All');
        setSelectedGender('All');
        setTeamView('Overall');
        setCurrentPage(1);
    };

    const handleTeamViewChange = (view: 'Overall' | 'Detailed') => {
        setTeamView(view);
        setCurrentPage(1);
    };

    const handleGenderChange = (gender: GenderFilter) => {
        setSelectedGender(gender);
        setSelectedCategory('All');
        setCurrentPage(1);
    };

    // --- Individual view ---
    const visibleCategories = individualCategories.filter(category =>
        (selectedCircuit === 'All' || getCircuitFromCategory(category) === selectedCircuit) &&
        (selectedGender === 'All' || getCategoryGender(category) === selectedGender)
    );

    const filteredIndividual = useMemo(() => {
        let filtered = individualResults;

        if (selectedCircuit !== 'All') {
            filtered = filtered.filter(r => r.circuit === selectedCircuit);
        }
        if (selectedGender !== 'All') {
            filtered = filtered.filter(r => getCategoryGender(r.category) === selectedGender);
        }
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(r => r.category === selectedCategory);
        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(r =>
                r.name.toLowerCase().includes(query) || r.bibNumber.toLowerCase().includes(query)
            );
        }
        return filtered;
    }, [individualResults, selectedCircuit, selectedGender, selectedCategory, searchQuery]);

    // --- Team view ---
    const filteredTeamStandings = useMemo(() => {
        let filtered = teamStandings.filter(t => selectedCircuit === 'All' || t.circuit === selectedCircuit);
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t => t.teamName.toLowerCase().includes(query));
        }
        return filtered;
    }, [teamStandings, selectedCircuit, searchQuery]);

    const filteredTeamRoster = useMemo(() => {
        let filtered = teamRoster.filter(r => selectedCircuit === 'All' || r.circuit === selectedCircuit);
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(r =>
                r.name.toLowerCase().includes(query) ||
                r.riderCode.toLowerCase().includes(query) ||
                r.teamName.toLowerCase().includes(query)
            );
        }
        return filtered;
    }, [teamRoster, selectedCircuit, searchQuery]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedType, selectedCircuit, selectedGender, selectedCategory, teamView, searchQuery]);

    const isTeamView = selectedType === 'Team';
    const showTeamStandings = isTeamView && teamView === 'Overall';
    const showTeamRoster = isTeamView && teamView === 'Detailed';

    const activeList: any[] = showTeamRoster
        ? filteredTeamRoster
        : showTeamStandings
            ? filteredTeamStandings
            : filteredIndividual;

    const totalPages = Math.max(1, Math.ceil(activeList.length / itemsPerPage));
    const pageSlice = activeList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="page">
            <div className="page-inner">
                {/* Header */}
                <div className="page-section">
                    <div className="page-label-row">
                        <div className="page-label-line" />
                        <span className="page-eyebrow">Race Results</span>
                    </div>
                    <h1 className="page-display page-title">Event <span className="page-accent">Results.</span></h1>
                    <p className="page-subtitle">
                        Search and view rider and team results from the 2026 edition
                    </p>
                </div>

                {/* Search Section */}
                <div className="page-section">
                    <div className="search-section">
                        <div className="search-form">
                            <div className="search-input-wrapper">
                                <AiOutlineSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder={isTeamView ? 'Search by team or rider name...' : 'Search by name or bib number...'}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input clip-md"
                                />
                            </div>

                            <div className="filters-right">
                                <div className="filter-group">
                                    <span className="filter-label">Circuit</span>
                                    <select
                                        value={selectedCircuit}
                                        onChange={(e) => handleCircuitChange(e.target.value as CircuitFilter)}
                                        className="filter-select clip-sm"
                                    >
                                        <option value="All">All Circuits</option>
                                        <option value="Recon">Recon</option>
                                        <option value="Corporate">Corporate</option>
                                    </select>
                                </div>


                                {!isTeamView && (
                                    <>
                                        <div className="filter-group">
                                            <span className="filter-label">Gender</span>
                                            <select
                                                value={selectedGender}
                                                onChange={(e) => handleGenderChange(e.target.value as GenderFilter)}
                                                className="filter-select clip-sm"
                                            >
                                                <option value="All">All</option>
                                                <option value="Male">Men</option>
                                                <option value="Female">Women</option>
                                            </select>
                                        </div>

                                        <div className="filter-group">
                                            <span className="filter-label">Category</span>
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="filter-select clip-sm"
                                            >
                                                <option value="All">All Categories</option>
                                                {visibleCategories.map((category) => (
                                                    <option key={category} value={category}>
                                                        {category}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}

                                {isTeamView && (
                                    <div className="filter-group">
                                        <span className="filter-label">View</span>
                                        <select
                                            value={teamView}
                                            onChange={(e) => handleTeamViewChange(e.target.value as 'Overall' | 'Detailed')}
                                            className="filter-select clip-sm"
                                        >
                                            <option value="Overall">Overall Standings</option>
                                            <option value="Detailed">Detailed Summary</option>
                                        </select>
                                    </div>
                                )}

                                <button
                                    onClick={handleReset}
                                    className="search-button search-button-reset clip-md"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Table */}
                <div className="page-section">
                    <div className="results-table-section clip-md">
                        {activeList.length === 0 ? (
                            <div className="no-results">
                                <p>No results found matching your search criteria.</p>
                            </div>
                        ) : (
                            <>
                                <div className="table-wrapper">
                                    {showTeamStandings && (
                                        <table className="results-table">
                                            <thead>
                                                <tr>
                                                    <th>Position</th>
                                                    <th>Team</th>
                                                    <th>Circuit</th>
                                                    <th>Average</th>
                                                    <th>Leg Times</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(pageSlice as TeamStanding[]).map((team, index) => (
                                                    <tr key={team.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                                                        <td className="position-cell">
                                                            <span className="position-badge">{team.position}</span>
                                                        </td>
                                                        <td className="name-cell">{team.teamName}</td>
                                                        <td className="circuit-cell">{team.circuit}</td>
                                                        <td className="time-cell">{team.average}</td>
                                                        <td
                                                            className="legtimes-cell"
                                                            style={{
                                                                whiteSpace: 'normal',
                                                                overflow: 'visible',
                                                                textOverflow: 'clip',
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                gap: '6px',
                                                                minWidth: '220px',
                                                            }}
                                                        >
                                                            {team.legTimes.map((leg, legIndex) => (
                                                                <span
                                                                    key={legIndex}
                                                                    className="leg-time-badge"
                                                                    style={{
                                                                        whiteSpace: 'nowrap',
                                                                        padding: '2px 6px',
                                                                        borderRadius: '4px',
                                                                        background: 'rgba(0,0,0,0.06)',
                                                                        fontSize: '0.85em',
                                                                    }}
                                                                    title={`Leg ${legIndex + 1}`}
                                                                >
                                                                    L{legIndex + 1}: {leg}
                                                                </span>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}

                                    {showTeamRoster && (
                                        <table className="results-table">
                                            <thead>
                                                <tr>
                                                    <th>Position</th>
                                                    <th>Rider Code</th>
                                                    <th>Name</th>
                                                    <th>Team</th>
                                                    <th>Circuit</th>
                                                    <th>Time</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(pageSlice as TeamRosterRider[]).map((rider, index) => (
                                                    <tr key={rider.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                                                        <td className="position-cell">
                                                            <span className="position-badge">{rider.position}</span>
                                                        </td>
                                                        <td className="bib-cell">{rider.riderCode}</td>
                                                        <td className="name-cell" title={rider.name}>{rider.name}</td>
                                                        <td className="name-cell">{rider.teamName}</td>
                                                        <td className="circuit-cell">{rider.circuit}</td>
                                                        <td className="time-cell">{rider.time}</td>
                                                        <td className="status-cell">
                                                            <span className={`status-badge status-${rider.status.toLowerCase()}`}>
                                                                {rider.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}

                                    {!isTeamView && (
                                        <table className="results-table">
                                            <colgroup>
                                                <col className="col-position" />
                                                <col className="col-bib" />
                                                <col className="col-name" />
                                                <col className="col-circuit" />
                                                <col className="col-category" />
                                                <col className="col-time" />
                                                <col className="col-status" />
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    <th>Position</th>
                                                    <th>Bib Number</th>
                                                    <th>Name</th>
                                                    <th>Circuit</th>
                                                    <th>Category</th>
                                                    <th>Time</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(pageSlice as RiderResult[]).map((result, index) => (
                                                    <tr key={result.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                                                        <td className="position-cell">
                                                            <span className="position-badge">{result.position}</span>
                                                        </td>
                                                        <td className="bib-cell">{result.bibNumber}</td>
                                                        <td className="name-cell" title={result.name}>{result.name}</td>
                                                        <td className="circuit-cell">{result.circuit}</td>
                                                        <td className="category-cell">{result.category}</td>
                                                        <td className="time-cell">{result.time}</td>
                                                        <td className="status-cell">
                                                            <span className={`status-badge status-${result.status.toLowerCase()}`}>
                                                                {result.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>

                                {/* Footer: results count (left) + pagination (right) */}
                                <div className="table-footer">
                                    <div className="results-count">
                                        Showing {Math.min(currentPage * itemsPerPage, activeList.length)} of {activeList.length} results
                                    </div>

                                    {activeList.length > itemsPerPage && (
                                        <div className="pagination">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                                className="pagination-button clip-sm"
                                            >
                                                Previous
                                            </button>
                                            <div className="pagination-info">
                                                Page {currentPage} of {totalPages}
                                            </div>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={currentPage === totalPages}
                                                className="pagination-button clip-sm"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;