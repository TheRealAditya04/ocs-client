import { useState } from "react";
import api from "../api";
import { hashPassword } from "../auth";

export default function Login({ onLogin }) {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError(""); // clear old error

    try {
      const res = await api.post("/login", {
        userid,
        password_md5: hashPassword(password)
      });

      console.log("LOGIN RESPONSE:", res.data);

      localStorage.setItem("token", res.data.token);
      onLogin(res.data.role);

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      if (err.response) {
        setError(err.response.data.error || "Login failed");
      } else {
        setError("Server not reachable");
      }
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Login</h2>

      <input
        placeholder="User ID"
        value={userid}
        onChange={e => setUserid(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          {error}
        </p>
      )}
    </div>
  );
}
