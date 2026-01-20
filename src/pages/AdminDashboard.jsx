import { useEffect, useState } from "react";
import api from "../api";

const STATUS_OPTIONS = [
  "Applied",
  "Selected",
  "Not Selected",
  "Accepted"
];

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAll() {
      try {
        const [u, p, a] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/profiles"),
          api.get("/admin/applications")
        ]);

        setUsers(u.data);
        setProfiles(p.data);
        setApplications(a.data);
      } catch {
        setError("Failed to load admin data");
      }
    }

    loadAll();
  }, []);

  async function updateStatus(profile_code, entry_number, status) {
    try {
      await api.post("/application/change_status", {
        profile_code,
        entry_number,
        status
      });

      setApplications(prev =>
        prev.map(app =>
          app.profile_code === profile_code &&
          app.entry_number === entry_number
            ? { ...app, status }
            : app
        )
      );
    } catch {
      alert("Failed to update status");
    }
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🛠 Admin Control Panel</h1>

      {error && <p style={styles.error}>{error}</p>}

      {/* SUMMARY STRIP */}
      <div style={styles.stats}>
        <Stat label="Users" value={users.length} />
        <Stat label="Profiles" value={profiles.length} />
        <Stat label="Applications" value={applications.length} />
      </div>

      {/* APPLICATIONS TABLE */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Applications</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>Change Status</th>
            </tr>
          </thead>

          <tbody>
            {applications.map(app => (
              <tr key={`${app.profile_code}-${app.entry_number}`}>
                <td>{app.entry_number}</td>
                <td>{app.company_name}</td>
                <td>{app.designation}</td>
                <td>
                  <span style={badge(app.status)}>
                    {app.status}
                  </span>
                </td>
                <td>
                  <select
                    value={app.status}
                    onChange={e =>
                      updateStatus(
                        app.profile_code,
                        app.entry_number,
                        e.target.value
                      )
                    }
                    style={styles.select}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Small Components ---------- */

function Stat({ label, value }) {
  return (
    <div style={styles.statBox}>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

/* ---------- Styling (Dark Admin Console) ---------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #020617)",
    color: "#e5e7eb",
    padding: 30
  },
  title: {
    marginBottom: 20,
    fontSize: 32,
    fontWeight: 700
  },
  sectionTitle: {
    marginBottom: 15
  },
  error: {
    color: "#f87171"
  },
  stats: {
    display: "flex",
    gap: 20,
    marginBottom: 30
  },
  statBox: {
    background: "#020617",
    borderRadius: 12,
    padding: 20,
    width: 160,
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
    textAlign: "center"
  },
  statValue: {
    fontSize: 28,
    fontWeight: 700
  },
  statLabel: {
    opacity: 0.7
  },
  card: {
    background: "#020617",
    borderRadius: 14,
    padding: 25,
    boxShadow: "0 20px 60px rgba(0,0,0,0.7)"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  select: {
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #334155",
    borderRadius: 6,
    padding: "4px 6px"
  }
};

function badge(status) {
  const colors = {
    Applied: "#38bdf8",
    Selected: "#a78bfa",
    Accepted: "#22c55e",
    "Not Selected": "#ef4444"
  };

  return {
    padding: "4px 10px",
    borderRadius: 999,
    background: colors[status],
    color: "#020617",
    fontWeight: 600,
    fontSize: 13
  };
}
