import React from 'react'
import Table from 'react-bootstrap/Table';

export const TableLayout = ({
    columns = ["col1", "col2"],
    children,
    is_loading
}) => {

    if (is_loading) {
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
            <div className='bhumi_putra_dashboard'>
                <div className="data-table fade-in-up">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    { }

                                    {columns.map((col) =>
                                    (
                                        <th key={col}>{col}</th>
                                    )
                                    )}

                                </tr>
                            </thead>
                            <tbody>
                                {children}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );

}