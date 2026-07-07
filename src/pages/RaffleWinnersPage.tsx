import { useState, useEffect } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import '../styles/raffle.css';
import '../styles/pages.css';
import raffleData from '../assets/raffle.json';

interface RaffleWinner {
    serial_number: number;
    item: string;
    raffle_number: string;
    name: string;
}

const RaffleWinnersPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [winners, setWinners] = useState<RaffleWinner[]>([]);
    const [filteredWinners, setFilteredWinners] = useState<RaffleWinner[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    useEffect(() => {
        setWinners(raffleData as RaffleWinner[]);
        setFilteredWinners(raffleData as RaffleWinner[]);
    }, []);

    useEffect(() => {
        let filtered = winners;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(winner =>
                winner.name.toLowerCase().includes(query) ||
                winner.raffle_number.toLowerCase().includes(query) ||
                winner.item.toLowerCase().includes(query)
            );
        }

        setFilteredWinners(filtered);
        setCurrentPage(1);
    }, [searchQuery, winners]);

    const handleReset = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };

    const totalPages = Math.max(1, Math.ceil(filteredWinners.length / itemsPerPage));

    return (
        <div className="page">
            <div className="page-inner">
                {/* Header */}
                <div className="page-section">
                    <div className="page-label-row">
                        <div className="page-label-line" />
                        <span className="page-eyebrow">Raffle Winners</span>
                    </div>
                    <h1 className="page-display page-title">Raffle <span className="page-accent">Winners.</span></h1>
                    <p className="page-subtitle">
                        View the lucky winners from our raffle draw
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
                                    placeholder="Search by name, raffle number, or item..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input clip-md"
                                />
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

                {/* Results Table */}
                <div className="page-section">
                    <div className="winners-table-section clip-md">
                        {filteredWinners.length === 0 ? (
                            <div className="no-results">
                                <p>No winners found matching your search criteria.</p>
                            </div>
                        ) : (
                            <>
                                <div className="table-wrapper">
                                    <table className="winners-table">
                                        <colgroup>
                                            <col className="col-serial" />
                                            <col className="col-item" />
                                            <col className="col-raffle" />
                                            <col className="col-name" />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>S/N</th>
                                                <th>Item</th>
                                                <th>Raffle No</th>
                                                <th>Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredWinners
                                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                                .map((winner, index) => (
                                                    <tr key={winner.serial_number} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                                                        <td className="serial-cell">{winner.serial_number}</td>
                                                        <td className="item-cell">{winner.item}</td>
                                                        <td className="raffle-cell">{winner.raffle_number}</td>
                                                        <td className="name-cell" title={winner.name}>{winner.name.toLocaleLowerCase()}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer: results count (left) + pagination (right) */}
                                <div className="table-footer">
                                    <div className="results-count">
                                        Showing {Math.min(currentPage * itemsPerPage, filteredWinners.length)} of {filteredWinners.length} winners
                                    </div>

                                    {filteredWinners.length > itemsPerPage && (
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

export default RaffleWinnersPage;
