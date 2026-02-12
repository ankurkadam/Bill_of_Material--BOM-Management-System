
import { useEffect, useState } from "react";
import BomNodeReadOnly from "./BomNodeReadOnly";

function BomTreeReadOnly({ productId, versionNumber, onUnauthorized }) {
    const [bom, setBom] = useState(null);
    const [message, setMessage] = useState("Loading historical BOM...");

    useEffect(() => {
        fetchVersionBom();
    }, [productId, versionNumber]);

    const fetchVersionBom = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:7777/api/bom/${productId}/versions/${versionNumber}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
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
                    <div style={styles.versionBadge}>
                        <span style={styles.versionIcon}>🕐</span>
                        <span style={styles.versionText}>Version {bom.versionNumber}</span>
                    </div>
                    <div style={styles.productInfo}>
                        <span style={styles.productLabel}>Product:</span>
                        <span style={styles.productName}>{bom.productName}</span>
                        <span style={styles.productCode}>({bom.productCode})</span>
                    </div>
                </div>
            </div>

         
            <div style={styles.content}>
                {bom.bom.length === 0 ? (
                    <div style={styles.emptyState}>
                        <span style={styles.emptyIcon}>📭</span>
                        <p style={styles.emptyText}>No components in this version</p>
                    </div>
                ) : (
                    <div style={styles.treeWrapper}>
                        {bom.bom.map((component, index) => (
                            <BomNodeReadOnly
                                key={component.componentId || index}
                                node={component}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        background: "white",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },

    header: {
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        padding: 20,
        borderBottom: "2px solid #e2e8f0",
    },

    headerContent: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },

    versionBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
        borderRadius: 20,
        width: "fit-content",
        border: "2px solid #93c5fd",
    },

    versionIcon: {
        fontSize: 18,
    },

    versionText: {
        fontSize: 14,
        fontWeight: 700,
        color: "#1e40af",
    },

    productInfo: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 14,
        color: "#475569",
    },

    productLabel: {
        fontWeight: 500,
    },

    productName: {
        fontWeight: 600,
        color: "#1e293b",
    },

    productCode: {
        fontFamily: "monospace",
        color: "#64748b",
        fontSize: 13,
    },

    content: {
        padding: 20,
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
        padding: 40,
    },

    emptyIcon: {
        fontSize: 48,
        display: "block",
        marginBottom: 12,
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
    },

    emptyText: {
        fontSize: 15,
        color: "#64748b",
        margin: 0,
    },

    treeWrapper: {
        marginTop: 8,
    },
};

export default BomTreeReadOnly;
