import { useState } from "react";
import { FaWrench, FaPlus, FaEdit, FaTrash, FaSearch, FaCalendarAlt, FaTools } from "react-icons/fa";
import { useFormValidation } from "../hooks/useFormValidation";
import { required, number } from "../utils/validationRules";
import "../styles/form-modal.css";
import "../styles/user-management.css";

export default function MaintenanceManagementPage() {
  const [maintenance, setMaintenance] = useState([
    { id: 1, equipment: "Treadmill A1", type: "Preventive", status: "completed", date: "2026-05-05", nextDue: "2026-06-05", technician: "John Tech", cost: 150 },
    { id: 2, equipment: "Bench Press B2", type: "Repair", status: "in-progress", date: "2026-05-06", nextDue: "2026-08-06", technician: "Mike Tech", cost: 250 },
    { id: 3, equipment: "Dumbbells Set", type: "Inspection", status: "pending", date: "2026-05-10", nextDue: "2026-05-15", technician: "Unassigned", cost: 0 },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { formData, errors, setFormData, validateForm, resetForm } = useFormValidation({
    equipment: "",
    type: "Preventive",
    status: "pending",
    date: "",
    nextDue: "",
    technician: "",
    cost: "",
  }, {
    equipment: [required],
    date: [required],
    technician: [required],
    cost: [required, number],
  });

  const PER_PAGE = 10;
  const filtered = maintenance.filter(m =>
    (statusFilter === "all" || m.status === statusFilter) &&
    (m.equipment.toLowerCase().includes(search.toLowerCase()) ||
     m.technician.toLowerCase().includes(search.toLowerCase()))
  );
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleAdd = () => {
    resetForm();
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingId) {
      setMaintenance(maintenance.map(m => m.id === editingId ? { ...m, ...formData, cost: Number(formData.cost) } : m));
    } else {
      setMaintenance([...maintenance, { id: Date.now(), ...formData, cost: Number(formData.cost) }]);
    }
    setShowForm(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this maintenance record?")) {
      setMaintenance(maintenance.filter(m => m.id !== id));
    }
  };

  const getStatusColor = (status) => {
    const colors = { completed: "sa-green", "in-progress": "sa-yellow", pending: "sa-red" };
    return colors[status] || "sa-gray";
  };

  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaWrench style={{ marginRight: 8 }} />Maintenance Management</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={handleAdd}><FaPlus style={{ marginRight: 6 }} />Schedule Maintenance</button>
      </div>

      <div className="sa-filters">
        <div className="sa-search-wrap"><FaSearch className="sa-search-icon" /><input className="sa-input sa-input-search" placeholder="Search equipment or technician..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
        {["all", "pending", "in-progress", "completed"].map(s => (
          <button key={s} className={`sa-filter-btn ${statusFilter === s ? "sa-filter-active" : ""}`} onClick={() => { setStatusFilter(s); setPage(1); }}>{s}</button>
        ))}
      </div>

      <div className="sa-card">
        {paged.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
            <FaWrench style={{ fontSize: "2rem", marginBottom: 12, opacity: 0.5 }} />
            <p>No maintenance records found</p>
          </div>
        ) : (
          <table className="sa-table">
            <thead><tr><th>Equipment</th><th>Type</th><th>Technician</th><th>Date</th><th>Next Due</th><th>Cost</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {paged.map(m => (
                <tr key={m.id}>
                  <td><strong>{m.equipment}</strong></td>
                  <td><span className="sa-badge sa-blue">{m.type}</span></td>
                  <td>{m.technician}</td>
                  <td style={{ fontSize: ".8rem", color: "var(--text-secondary)" }}><FaCalendarAlt style={{ marginRight: 4 }} />{m.date}</td>
                  <td style={{ fontSize: ".8rem", color: "var(--text-secondary)" }}>{m.nextDue}</td>
                  <td><strong>${m.cost}</strong></td>
                  <td><span className={`sa-badge ${getStatusColor(m.status)}`}>{m.status}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="sa-link-btn" onClick={() => handleEdit(m)}><FaEdit /></button>
                      <button className="sa-link-btn" style={{ color: "#ef4444" }} onClick={() => handleDelete(m.id)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {filtered.length > PER_PAGE && (
          <div className="sa-pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="sa-page-btn">‹</button>
            {Array.from({ length: Math.ceil(filtered.length / PER_PAGE) }, (_, i) => (
              <button key={i} className={`sa-page-btn ${page === i + 1 ? "sa-page-active" : ""}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
            <button disabled={page === Math.ceil(filtered.length / PER_PAGE)} onClick={() => setPage(page + 1)} className="sa-page-btn">›</button>
          </div>
        )}
      </div>

      {showForm && (
        <div className="sa-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="sa-modal" onClick={e => e.stopPropagation()}>
            <div className="sa-modal-head">
              <h3>{editingId ? "Edit Maintenance" : "Schedule Maintenance"}</h3>
              <button className="sa-modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <div className="sa-modal-body">
              <div className="sa-form-group">
                <label>Equipment *</label>
                <input className="sa-input" value={formData.equipment} onChange={e => setFormData({ ...formData, equipment: e.target.value })} placeholder="Enter equipment name" />
                {errors.equipment && <span className="sa-error">{errors.equipment}</span>}
              </div>
              <div className="sa-form-group">
                <label>Maintenance Type</label>
                <select className="sa-input" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                  <option value="Preventive">Preventive</option>
                  <option value="Repair">Repair</option>
                  <option value="Inspection">Inspection</option>
                </select>
              </div>
              <div className="sa-form-group">
                <label>Technician *</label>
                <input className="sa-input" value={formData.technician} onChange={e => setFormData({ ...formData, technician: e.target.value })} placeholder="Enter technician name" />
                {errors.technician && <span className="sa-error">{errors.technician}</span>}
              </div>
              <div className="sa-form-group">
                <label>Maintenance Date *</label>
                <input className="sa-input" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                {errors.date && <span className="sa-error">{errors.date}</span>}
              </div>
              <div className="sa-form-group">
                <label>Next Due Date</label>
                <input className="sa-input" type="date" value={formData.nextDue} onChange={e => setFormData({ ...formData, nextDue: e.target.value })} />
              </div>
              <div className="sa-form-group">
                <label>Cost ($) *</label>
                <input className="sa-input" type="number" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} placeholder="Enter cost" />
                {errors.cost && <span className="sa-error">{errors.cost}</span>}
              </div>
              <div className="sa-form-group">
                <label>Status</label>
                <select className="sa-input" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button className="btn btn-primary sa-btn-sm" onClick={handleSave}>Save Maintenance</button>
                <button className="btn btn-outline sa-btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
