import React, { useState, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSync, FaMapMarkerAlt } from 'react-icons/fa';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import { useCreateBranch, useUpdateBranch, useDeleteBranch } from '../../hooks/useSuperAdminMutations';
import LoadingSpinner from '../LoadingSpinner';
import ErrorAlert from '../ErrorAlert';
import SuccessAlert from '../SuccessAlert';
import FormModal from '../FormModal';
import { formatDate } from '../../utils/apiUtils';

const BranchManagementModule = () => {
  const {
    branches,
    branchesLoading,
    branchesError,
    branchesPagination,
    fetchBranches,
  } = useSuperAdmin();

  const { mutate: createBranch, loading: createLoading } = useCreateBranch();
  const { mutate: updateBranch, loading: updateLoading } = useUpdateBranch();
  const { mutate: deleteBranch, loading: deleteLoading } = useDeleteBranch();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchBranches(currentPage, 10);
  }, [fetchBranches, currentPage]);

  const handleCreateBranch = useCallback(async (formData) => {
    try {
      await createBranch(formData);
      setSuccessMessage('Branch created successfully');
      setShowModal(false);
      handleRefresh();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to create branch');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  }, [createBranch, handleRefresh]);

  const handleUpdateBranch = useCallback(async (formData) => {
    try {
      await updateBranch(editingBranch._id, formData);
      setSuccessMessage('Branch updated successfully');
      setShowModal(false);
      setEditingBranch(null);
      handleRefresh();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update branch');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  }, [updateBranch, editingBranch, handleRefresh]);

  const handleDeleteBranch = useCallback(async (branchId) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await deleteBranch(branchId);
        setSuccessMessage('Branch deleted successfully');
        handleRefresh();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setErrorMessage(error.message || 'Failed to delete branch');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  }, [deleteBranch, handleRefresh]);

  const handleEditBranch = useCallback((branch) => {
    setEditingBranch(branch);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingBranch(null);
  }, []);

  const filteredBranches = branches.filter((branch) => {
    const matchesSearch = branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || branch.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (branchesLoading) return <LoadingSpinner />;

  return (
    <div className="module-container">
      {successMessage && <SuccessAlert message={successMessage} />}
      {errorMessage && <ErrorAlert message={errorMessage} />}
      {branchesError && <ErrorAlert message={branchesError} />}

      <div className="module-header">
        <h2>Branch Management</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Branch
        </button>
      </div>

      <div className="module-controls">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search branches..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="filter-group">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="btn btn-secondary" onClick={handleRefresh} disabled={branchesLoading}>
            <FaSync /> Refresh
          </button>
        </div>
      </div>

      <div className="branches-grid">
        {filteredBranches.length > 0 ? (
          filteredBranches.map((branch) => (
            <div key={branch._id || branch.id} className="branch-card">
              <div className="card-header">
                <h3>{branch.name}</h3>
                <span className={`status ${branch.status}`}>{branch.status}</span>
              </div>
              <div className="card-body">
                <p><strong>Code:</strong> {branch.code}</p>
                <p><FaMapMarkerAlt /> {branch.city}, {branch.address}</p>
                <p><strong>Phone:</strong> {branch.phone}</p>
                <p><strong>Email:</strong> {branch.email}</p>
                <p><strong>Members:</strong> {branch.members || 0}</p>
                <p><strong>Trainers:</strong> {branch.trainers || 0}</p>
                <p><strong>Created:</strong> {formatDate(branch.createdAt)}</p>
              </div>
              <div className="card-actions">
                <button
                  className="btn-icon edit"
                  onClick={() => handleEditBranch(branch)}
                  disabled={updateLoading}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => handleDeleteBranch(branch._id || branch.id)}
                  disabled={deleteLoading}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">No branches found</div>
        )}
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage} of {Math.ceil(branchesPagination.total / 10)}</span>
        <button
          disabled={currentPage >= Math.ceil(branchesPagination.total / 10)}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {showModal && (
        <FormModal
          title={editingBranch ? 'Edit Branch' : 'Create Branch'}
          onClose={handleCloseModal}
          onSubmit={editingBranch ? handleUpdateBranch : handleCreateBranch}
          loading={editingBranch ? updateLoading : createLoading}
          fields={[
            { name: 'name', label: 'Branch Name', type: 'text', required: true },
            { name: 'code', label: 'Branch Code', type: 'text', required: true },
            { name: 'city', label: 'City', type: 'text', required: true },
            { name: 'address', label: 'Address', type: 'text', required: true },
            { name: 'phone', label: 'Phone', type: 'tel', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'capacity', label: 'Capacity', type: 'number', required: false },
            { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'], required: true },
          ]}
          initialData={editingBranch}
        />
      )}
    </div>
  );
};

export default BranchManagementModule;
