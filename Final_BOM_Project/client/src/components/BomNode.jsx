
import { useState } from "react";
import AddComponentTest from "./AddComponentTest";
import Toast from "./Toast";

function BomNode({
    node,
    productId,
    allComponents = [],
    onAdded,
    onUnauthorized,
    level = 0,
    activeFormId,
    setActiveFormId,
}) {
    const [showAddChild, setShowAddChild] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(node.name);
    const [quantity, setQuantity] = useState(node.quantity);
    const [message, setMessage] = useState("");
    const [parentId, setParentId] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "" });

    const updateComponent = async () => {
        setMessage("Updating...");

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:7777/api/component/${node.componentId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        componentName: name,
                        quantity: quantity,
                        parent_component_id: parentId || null,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (data.code === "PLAN_LIMIT_REACHED") {
                    setToast({ message: "Free plan limit reached. Upgrade required.", type: "error" });
                } else if (data.code === "ACCESS_DENIED") {
                    setToast({ message: "You don't have permission", type: "error" });
                } else if (data.code === "INVALID_COMPONENT") {
                    setToast({ message: data.message || "Invalid component", type: "error" });
                } else if (data.code === "INVALID_HIERARCHY") {
                    setToast({ message: "Invalid hierarchy structure", type: "error" });
                } else {
                    setToast({ message: data.message || "Operation failed", type: "error" });
                }
                return;
            }

            if (response.status === 401) {
                onUnauthorized();
                return;
            }

            if (response.status === 403) {
                setMessage("Access denied");
                return;
            }

            setEditMode(false);


            setMessage("");
            onAdded();
            setToast({ message: "Component updated successfully", type: "success" });
        } catch (err) {
            console.error(err);
            setMessage("Server error");
        }
    };

    const deleteComponent = async () => {
        if (!window.confirm("Delete this component?")) return;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:7777/api/component/${node.componentId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            
            let data = null;
            try {
                data = await response.json();
            } catch (e) {
                
            }
         
            if (!response.ok) {
                if (data.code === "PRODUCT_CODE_EXISTS") {
                    setToast({ message: "Product code already exists", type: "error" });
                } else if (data.code === "PLAN_LIMIT_REACHED") {
                    setToast({ message: "Free plan limit reached. Upgrade required.", type: "error" });
                } else if (data.code === "PRODUCT_NOT_FOUND") {
                    setToast({ message: "Product not found", type: "error" });
                } else if (data.code === "ACCESS_DENIED") {
                    setToast({ message: "You don't have permission", type: "error" });
                } else if (data.code === "INVALID_COMPONENT") {
                    setToast({ message: data.message || "Invalid component", type: "error" });
                } else if (data.code === "INVALID_HIERARCHY") {
                    setToast({ message: "Invalid hierarchy structure", type: "error" });
                } else {
                    setToast({ message: data.message || "Operation failed", type: "error" });
                }
                return;
            }
            
            if (response.status === 401) {
                onUnauthorized();
                return;
            }





          
            onAdded();
            setToast({ message: "Component deleted successfully", type: "success" });

        } catch (err) {
            console.error(err);
            setToast({ message: "Invalid Delete Operation", type: "error" });
        }
    };

    const levelColor = level === 0 ? "#3b82f6" : level === 1 ? "#8b5cf6" : level === 2 ? "#ec4899" : "#f59e0b";
    const levelBg = level === 0 ? "#eff6ff" : level === 1 ? "#f5f3ff" : level === 2 ? "#fdf2f8" : "#fff7ed";

    return (
        <div
            style={{
                ...styles.nodeContainer,
                marginLeft: level * 24,
                borderLeft: level > 0 ? `2px solid ${levelColor}20` : "none",
                paddingLeft: level > 0 ? 16 : 0,
            }}
        >
            {editMode ? (
                <div style={styles.editForm}>
                    <div style={styles.editHeader}>
                        <span style={styles.editIcon}>✏️</span>
                        <h4 style={styles.editTitle}>Edit Component</h4>
                    </div>

                    <div style={styles.formGrid}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Component Name</label>
                            <input
                                value={name ?? ""}
                                onChange={(e) => setName(e.target.value)}
                                style={styles.input}
                                placeholder="Enter name"
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                style={styles.qtyInput}
                            />
                        </div>

                        <div style={{ ...styles.inputGroup, gridColumn: "1 / -1" }}>
                            <label style={styles.label}>Parent Component</label>
                            <select
                                value={parentId}
                                onChange={(e) => setParentId(e.target.value)}
                                style={styles.dropdown}
                            >
                                <option value="">(Root Component)</option>
                                {allComponents
                                    .filter((c) => c.componentId !== node.componentId)
                                    .map((c) => (
                                        <option key={c.componentId} value={c.componentId}>
                                            {c.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div style={styles.formActions}>
                        <button
                            onClick={() => {
                                setEditMode(false);
                                setActiveFormId(null);
                            }}
                            style={styles.cancelBtn}
                        >
                            Cancel
                        </button>
                        <button onClick={updateComponent} style={styles.saveBtn}>
                            <span>✓</span> Save Changes
                        </button>
                    </div>

                    {message && (
                        <div style={styles.statusMessage}>
                            {message}
                        </div>
                    )}
                </div>
            ) : (
                <div
                    style={{
                        ...styles.nodeCard,
                        background: levelBg,
                        borderLeft: `4px solid ${levelColor}`,
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div style={styles.nodeContent}>
                        <div style={styles.nodeInfo}>
                            <span style={{ ...styles.nodeIcon, color: levelColor }}>
                                {level === 0 ? "📦" : "🔧"}
                            </span>
                            <div style={styles.nodeDetails}>
                                <span style={styles.nodeName}>{node.name}</span>
                                <span style={styles.nodeQty}>Quantity: {node.quantity}</span>
                            </div>
                        </div>

                        <div style={{
                            ...styles.nodeActions,
                            opacity: isHovered ? 1 : 0,
                        }}>
                            <button
                                style={{ ...styles.actionBtn, ...styles.editActionBtn }}
                                onClick={() => {
                                    setEditMode(true);
                                    setShowAddChild(false);
                                    setActiveFormId(node.componentId);
                                }}
                                title="Edit component"
                            >
                                <span>✏️</span>
                            </button>

                            <button
                                style={{ ...styles.actionBtn, ...styles.addActionBtn }}
                                onClick={() => {
                                    setShowAddChild(true);
                                    setEditMode(false);
                                    setActiveFormId(node.componentId + "_add");
                                }}
                                title="Add child component"
                            >
                                <span>➕</span>
                            </button>

                            <button
                                style={{ ...styles.actionBtn, ...styles.deleteActionBtn }}
                                onClick={deleteComponent}
                                title="Delete component"
                            >
                                <span>🗑️</span>
                            </button>
                        </div>
                    </div>

                </div>
            )}

            {showAddChild && (
                <div style={styles.addChildContainer}>
                    <AddComponentTest
                        productId={productId}
                        parentId={node.componentId}
                        onAdded={() => {
                            setShowAddChild(false);
                            setActiveFormId(null);
                            onAdded();
                        }}
                        onUnauthorized={onUnauthorized}
                    />
                </div>
            )}

            {node.children && node.children.length > 0 && (
                <div style={styles.childrenContainer}>
                    {node.children.map((child) => (
                        <BomNode
                            key={child.componentId}
                            node={child}
                            productId={productId}
                            allComponents={allComponents}
                            onAdded={onAdded}
                            onUnauthorized={onUnauthorized}
                            level={level + 1}
                            activeFormId={activeFormId}
                            setActiveFormId={setActiveFormId}
                        />
                    ))}
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
    nodeContainer: {
        marginTop: 8,
        position: "relative",
    },

    nodeCard: {
        borderRadius: 10,
        padding: "14px 16px",
        transition: "all 0.2s ease",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        marginBottom: 8,
    },

    nodeContent: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
    },

    nodeInfo: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },

    nodeIcon: {
        fontSize: 24,
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
    },

    nodeDetails: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
    },

    nodeName: {
        fontSize: 15,
        fontWeight: 600,
        color: "#1e293b",
    },

    nodeQty: {
        fontSize: 13,
        color: "#64748b",
        fontWeight: 500,
    },

    nodeActions: {
        display: "flex",
        gap: 6,
        transition: "opacity 0.2s ease",
    },

    actionBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        fontSize: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
    },

    editActionBtn: {
        background: "#dbeafe",
        color: "#1e40af",
    },

    addActionBtn: {
        background: "#dcfce7",
        color: "#166534",
    },

    deleteActionBtn: {
        background: "#fee2e2",
        color: "#991b1b",
    },

    addChildContainer: {
        marginTop: 12,
        marginLeft: 40,
    },

    childrenContainer: {
        marginTop: 4,
    },

    editForm: {
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        padding: 20,
        borderRadius: 12,
        border: "2px solid #cbd5e1",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        marginBottom: 12,
    },

    editHeader: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 16,
    },

    editIcon: {
        fontSize: 20,
    },

    editTitle: {
        margin: 0,
        fontSize: 16,
        fontWeight: 600,
        color: "#1e293b",
    },

    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 120px",
        gap: 14,
        marginBottom: 16,
    },

    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 6,
    },

    label: {
        fontSize: 13,
        fontWeight: 600,
        color: "#475569",
    },

    input: {
        padding: "10px 12px",
        fontSize: 14,
        border: "2px solid #e2e8f0",
        borderRadius: 8,
        outline: "none",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
        background: "white",
    },

    qtyInput: {
        padding: "10px 12px",
        fontSize: 14,
        border: "2px solid #e2e8f0",
        borderRadius: 8,
        outline: "none",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
        textAlign: "center",
        fontWeight: 600,
        background: "white",
    },

    dropdown: {
        padding: "10px 12px",
        fontSize: 14,
        border: "2px solid #e2e8f0",
        borderRadius: 8,
        outline: "none",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
        background: "white",
        cursor: "pointer",
    },

    formActions: {
        display: "flex",
        gap: 10,
        justifyContent: "flex-end",
    },

    saveBtn: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
    },

    cancelBtn: {
        background: "white",
        color: "#64748b",
        border: "2px solid #e2e8f0",
        padding: "10px 20px",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
    },

    statusMessage: {
        marginTop: 12,
        padding: "8px 12px",
        background: "#dbeafe",
        color: "#1e40af",
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 500,
        textAlign: "center",
    },
};

export default BomNode;
