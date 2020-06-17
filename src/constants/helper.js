import moment from "moment";
import _ from "lodash";
import html2pdf from "html2pdf";
import apiPath from "./apiPath";
import axios from "axios";
import Config from "./config";
import { setBuildings } from '../components/buildingsSlice';

// import { useSelector } from 'react-redux';

// import {
//   selectToken
// } from '../components/authenticationSlice';

// const authToken = useSelector(selectToken);

var helper = {
  // init: async ({authToken, dispatch }) =>{
    // let buildings = await helper.get({}, apiPath.buildings, {token:authToken});
    // console.log(buildings);

    // let response = await buildings.response;
    // console.log('here!')
    // let json = await response.json();
    // console.log(json);
    // dispatch(setBuildings(json));
  // },
  getRoles : async ({token})=>{
    const url =  process.env.REACT_APP_API_BASE_URL + apiPath.list_roles;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token || ""
      }
    });

    let response = await res;
    let json = await response.json();

    return { response, json, status: await res.status };
  },
  getFloorPlanUrl : async ()=>{
    return `http://localhost:3001/plans/retail.jpg`
  },
  createPdf: async (reportId, file_name = "") => {
    var element = document.getElementById(reportId);
    if (element == null) {
      window.alert("Source not found.");
      return false;
    }
    var opt = {
      margin: 0.2,
      filename: file_name,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2.5 },
      jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] }
    };
    return await html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get("pdf")
      .save();
  },
  get_url: async (url = {}, jsonObj) => {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    return { response: await res, status: await res.status };
  },
  get: async (jsonObj = {}, path = "", session = {}) => {
    let query = await helper.serialize(jsonObj);
    const url = process.env.REACT_APP_API_BASE_URL + path + "?" + query;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": session.token || ""
      }
    });
    if (res.status === 401) {
      localStorage.removeItem("honeywell-app");
      window.location = "/login";
    }
    return { response: await res, status: await res.status };
  },
  get_v2: async (jsonObj = {}, path = "", session = {}) => {
    let query = await helper.serialize(jsonObj);
    const url = process.env.REACT_APP_API_BASE_URL + path + "?" + query;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": session.token || ""
      }
    });
    if (res.status === 401) {
      localStorage.removeItem("honeywell-app");
      window.location = "/login";
    }
    if (res.status === 200) {
      return await res.json();
    }
  },
  get_img_url: path => {
    let url = process.env.REACT_APP_API_BASE_URL + "/plans/" + path;
    return url;
  },
  post: async (jsonObj = {}, path = "", session = {}) => {
    const url = process.env.REACT_APP_API_BASE_URL + path;
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(jsonObj),
      headers: {
        "Content-Type": "application/json",
        "x-access-token": session.token || ""
      }
    });
    return { response: await res, status: await res.status };
  },
  put: async (jsonObj = {}, path = "", session = {}) => {
    const url = process.env.REACT_APP_API_BASE_URL + path;
    const res = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(jsonObj),
      headers: {
        "Content-Type": "application/json",
        "x-access-token": session.token || ""
      }
    });
    return { response: await res, status: await res.status };
  },
  delete: async (path = "", session = {}) => {
    const url = process.env.REACT_APP_API_BASE_URL + path;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": session.token || ""
      }
    });
    return { response: await res, status: await res.status };
  },
  post_formdata: async (formData = {}, path = "", session) => {
    const url = process.env.REACT_APP_API_BASE_URL + path;
    const res = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        "x-access-token": session.token || ""
      }
    });
    return await res;
  },
  put_formdata: async (formData = {}, path = "", session) => {
    const url = process.env.REACT_APP_API_BASE_URL + path;
    const res = await fetch(url, {
      method: "PUT",
      body: formData,
      headers: {
        "x-access-token": session.token || ""
      }
    });
    return await res;
  },
  axios_get: async (jsonObj = {}, path = "", session = {}) => {
    let query = await helper.serialize(jsonObj);
    const url = process.env.REACT_APP_API_BASE_URL + path + "?" + query;
    const res = await axios(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": session.token || ""
      }
    });
    if (res.status === 401) {
      localStorage.removeItem("honeywell-app");
      window.location = "/login";
    }
    return res;
  },
  rtls_get: async (obj = {}, path = "") => {
    let query = await helper.serialize(obj);
    const url = process.env.REACT_APP_REST_HOST + path + query;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-ApiKey": process.env.REACT_APP_API_KEY
      }
    });
    return { response: await res, status: await res.status };
  },
  rtls_put: async (obj = {}, path = "") => {
    const url = process.env.REACT_APP_REST_HOST + path;
    const res = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
        "X-ApiKey": process.env.REACT_APP_API_KEY
      }
    });
    return { response: await res, status: await res.status };
  },
  rtls_post: async (obj = {}, path = "") => {
    const url = process.env.REACT_APP_REST_HOST + path;
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
        "X-ApiKey": process.env.REACT_APP_API_KEY
      }
    });
    return { response: await res, status: await res.status };
  },
  rtls_delete: async (path = "") => {
    const url = process.env.REACT_APP_REST_HOST + path;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-ApiKey": process.env.REACT_APP_API_KEY
      }
    });
    return { response: await res, status: await res.status };
  },
  serialize: function(obj, prefix) {
    var str = [],
      p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];
        str.push(
          v !== null && typeof v === "object"
            ? this.serialize(v, k)
            : encodeURIComponent(k) + "=" + encodeURIComponent(v)
        );
      }
    }
    return str.join("&");
  },
  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      cb(reader.result);
    };
    reader.onerror = function(error) {
      console.log("Error: ", error);
    };
  },
  range: (start, end) => {
    return {
      "Today Only": [moment(start), moment(end)],
      "Yesterday Only": [
        moment(start).subtract(1, "days"),
        moment(end).subtract(1, "days")
      ],
      "3 Days": [moment(start).subtract(3, "days"), moment(end)],
      "5 Days": [moment(start).subtract(5, "days"), moment(end)],
      "1 Week": [moment(start).subtract(7, "days"), moment(end)],
      "2 Weeks": [moment(start).subtract(14, "days"), moment(end)],
      "1 Month": [moment(start).subtract(1, "months"), moment(end)],
      "90 Days": [moment(start).subtract(90, "days"), moment(end)],
      "1 Year": [moment(start).subtract(1, "years"), moment(end)]
    };
  },
  local: () => {
    return {
      format: "DD-MM-YYYY HH:mm",
      sundayFirst: false
    };
  },
  weekdays: () => {
    return [
      { day: "mon", status: false, dayVal: "1" },
      { day: "tue", status: false, dayVal: "2" },
      { day: "wed", status: false, dayVal: "3" },
      { day: "thu", status: false, dayVal: "4" },
      { day: "fri", status: false, dayVal: "5" },
      { day: "sat", status: false, dayVal: "6" },
      { day: "sun", status: false, dayVal: "0" }
    ];
  },
  getBuildings: async session => {
    return helper.get({}, apiPath.buildings, session);
  },
  trackTransform: ctx => {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function() {
      return xform;
    };

    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function() {
      savedTransforms.push(xform.translate(0, 0));
      return save.call(ctx);
    };

    var restore = ctx.restore;
    ctx.restore = function() {
      xform = savedTransforms.pop();
      return restore.call(ctx);
    };

    var scale = ctx.scale;
    ctx.scale = function(sx, sy) {
      xform = xform.scaleNonUniform(sx, sy);
      return scale.call(ctx, sx, sy);
    };

    var rotate = ctx.rotate;
    ctx.rotate = function(radians) {
      xform = xform.rotate((radians * 180) / Math.PI);
      return rotate.call(ctx, radians);
    };

    var translate = ctx.translate;
    ctx.translate = function(dx, dy) {
      xform = xform.translate(dx, dy);
      return translate.call(ctx, dx, dy);
    };

    var transform = ctx.transform;
    ctx.transform = function(a, b, c, d, e, f) {
      var m2 = svg.createSVGMatrix();
      m2.a = a;
      m2.b = b;
      m2.c = c;
      m2.d = d;
      m2.e = e;
      m2.f = f;
      xform = xform.multiply(m2);
      return transform.call(ctx, a, b, c, d, e, f);
    };

    var setTransform = ctx.setTransform;
    ctx.setTransform = function(a, b, c, d, e, f) {
      xform.a = a;
      xform.b = b;
      xform.c = c;
      xform.d = d;
      xform.e = e;
      xform.f = f;
      return setTransform.call(ctx, a, b, c, d, e, f);
    };

    var pt = svg.createSVGPoint();
    ctx.transformedPoint = function(x, y) {
      pt.x = x;
      pt.y = y;
      return pt.matrixTransform(xform.inverse());
    };
  },
  errorHandler: (error, section) => {
    // console.log('Error occured in section ' + section, error);
  },
  capitalize: s => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  },
  humanize: str => {
    return _.capitalize(
      _.trim(
        _.snakeCase(str)
          .replace(/_id$/, "")
          .replace(/_/g, " ")
      )
    );
  },
  parseJwt: token => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function(c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  },
  compareTime: (time1, time2) => {
    let time = time1.split(":");
    let timeTo = time2.split(":");
    var startHour = time[0];
    var startMinute = time[1];
    var startSecond = 0;

    var endHour = timeTo[0];
    var endMinute = timeTo[1];
    var endSecond = 0;

    //Create date object and set the time to that
    var startTimeObject = new Date();
    startTimeObject.setHours(startHour, startMinute, startSecond);

    //Create date object and set the time to that
    var endTimeObject = new Date(startTimeObject);
    endTimeObject.setHours(endHour, endMinute, endSecond);

    //Now we are ready to compare both the dates
    if (startTimeObject > endTimeObject) {
      return false;
      // alert('End time should be after start time.');
    } else {
      return true;
    }
  },
  displayTime: time => {
    return moment(time).format(
      process.env.DATE_TIME_FORMAT
        ? process.env.DATE_TIME_FORMAT
        : Config.DEFAULT_DATE_TIME_FORMAT
    );
  }
};
export default helper;
