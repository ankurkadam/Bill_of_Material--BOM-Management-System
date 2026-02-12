

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";

function Dashboard({ onUnauthorized, refreshTrigger }) {
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState("");
    const [productCode, setProductCode] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editName, setEditName] = useState("");
    const [editCode, setEditCode] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "" });

    const navigate = useNavigate();

    

    useEffect(() => {
        fetchProducts();
    }, [refreshTrigger]);
    useEffect(() => {
        loadUser();
    }, [refreshTrigger]);

    const loadUser = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:7777/api/user", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
    
        localStorage.setItem("username",data.username || "")
       
    };
    const username = localStorage.getItem("username");
   
    
    const fetchProducts = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:7777/api/products", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
            if (data.code === "PRODUCT_NOT_FOUND") {
                setToast({ message: "Product not found", type: "error" });
            } else if (data.code === "ACCESS_DENIED") {
                setToast({ message: "You don't have permission", type: "error" });
            } else if (data.code === "INVALID_COMPONENT") {
                setToast({ message: data.message || "Invalid component", type: "error" });
            } else {
                setToast({ message: data.message || "Operation failed", type: "error" });
            }
            return;
        }
        setProducts(data);


    };

    const handleCreateProduct = async () => {
        if (!productName || !productCode) return;
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:7777/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                productName,
                productCode,
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            if (data.code === "PRODUCT_CODE_EXISTS") {
                setToast({ message: "Product code already exists", type: "error" });
            } else if (data.code === "PLAN_LIMIT_REACHED") {
                setToast({ message: "Free plan limit reached. Upgrade required.", type: "error" });
            } else if (data.code === "PRODUCT_NOT_FOUND") {
                setToast({ message: "Product not found", type: "error" });
            } else if (data.code === "ACCESS_DENIED") {
                setToast({ message: "You don't have permission", type: "error" });
            } else {
                setToast({ message: data.message || "Operation failed", type: "error" });
            }
            return;
        }

        setProductName("");
        setProductCode("");
        setShowAddModal(false);
        fetchProducts();
        setToast({ message: "Product created successfully", type: "success" });

    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (!window.confirm("Delete this product?")) return;

        const response = await fetch(`http://localhost:7777/api/products/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok) {
            if (data.code === "PRODUCT_NOT_FOUND") {
                setToast({ message: "Product not found", type: "error" });
            } else if (data.code === "ACCESS_DENIED") {
                setToast({ message: "You don't have permission", type: "error" });
            }else if (data.code === "INVALID_HIERARCHY") {
                setToast({ message: "Invalid hierarchy structure", type: "error" });
            } else {
                setToast({ message: data.message || "Operation failed", type: "error" });
            }
            return;
        }
        setToast({ message: "Product Deleted successfully", type: "success" });

        fetchProducts();
    };

    const openEdit = (p) => {
        setEditingProduct(p);
        setEditName(p.productName);
        setEditCode(p.productCode);
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:7777/api/products/${editingProduct.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productName: editName,
                    productCode: editCode,
                }),
            }
        );
        const data = await response.json();

        if (!response.ok) {
            if (data.code === "PRODUCT_NOT_FOUND") {
                setToast({ message: "Product not found", type: "error" });
            } else if (data.code === "ACCESS_DENIED") {
                setToast({ message: "You don't have permission", type: "error" });
            } else {
                setToast({ message: data.message || "Operation failed", type: "error" });
            }
            return;
        }

        setEditingProduct(null);
        setToast({ message: "Product updated successfully", type: "success" });

        fetchProducts();
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <div style={styles.page}>
         
            <div style={styles.header}>
                <div style={styles.logoSection}>
                    <div style={styles.logoIcon}>📦</div>
                    <h2 style={styles.logoText}>BOM Manager</h2>
                </div>

                <div style={{ position: "relative" }}>
                    <div
                        style={styles.userButton}
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <div style={styles.userAvatar}>
                            {username ? username.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span style={styles.username}>{localStorage.getName || "User"}</span>
                        <span style={styles.dropdownArrow}>▼</span>
                    </div>

                    {showDropdown && (
                        <div style={styles.dropdown}>
                            <div style={styles.dropItem}>
                                <span style={styles.dropIcon}>👤</span>
                                <div onClick={() => navigate("/profile")}>Profile</div>
                            </div>
                            <div style={styles.dropItem}>
                                <span style={styles.dropIcon}>📋</span>
                                <div onClick={() => navigate("/plans")}>Subscription Plans</div>
                            </div>
                            <div style={styles.dropDivider}></div>
                            <div
                                style={{ ...styles.dropItem, ...styles.logoutItem }}
                                onClick={handleLogout}
                            >
                                <span style={styles.dropIcon}>🚪</span>
                                Logout
                            </div>
                        </div>
                    )}
                </div>
            </div>

          
            <div style={styles.content}>
                <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>Your Products</h3>
                    <p style={styles.sectionSubtitle}>Manage your bill of materials</p>
                </div>

              
                <div style={styles.grid}>
                
                    <div
                        style={styles.addCard}
                        onClick={() => setShowAddModal(true)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow = "0 12px 24px rgba(59, 130, 246, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.08)";
                        }}
                    >
                        <div style={styles.addIconCircle}>
                            <span style={styles.plusIcon}>+</span>
                        </div>
                        <p style={styles.addCardText}>Add New Product</p>
                        <p style={styles.addCardSubtext}>Create a new BOM</p>
                    </div>

                    {products.map((p) => (
                        <div
                            key={p.id}
                            style={styles.productCard}
                            onClick={() => navigate(`/workspace/${p.id}`)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-4px)";
                                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.1)";
                                const icons = e.currentTarget.querySelector('.action-icons');
                                if (icons) icons.style.opacity = "1";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)";
                                const icons = e.currentTarget.querySelector('.action-icons');
                                if (icons) icons.style.opacity = "0";
                            }}
                        >
                            <div className="action-icons" style={styles.cardActions}>
                                <button
                                    style={styles.actionButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openEdit(p);
                                    }}
                                    title="Edit"
                                >
                                    ✏️
                                </button>
                                <button
                                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(p.id);
                                    }}
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>

                            <div style={styles.productIcon}>📦</div>
                            <h3 style={styles.productName}>{p.productName}</h3>
                            <p style={styles.productCode}>{p.productCode}</p>
                            <div style={styles.cardFooter}>
                                <span style={styles.viewText}>Click to open →</span>
                            </div>
                        </div>
                    ))}
                </div>

            
                <div style={styles.recentSection}>
                    <h3 style={styles.recentTitle}>Recent Activity</h3>
                    <div style={styles.recentCard}>
                        <div style={styles.comingSoonBadge}>Coming Soon</div>
                        <p style={styles.recentText}>BOM Tree Snapshots & Activity Timeline</p>
                    </div>
                </div>
            </div>

           
            {editingProduct && (
                <div style={styles.modalOverlay} onClick={() => setEditingProduct(null)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Edit Product</h3>
                            <button
                                style={styles.closeButton}
                                onClick={() => setEditingProduct(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={styles.modalBody}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Product Name</label>
                                <input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    style={styles.input}
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Product Code</label>
                                <input
                                    value={editCode}
                                    onChange={(e) => setEditCode(e.target.value)}
                                    style={styles.input}
                                    placeholder="Enter product code"
                                />
                            </div>
                        </div>

                        <div style={styles.modalFooter}>
                            <button
                                style={styles.secondaryButton}
                                onClick={() => setEditingProduct(null)}
                            >
                                Cancel
                            </button>
                            <button
                                style={styles.primaryButton}
                                onClick={handleUpdate}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

         
            {showAddModal && (
                <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Create New Product</h3>
                            <button
                                style={styles.closeButton}
                                onClick={() => setShowAddModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={styles.modalBody}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Product Name</label>
                                <input
                                    placeholder="Enter product name"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Product Code</label>
                                <input
                                    placeholder="Enter product code"
                                    value={productCode}
                                    onChange={(e) => setProductCode(e.target.value)}
                                    style={styles.input}
                                />
                            </div>
                        </div>

                        <div style={styles.modalFooter}>
                            <button
                                style={styles.secondaryButton}
                                onClick={() => setShowAddModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                style={styles.primaryButton}
                                onClick={handleCreateProduct}
                            >
                                Create Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: "", type: "" })}
            />
        </div>



    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },

    header: {
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100,
    },

    logoSection: {
        display: "flex",
        alignItems: "center",
        gap: 12,
    },

    logoIcon: {
        fontSize: 28,
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
    },

    logoText: {
        margin: 0,
        fontSize: 24,
        fontWeight: 700,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },

    userButton: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 16px",
        background: "#f8fafc",
        borderRadius: 24,
        cursor: "pointer",
        transition: "all 0.2s ease",
        border: "1px solid #e2e8f0",
    },

    userAvatar: {
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: 14,
    },

    username: {
        fontWeight: 500,
        color: "#1e293b",
    },

    dropdownArrow: {
        fontSize: 10,
        color: "#64748b",
    },

    dropdown: {
        position: "absolute",
        top: 50,
        right: 0,
        background: "white",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
        borderRadius: 12,
        zIndex: 1000,
        minWidth: 180,
        overflow: "hidden",
        animation: "slideDown 0.2s ease",
    },

    dropItem: {
        padding: "12px 16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
        transition: "background 0.2s ease",
        color: "#334155",
        fontWeight: 500,
    },

    dropIcon: {
        fontSize: 16,
    },

    dropDivider: {
        height: 1,
        background: "#e2e8f0",
        margin: "4px 0",
    },

    logoutItem: {
        color: "#ef4444",
    },

    content: {
        padding: "32px",
        maxWidth: 1400,
        margin: "0 auto",
    },

    sectionHeader: {
        marginBottom: 32,
    },

    sectionTitle: {
        fontSize: 32,
        fontWeight: 700,
        color: "white",
        margin: 0,
        marginBottom: 8,
        textShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },

    sectionSubtitle: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.9)",
        margin: 0,
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 24,
        marginBottom: 40,
    },

    addCard: {
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        border: "2px dashed #3b82f6",
        borderRadius: 16,
        padding: 32,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        minHeight: 200,
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.08)",
    },

    addIconCircle: {
        width: 60,
        height: 60,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
    },

    plusIcon: {
        fontSize: 32,
        color: "white",
        fontWeight: 300,
    },

    addCardText: {
        fontSize: 16,
        fontWeight: 600,
        color: "#1e293b",
        margin: 0,
        marginBottom: 4,
    },

    addCardSubtext: {
        fontSize: 13,
        color: "#64748b",
        margin: 0,
    },

    productCard: {
        background: "white",
        borderRadius: 16,
        padding: 24,
        position: "relative",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    },

    cardActions: {
        position: "absolute",
        top: 12,
        right: 12,
        display: "flex",
        gap: 8,
        opacity: 0,
        transition: "opacity 0.2s ease",
    },

    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
        border: "none",
        background: "#f1f5f9",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        transition: "all 0.2s ease",
    },

    deleteButton: {
        background: "#fee2e2",
    },

    productIcon: {
        fontSize: 40,
        marginBottom: 16,
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
    },

    productName: {
        fontSize: 20,
        fontWeight: 600,
        color: "#1e293b",
        margin: 0,
        marginBottom: 8,
    },

    productCode: {
        fontSize: 14,
        color: "#64748b",
        margin: 0,
        marginBottom: 16,
        fontFamily: "monospace",
        background: "#f8fafc",
        padding: "4px 8px",
        borderRadius: 6,
        display: "inline-block",
    },

    cardFooter: {
        marginTop: "auto",
        paddingTop: 16,
        borderTop: "1px solid #f1f5f9",
    },

    viewText: {
        fontSize: 13,
        color: "#3b82f6",
        fontWeight: 500,
    },

    recentSection: {
        marginTop: 48,
    },

    recentTitle: {
        fontSize: 24,
        fontWeight: 700,
        color: "white",
        marginBottom: 16,
        textShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },

    recentCard: {
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        padding: 32,
        borderRadius: 16,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        position: "relative",
        overflow: "hidden",
    },

    comingSoonBadge: {
        display: "inline-block",
        padding: "6px 12px",
        background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        color: "white",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        marginBottom: 12,
    },

    recentText: {
        fontSize: 16,
        color: "#64748b",
        margin: 0,
    },

    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        animation: "fadeIn 0.2s ease",
    },

    modal: {
        background: "white",
        borderRadius: 20,
        width: "90%",
        maxWidth: 480,
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        animation: "slideUp 0.3s ease",
        overflow: "hidden",
    },

    modalHeader: {
        padding: "24px 28px",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    modalTitle: {
        margin: 0,
        fontSize: 20,
        fontWeight: 600,
        color: "#1e293b",
    },

    closeButton: {
        width: 32,
        height: 32,
        borderRadius: "50%",
        border: "none",
        background: "#f1f5f9",
        cursor: "pointer",
        fontSize: 18,
        color: "#64748b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
    },

    modalBody: {
        padding: "24px 28px",
    },

    inputGroup: {
        marginBottom: 20,
    },

    label: {
        display: "block",
        fontSize: 14,
        fontWeight: 500,
        color: "#475569",
        marginBottom: 8,
    },

    input: {
        width: "100%",
        padding: "12px 16px",
        fontSize: 15,
        border: "2px solid #e2e8f0",
        borderRadius: 10,
        outline: "none",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
        boxSizing: "border-box",
    },

    modalFooter: {
        padding: "20px 28px",
        background: "#f8fafc",
        display: "flex",
        gap: 12,
        justifyContent: "flex-end",
    },

    primaryButton: {
        padding: "12px 24px",
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        color: "white",
        border: "none",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
    },

    secondaryButton: {
        padding: "12px 24px",
        background: "white",
        color: "#64748b",
        border: "2px solid #e2e8f0",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
};

export default Dashboard;
