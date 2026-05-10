import React, { useState, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSync, FaStar } from 'react-icons/fa';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import { useCreateTrainer, useUpdateTrainer, useDeleteTrainer } from '../../hooks/useSuperAdminMutations';
import LoadingSpinner from '../LoadingSpinner';
import ErrorAlert from '../ErrorAlert';
import SuccessAlert from '../SuccessAlert';
import FormModal from '../FormModal';
import { formatDate, formatPhoneNumber } from '../../utils/apiUtils';

const TrainerManagementModule = () => {
  const {
    trainers,
    trainersLoading,
    trainersError,
    trainersPagination,
    fetchTrainers,
  } = useSuperAdmin();

  const { mutate: createTrainer, loading: createLoading } = useCreateTrainer();
  const { mutate: updateTrainer, loading: updateLoading } = useUpdateTrainer();
  const { mutate: deleteTrainer, loading: deleteLoading } = useDeleteTrainer();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchTrainers(currentPage, 10, { specialization: filterSpecialization, status: filterStatus });
  }, [fetchTrainers, currentPage, filterSpecialization, filterStatus]);

  const handleCreateTrainer = useCallback(async (formData) => {
    try {
      await createTrainer(formData);
      setSuccessMessage('Trainer created successfully');
      setShowModal(false);
      handleRefresh();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to create trainer');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  }, [createTrainer, handleRefresh]);

  const handleUpdateTrainer = useCallback(async (formData) => {
    try {
      await updateTrainer(editingTrainer._id, formData);
      setSuccessMessage('Trainer updated successfully');
      setShowModal(false);
      setEditingTrainer(null);
      handleRefresh();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update trainer');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  }, [updateTrainer, editingTrainer, handleRefresh]);

  const handleDeleteTrainer = useCallback(async (trainerId) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        await deleteTrainer(trainerId);
        setSuccessMessage('Trainer deleted successfully');
        handleRefresh();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setErrorMessage(error.message || 'Failed to delete trainer');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  }, [deleteTrainer, handleRefresh]);

  const handleEditTrainer = useCallback((trainer) => {
    setEditingTrainer(trainer);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingTrainer(null);
  }, []);

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch = trainer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !filterSpecialization || trainer.specialization === filterSpecialization;
    const matchesStatus = !filterStatus || trainer.status === filterStatus;
    return matchesSearch && matchesSpecialization && matchesStatus;
  });

  if (trainersLoading) return <LoadingSpinner />;

  return (
    <div className="module-container">
      {successMessage && <SuccessAlert message={successMessage} />}
      {errorMessage && <ErrorAlert message={errorMessage} />}
      {trainersError && <ErrorAlert message={trainersError} />}

      <div className="module-header">
        <h2>Trainer Management</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Trainer
        </button>
      </div>

      <div className="module-controls">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search trainers..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="filter-group">
          <select value={filterSpecialization} onChange={(e) => setFilterSpecialization(e.target.value)}>
            <option value="">All Specializations</option>
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
            <option value="yoga">Yoga</option>
            <option value="pilates">Pilates</option>
            <option value="crossfit">CrossFit</option>
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="btn btn-secondary" onClick={handleRefresh} disabled={trainersLoading}>
            <FaSync /> Refresh
          </button>
        </div>
      </div>

      <div className="trainers-grid">
        {filteredTrainers.length > 0 ? (
          filteredTrainers.map((trainer) => (
            <div key={trainer._id || trainer.id} className="trainer-card">
              <div className="card-header">
                <h3>{trainer.name}</h3>
                <span className={`status ${trainer.status}`}>{trainer.status}</span>
              </div>
              <div className="card-body">
                <p><strong>Email:</strong> {trainer.email}</p>
                <p><strong>Phone:</strong> {formatPhoneNumber(trainer.phone)}</p>
                <p><strong>Specialization:</strong> {trainer.specialization}</p>
                <p><strong>Experience:</strong> {trainer.experience} years</p>
                <p><strong>Certification:</strong> {trainer.certification}</p>
                <p><strong>Members:</strong> {trainer.members || 0}</p>
                <p className="rating">
                  <FaStar /> {trainer.rating || 0} / 5
                </p>
                <p><strong>Joined:</strong> {formatDate(trainer.joinDate)}</p>
              </div>
              <div className="card-actions">
                <button
                  className="btn-icon edit"
                  onClick={() => handleEditTrainer(trainer)}
                  disabled={updateLoading}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => handleDeleteTrainer(trainer._id || trainer.id)}
                  disabled={deleteLoading}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">No trainers found</div>
        )}
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage} of {Math.ceil(trainersPagination.total / 10)}</span>
        <button
          disabled={currentPage >= Math.ceil(trainersPagination.total / 10)}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {showModal && (
        <FormModal
          title={editingTrainer ? 'Edit Trainer' : 'Create Trainer'}
          onClose={handleCloseModal}
          onSubmit={editingTrainer ? handleUpdateTrainer : handleCreateTrainer}
          loading={editingTrainer ? updateLoading : createLoading}
          fields={[
            { name: 'name', label: 'Full Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Phone', type: 'tel', required: true },
            { name: 'specialization', label: 'Specialization', type: 'select', options: ['cardio', 'strength', 'yoga', 'pilates', 'crossfit'], required: true },
            { name: 'experience', label: 'Experience (years)', type: 'number', required: true },
            { name: 'certification', label: 'Certification', type: 'text', required: false },
            { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'], required: true },
          ]}
          initialData={editingTrainer}
        />
      )}
    </div>
  );
};

export default TrainerManagementModule;
