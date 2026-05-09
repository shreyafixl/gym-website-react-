import React, { useState, useCallback } from 'react';
import { FaSearch, FaSync, FaFilter, FaDownload } from 'react-icons/fa';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import LoadingSpinner from '../LoadingSpinner';
import ErrorAlert from '../ErrorAlert';
import { formatDate, formatNumber } from '../../utils/apiUtils';

const AttendanceManagementModule = () => {
  const {
    attendance,
    attendanceLoading,
    attendanceError,
    fetchAttendance,
  } = useSuperAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchAttendance(currentPage, 10, { status: filterStatus, startDate, endDate });
  }, [fetchAttendance, currentPage, filterStatus, startDate, endDate]);

  const filteredAttendance = attendance.filter((record) => {
    const matchesSearch = record.memberName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalRecords: attendance.length,
    presentCount: attendance.filter((a) => a.status === 'present').length,
    absentCount: attendance.filter((a) => a.status === 'absent').length,
    attendanceRate: attendance.length > 0 ? ((attendance.filter((a) => a.status === 'present').length / attendance.length) * 100).toFixed(1) : 0,
  };

  if (attendanceLoading) return <LoadingSpinner />;

  return (
    <div className="module-container">
      {attendanceError && <ErrorAlert message={attendanceError} />}

      <div className="module-header">
        <h2>Attendance Management</h2>
        <button className="btn btn-secondary" onClick={handleRefresh} disabled={attendanceLoading}>
          <FaSync /> Refresh
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Records</p>
          <p className="stat-value">{formatNumber(stats.totalRecords)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Present</p>
          <p className="stat-value">{formatNumber(stats.presentCount)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Absent</p>
          <p className="stat-value">{formatNumber(stats.absentCount)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Attendance Rate</p>
          <p className="stat-value">{stats.attendanceRate}%</p>
        </div>
      </div>

      <div className="module-controls">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="filter-group">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>

          <button className="btn btn-secondary" onClick={handleRefresh} disabled={attendanceLoading}>
            <FaFilter /> Filter
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Date</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Duration</th>
              <th>Branch</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.length > 0 ? (
              filteredAttendance.map((record) => (
                <tr key={record._id || record.id}>
                  <td>{record.memberName}</td>
                  <td>{formatDate(record.date)}</td>
                  <td>{record.checkInTime}</td>
                  <td>{record.checkOutTime}</td>
                  <td>{record.duration}</td>
                  <td>{record.branch}</td>
                  <td><span className={`status ${record.status}`}>{record.status}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-state">No attendance records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AttendanceManagementModule;
