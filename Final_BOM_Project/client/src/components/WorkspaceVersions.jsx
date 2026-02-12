

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BomTreeReadOnly from "./BomTreeReadOnly";

function WorkspaceVersions({ onUnauthorized }) {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [versions, setVersions] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [productInfo, setProductInfo] = useState(null);
    const [page, setPage] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        fetchVersions();
        fetchProductInfo();
    }, [productId]);

    const fetchVersions = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(
                `http://localhost:7777/api/bom/${productId}/versions`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const data = await res.json();
            setVersions(data);

           
            if (data.length > 0) {
                const latest = Math.max(...data.map((v) => v.versionNumber));
                setSelectedVersion(latest);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProductInfo = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:7777/api/bom/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            setProductInfo(data.product);
        } catch (err) {
            console.error(err);
        }
    };

    const restoreVersion = async () => {
        if (!selectedVersion) return;

        if (!window.confirm(`Restore version ${selectedVersion}? This will replace the current BOM.`)) return;

        const token = localStorage.getItem("token");

        try {
            await fetch(
                `http://localhost:7777/api/bom/${productId}/restore/${selectedVersion}`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            navigate(`/workspace/${productId}`);
        } catch (err) {
            console.error(err);
            alert("Restore failed");
        }
    };

    const start = page * pageSize;
    const visibleVersions = versions.slice(start, start + pageSize);
    const totalPages = Math.ceil(versions.length / pageSize);

    return (
        <div style={styles.page}>
            
            <div style={styles.header}>
                <div style={styles.logoSection} onClick={() => navigate("/dashboard")}>
                    <div style={styles.logoIcon}>📦</div>
                    <h2 style={styles.logoText}>BOM Manager</h2>
                </div>
                <div style={styles.userSection}>
                    <div style={styles.userAvatar}>
                        {localStorage.getItem("username")?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span style={styles.username}>{localStorage.getItem("username")}</span>
                </div>
            </div>

           
            <div style={styles.subHeader}>
                <div>
                    <div style={styles.breadcrumb}>
                        <span style={styles.breadcrumbLink} onClick={() => navigate("/dashboard")}>
                            Dashboard
                        </span>
                        <span style={styles.breadcrumbSeparator}>/</span>
                        <span 
                            style={styles.breadcrumbLink} 
                            onClick={() => navigate(`/workspace/${productId}`)}
                        >
                            Workspace
                        </span>
                        <span style={styles.breadcrumbSeparator}>/</span>
                        <span style={styles.breadcrumbCurrent}>Versions</span>
                    </div>
                    
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
                </div>

                <button
                    style={styles.backBtn}
                    onClick={() => navigate(`/workspace/${productId}`)}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateX(-4px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateX(0)";
                    }}
                >
                    <span style={styles.backArrow}>←</span>
                    Back to Workspace
                </button>
            </div>

      
            <div style={styles.content}>
            
                <div style={styles.sidebar}>
                    <div style={styles.sidebarHeader}>
                        <h3 style={styles.sidebarTitle}>Version History</h3>
                        <div style={styles.versionCount}>
                            {versions.length} {versions.length === 1 ? "version" : "versions"}
                        </div>
                    </div>

                    {versions.length > pageSize && (
                        <div style={styles.pagination}>
                            <button
                                disabled={page === 0}
                                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                                style={{
                                    ...styles.pageBtn,
                                    opacity: page === 0 ? 0.4 : 1,
                                    cursor: page === 0 ? "not-allowed" : "pointer",
                                }}
                            >
                                ↑ Previous
                            </button>
                            <span style={styles.pageInfo}>
                                Page {page + 1} of {totalPages}
                            </span>
                        </div>
                    )}

                    <div style={styles.versionList}>
                        {visibleVersions.length === 0 ? (
                            <div style={styles.noVersions}>
                                <span style={styles.noVersionsIcon}>🕐</span>
                                <p style={styles.noVersionsText}>No versions found</p>
                            </div>
                        ) : (
                            visibleVersions.map((v) => {
                                const isSelected = selectedVersion === v.versionNumber;
                                const isLatest = v.versionNumber === Math.max(...versions.map(ver => ver.versionNumber));

                                return (
                                    <div
                                        key={v.versionNumber}
                                        style={{
                                            ...styles.versionItem,
                                            background: isSelected ? "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)" : "white",
                                            border: isSelected ? "2px solid #3b82f6" : "2px solid #e2e8f0",
                                        }}
                                        onClick={() => setSelectedVersion(v.versionNumber)}
                                        onMouseEnter={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.background = "#f8fafc";
                                                e.currentTarget.style.borderColor = "#cbd5e1";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.background = "white";
                                                e.currentTarget.style.borderColor = "#e2e8f0";
                                            }
                                        }}
                                    >
                                        <div style={styles.versionNumber}>
                                            <span style={styles.versionIcon}>🕐</span>
                                            Version {v.versionNumber}
                                        </div>
                                        {isLatest && (
                                            <div style={styles.latestBadge}>Latest</div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {versions.length > pageSize && (
                        <div style={styles.pagination}>
                            <button
                                disabled={(page + 1) * pageSize >= versions.length}
                                onClick={() => setPage((p) => p + 1)}
                                style={{
                                    ...styles.pageBtn,
                                    opacity: (page + 1) * pageSize >= versions.length ? 0.4 : 1,
                                    cursor: (page + 1) * pageSize >= versions.length ? "not-allowed" : "pointer",
                                }}
                            >
                                ↓ Next
                            </button>
                        </div>
                    )}
                </div>

                
                <div style={styles.viewer}>
                    <div style={styles.viewerHeader}>
                        <div>
                            <h3 style={styles.viewerTitle}>
                                Historical BOM — Version {selectedVersion}
                            </h3>
                            <p style={styles.viewerSubtitle}>
                                Read-only view of this version's component structure
                            </p>
                        </div>

                        <button 
                            style={styles.restoreBtn} 
                            onClick={restoreVersion}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                                e.currentTarget.style.boxShadow = "0 6px 20px rgba(34, 197, 94, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(34, 197, 94, 0.2)";
                            }}
                        >
                            <span style={styles.restoreIcon}>↺</span>
                            Restore This Version
                        </button>
                    </div>

                    <div style={styles.viewerContent}>
                        {selectedVersion && (
                            <BomTreeReadOnly
                                productId={productId}
                                versionNumber={selectedVersion}
                                onUnauthorized={onUnauthorized}
                            />
                        )}
                    </div>
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

    header: {
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
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
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        flexWrap: "wrap",
        gap: 20,
    },

    breadcrumb: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
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
        fontSize: 28,
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
    },

    productName: {
        fontSize: 16,
        fontWeight: 700,
        color: "#1e293b",
    },

    productCode: {
        fontSize: 13,
        color: "#64748b",
        fontFamily: "monospace",
    },

    backBtn: {
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
        margin: "0 32px 32px 32px",
        display: "flex",
        gap: 20,
    },

    sidebar: {
        width: 280,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: 16,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 240px)",
    },

    sidebarHeader: {
        padding: 20,
        borderBottom: "2px solid #e2e8f0",
    },

    sidebarTitle: {
        margin: 0,
        fontSize: 18,
        fontWeight: 700,
        color: "#1e293b",
        marginBottom: 8,
    },

    versionCount: {
        fontSize: 13,
        color: "#64748b",
        fontWeight: 500,
    },

    versionList: {
        flex: 1,
        overflowY: "auto",
        padding: 12,
    },

    versionItem: {
        padding: 14,
        borderRadius: 10,
        cursor: "pointer",
        marginBottom: 8,
        transition: "all 0.2s ease",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    versionNumber: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 14,
        fontWeight: 600,
        color: "#1e293b",
    },

    versionIcon: {
        fontSize: 16,
    },

    latestBadge: {
        padding: "4px 10px",
        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        color: "white",
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 700,
    },

    noVersions: {
        textAlign: "center",
        padding: 40,
    },

    noVersionsIcon: {
        fontSize: 48,
        display: "block",
        marginBottom: 12,
    },

    noVersionsText: {
        fontSize: 14,
        color: "#64748b",
        margin: 0,
    },

    pagination: {
        padding: 12,
        borderTop: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },

    pageBtn: {
        padding: "8px 12px",
        background: "white",
        border: "2px solid #e2e8f0",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        color: "#475569",
        transition: "all 0.2s ease",
    },

    pageInfo: {
        fontSize: 12,
        color: "#64748b",
        textAlign: "center",
        fontWeight: 500,
    },

    viewer: {
        flex: 1,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: 16,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 240px)",
    },

    viewerHeader: {
        padding: 24,
        borderBottom: "2px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap",
    },

    viewerTitle: {
        margin: 0,
        fontSize: 20,
        fontWeight: 700,
        color: "#1e293b",
        marginBottom: 4,
    },

    viewerSubtitle: {
        margin: 0,
        fontSize: 14,
        color: "#64748b",
    },

    restoreBtn: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 20px",
        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        color: "white",
        border: "none",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(34, 197, 94, 0.2)",
    },

    restoreIcon: {
        fontSize: 18,
    },

    viewerContent: {
        flex: 1,
        overflowY: "auto",
        padding: 24,
    },
};

export default WorkspaceVersions;
