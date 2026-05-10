import React, { useState, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSync } from 'react-icons/fa';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import { useCreateMembership, useUpdateMembership, useCancelMembership } from '../../hooks/useSuperAdminMutations';
import LoadingSpinner from '../LoadingSpinner';
import ErrorAlert from '../ErrorAlert';
import SuccessAlert from '../SuccessAlert';
import FormModal from '../FormModal';
import { formatDate, formatCurrency, calculateDaysRemaining } from '../../utils/apiUtils';

const MembershipManagementModule = () => {
  const {
    memberships,
    membershipsLoading,
    membershipsError,
    membershipsPagination,
    fetchMemberships,
  } = useSuperAdmin();

  const { mutate: createMembership, loading: createLoading } = useCreateMembership();
  const { mutate: updateMembership, loading: updateLoading } = useUpdateMembership();
  const { mutate: cancelMembership, loading: cancelLoading } = useCancelMembership();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingMembership, setEditingMembership] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchMemberships(currentPage, 10);
  }, [fetchMemberships, currentPage]);

  const handleCreateMembership = useCallback(async (formData) => {
    try {
      await createMembership(formData);
      setSuccessMessage('Membership created successfully');
      setShowModal(false);
      handleRefresh();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to create membership');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  }, [createMembership, handleRefresh]);

  const handleUpdateMembership = useCallback(async (formData) => {
    try {
      await updateMembership(editingMembership._id, formData);
      setSuccessMessage('Membership updated successfully');
      setShowModal(false);
      setEditingMembership(null);
      handleRefresh();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update membership');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  }, [updateMembership, editingMembership, handleRefresh]);

  const handleCancelMembership = useCallback(async (membershipId) => {
    if (window.confirm('Are you sure you want to cancel this membership?')) {
      try {
        await cancelMembership(membershipId);
        setSuccessMessage('Membership cancelled successfully');
        handleRefresh();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setErrorMessage(error.message || 'Failed to cancel membership');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  }, [cancelMembership, handleRefresh]);

  const handleEditMembership = useCallback((membership) => {
    setEditingMembership(membership);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingMembership(null);
  }, []);

  const filteredMemberships = memberships.filter((membership) => {
    const matchesSearch = membership.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         membership.planName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || membership.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (membershipsLoading) return <LoadingSpinner />;

  return (
    <div className="module-container">
      {successMessage && <SuccessAlert message={successMessage} />}
      {errorMessage && <ErrorAlert message={errorMessage} />}
      {membershipsError && <ErrorAlert message={membershipsError} />}

      <div className="module-header">
        <h2>Membership Management</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Membership
        </button>
      </div>

      <div className="module-controls">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search memberships..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="filter-group">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button className="btn btn-secondary" onClick={handleRefresh} disabled={membershipsLoading}>
            <FaSync /> Refresh
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Plan</th>
              <th>Price</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Days Remaining</th>
              <th>Status</th>
              <th>Auto Renew</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMemberships.length > 0 ? (
              filteredMemberships.map((membership) => (
                <tr key={membership._id || membership.id}>
                  <td>{membership.memberName}</td>
                  <td>{membership.planName}</td>
                  <td>{membership.planPrice}</td>
                  <td>{formatDate(membership.startDate)}</td>
                  <td>{formatDate(membership.endDate)}</td>
                  <td>{calculateDaysRemaining(membership.endDate)} days</td>
                  <td><span className={`status ${membership.status}`}>{membership.status}</span></td>
                  <td>{membership.autoRenew ? 'Yes' : 'No'}</td>
                  <td className="actions">
                    <button
                      className="btn-icon edit"
                      onClick={() => handleEditMembership(membership)}
                      disabled={updateLoading}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleCancelMembership(membership._id || membership.id)}
                      disabled={cancelLoading}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="empty-state">No memberships found</td>
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
        <span>Page {currentPage} of {Math.ceil(membershipsPagination.total / 10)}</span>
        <button
          disabled={currentPage >= Math.ceil(membershipsPagination.total / 10)}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {showModal && (
        <FormModal
          title={editingMembership ? 'Edit Membership' : 'Create Membership'}
          onClose={handleCloseModal}
          onSubmit={editingMembership ? handleUpdateMembership : handleCreateMembership}
          loading={editingMembership ? updateLoading : createLoading}
          fields={[
            { name: 'memberId', label: 'Member ID', type: 'text', required: true },
            { name: 'planId', label: 'Plan ID', type: 'text', required: true },
            { name: 'startDate', label: 'Start Date', type: 'date', required: true },
            { name: 'endDate', label: 'End Date', type: 'date', required: true },
            { name: 'autoRenew', label: 'Auto Renew', type: 'checkbox', required: false },
            { name: 'status', label: 'Status', type: 'select', options: ['active', 'expired', 'cancelled'], required: true },
          ]}
          initialData={editingMembership}
        />
      )}
    </div>
  );
};

export default MembershipManagementModule;
