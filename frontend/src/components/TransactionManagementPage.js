import React, { useEffect, useState, useCallback } from 'react';
import { FaExchangeAlt, FaSearch, FaSpinner, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import useCRUDOperations from '../hooks/useCRUDOperations';
import TransactionService from '../services/superadmin/TransactionService';
import '../styles/user-management.css';

const TransactionManagementPage = () => {
  const crud = useCRUDOperations(TransactionService);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [notification, setNotification] = useState(null);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = useCallback(async () => {
    try {
      await crud.fetchAll({
        page: 1,
        perPage: 100,
        filters: { status: statusFilter !== 'all' ? statusFilter : undefined },
      });
    } catch (error) {
      showNotification('Failed to load transactions', 'error');
    }
  }, [statusFilter]);

  const filteredTransactions = crud.data.filter((tx) => {
    const matchesSearch =
      tx.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
      tx.user?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

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
          <FaExchangeAlt className="header-icon" />
          <h1>Transactions</h1>
        </div>
      </div>

      <div className="user-management-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by transaction ID or user..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="search-input"
          />
        </div>
        <div className="role-filters">
          {['all', 'success', 'failed', 'pending', 'refunded'].map((status) => (
            <button
              key={status}
              className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
              onClick={() => { setStatusFilter(status); setPage(1); }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {crud.loading && crud.data.length === 0 && (
        <div className="loading-state">
          <FaSpinner className="spinner" />
          <p>Loading transactions...</p>
        </div>
      )}

      {crud.error && (
        <div className="error-state">
          <FaExclamationCircle />
          <p>{crud.error}</p>
          <button className="btn btn-primary" onClick={loadTransactions}>Retry</button>
        </div>
      )}

      {!crud.loading && crud.data.length === 0 && !crud.error && (
        <div className="empty-state">
          <FaExchangeAlt className="empty-icon" />
          <h3>No transactions found</h3>
        </div>
      )}

      {!crud.loading && paginatedTransactions.length > 0 && (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="cell-name"><strong>{tx.transactionId}</strong></td>
                  <td className="cell-email">{tx.user}</td>
                  <td className="cell-email">₹{parseFloat(tx.amount).toLocaleString()}</td>
                  <td className="cell-email">{tx.type}</td>
                  <td className="cell-email">{tx.method}</td>
                  <td className="cell-status">
                    <span className={`badge badge-${tx.status}`}>{tx.status}</span>
                  </td>
                  <td className="cell-email">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button className="pagination-btn" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
                Previous
              </button>
              <span className="pagination-info">Page {page} of {totalPages}</span>
              <button className="pagination-btn" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionManagementPage;
