let Config = {
  ZOOM_WINDOW_SIZE: 120, // pixels (width) on screen, false ==> disables it
  ZOOM_PAN_LIMIT:10, // meters- limit bounds of panning
  ZOOM_OUT_LIMIT: 0.5, // zoom magnification.  (lower is more zoomed out)
  ZOOM_IN_LIMIT: 3, // meters- number of meters that the full screen of the device will show, lower is more zoomed in
  ZOOM_INIT:0.95, // initial magnification. 1 == exact fit.  lower == more zoomed out

  DEFAULT_TAG_TYPE: "tag",
  DEFAULT_PADDING_X: 10,
  DEFAULT_PADDING_Y: 10,
  IMAGE_RATIO_MULTIPLIER_X: 1,
  IMAGE_RATIO_MULTIPLIER_Y: 1,
  zoneGapXY: 20,
  DEFAULT_ZOOM_LEVEL: 50,
  MAX_ZOOM_LEVEL: 53.5,
  MIN_ZOOM_LEVEL: 0,
  ANCHOR_DEFAULT_SIZE: { w: 30, h: 30, x_padd: 25, y_padd: 30 },
  TAG_DEFAULT_SIZE: { w: 50, h: 80, x_padd: 35, y_padd: 90 },
  USER_PERMISSIONS: [
    { name: "Access Users", alias: "access_users", route: "Settings" },
    { name: "Access Roles", alias: "access_roles", route: "Settings" },
    {
      name: "Access Activity Logs",
      alias: "access_activity_logs",
      route: "Settings"
    },
    {
      name: "Access User Himself",
      alias: "access_user_himself",
      route: "Profile"
    },
    { name: "Access Map", alias: "access_map", route: "RTLS" },
    {
      name: "Access Map Editor",
      alias: "access_map_editor",
      route: "RTLS_Editor"
    },
    {
      name: "Access Tag Editor",
      alias: "access_tag_editor",
      route: "RTLS_Editor"
    },
    {
      name: "Access Schedules",
      alias: "access_schedules",
      route: "RTLS_Editor"
    },
    // { name: "Create/Update/Delete Tags", alias: 'create_update_delete_tags', route: 'RTLS_Editor' },
    { name: "Access Reports", alias: "access_reports", route: "Reports" },
    { name: "Access Alarms", alias: "access_alarms", route: "Alarms" },
    // { name: "Access System", alias: 'access_system', route: 'System' },
    { name: "Access History", alias: "access_history", route: "History" },
    {
      name: "Display Tag Alias",
      alias: "display_tag_alias",
      route: "Display_Tag_Alias"
    }
  ],
  DEFAULT_PER_PAGE: 50,
  DEFAULT_ACTIVE_TIME_MIN: 5,
  TAG_ACTIVE_INTERVAL_CHECK: (60 * 1000) / 4,
  DEFAULT_REPORT_DATE_FORMAT: "YYYY.MM.DD-HH.mm",
  DEFAULT_DATE_TIME_FORMAT: "YYYY/MM/DD HH:mm:ss",
  MUSTER_REPORT_TIME_FRAME_MIN: 5,
  BUILDINGS_RIGHT_NAV: true
};
export default Config;
