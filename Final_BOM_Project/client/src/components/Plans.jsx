

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Plans() {
    const navigate = useNavigate();
    const [plan, setPlan] = useState("FREE");
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:7777/api/user", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setPlan(data.plan);
    };

    const createOrder = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:7777/api/payment/create-order", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            alert("Failed to create order");
            return null;
        }

        return await res.json();
    };

    const verifyPayment = async (orderId, paymentId, signature) => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:7777/api/payment/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                orderId,
                paymentId,
                signature,
            }),
        });

        if (!res.ok) {
            alert("Payment verification failed");
            return false;
        }

        return true;
    };

    const openRazorpay = async () => {
        setIsProcessing(true);
        const order = await createOrder();
        
        if (!order) {
            setIsProcessing(false);
            return;
        }

        const options = {
            key: order.key,
            amount: order.amount,
            currency: order.currency,
            name: "BOM Management",
            description: "Upgrade to PREMIUM",
            order_id: order.orderId,

            handler: async function (response) {
                const success = await verifyPayment(
                    response.razorpay_order_id,
                    response.razorpay_payment_id,
                    response.razorpay_signature
                );

                if (success) {
                    alert("🎉 Payment Successful — Welcome to PREMIUM!");
                    await loadUser();
                }
                setIsProcessing(false);
            },

            modal: {
                ondismiss: function() {
                    setIsProcessing(false);
                }
            },

            theme: {
                color: "#667eea",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const currentPlan = plan;

    return (
        <div style={styles.page}>
           
            <div style={styles.header}>
                <div style={styles.logoSection} onClick={() => navigate("/dashboard")}>
                    <span style={styles.logoIcon}>📦</span>
                    <h2 style={styles.logoText}>BOM Manager</h2>
                </div>

                <button
                    style={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    <span style={styles.backArrow}>←</span>
                    Back
                </button>
            </div>

           
            <div style={styles.heroSection}>
                <h1 style={styles.heroTitle}>Choose Your Plan</h1>
                <p style={styles.heroSubtitle}>
                    Select the perfect plan for your BOM management needs
                </p>
            </div>

           
            <div style={styles.content}>
                <div style={styles.plansGrid}>
                    
                    <div
                        style={{
                            ...styles.planCard,
                            ...(currentPlan === "FREE" ? styles.activePlanCard : {}),
                        }}
                    >
                        {currentPlan === "FREE" && (
                            <div style={styles.currentBadge}>
                                <span>✓</span> Current Plan
                            </div>
                        )}

                        <div style={styles.planIcon}>🆓</div>
                        <h3 style={styles.planName}>Free Plan</h3>
                        
                        <div style={styles.priceSection}>
                            <span style={styles.price}>₹0</span>
                            <span style={styles.period}>/free</span>
                        </div>

                        <p style={styles.planDescription}>
                            Perfect for getting started
                        </p>

                        <div style={styles.divider}></div>

                        <div style={styles.featuresList}>
                            <div style={styles.featureItem}>
                                <span style={styles.checkIcon}>✓</span>
                                <span>Limited BOM Products</span>
                            </div>
                            <div style={styles.featureItem}>
                                <span style={styles.checkIcon}>✓</span>
                                <span>Basic Component Management</span>
                            </div>
                            <div style={styles.featureItem}>
                                <span style={styles.crossIcon}>✗</span>
                                <span style={styles.disabledText}>Excel Export</span>
                            </div>
                            <div style={styles.featureItem}>
                                <span style={styles.crossIcon}>✗</span>
                                <span style={styles.disabledText}>PDF Export</span>
                            </div>
                            <div style={styles.featureItem}>
                                <span style={styles.crossIcon}>✗</span>
                                <span style={styles.disabledText}>Priority Support</span>
                            </div>
                        </div>

                        {currentPlan === "FREE" ? (
                            <div style={styles.activePlanButton}>
                                <span>✓</span> Active Plan
                            </div>
                        ) : (
                            <button style={styles.currentPremiumButton} disabled>
                                Current: Premium
                            </button>
                        )}
                    </div>

                    <div
                        style={{
                            ...styles.planCard,
                            ...styles.premiumCard,
                            ...(currentPlan === "PREMIUM" ? styles.activePremiumCard : {}),
                        }}
                    >
                        <div style={styles.popularBadge}>
                            <span>⭐</span> Recommended
                        </div>

                        {currentPlan === "PREMIUM" && (
                            <div style={styles.currentBadgePremium}>
                                <span>✓</span> Current Plan
                            </div>
                        )}

                        <div style={styles.planIconPremium}>👑</div>
                        <h3 style={styles.planNamePremium}>Premium Plan</h3>
                        
                        <div style={styles.priceSection}>
                            <span style={styles.pricePremium}>₹499</span>
                            <span style={styles.periodPremium}> for Forever</span>
                        </div>

                        <p style={styles.planDescriptionPremium}>
                            Full-featured professional solution
                        </p>

                        <div style={styles.dividerPremium}></div>

                        <div style={styles.featuresList}>
                            <div style={styles.featureItem}>
                                <span style={styles.checkIconGold}>✓</span>
                                <span style={styles.premiumFeatureText}>
                                    <strong>Unlimited</strong> BOM Products
                                </span>
                            </div>
                            <div style={styles.featureItem}>
                                <span style={styles.checkIconGold}>✓</span>
                                <span style={styles.premiumFeatureText}>Excel Export</span>
                            </div>
                            <div style={styles.featureItem}>
                                <span style={styles.checkIconGold}>✓</span>
                                <span style={styles.premiumFeatureText}>PDF Export</span>
                            </div>
                           
                            <div style={styles.featureItem}>
                                <span style={styles.checkIconGold}>✓</span>
                                <span style={styles.premiumFeatureText}>Priority Support</span>
                            </div>
                        </div>

                        {currentPlan === "PREMIUM" ? (
                            <div style={styles.activePremiumPlanButton}>
                                <span>✓</span> Active Plan
                            </div>
                        ) : (
                            <button
                                style={styles.upgradeButton}
                                onClick={openRazorpay}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <span style={styles.spinner}></span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <span>🚀</span>
                                        Upgrade to Premium
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Comparison Table */}
                <div style={styles.comparisonSection}>
                    <h3 style={styles.comparisonTitle}>Feature Comparison</h3>
                    
                    <div style={styles.comparisonTable}>
                        <div style={styles.tableRow}>
                            <div style={styles.tableFeature}>Feature</div>
                            <div style={styles.tablePlan}>Free</div>
                            <div style={styles.tablePlan}>Premium</div>
                        </div>

                        {[
                            { feature: "BOM Products", free: "Up to 5", premium: "Unlimited" },
                            { feature: "Components", free: "Limited", premium: "Unlimited" },
                            { feature: "Excel Export", free: "✗", premium: "✓" },
                            { feature: "PDF Export", free: "✗", premium: "✓" },
                            { feature: "Support", free: "Community", premium: "Priority" },
                        ].map((row, index) => (
                            <div key={index} style={styles.tableRow}>
                                <div style={styles.tableFeature}>{row.feature}</div>
                                <div style={styles.tableValue}>{row.free}</div>
                                <div style={{...styles.tableValue, ...styles.tablePremiumValue}}>
                                    {row.premium}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={styles.infoGrid}>
                    <div style={styles.infoCard}>
                        <span style={styles.infoIcon}>🔒</span>
                        <h4 style={styles.infoTitle}>Secure Payments</h4>
                        <p style={styles.infoText}>Powered by Razorpay with bank-level security</p>
                    </div>

                    <div style={styles.infoCard}>
                        <span style={styles.infoIcon}>⚡</span>
                        <h4 style={styles.infoTitle}>Instant Access</h4>
                        <p style={styles.infoText}>Premium features activated immediately</p>
                    </div>

                    <div style={styles.infoCard}>
                        <span style={styles.infoIcon}>💡</span>
                        <h4 style={styles.infoTitle}>Cancel Anytime</h4>
                        <p style={styles.infoText}>No long-term commitment required</p>
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

    heroSection: {
        padding: "50px 32px 30px 32px",
        textAlign: "center",
    },

    heroTitle: {
        margin: 0,
        fontSize: 40,
        fontWeight: 800,
        color: "white",
        marginBottom: 12,
        textShadow: "0 2px 10px rgba(0,0,0,0.2)",
    },

    heroSubtitle: {
        margin: 0,
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.9)",
        fontWeight: 500,
    },

    content: {
        padding: "0 32px 60px 32px",
        maxWidth: 1200,
        margin: "0 auto",
    },

    plansGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 28,
        marginBottom: 48,
    },

    planCard: {
        background: "white",
        borderRadius: 16,
        padding: 28,
        position: "relative",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        border: "3px solid transparent",
        transition: "all 0.3s ease",
    },

    activePlanCard: {
        border: "3px solid #3b82f6",
    },

    premiumCard: {
        background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
        border: "3px solid #fbbf24",
    },

    activePremiumCard: {
        border: "3px solid #f59e0b",
    },

    popularBadge: {
        position: "absolute",
        top: -14,
        left: "50%",
        transform: "translateX(-50%)",
        background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        color: "white",
        padding: "6px 16px",
        borderRadius: 16,
        fontSize: 12,
        fontWeight: 700,
        boxShadow: "0 4px 12px rgba(251, 191, 36, 0.3)",
        display: "flex",
        alignItems: "center",
        gap: 6,
    },

    currentBadge: {
        position: "absolute",
        top: 16,
        right: 16,
        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        color: "white",
        padding: "6px 12px",
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        gap: 4,
    },

    currentBadgePremium: {
        position: "absolute",
        top: 16,
        right: 16,
        background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        color: "white",
        padding: "6px 12px",
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        gap: 4,
    },

    planIcon: {
        fontSize: 48,
        marginBottom: 16,
        textAlign: "center",
    },

    planIconPremium: {
        fontSize: 48,
        marginBottom: 16,
        textAlign: "center",
    },

    planName: {
        margin: 0,
        fontSize: 22,
        fontWeight: 700,
        color: "#1e293b",
        textAlign: "center",
        marginBottom: 12,
    },

    planNamePremium: {
        margin: 0,
        fontSize: 22,
        fontWeight: 700,
        color: "#92400e",
        textAlign: "center",
        marginBottom: 12,
    },

    priceSection: {
        textAlign: "center",
        marginBottom: 8,
    },

    price: {
        fontSize: 40,
        fontWeight: 800,
        color: "#1e293b",
    },

    pricePremium: {
        fontSize: 40,
        fontWeight: 800,
        color: "#92400e",
    },

    period: {
        fontSize: 15,
        color: "#64748b",
        fontWeight: 500,
    },

    periodPremium: {
        fontSize: 15,
        color: "#92400e",
        fontWeight: 500,
        opacity: 0.7,
    },

    planDescription: {
        margin: 0,
        fontSize: 14,
        color: "#64748b",
        textAlign: "center",
        marginBottom: 20,
    },

    planDescriptionPremium: {
        margin: 0,
        fontSize: 14,
        color: "#92400e",
        textAlign: "center",
        marginBottom: 20,
        opacity: 0.8,
    },

    divider: {
        height: 1,
        background: "#e2e8f0",
        marginBottom: 20,
    },

    dividerPremium: {
        height: 1,
        background: "#fbbf24",
        opacity: 0.3,
        marginBottom: 20,
    },

    featuresList: {
        marginBottom: 24,
    },

    featureItem: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 0",
        fontSize: 14,
    },

    checkIcon: {
        color: "#22c55e",
        fontWeight: "bold",
        fontSize: 16,
    },

    checkIconGold: {
        color: "#f59e0b",
        fontWeight: "bold",
        fontSize: 16,
    },

    crossIcon: {
        color: "#cbd5e1",
        fontWeight: "bold",
        fontSize: 16,
    },

    disabledText: {
        color: "#94a3b8",
    },

    premiumFeatureText: {
        color: "#92400e",
    },

    activePlanButton: {
        width: "100%",
        padding: "14px",
        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        color: "white",
        border: "none",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },

    activePremiumPlanButton: {
        width: "100%",
        padding: "14px",
        background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        color: "white",
        border: "none",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },

    upgradeButton: {
        width: "100%",
        padding: "14px",
        background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        color: "white",
        border: "none",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        boxShadow: "0 4px 12px rgba(251, 191, 36, 0.3)",
    },

    currentPremiumButton: {
        width: "100%",
        padding: "14px",
        background: "#e2e8f0",
        color: "#94a3b8",
        border: "none",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 700,
        cursor: "not-allowed",
    },

    spinner: {
        width: 16,
        height: 16,
        border: "2px solid rgba(255,255,255,0.3)",
        borderTop: "2px solid white",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        display: "inline-block",
    },

    comparisonSection: {
        background: "white",
        borderRadius: 16,
        padding: 32,
        marginBottom: 32,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    },

    comparisonTitle: {
        margin: 0,
        fontSize: 24,
        fontWeight: 700,
        color: "#1e293b",
        marginBottom: 24,
        textAlign: "center",
    },

    comparisonTable: {
        border: "2px solid #e2e8f0",
        borderRadius: 12,
        overflow: "hidden",
    },

    tableRow: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        borderBottom: "1px solid #f1f5f9",
    },

    tableFeature: {
        padding: "14px 20px",
        fontSize: 14,
        fontWeight: 600,
        color: "#1e293b",
        background: "#f8fafc",
    },

    tablePlan: {
        padding: "14px 20px",
        fontSize: 13,
        fontWeight: 700,
        color: "#475569",
        textAlign: "center",
        background: "#f8fafc",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },

    tableValue: {
        padding: "14px 20px",
        fontSize: 14,
        color: "#64748b",
        textAlign: "center",
    },

    tablePremiumValue: {
        color: "#f59e0b",
        fontWeight: 600,
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 20,
    },

    infoCard: {
        background: "white",
        padding: 24,
        borderRadius: 12,
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },

    infoIcon: {
        fontSize: 32,
        marginBottom: 12,
        display: "block",
    },

    infoTitle: {
        margin: 0,
        fontSize: 15,
        fontWeight: 700,
        color: "#1e293b",
        marginBottom: 8,
    },

    infoText: {
        margin: 0,
        fontSize: 13,
        color: "#64748b",
        lineHeight: 1.5,
    },
};

export default Plans;
