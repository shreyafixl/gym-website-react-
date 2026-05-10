import { useState } from "react";
import { FaStore, FaPlus, FaEdit, FaTrash, FaSearch, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useFormValidation } from "../hooks/useFormValidation";
import { useCRUDOperations } from "../hooks/useCRUDOperations";
import { required, minLength, phone, email } from "../utils/validationRules";
import "../styles/form-modal.css";
import "../styles/user-management.css";

export default function VendorsManagementPage() {
  const [vendors, setVendors] = useState([
    { id: 1, name: "FitEquip Pro", contact: "John Smith", phone: "+1-555-0101", email: "john@fitequip.com", city: "New York", status: "active", rating: 4.8 },
    { id: 2, name: "Gym Supplies Inc", contact: "Sarah Johnson", phone: "+1-555-0102", email: "sarah@gymsupplies.com", city: "Los Angeles", status: "active", rating: 4.5 },
    { id: 3, name: "Equipment World", contact: "Mike Davis", phone: "+1-555-0103", email: "mike@equipworld.com", city: "Chicago", status: "inactive", rating: 4.2 },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { formData, errors, setFormData, validateForm, resetForm } = useFormValidation({
    name: "",
    contact: "",
    phone: "",
    email: "",
    city: "",
    status: "active",
  }, {
    name: [required, minLength(3)],
    contact: [required],
    phone: [required, phone],
    email: [required, email],
    city: [required],
  });

  const PER_PAGE = 10;
  const filtered = vendors.filter(v =>
    (statusFilter === "all" || v.status === statusFilter) &&
    (v.name.toLowerCase().includes(search.toLowerCase()) ||
     v.contact.toLowerCase().includes(search.toLowerCase()) ||
     v.email.toLowerCase().includes(search.toLowerCase()))
  );
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleAdd = () => {
    resetForm();
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (vendor) => {
    setFormData(vendor);
    setEditingId(vendor.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingId) {
      setVendors(vendors.map(v => v.id === editingId ? { ...v, ...formData } : v));
    } else {
      setVendors([...vendors, { id: Date.now(), ...formData }]);
    }
    setShowForm(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      setVendors(vendors.filter(v => v.id !== id));
    }
  };

  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaStore style={{ marginRight: 8 }} />Vendors Management</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={handleAdd}><FaPlus style={{ marginRight: 6 }} />Add Vendor</button>
      </div>

      <div className="sa-filters">
        <div className="sa-search-wrap"><FaSearch className="sa-search-icon" /><input className="sa-input sa-input-search" placeholder="Search vendors..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
        {["all", "active", "inactive"].map(s => (
          <button key={s} className={`sa-filter-btn ${statusFilter === s ? "sa-filter-active" : ""}`} onClick={() => { setStatusFilter(s); setPage(1); }}>{s}</button>
        ))}
      </div>

      <div className="sa-card">
        {paged.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
            <FaStore style={{ fontSize: "2rem", marginBottom: 12, opacity: 0.5 }} />
            <p>No vendors found</p>
          </div>
        ) : (
          <table className="sa-table">
            <thead><tr><th>Name</th><th>Contact</th><th>Phone</th><th>Email</th><th>City</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {paged.map(v => (
                <tr key={v.id}>
                  <td><strong>{v.name}</strong></td>
                  <td>{v.contact}</td>
                  <td>{v.phone}</td>
                  <td style={{ fontSize: ".8rem", color: "var(--text-secondary)" }}>{v.email}</td>
                  <td><FaMapMarkerAlt style={{ marginRight: 4 }} />{v.city}</td>
                  <td><strong style={{ color: "#f97316" }}>★ {v.rating}</strong></td>
                  <td><span className={`sa-badge ${v.status === "active" ? "sa-green" : "sa-gray"}`}>{v.status}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="sa-link-btn" onClick={() => handleEdit(v)}><FaEdit /></button>
                      <button className="sa-link-btn" style={{ color: "#ef4444" }} onClick={() => handleDelete(v.id)}><FaTrash /></button>
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
              <h3>{editingId ? "Edit Vendor" : "Add Vendor"}</h3>
              <button className="sa-modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <div className="sa-modal-body">
              <div className="sa-form-group">
                <label>Vendor Name *</label>
                <input className="sa-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter vendor name" />
                {errors.name && <span className="sa-error">{errors.name}</span>}
              </div>
              <div className="sa-form-group">
                <label>Contact Person *</label>
                <input className="sa-input" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} placeholder="Enter contact name" />
                {errors.contact && <span className="sa-error">{errors.contact}</span>}
              </div>
              <div className="sa-form-group">
                <label>Phone *</label>
                <input className="sa-input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Enter phone number" />
                {errors.phone && <span className="sa-error">{errors.phone}</span>}
              </div>
              <div className="sa-form-group">
                <label>Email *</label>
                <input className="sa-input" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Enter email" />
                {errors.email && <span className="sa-error">{errors.email}</span>}
              </div>
              <div className="sa-form-group">
                <label>City *</label>
                <input className="sa-input" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="Enter city" />
                {errors.city && <span className="sa-error">{errors.city}</span>}
              </div>
              <div className="sa-form-group">
                <label>Status</label>
                <select className="sa-input" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button className="btn btn-primary sa-btn-sm" onClick={handleSave}>Save Vendor</button>
                <button className="btn btn-outline sa-btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
