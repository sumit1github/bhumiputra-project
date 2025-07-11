import React from 'react'
import Table from 'react-bootstrap/Table';

export const TableLayout = ({
    columns = ["col1","col2"],
    children,
    is_loading
}) => {

    if (is_loading){
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px',
                color: 'white',
                fontFamily: "'Inter', sans-serif",
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                }}></div>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '3px solid transparent',
                    borderTop: '3px solid #ffffff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    zIndex: 1
                }}></div>
                <h1 style={{
                    fontSize: '1.2rem',
                    fontWeight: '500',
                    marginTop: '1rem',
                    zIndex: 1,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>Loading...</h1>
                <style>
                    {`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}
                </style>
            </div>
        );
    }
    
    return (
        <>
            <style>
            {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                
                table{
                    margin-top: 2rem;
                    font-family: 'Inter', sans-serif;
                    background: linear-gradient(145deg, #ffffff, #f8fafc);
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
                    border: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                table:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.12);
                }
                
                .table th{
                    font-weight: 600;
                    font-size: 13px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: #ffffff;
                    border: none;
                    padding: 1.2rem 1rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    position: relative;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
                    transition: all 0.2s ease;
                }
                
                .table th:first-child {
                    border-top-left-radius: 16px;
                }
                
                .table th:last-child {
                    border-top-right-radius: 16px;
                }
                
                .table th::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E");
                    opacity: 0.3;
                }
                
                .table th:hover {
                    background: linear-gradient(135deg, #5a67d8, #6b46c1);
                    transform: translateY(-1px);
                }
                
                svg{
                    margin-left: 8px;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                    transition: all 0.2s ease;
                }
                
                svg:hover {
                    transform: scale(1.1);
                }
                
                table, th, td {
                    border: none;
                    border-collapse: separate;
                    border-spacing: 0;
                }
                
                .table tbody tr {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                    position: relative;
                }
                
                .table tbody tr:hover {
                    background: linear-gradient(90deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
                    transform: translateX(4px);
                    box-shadow: inset 4px 0 0 #667eea;
                }
                
                .table tbody tr:nth-child(even) {
                    background: rgba(248, 250, 252, 0.5);
                }
                
                .table tbody tr:nth-child(even):hover {
                    background: linear-gradient(90deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
                }
                
                td {
                    color: #2d3748;
                    padding: 1rem;
                    font-size: 13px;
                    font-weight: 400;
                    vertical-align: middle;
                    position: relative;
                    transition: all 0.2s ease;
                }
                
                td::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 0;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    transition: width 0.3s ease;
                }
                
                tr:hover td::before {
                    width: 3px;
                }
                
                .table_search_box {
                    position: relative;
                    overflow: hidden;
                }
                
                .table_search_box::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
                    transform: rotate(-45deg);
                    animation: shimmer 3s infinite;
                    pointer-events: none;
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%) translateY(-100%) rotate(-45deg); }
                    100% { transform: translateX(100%) translateY(100%) rotate(-45deg); }
                }
                
                /* Modern scrollbar */
                .table_search_box::-webkit-scrollbar {
                    height: 8px;
                    width: 8px;
                }
                
                .table_search_box::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.05);
                    border-radius: 4px;
                }
                
                .table_search_box::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border-radius: 4px;
                }
                
                .table_search_box::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #5a67d8, #6b46c1);
                }
                
                /* Responsive design */
                @media (max-width: 768px) {
                    table {
                        margin-top: 1rem;
                        border-radius: 12px;
                    }
                    
                    .table th {
                        padding: 0.8rem 0.6rem;
                        font-size: 12px;
                    }
                    
                    td {
                        padding: 0.8rem 0.6rem;
                        font-size: 12px;
                    }
                    
                    .table th:first-child {
                        border-top-left-radius: 12px;
                    }
                    
                    .table th:last-child {
                        border-top-right-radius: 12px;
                    }
                }
                
                /* Accessibility improvements */
                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
                
                /* Focus states for keyboard navigation */
                .table th:focus,
                .table td:focus {
                    outline: 2px solid #667eea;
                    outline-offset: 2px;
                    border-radius: 4px;
                }
                
                /* Print styles */
                @media print {
                    table {
                        box-shadow: none;
                        border: 1px solid #000;
                    }
                    
                    .table th {
                        background: #f0f0f0 !important;
                        color: #000 !important;
                    }
                }
            `}
            </style>

            <Table className='table_search_box' striped >
                <thead>
                    <tr>
                        {}
                        
                        {columns.map((col)=>
                            (
                                <th key={col}>{col}</th>
                            )
                        )}
                        
                    </tr>
                </thead>

                <tbody>
                    {children}
                </tbody>

            </Table>
        </>
    );
    
}