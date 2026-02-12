
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:7777/api/user", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
       
    };

    const updateUser = async () => {
        const token = localStorage.getItem("token");

        await fetch("http://localhost:7777/api/user", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, email }),
        });

        setEditMode(false);
        loadUser();
    };

    if (!user) {
        return (
            <div style={styles.page}>
                <div style={styles.loadingContainer}>
                    <div style={styles.spinner}></div>
                    <p style={styles.loadingText}>Loading profile...</p>
                </div>
            </div>
        );
    }

    const isPremium = user.plan === "PREMIUM";

    return (
        <div style={styles.page}>
      
            <div style={styles.header}>
                <div style={styles.logoSection} onClick={() => navigate("/dashboard")}>
                    <span style={styles.logoIcon}>📦</span>
                    <h2 style={styles.logoText}>BOM Manager</h2>
                </div>

                <button
                    style={styles.backButton}
                    onClick={() => navigate("/dashboard")}
                >
                    <span style={styles.backArrow}>←</span>
                    Back to Dashboard
                </button>
            </div>

   
            <div style={styles.content}>
                
                <div style={styles.profileCard}>
                    
                    <div style={styles.profileHeader}>
                        <div style={styles.avatarWrapper}>
                            <div style={styles.avatar}>
                                <span style={styles.avatarText}>
                                    {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div style={styles.planBadge}>
                                <span style={isPremium ? styles.premiumIcon : styles.freeIcon}>
                                    {isPremium ? "⭐" : "🆓"}
                                </span>
                                <span style={styles.planText}>{user.plan}</span>
                            </div>
                        </div>

                        {!editMode && (
                            <button
                                style={styles.editButton}
                                onClick={() => setEditMode(true)}
                            >
                                <span style={styles.editIcon}>✏️</span>
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div style={styles.divider}></div>

                    {editMode ? (
                        <div style={styles.editForm}>
                            <h3 style={styles.formTitle}>Edit Profile</h3>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Name</label>
                                <input
                                    style={styles.input}
                                    value={name}
                                    placeholder="Enter your name"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email</label>
                                <input
                                    style={styles.input}
                                    value={email}
                                    placeholder="Enter your email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                />
                            </div>

                            <div style={styles.formActions}>
                                <button
                                    style={styles.cancelButton}
                                    onClick={() => {
                                        setEditMode(false);
                                        setName(user.name || "");
                                        setEmail(user.email || "");
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    style={styles.saveButton}
                                    onClick={updateUser}
                                >
                                    <span>✓</span>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={styles.profileDetails}>
                            <div style={styles.detailRow}>
                                <div style={styles.detailIcon}>👤</div>
                                <div style={styles.detailContent}>
                                    <div style={styles.detailLabel}>Name</div>
                                    <div style={styles.detailValue}>{user.name || "-"}</div>
                                </div>
                            </div>

                            <div style={styles.detailRow}>
                                <div style={styles.detailIcon}>🏷️</div>
                                <div style={styles.detailContent}>
                                    <div style={styles.detailLabel}>Username</div>
                                    <div style={styles.detailValue}>{user.username}</div>
                                </div>
                            </div>

                            <div style={styles.detailRow}>
                                <div style={styles.detailIcon}>📧</div>
                                <div style={styles.detailContent}>
                                    <div style={styles.detailLabel}>Email</div>
                                    <div style={styles.detailValue}>{user.email || "-"}</div>
                                </div>
                            </div>

                            <div style={styles.detailRow}>
                                <div style={styles.detailIcon}>📊</div>
                                <div style={styles.detailContent}>
                                    <div style={styles.detailLabel}>Subscription Plan</div>
                                    <div style={styles.detailValue}>
                                        <span style={isPremium ? styles.premiumBadge : styles.freeBadge}>
                                            {user.plan}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {!isPremium && (
                                <div style={styles.upgradeSection}>
                                    <div style={styles.upgradePrompt}>
                                        <span style={styles.upgradeIcon}>🚀</span>
                                        <div>
                                            <h4 style={styles.upgradeTitle}>Upgrade to Premium</h4>
                                            <p style={styles.upgradeText}>
                                                Unlock unlimited products, exports, and more!
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        style={styles.upgradeButton}
                                        onClick={() => navigate("/plans")}
                                    >
                                        View Plans →
                                    </button>
                                </div>
                            )}

                            {isPremium && (
                                <div style={styles.premiumSection}>
                                    <span style={styles.premiumCheckIcon}>✓</span>
                                    <span style={styles.premiumText}>Premium Member</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },

    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 16,
    },

    spinner: {
        width: 40,
        height: 40,
        border: "4px solid rgba(255, 255, 255, 0.3)",
        borderTop: "4px solid white",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },

    loadingText: {
        color: "white",
        fontSize: 16,
        fontWeight: 500,
    },

    header: {
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
    },

    logoSection: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
    },

    logoIcon: {
        fontSize: 28,
    },

    logoText: {
        margin: 0,
        fontSize: 22,
        fontWeight: 700,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },

    backButton: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 18px",
        background: "white",
        border: "2px solid #e2e8f0",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        color: "#475569",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },

    backArrow: {
        fontSize: 16,
    },

    content: {
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 80px)",
    },

    profileCard: {
        background: "white",
        borderRadius: 20,
        padding: 32,
        width: "100%",
        maxWidth: 520,
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
    },

    profileHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },

    avatarWrapper: {
        display: "flex",
        alignItems: "center",
        gap: 16,
    },

    avatar: {
        width: 72,
        height: 72,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
    },

    avatarText: {
        fontSize: 32,
        fontWeight: 700,
        color: "white",
    },

    planBadge: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 14px",
        borderRadius: 20,
        background: "#f8fafc",
        border: "2px solid #e2e8f0",
    },

    premiumIcon: {
        fontSize: 16,
    },

    freeIcon: {
        fontSize: 16,
    },

    planText: {
        fontSize: 13,
        fontWeight: 700,
        color: "#475569",
    },

    editButton: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "10px 18px",
        background: "#f8fafc",
        border: "2px solid #e2e8f0",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        color: "#475569",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },

    editIcon: {
        fontSize: 16,
    },

    divider: {
        height: 2,
        background: "linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%)",
        marginBottom: 24,
    },

    profileDetails: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },

    detailRow: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        background: "#f8fafc",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
    },

    detailIcon: {
        fontSize: 22,
        width: 44,
        height: 44,
        borderRadius: 10,
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid #e2e8f0",
    },

    detailContent: {
        flex: 1,
    },

    detailLabel: {
        fontSize: 12,
        color: "#64748b",
        fontWeight: 600,
        marginBottom: 4,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },

    detailValue: {
        fontSize: 16,
        color: "#1e293b",
        fontWeight: 600,
    },

    premiumBadge: {
        display: "inline-block",
        padding: "4px 12px",
        background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        color: "white",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 700,
    },

    freeBadge: {
        display: "inline-block",
        padding: "4px 12px",
        background: "#e2e8f0",
        color: "#64748b",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 700,
    },

    upgradeSection: {
        marginTop: 8,
        padding: 20,
        background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        borderRadius: 12,
        border: "2px solid #bfdbfe",
    },

    upgradePrompt: {
        display: "flex",
        gap: 12,
        marginBottom: 16,
    },

    upgradeIcon: {
        fontSize: 28,
    },

    upgradeTitle: {
        margin: 0,
        fontSize: 16,
        fontWeight: 700,
        color: "#1e40af",
        marginBottom: 4,
    },

    upgradeText: {
        margin: 0,
        fontSize: 14,
        color: "#1e40af",
        opacity: 0.8,
    },

    upgradeButton: {
        width: "100%",
        padding: "12px 20px",
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        color: "white",
        border: "none",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
    },

    premiumSection: {
        marginTop: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "16px",
        background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
        borderRadius: 12,
        border: "2px solid #86efac",
    },

    premiumCheckIcon: {
        fontSize: 20,
        color: "#16a34a",
        fontWeight: "bold",
    },

    premiumText: {
        fontSize: 16,
        color: "#166534",
        fontWeight: 700,
    },

    editForm: {
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },

    formTitle: {
        margin: 0,
        fontSize: 20,
        fontWeight: 700,
        color: "#1e293b",
        marginBottom: 4,
    },

    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },

    label: {
        fontSize: 13,
        fontWeight: 600,
        color: "#475569",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },

    input: {
        padding: "12px 16px",
        fontSize: 15,
        border: "2px solid #e2e8f0",
        borderRadius: 10,
        outline: "none",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
    },

    formActions: {
        display: "flex",
        gap: 12,
        marginTop: 8,
    },

    cancelButton: {
        flex: 1,
        padding: "12px 20px",
        background: "white",
        color: "#64748b",
        border: "2px solid #e2e8f0",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
    },

    saveButton: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "12px 20px",
        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        color: "white",
        border: "none",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(34, 197, 94, 0.2)",
    },
};

export default Profile;
