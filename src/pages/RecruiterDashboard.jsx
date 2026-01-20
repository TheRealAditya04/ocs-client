import { useEffect, useState } from "react";
import api from "../api";

const STATUS_OPTIONS = ["Applied", "Selected", "Not Selected"];

export default function RecruiterDashboard() {
  const [profiles, setProfiles] = useState([]);
  const [applications, setApplications] = useState([]);
  const [newProfile, setNewProfile] = useState({
    company_name: "",
    designation: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [p, a] = await Promise.all([
      api.get("/recruiter/profiles"),
      api.get("/recruiter/applications")
    ]);
    setProfiles(p.data);
    setApplications(a.data);
  }

  async function createProfile() {
    await api.post("/recruiter/create-profile", newProfile);
    setNewProfile({ company_name: "", designation: "" });
    loadData();
  }

  async function updateStatus(profile_code, entry_number, status) {
    await api.post("/application/change_status", {
      profile_code,
      entry_number,
      status
    });

    setApplications(prev =>
      prev.map(a =>
        a.profile_code === profile_code &&
        a.entry_number === entry_number
          ? { ...a, status }
          : a
      )
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>🏢 Recruiter Dashboard</h1>

        {/* CREATE PROFILE */}
        <div style={styles.card}>
          <h2>Create Job / Internship</h2>

          <input
            placeholder="Company Name"
            value={newProfile.company_name}
            onChange={e =>
              setNewProfile({ ...newProfile, company_name: e.target.value })
            }
          />
          <input
            placeholder="Designation"
            value={newProfile.designation}
            onChange={e =>
              setNewProfile({ ...newProfile, designation: e.target.value })
            }
          />

          <button style={styles.primaryBtn} onClick={createProfile}>
            Create Profile
          </button>
        </div>

        {/* PROFILES */}
        <div style={styles.card}>
          <h2>Your Profiles</h2>
          <ul>
            {profiles.map(p => (
              <li key={p.profile_code}>
                #{p.profile_code} — {p.company_name} ({p.designation})
              </li>
            ))}
          </ul>
        </div>

        {/* APPLICATIONS */}
        <div style={styles.card}>
          <h2>Applications</h2>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Role</th>
                <th>Status</th>
                <th>Change</th>
              </tr>
            </thead>

            <tbody>
              {applications.map(a => (
                <tr key={`${a.profile_code}-${a.entry_number}`}>
                  <td>{a.entry_number}</td>
                  <td>{a.designation}</td>
                  <td>
                    <span style={badge(a.status)}>{a.status}</span>
                  </td>
                  <td>
                    <select
                      value={a.status}
                      onChange={e =>
                        updateStatus(
                          a.profile_code,
                          a.entry_number,
                          e.target.value
                        )
                      }
                      style={styles.select}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
/* ---------- Styles & Small Components ---------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617, #020617)",
    color: "#e5e7eb",
    padding: 30
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 30
  },
  title: {
    fontSize: 32,
    fontWeight: 700
  },
  card: {
    background: "#020617",
    padding: 24,
    borderRadius: 16,
    boxShadow: "0 20px 60px rgba(0,0,0,0.7)"
  },
  primaryBtn: {
    marginTop: 10,
    background: "#4f46e5",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  select: {
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #334155",
    borderRadius: 8,
    padding: "6px 10px"
  }
};

function badge(status) {
  const colors = {
    Applied: "#38bdf8",
    Selected: "#a78bfa",
    "Not Selected": "#ef4444"
  };

  return {
    background: colors[status],
    color: "#020617",
    padding: "4px 10px",
    borderRadius: 999,
    fontWeight: 600,
    fontSize: 13
  };
}
