/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1", // Indigo
        secondary: "#10B981", // Emerald
        accent: "#F59E0B", // Amber
        background: "#F9FAFB", // Light gray background
        surface: "#FFFFFF", // Card surfaces
        textPrimary: "#111827", // Deep gray for main text
        textSecondary: "#6B7280", // Muted text
        danger: "#EF4444", // Red for alerts/spending
        success: "#22C55E", // Green for growth
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0,0,0,0.05)",
        glow: "0 4px 30px rgba(99, 102, 241, 0.3)", // Indigo glow
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
