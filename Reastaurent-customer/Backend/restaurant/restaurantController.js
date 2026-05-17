const db = require("../config/db");
const { attachImageUrl } = require("../media");

const DEFAULT_WEEKLY_SCHEDULE = {
  sunday: { enabled: true, start_time: "07:00", end_time: "23:00" },
  monday: { enabled: true, start_time: "07:00", end_time: "23:00" },
  tuesday: { enabled: true, start_time: "07:00", end_time: "23:00" },
  wednesday: { enabled: true, start_time: "07:00", end_time: "23:00" },
  thursday: { enabled: true, start_time: "07:00", end_time: "23:00" },
  friday: { enabled: true, start_time: "07:00", end_time: "02:00" },
  saturday: { enabled: true, start_time: "08:00", end_time: "02:00" },
};

const normalizeWeeklySchedule = (value) => {
  if (!value) return DEFAULT_WEEKLY_SCHEDULE;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (_error) {
      return DEFAULT_WEEKLY_SCHEDULE;
    }
  }
  if (typeof value === "object" && Object.keys(value).length > 0) return value;
  return DEFAULT_WEEKLY_SCHEDULE;
};

const normalizeJsonObject = (value) => {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (_error) {
      return {};
    }
  }
  return typeof value === "object" && !Array.isArray(value) ? value : {};
};

const normalizeRow = (row) => {
  if (!row) return null;
  return {
    ...row,
    manual_override_enabled: Number(row.manual_override_enabled),
    manual_is_active: Number(row.manual_is_active),
    schedule_enabled: Number(row.schedule_enabled),
    weekly_schedule: normalizeWeeklySchedule(row.weekly_schedule),
    special_dates: normalizeJsonObject(row.special_dates),
  };
};

const getRestaurantSettings = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        institution_name,
        restaurant_name,
        manual_override_enabled,
        manual_is_active,
        schedule_enabled,
        schedule_start_time,
        schedule_end_time,
        weekly_schedule,
        special_dates,
        timezone_name
      FROM restaurant_settings
      LIMIT 1;
    `);

    let settings = result.rows[0] ? normalizeRow(result.rows[0]) : null;

    if (!settings) {
      settings = {
        institution_name: "Bagel Master Group",
        restaurant_name: "Bagel Master Cafe",
        manual_override_enabled: 0,
        manual_is_active: 1,
        schedule_enabled: 1,
        schedule_start_time: null,
        schedule_end_time: null,
        weekly_schedule: DEFAULT_WEEKLY_SCHEDULE,
        special_dates: {},
        timezone_name: "Asia/Kolkata",
      };
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching restaurant settings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch restaurant settings",
      error: error.message,
    });
  }
};

module.exports = {
  getRestaurantSettings,
};
