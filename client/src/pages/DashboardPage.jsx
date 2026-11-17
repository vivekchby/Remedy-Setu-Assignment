import { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../services/api";

const STATUSES = ["New", "Contacted", "Quoted", "Won", "Lost"];

export default function DashboardPage() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/leads", { params: { search, status } });
      setLeads(response.data.leads);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("leadflow_token");
        window.location.href = "/login";
        return;
      }
      setError(err.response?.data?.message || "Could not load leads");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timer = setTimeout(fetchLeads, 250);
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  async function updateLead(id, updates) {
    setSavingId(id);
    setError("");
    try {
      const response = await api.patch(`/leads/${id}`, updates);
      setLeads((current) => current.map((lead) => lead._id === id ? response.data.lead : lead));
    } catch (err) {
      setError(err.response?.data?.message || "Could not update lead");
    } finally {
      setSavingId("");
    }
  }

  return (
    <>
      <Header dashboard />
      <main className="dashboard-shell">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">REMEDY SETU · SALES</p>
            <h1>Lead Dashboard</h1>
            <p className="muted">View and manage customer enquiries.</p>
          </div>
        </div>

        <section className="toolbar panel">
          <label className="search-field">
            Search leads
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or phone" />
          </label>
          <label className="filter-field">
            Filter by status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              {STATUSES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </section>

        {error && <p className="alert alert-error">{error}</p>}

        <section className="panel leads-panel">
          <div className="table-heading">
            <h2>All leads</h2>
            <span className="muted">{leads.length} result{leads.length === 1 ? "" : "s"}</span>
          </div>

          {loading ? (
            <p className="empty-state">Loading leads...</p>
          ) : leads.length === 0 ? (
            <p className="empty-state">No leads found.</p>
          ) : (
            <div className="lead-list">
              {leads.map((lead) => (
                <article className="lead-card" key={lead._id}>
                  <div className="lead-main">
                    <div className="lead-person">
                      <h3>{lead.name}</h3>
                      <span className={`status-pill status-${lead.status.toLowerCase()}`}>{lead.status}</span>
                    </div>
                    <p className="lead-contact">{lead.phone} · {lead.city}</p>
                    <p className="lead-detail">{lead.businessType} · {lead.productsOfInterest.join(", ")}</p>
                    <p className="lead-date">Submitted {new Date(lead.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="lead-actions">
                    <label>
                      Status
                      <select
                        value={lead.status}
                        disabled={savingId === lead._id}
                        onChange={(e) => updateLead(lead._id, { status: e.target.value })}
                      >
                        {STATUSES.map((item) => <option key={item}>{item}</option>)}
                      </select>
                    </label>
                    <label>
                      Notes
                      <textarea
                        rows="2"
                        defaultValue={lead.notes}
                        placeholder="Add sales notes..."
                        onBlur={(e) => {
                          if (e.target.value !== lead.notes) {
                            updateLead(lead._id, { notes: e.target.value });
                          }
                        }}
                      />
                    </label>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
