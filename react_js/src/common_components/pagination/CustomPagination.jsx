import React from "react";
import Pagination from 'react-bootstrap/Pagination';

export default function CustomPagination({ metadata, onPageChange }) {
  const { page, total_pages, previous_page, next_page } = metadata;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= total_pages) {
      onPageChange(newPage);
    }
  };

  return (
    
    <Pagination style={{ justifyContent: 'right', marginTop: '20px' }}>
      <Pagination.First 
        disabled={page === 1}
        onClick={() => handlePageChange(1)}
      />
      <Pagination.Prev 
        disabled={!previous_page}
        onClick={() => handlePageChange(page - 1)}
      />

      {[...Array(total_pages)].map((_, index) => (
        <Pagination.Item
          key={index + 1}
          active={page === index + 1}
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </Pagination.Item>
      ))}

      <Pagination.Next 
        disabled={!next_page}
        onClick={() => handlePageChange(page + 1)}
      />
      <Pagination.Last 
        disabled={page === total_pages}
        onClick={() => handlePageChange(total_pages)}
      />
    </Pagination>
  );
}

