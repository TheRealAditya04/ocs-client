import { useEffect, useState } from "react";
import api from "../api";

export default function StudentDashboard() {
  const [profiles, setProfiles] = useState([]);
  const [applications, setApplications] = useState(null); // IMPORTANT
  const [error, setError] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const [p, a] = await Promise.all([
        api.get("/profiles"),
        api.get("/my-applications")
      ]);

      setProfiles(p.data.profiles || []);
      setApplications(a.data || []);
    } catch {
      setError("Failed to load data");
      setApplications([]); // prevent crash
    }
  }

  // 🛑 VERY IMPORTANT GUARD
  if (applications === null) {
    return <p style={{ padding: 30 }}>Loading...</p>;
  }

  const accepted = applications.find(a => a.status === "Accepted");
  const selectedOffers = applications.filter(a => a.status === "Selected");

  async function apply(profile_code) {
    await api.post("/apply", { profile_code });
    loadAll();
  }

  async function accept(profile_code) {
    await api.post("/application/accept", { profile_code });
    loadAll();
  }

  async function reject(profile_code) {
    await api.post("/application/reject", { profile_code });
    loadAll();
  }

  /* ================= ACCEPTED ================= */
  if (accepted) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <h2>🎉 Congratulations!</h2>
          <p>
            You have accepted an offer from{" "}
            <strong>{accepted.company_name}</strong>{" "}
            ({accepted.designation})
          </p>
        </div>
      </div>
    );
  }

  /* ================= SELECTED (MULTIPLE SAFE) ================= */
  if (selectedOffers.length > 0) {
    return (
      <div style={{ padding: 30 }}>
        <h2>🎯 You have {selectedOffers.length} selected offer(s)</h2>
        <p>Please choose one to accept:</p>

        <div style={styles.grid}>
          {selectedOffers.map(o => (
            <div key={o.profile_code} style={styles.card}>
              <h3>{o.company_name || "Company"}</h3>
              <p>{o.designation || "Role"}</p>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  style={styles.primaryBtn}
                  onClick={() => accept(o.profile_code)}
                >
                  Accept
                </button>

                <button
                  style={styles.secondaryBtn}
                  onClick={() => reject(o.profile_code)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ================= NORMAL / APPLIED ================= */
  return (
    <div style={{ padding: 30 }}>
      <h2>Available Profiles</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={styles.grid}>
        {profiles.map(p => {
          const app = applications.find(
            a => a.profile_code === p.profile_code
          );

          return (
            <div key={p.profile_code} style={styles.card}>
              <h3>{p.company_name}</h3>
              <p>{p.designation}</p>

              {app ? (
                <button style={styles.disabledBtn} disabled>
                  {app.status}
                </button>
              ) : (
                <button
                  style={styles.primaryBtn}
                  onClick={() => apply(p.profile_code)}
                >
                  Apply
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Styling ---------- */

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 80
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 20
  },
  card: {
    background: "#020617",
    padding: 24,
    borderRadius: 14,
    boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
    color: "#e5e7eb"
  },
  primaryBtn: {
    background: "#4f46e5",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer"
  },
  secondaryBtn: {
    background: "#374151",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer"
  },
  disabledBtn: {
    background: "#555",
    color: "#aaa",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8
  }
};
