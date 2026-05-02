import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const blockIndex = Math.floor((currentPage - 1) / 5);
  const startPage = blockIndex * 5 + 1;
  const endPage = Math.min(startPage + 4, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-5 py-8 border-t border-gray-50 mt-8">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`group transition-all ${
          currentPage === 1 ? 'opacity-5 cursor-not-allowed' : 'text-gray-300 hover:text-black'
        }`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div className="flex space-x-5">
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`text-[12px] transition-all relative pb-0.5 ${
              page === currentPage
                ? 'font-bold text-black border-b-[1.5px] border-black'
                : 'text-gray-300 hover:text-black font-medium'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`group transition-all ${
          currentPage === totalPages
            ? 'opacity-5 cursor-not-allowed'
            : 'text-gray-300 hover:text-black'
        }`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
