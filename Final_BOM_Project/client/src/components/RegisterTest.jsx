import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterTest() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setMessage("Creating account...");
    setStatus("");

    try {
      const res = await fetch("http://localhost:7777/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, name }),
      });


      let data = null;
      try {
        data = await res.json();
      } catch (e) {
 
      }

      if (res.status === 400 && data?.code === "USERNAME_EXISTS") {
        setMessage("Username already registered");
        setStatus("error");
        setLoading(false);
        return;
      }

      
      if (!res.ok) {
        setMessage(data?.message || "Registration failed");
        setStatus("error");
        setLoading(false);
        return;
      }

      setMessage("Account created successfully. Please login.");
      setStatus("success");
      setLoading(false);

      
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      console.error(err);
      setMessage("Server unreachable");
      setStatus("error");
      setLoading(false);
    }
  };


  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join us to get started</p>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <button
          style={{
            ...styles.primaryBtn,
            opacity: loading ? 0.7 : 1,
          }}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p style={styles.loginText}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

       
        {message && (
          <div
            style={{
              ...styles.toast,
              ...(status === "success" && styles.success),
              ...(status === "error" && styles.error),
              ...(status === "warning" && styles.warning),
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}


const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
    fontFamily: "Segoe UI, sans-serif",
  },

  card: {
    background: "#ffffff",
    padding: "34px",
    borderRadius: "16px",
    width: "340px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    textAlign: "center",
    animation: "fadeUp 0.6s ease",
  },

  title: {
    marginBottom: "6px",
    fontSize: "24px",
  },

  subtitle: {
    marginBottom: "22px",
    color: "#6b7280",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "14px",
    borderRadius: "8px",
    border: "1px solid #dbe2ff",
    outline: "none",
    fontSize: "14px",
  },

  primaryBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
    marginTop: "8px",
  },

  loginText: {
    marginTop: "18px",
    fontSize: "14px",
  },

  link: {
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: "bold",
  },

  toast: {
    marginTop: "18px",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    animation: "fadeUp 0.4s ease",
  },

  success: {
    background: "#ecfdf5",
    color: "#065f46",
    border: "1px solid #a7f3d0",
  },

  error: {
    background: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
  },

  warning: {
    background: "#fff7ed",
    color: "#9a3412",
    border: "1px solid #fed7aa",
  },
};

export default RegisterTest;
