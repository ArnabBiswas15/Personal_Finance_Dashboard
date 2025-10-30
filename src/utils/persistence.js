// src/utils/persistence.js

const DASHBOARD_KEY = "finance_dashboard_data";

/**
 * Save dashboard data to localStorage
 * @param {object} data
 */
export function saveDashboardData(data) {
  try {
    localStorage.setItem(DASHBOARD_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save dashboard data:", err);
  }
}

/**
 * Load dashboard data from localStorage
 * @returns {object|null}
 */
export function loadDashboardData() {
  try {
    const json = localStorage.getItem(DASHBOARD_KEY);
    if (json) return JSON.parse(json);
  } catch (err) {
    console.error("Failed to load dashboard data:", err);
  }
  return null;
}
