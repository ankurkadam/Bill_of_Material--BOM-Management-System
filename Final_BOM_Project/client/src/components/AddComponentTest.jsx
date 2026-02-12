

import { useState } from "react";

function AddComponentTest({
    productId,
    parentId,
    onAdded,
    onUnauthorized,
}) {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");

    const addComponent = async () => {
        if (!name.trim()) {
            setMessage("Please enter component name");
            return;
        }

        setMessage("Adding component...");

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:7777/api/component/${productId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        componentName: name,
                        quantity: quantity,
                        parent_component_id: parentId ?? null,
                    }),
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

            setMessage("✓ Component added");
            setTimeout(() => {
                setName("");
                setQuantity(1);
                setMessage("");
                onAdded(); // refresh BOM
            }, 500);
        } catch (err) {
            console.error(err);
            setMessage("Server error");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            addComponent();
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formRow}>
                <div style={styles.inputWrapper}>
                    <label style={styles.label}>Component Name</label>
                    <input
                        placeholder="Enter component name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        style={styles.input}
                    />
                </div>

                <div style={styles.qtyWrapper}>
                    <label style={styles.label}>Qty</label>
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        onKeyPress={handleKeyPress}
                        style={styles.qtyInput}
                    />
                </div>
            </div>

            <div style={styles.actionRow}>
                <button 
                    onClick={addComponent} 
                    style={styles.addBtn}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.02)";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(34, 197, 94, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(34, 197, 94, 0.2)";
                    }}
                >
                    <span style={styles.btnIcon}>✓</span>
                    Add Component
                </button>

                {message && (
                    <div style={{
                        ...styles.message,
                        color: message.includes("✓") ? "#059669" : 
                               message.includes("error") || message.includes("denied") ? "#dc2626" : "#3b82f6"
                    }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
        padding: 20,
        borderRadius: 12,
        border: "2px solid #86efac",
        boxShadow: "0 4px 12px rgba(34, 197, 94, 0.1)",
    },

    formRow: {
        display: "flex",
        gap: 12,
        marginBottom: 16,
    },

    inputWrapper: {
        flex: 1,
    },

    qtyWrapper: {
        width: 100,
    },

    label: {
        display: "block",
        fontSize: 13,
        fontWeight: 600,
        color: "#065f46",
        marginBottom: 6,
    },

    input: {
        width: "100%",
        padding: "10px 14px",
        fontSize: 14,
        border: "2px solid #d1fae5",
        borderRadius: 8,
        outline: "none",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
        boxSizing: "border-box",
        background: "white",
    },

    qtyInput: {
        width: "100%",
        padding: "10px 14px",
        fontSize: 14,
        border: "2px solid #d1fae5",
        borderRadius: 8,
        outline: "none",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
        boxSizing: "border-box",
        textAlign: "center",
        fontWeight: 600,
        background: "white",
    },

    actionRow: {
        display: "flex",
        alignItems: "center",
        gap: 12,
    },

    addBtn: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(34, 197, 94, 0.2)",
    },

    btnIcon: {
        fontSize: 16,
        fontWeight: "bold",
    },

    message: {
        fontSize: 13,
        fontWeight: 500,
        padding: "6px 12px",
        borderRadius: 6,
        background: "white",
        border: "1px solid currentColor",
    },
};

export default AddComponentTest;
