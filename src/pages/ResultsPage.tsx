import { useState, useEffect } from 'react';
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
    team?: string;
}

type GenderFilter = 'All' | 'Male' | 'Female';

// Categories encode gender in their name (e.g. "Men's Blitz Circuit", "Women's Recon Circuit").
// Check the female pattern first since "Women's" contains "men".
const getCategoryGender = (category: string): 'Male' | 'Female' | 'Other' => {
    if (/women|ladies|female/i.test(category)) return 'Female';
    if (/\bmen'?s?\b|male/i.test(category)) return 'Male';
    return 'Other';
};

const ResultsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<RiderResult[]>([]);
    const [filteredResults, setFilteredResults] = useState<RiderResult[]>([]);
    const [selectedGender, setSelectedGender] = useState<GenderFilter>('All');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [categories, setCategories] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Category pills narrow down to whichever gender is selected
    const visibleCategories = categories.filter(
        category => selectedGender === 'All' || getCategoryGender(category) === selectedGender
    );

    useEffect(() => {
        // Transform mock data from new format to flat array
        const transformResults = (): { results: RiderResult[], categories: string[] } => {
            const transformed: RiderResult[] = [];
            const categoryList: string[] = [];
            const data = resultsData as Record<string, any>;

            Object.keys(data).forEach(category => {
                const categoryData = data[category];

                // Skip team categories for now (they have different structure)
                if (category === 'RECON TEAM' || category === 'BLITZ TEAM') {
                    return;
                }

                // Process individual rider categories
                if (Array.isArray(categoryData)) {
                    categoryList.push(category);
                    categoryData.forEach((rider: any, index: number) => {
                        transformed.push({
                            id: `${category}-${index}`,
                            bibNumber: rider.bib_number || '',
                            name: `${rider.first_name} ${rider.last_name}`,
                            circuit: category,
                            category: category,
                            time: rider.time || '0.00',
                            position: rider.position,
                            status: rider.position === 'DQ' ? 'DQ' : (rider.position ? 'Finished' : 'DNS'),
                            team: rider.team || 'individual'
                        });
                    });
                }
            });

            return { results: transformed, categories: categoryList };
        };

        const { results: allResults, categories: categoryList } = transformResults();
        setResults(allResults);
        setFilteredResults(allResults);
        setCategories(categoryList);
    }, []);

    const handleReset = () => {
        setSearchQuery('');
        setSelectedGender('All');
        setSelectedCategory('All');
        setCurrentPage(1);
    };

    const handleGenderChange = (gender: GenderFilter) => {
        setSelectedGender(gender);
        setSelectedCategory('All'); // category pills change under a new gender, so reset the pick
        setCurrentPage(1);
    };

    useEffect(() => {
        let filtered = results;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(rider =>
                rider.name.toLowerCase().includes(query) ||
                rider.bibNumber.toLowerCase().includes(query)
            );
        }

        if (selectedGender !== 'All') {
            filtered = filtered.filter(rider => getCategoryGender(rider.category) === selectedGender);
        }

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(rider => rider.category === selectedCategory);
        }

        setFilteredResults(filtered);
        setCurrentPage(1);
    }, [searchQuery, selectedGender, selectedCategory, results]);

    const totalPages = Math.max(1, Math.ceil(filteredResults.length / itemsPerPage));

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
                        Search and view rider results from the 2026 edition
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
                                    placeholder="Search by name or bib number..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input clip-md"
                                />
                            </div>

                            <div className="filters-right">
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
                        {filteredResults.length === 0 ? (
                            <div className="no-results">
                                <p>No results found matching your search criteria.</p>
                            </div>
                        ) : (
                            <>
                                <div className="table-wrapper">
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
                                            {filteredResults
                                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                                .map((result, index) => (
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
                                </div>

                                {/* Footer: results count (left) + pagination (right) */}
                                <div className="table-footer">
                                    <div className="results-count">
                                        Showing {Math.min(currentPage * itemsPerPage, filteredResults.length)} of {filteredResults.length} results
                                    </div>

                                    {filteredResults.length > itemsPerPage && (
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