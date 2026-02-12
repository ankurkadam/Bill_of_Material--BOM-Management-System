
function BomNodeReadOnly({ node, level = 0 }) {
    const levelColor = level === 0 ? "#3b82f6" : level === 1 ? "#8b5cf6" : level === 2 ? "#ec4899" : "#f59e0b";
    const levelBg = level === 0 ? "#eff6ff" : level === 1 ? "#f5f3ff" : level === 2 ? "#fdf2f8" : "#fff7ed";

    const hasChildren = node.children && node.children.length > 0;

    return (
        <div
            style={{
                ...styles.container,
                marginLeft: level * 24,
                borderLeft: level > 0 ? `2px solid ${levelColor}20` : "none",
                paddingLeft: level > 0 ? 16 : 0,
            }}
        >
            <div
                style={{
                    ...styles.nodeCard,
                    background: levelBg,
                    borderLeft: `4px solid ${levelColor}`,
                }}
            >
                <div style={styles.nodeContent}>
                    <div style={styles.nodeInfo}>
                        <span style={{ ...styles.icon, color: levelColor }}>
                            {level === 0 ? "📦" : "🔧"}
                        </span>
                        <div style={styles.details}>
                            <span style={styles.name}>{node.name}</span>
                            <span style={styles.qty}>Quantity: {node.quantity}</span>
                        </div>
                    </div>

                    {hasChildren && (
                        <div style={styles.childBadge}>
                            {node.children.length} {node.children.length === 1 ? "child" : "children"}
                        </div>
                    )}
                </div>
            </div>

            {hasChildren && (
                <div style={styles.childrenContainer}>
                    {node.children.map((child, index) => (
                        <BomNodeReadOnly
                            key={child.componentId || index}
                            node={child}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        marginTop: 8,
        position: "relative",
    },

    nodeCard: {
        borderRadius: 10,
        padding: "12px 14px",
        marginBottom: 8,
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
        transition: "all 0.2s ease",
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

    icon: {
        fontSize: 22,
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
    },

    details: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
    },

    name: {
        fontSize: 15,
        fontWeight: 600,
        color: "#1e293b",
    },

    qty: {
        fontSize: 13,
        color: "#64748b",
        fontWeight: 500,
    },

    childBadge: {
        padding: "4px 10px",
        background: "rgba(59, 130, 246, 0.1)",
        color: "#3b82f6",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
    },

    childrenContainer: {
        marginTop: 4,
    },
};

export default BomNodeReadOnly;
