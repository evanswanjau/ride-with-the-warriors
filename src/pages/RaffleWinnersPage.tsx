import { useState, useEffect } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaCarSide } from 'react-icons/fa';
import '../styles/raffle.css';
import '../styles/pages.css';
import raffleData from '../assets/raffle.json';
import { displayName } from '../utils/maskName';

/** The car: shown in the Grand Prize card and highlighted in the table. */
const GRAND_PRIZE_TICKET = 'AA130';

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

    const grandPrize = (raffleData as RaffleWinner[]).find(w => w.raffle_number === GRAND_PRIZE_TICKET);

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

                {/* Grand prize (the car) */}
                {grandPrize && (
                    <div className="page-section">
                        <section className="grand-prize" data-testid="grand-prize" aria-label="Grand prize">
                            <div className="grand-prize-label">
                                <FaCarSide aria-hidden="true" className="grand-prize-icon" />
                                <span>Grand Prize · Car</span>
                            </div>
                            <div className="grand-prize-body">
                                <div className="grand-prize-main">
                                    <h2 className="grand-prize-title">{grandPrize.item}</h2>
                                    <p className="grand-prize-sub">A brand-new car</p>
                                </div>
                                <div className="grand-prize-ticket">
                                    <span className="grand-prize-ticket-label">Ticket</span>
                                    <span className="grand-prize-ticket-no">{grandPrize.raffle_number}</span>
                                </div>
                                <p className="grand-prize-winner">
                                    Won by <strong>{displayName(grandPrize.name)}</strong>
                                </p>
                            </div>
                        </section>
                    </div>
                )}

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
                                                    <tr
                                                        key={winner.serial_number}
                                                        className={winner.raffle_number === GRAND_PRIZE_TICKET ? 'row-grand' : index % 2 === 0 ? 'row-even' : 'row-odd'}
                                                    >
                                                        <td className="serial-cell">{winner.serial_number}</td>
                                                        <td className="item-cell">
                                                            {winner.item}
                                                            {winner.raffle_number === GRAND_PRIZE_TICKET && (
                                                                <span className="grand-badge">🚗 Car · Grand prize</span>
                                                            )}
                                                        </td>
                                                        <td className="raffle-cell">{winner.raffle_number}</td>
                                                        <td className="name-cell" title={displayName(winner.name)}>{displayName(winner.name)}</td>
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
