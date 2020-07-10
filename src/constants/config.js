let Config = {
  ANIMATION_PERIOD: 100, // How long it takes for movement animations to occur. Should be greater or equal to the socket/ Blink update interval (ms).

  ZOOM_WINDOW_SIZE: 120, // zoom previewer element. Sets pixels (width) on screen, false ==> disables it
  ZOOM_PAN_LIMIT:10, // meters- limit bounds of panning
  ZOOM_OUT_LIMIT: 0.5, // zoom magnification.  (lower is more zoomed out)
  ZOOM_IN_LIMIT: 3, // meters- number of meters that the full screen of the device will show, lower is more zoomed in
  ZOOM_INIT:0.9, // initial magnification. 1 == exact fit.  lower == more zoomed out
  PIN_PERSON:{
    w: 1,  // width in meters
    h: 1,  // height in meters
    x_padd:0.5, // offset to origin of pin (meters)
    y_padd:1, // offset to origin of pin (meters)
    path_x: 1000, // Size of path, x
    path_y: 1000, // Size of path, y
    path: "M500,598.9c84.3,0,149.5-35.3,195.5-105.8c0-29.2-22.6-53.3-67.9-72.5c-45.2-19.2-87.8-28.8-127.7-28.8c-39.9,0-82.5,9.6-127.7,28.8c-45.3,19.2-67.9,43.3-67.9,72.5C350.4,563.7,415.6,598.9,500,598.9L500,598.9z M500,106.6c-26.1,0-49.1,10-69,29.9c-19.9,19.9-29.9,42.9-29.9,69c0,27.6,10,51,29.9,70.2c19.9,19.2,42.9,28.8,69,28.8c26.1,0,49.1-9.6,69-28.8c19.9-19.2,29.9-42.6,29.9-70.2c0-26.1-10-49.1-29.9-69C549.1,116.5,526.1,106.6,500,106.6z M500,10c95.1,0,176,33.4,242.7,100.1c66.7,66.7,100.1,147.6,100.1,242.7c0,47.5-11.9,102-35.7,163.3c-23.8,61.3-52.5,118.9-86.3,172.6c-33.7,53.7-67.1,103.9-100.1,150.7c-33,46.8-61,83.9-84,111.6L500,990c-9.2-10.7-21.5-24.9-36.8-42.6c-15.3-17.6-43-52.9-82.8-105.8c-39.9-52.9-74.8-104.3-104.7-154.2S218.5,581.3,194,518.4c-24.5-62.9-36.8-118.1-36.8-165.6c0-95.1,33.4-176,100.1-242.7C324,43.4,404.9,10,500,10L500,10z",
    color:"#000",
    focusedColor: "#2196f3",
    strokeWidth:10,
    strokeColor:"#555",
    zoom_mode: 0.5, //  0 - 1,   0 is fixed sizing relative to the floorplan. 1 is fixed sizing relative to the sreen.
    screen_size: 40 // pixels width   // takes more effect as zoom_mode approaches 1
  },
  

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
