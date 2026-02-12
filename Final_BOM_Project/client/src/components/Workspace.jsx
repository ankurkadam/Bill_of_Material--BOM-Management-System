

import { useParams, useNavigate } from "react-router-dom";
import BomTreeTest from "./BomTreeTest";
import { useEffect, useState } from "react";

function Workspace({ onUnauthorized }) {
    const [productInfo, setProductInfo] = useState(null);
    const { productId } = useParams();
    const navigate = useNavigate();
    const [showDownload, setShowDownload] = useState(false);

    useEffect(() => {
        fetchProductInfo();
    }, [productId]);

    const fetchProductInfo = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:7777/api/bom/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
            setProductInfo(data.product);
        } catch (err) {
            console.error(err);
        }
    };

    const downloadPdf = () => {
        window.open(
            `http://localhost:5103/api/reports/bom/${productId}/pdf`,
            "_blank"
        );
    };

    const downloadExcel = () => {
        window.open(
            `http://localhost:5103/api/reports/bom/${productId}/excel`,
            "_blank"
        );
    };

    return (
        <div style={styles.page}>
      
            <div style={styles.header}>
                <div style={styles.logoSection} onClick={() => navigate("/dashboard")}>
                    <div style={styles.logoIcon}>📦</div>
                    <h2 style={styles.logoText}>BOM Manager</h2>
                </div>

                <div style={styles.userSection} onClick={() => navigate("/dashboard")}>
                    <div style={styles.userAvatar}>
                        {localStorage.getItem("username")?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span style={styles.username}>{localStorage.getItem("username")}</span>
                </div>
            </div>

      
            <div style={styles.subHeader}>
                <div style={styles.breadcrumb}>
                    <span 
                        style={styles.breadcrumbLink} 
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </span>
                    <span style={styles.breadcrumbSeparator}>/</span>
                    <span style={styles.breadcrumbCurrent}>Workspace</span>
                </div>

                <div style={styles.productSection}>
                    <div style={styles.productBadge}>
                        <span style={styles.productIcon}>📦</span>
                        <div>
                            <div style={styles.productName}>
                                {productInfo?.name || "Loading..."}
                            </div>
                            <div style={styles.productCode}>
                                {productInfo?.code || ""}
                            </div>
                        </div>
                    </div>

                    <div style={styles.actionButtons}>
                
                        <div style={{ position: "relative" }}>
                            <button
                                style={styles.actionBtn}
                                onClick={() => setShowDownload(!showDownload)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#f1f5f9";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "white";
                                }}
                            >
                                <span style={styles.btnIcon}>⬇️</span>
                                Download
                                <span style={styles.dropdownIndicator}>▼</span>
                            </button>

                            {showDownload && (
                                <div style={styles.downloadMenu}>
                                    <div
                                        style={styles.menuItem}
                                        onClick={() => {
                                            downloadPdf();
                                            setShowDownload(false);
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = "#f1f5f9";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "transparent";
                                        }}
                                    >
                                        <span style={styles.menuIcon}>📄</span>
                                        PDF Document
                                    </div>
                                    <div
                                        style={styles.menuItem}
                                        onClick={() => {
                                            downloadExcel();
                                            setShowDownload(false);
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = "#f1f5f9";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "transparent";
                                        }}
                                    >
                                        <span style={styles.menuIcon}>📊</span>
                                        Excel Spreadsheet
                                    </div>
                                </div>
                            )}
                        </div>

                        
                        <button
                            style={styles.versionsBtn}
                            onClick={() => navigate(`/workspace/${productId}/versions`)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.2)";
                            }}
                        >
                            <span style={styles.btnIcon}>🕐</span>
                            BOM Versions
                        </button>
                    </div>
                </div>
            </div>

           
            <div style={styles.workspaceContainer}>
                <BomTreeTest
                    productId={productId}
                    onUnauthorized={onUnauthorized}
                />
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
        cursor: "pointer",
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

    userSection: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
        padding: "8px 16px",
        borderRadius: 24,
        transition: "background 0.2s ease",
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

    subHeader: {
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        margin: "20px 32px",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    },

    breadcrumb: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 20,
        fontSize: 14,
    },

    breadcrumbLink: {
        color: "#3b82f6",
        cursor: "pointer",
        fontWeight: 500,
        transition: "color 0.2s ease",
    },

    breadcrumbSeparator: {
        color: "#cbd5e1",
    },

    breadcrumbCurrent: {
        color: "#64748b",
        fontWeight: 500,
    },

    productSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap",
    },

    productBadge: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 20px",
        background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        borderRadius: 12,
        border: "2px solid #bfdbfe",
    },

    productIcon: {
        fontSize: 32,
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
    },

    productName: {
        fontSize: 18,
        fontWeight: 700,
        color: "#1e293b",
        marginBottom: 2,
    },

    productCode: {
        fontSize: 13,
        color: "#64748b",
        fontFamily: "monospace",
        fontWeight: 500,
    },

    actionButtons: {
        display: "flex",
        gap: 12,
        alignItems: "center",
    },

    actionBtn: {
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

    btnIcon: {
        fontSize: 16,
    },

    dropdownIndicator: {
        fontSize: 10,
        opacity: 0.6,
    },

    downloadMenu: {
        position: "absolute",
        right: 0,
        top: 48,
        background: "white",
        border: "2px solid #e2e8f0",
        borderRadius: 10,
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
        zIndex: 100,
        minWidth: 200,
        overflow: "hidden",
        animation: "slideDown 0.2s ease",
    },

    menuItem: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        cursor: "pointer",
        transition: "background 0.2s ease",
        fontSize: 14,
        fontWeight: 500,
        color: "#475569",
    },

    menuIcon: {
        fontSize: 18,
    },

    versionsBtn: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 18px",
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        color: "white",
        border: "none",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
    },

    workspaceContainer: {
        margin: "0 32px 32px 32px",
    },
};

export default Workspace;
    