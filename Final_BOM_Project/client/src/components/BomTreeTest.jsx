
import { useEffect, useState } from "react";
import BomNode from "./BomNode";
import AddComponentTest from "./AddComponentTest";

const flattenComponents = (nodes, list = []) => {
    nodes.forEach((node) => {
        list.push({
            componentId: node.componentId,
            name: node.name,
        });

        if (node.children && node.children.length > 0) {
            flattenComponents(node.children, list);
        }
    });

    return list;
};

function BomTreeTest({ productId, onUnauthorized }) {
    const [bom, setBom] = useState(null);
    const [message, setMessage] = useState("Loading BOM...");
    const [refreshKey, setRefreshKey] = useState(0);
    const [activeFormId, setActiveFormId] = useState(null);
    const [showRootAdd, setShowRootAdd] = useState(false);

    const allComponents = bom ? flattenComponents(bom.components) : [];

    useEffect(() => {
        fetchBom();
    }, [productId, refreshKey]);

    const fetchBom = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:7777/api/bom/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401) {
                onUnauthorized();
                return;
            }

            if (response.status === 403) {
                setMessage("Access denied");
                return;
            }

            const data = await response.json();
            setBom(data);
            setMessage("");
        } catch (err) {
            console.error(err);
            setMessage("Server error");
        }
    };

    const refreshBom = () => {
        setRefreshKey((prev) => prev + 1);
    };

    if (message) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>{message}</p>
            </div>
        );
    }

    if (!bom) return null;

    return (
        <div style={styles.container}>
            
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.iconWrapper}>
                        <span style={styles.headerIcon}>🌳</span>
                    </div>
                    <div>
                        <h3 style={styles.title}>BOM Tree Structure</h3>
                        <div style={styles.productInfo}>
                            <span style={styles.productLabel}>Product:</span>
                            <span style={styles.productName}>{bom.product.name}</span>
                            <span style={styles.productCode}>({bom.product.code})</span>
                        </div>
                    </div>
                </div>

                {bom.components.length > 0 && (
                    <div style={styles.stats}>
                        <div style={styles.statItem}>
                            <span style={styles.statValue}>{bom.components.length}</span>
                            <span style={styles.statLabel}>Root Components</span>
                        </div>
                        <div style={styles.statDivider}></div>
                        <div style={styles.statItem}>
                            <span style={styles.statValue}>{allComponents.length}</span>
                            <span style={styles.statLabel}>Total Components</span>
                        </div>
                    </div>
                )}
            </div>

           
            <div style={styles.treeContainer}>
                {bom.components.length === 0 && !showRootAdd ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📦</div>
                        <h4 style={styles.emptyTitle}>No Components Yet</h4>
                        <p style={styles.emptyText}>
                            Start building your BOM by adding your first component
                        </p>
                        <button
                            style={styles.emptyActionBtn}
                            onClick={() => setShowRootAdd(true)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                                e.currentTarget.style.boxShadow = "0 8px 20px rgba(59, 130, 246, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.2)";
                            }}
                        >
                            <span style={styles.btnIcon}>➕</span>
                            Add First Component
                        </button>
                    </div>
                ) : (
                    <>
                       
                        <div style={styles.componentsWrapper}>
                            {bom.components.map((component, index) => (
                                <div key={component.componentId} style={styles.componentWrapper}>
                                    <BomNode
                                        node={component}
                                        productId={productId}
                                        allComponents={allComponents}
                                        onAdded={refreshBom}
                                        onUnauthorized={onUnauthorized}
                                        activeFormId={activeFormId}
                                        setActiveFormId={setActiveFormId}
                                    />
                                </div>
                            ))}
                        </div>

                     
                        <div style={styles.addRootSection}>
                            {!showRootAdd ? (
                                <button
                                    style={styles.addRootBtn}
                                    onClick={() => setShowRootAdd(true)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#eff6ff";
                                        e.currentTarget.style.borderColor = "#3b82f6";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "white";
                                        e.currentTarget.style.borderColor = "#cbd5e1";
                                    }}
                                >
                                    <span style={styles.addIcon}>➕</span>
                                    Add Root Component
                                </button>
                            ) : (
                                <div style={styles.addFormWrapper}>
                                    <AddComponentTest
                                        productId={productId}
                                        parentId={null}
                                        onAdded={() => {
                                            setShowRootAdd(false);
                                            refreshBom();
                                        }}
                                        onUnauthorized={onUnauthorized}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        background: "white",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    },

    header: {
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        padding: 24,
        color: "white",
    },

    headerContent: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 16,
    },

    iconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 12,
        background: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    headerIcon: {
        fontSize: 32,
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
    },

    title: {
        margin: 0,
        fontSize: 22,
        fontWeight: 700,
        marginBottom: 6,
        textShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },

    productInfo: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 14,
        opacity: 0.95,
    },

    productLabel: {
        fontWeight: 500,
    },

    productName: {
        fontWeight: 600,
    },

    productCode: {
        opacity: 0.8,
        fontFamily: "monospace",
    },

    stats: {
        display: "flex",
        gap: 20,
        padding: "16px 20px",
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(10px)",
        borderRadius: 10,
    },

    statItem: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
    },

    statValue: {
        fontSize: 24,
        fontWeight: 700,
    },

    statLabel: {
        fontSize: 12,
        opacity: 0.9,
        fontWeight: 500,
    },

    statDivider: {
        width: 1,
        background: "rgba(255, 255, 255, 0.3)",
    },

    treeContainer: {
        padding: 24,
    },

    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        gap: 16,
    },

    spinner: {
        width: 40,
        height: 40,
        border: "4px solid #e2e8f0",
        borderTop: "4px solid #3b82f6",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },

    loadingText: {
        color: "#64748b",
        fontSize: 15,
        fontWeight: 500,
    },

    emptyState: {
        textAlign: "center",
        padding: "60px 20px",
    },

    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: 600,
        color: "#1e293b",
        margin: 0,
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 15,
        color: "#64748b",
        marginBottom: 24,
    },

    emptyActionBtn: {
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        color: "white",
        border: "none",
        padding: "14px 28px",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
    },

    btnIcon: {
        fontSize: 18,
    },

    componentsWrapper: {
        marginBottom: 20,
    },

    componentWrapper: {
        marginBottom: 8,
    },

    addRootSection: {
        marginTop: 24,
        paddingTop: 24,
        borderTop: "2px dashed #e2e8f0",
    },

    addRootBtn: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "14px 20px",
        background: "white",
        border: "2px dashed #cbd5e1",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 600,
        color: "#3b82f6",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },

    addIcon: {
        fontSize: 18,
    },

    addFormWrapper: {
        animation: "slideDown 0.3s ease",
    },
};

export default BomTreeTest;
