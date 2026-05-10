import React, { useEffect, useState, useCallback } from 'react';
import { FaChartLine, FaSearch, FaSpinner, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import useCRUDOperations from '../hooks/useCRUDOperations';
import FinancialService from '../services/superadmin/FinancialService';
import '../styles/user-management.css';

const RevenueTrackingPage = () => {
  const crud = useCRUDOperations(FinancialService);
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [notification, setNotification] = useState(null);
  const [branches, setBranches] = useState([]);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadRevenue();
    loadBranches();
  }, []);

  const loadRevenue = useCallback(async () => {
    try {
      await crud.fetchAll({
        page: 1,
        perPage: 100,
        filters: {
          branchId: branchFilter !== 'all' ? branchFilter : undefined,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        },
      });
    } catch (error) {
      showNotification('Failed to load revenue data', 'error');
    }
  }, [branchFilter, dateFrom, dateTo]);

  const loadBranches = async () => {
    try {
      const response = await fetch('/api/superadmin/branches?perPage=100');
      if (response.ok) {
        const data = await response.json();
        setBranches(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load branches:', error);
    }
  };

  const filteredRevenue = crud.data.filter((rev) => {
    const matchesSearch = rev.source?.toLowerCase().includes(search.toLowerCase()) || rev.description?.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = branchFilter === 'all' || rev.branchId === branchFilter;
    return matchesSearch && matchesBranch;
  });

  const paginatedRevenue = filteredRevenue.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredRevenue.length / ITEMS_PER_PAGE);

  const totalRevenue = filteredRevenue.reduce((sum, rev) => sum + (parseFloat(rev.amount) || 0), 0);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="user-management-page">
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="user-management-header">
        <div className="header-title">
          <FaChartLine className="header-icon" />
          <h1>Revenue Tracking</h1>
        </div>
        <div className="revenue-summary">
          <div className="summary-card">
            <p className="summary-label">Total Revenue</p>
            <p className="summary-value">₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="user-management-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search by source or description..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
        </div>
        <div className="filter-group">
          <label>Branch:</label>
          <select value={branchFilter} onChange={(e) => { setBranchFilter(e.target.value); setPage(1); }} className="filter-select">
            <option value="all">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>From:</label>
          <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="filter-input" />
        </div>
        <div className="filter-group">
          <label>To:</label>
          <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="filter-input" />
        </div>
      </div>

      {crud.loading && crud.data.length === 0 && (
        <div className="loading-state">
          <FaSpinner className="spinner" />
          <p>Loading revenue data...</p>
        </div>
      )}

      {crud.error && (
        <div className="error-state">
          <FaExclamationCircle />
          <p>{crud.error}</p>
          <button className="btn btn-primary" onClick={loadRevenue}>Retry</button>
        </div>
      )}

      {!crud.loading && crud.data.length === 0 && !crud.error && (
        <div className="empty-state">
          <FaChartLine className="empty-icon" />
          <h3>No revenue data found</h3>
        </div>
      )}

      {!crud.loading && paginatedRevenue.length > 0 && (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Source</th>
                <th>Branch</th>
                <th>Description</th>
                <th>Amount (₹)</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRevenue.map((rev) => (
                <tr key={rev.id}>
                  <td className="cell-email">{rev.date}</td>
                  <td className="cell-name"><strong>{rev.source}</strong></td>
                  <td className="cell-email">{rev.branchName || 'N/A'}</td>
                  <td className="cell-email">{rev.description}</td>
                  <td className="cell-email">₹{parseFloat(rev.amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td className="cell-status"><span className="badge badge-info">{rev.category}</span></td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button className="pagination-btn" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>Previous</button>
              <span className="pagination-info">Page {page} of {totalPages}</span>
              <button className="pagination-btn" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RevenueTrackingPage;
