import WebFont from "webfontloader";
import moment from "moment";
import history from "../history";
import $ from "jquery";

const validationHash = {
  email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/,
  phone: /^[0-9 +-]+$/,
  name: /^[A-z0-9\[\] -]+$/,
  appstore_shared_secret: /^[a-z0-9]+$/,
  url:
    "(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})"
};

export const validation = (value, type) => {
  const regex = validationHash[type] || "";

  if (regex && type !== "url") return regex.test(value);

  if (value && regex) {
    // regex = regex.replace("/", "//")
    return new RegExp(regex).test(value);
  } else return true;
};

export const formatMoney = (
  amount,
  decimalCount = 2
) => {
  return Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalCount
  })
};

export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const connectFont = (font) => {
  if (font && ["SF Pro Display"].indexOf(font) === -1) {
    const families = `${font}:400,700`;
    const frameElement = document.getElementById("screen-frame");
    const target = frameElement
      ? frameElement.contentWindow || frameElement.contentDocument
      : window;
    WebFont.load({
      google: {
        families: [families]
      },
      context: target
    });
  }
};

export const convertSeconds = (seconds) => {
  let hour, minute;
  minute = Math.floor(seconds / 60);
  seconds = seconds % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  const day = Math.floor(hour / 24);
  hour = hour % 24;

  return {
    days: `${day}`,
    hours: `${hour}`,
    minutes: `${minute}`
  };
};

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export const generateSegmentsForFrontend = (segments, dictionarySegments) => {
  const result = [];

  for (const segment of segments) {
    const newSegment = {};

    for (const key of Object.keys(segment.properties)) {
      newSegment.value = key;
      newSegment.label = dictionarySegments.find((s) => s.value === key).name;

      if (Array.isArray(segment.properties[key])) {
        newSegment.equal = segment.properties[key];
      } else {
        const groupValue = Object.keys(segment.properties[key])[0];
        newSegment.productGroup = groupValue;
        newSegment.productGroups = dictionarySegments.find(
          (s) => s.value === key
        ).groups;
        newSegment.equal =
          segment.properties[key][Object.keys(segment.properties[key])[0]];
      }

      if (segment.hasOwnProperty("id")) newSegment.id = segment.id;

      result.push(newSegment);
    }
  }

  return result;
};

export const generateTriggersForFrontend = (triggers, meta) => {
  const result = [];

  for (const trigger of triggers) {
    const currentEvent = meta.events.value.find(
      (e) => e.name === trigger.event_name
    );
    const newTrigger = {
      id: trigger.id,
      name: trigger.event_name,
      properties: currentEvent ? currentEvent.properties : [],
      filters: []
    };

    if (trigger.properties !== null) {
      for (const key of Object.keys(trigger.properties)) {
        newTrigger.filters.push({
          label: currentEvent
            ? currentEvent.properties.find((p) => p.value === key).name
            : key,
          value: key,
          equal: trigger.properties[key]
        });
      }
    }

    result.push(newTrigger);
  }

  return result;
};

export const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const isMobile = () => {
  let check = false;
  (function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    ) {
      check = true;
    }
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

export const getDateFromURI = (name = false) => {
  const queryStartTime = getParameterByName("start_time");
  const queryEndTime = getParameterByName("end_time");
  if (queryStartTime && queryEndTime) {
    return {
      start_time: queryStartTime,
      end_time: queryEndTime
    }
  }
  let date = null;
  const item = localStorage.getItem(`${name}.date`);
  if (item) {
    date = JSON.parse(item);
  }
  return date || generatePeriod("last_7_days");
}

export const setDateToURI = (start, end, name = false, format = "YYYY-MM-DD") => {
  const start_time = moment(start).format(format);
  const end_time = moment(end).format(format);
  if (name) {
    localStorage.setItem(`${name}.date`, JSON.stringify({
      start_time,
      end_time
    }));
  }

  history.push({
    pathname: `${window.location.pathname}`,
    search: `?start_time=${start_time}&end_time=${end_time}`
  });
}

export const createCohortDatePeriod = (amount, unit, format = "YYYY-MM-DD HH:mm:ss") => {
  const time = moment().startOf(unit).subtract(amount, unit);
  return {
    start_time: time.format(format),
    end_time: time.add(amount, unit).subtract(1, "days").format(format)
  };
}

export const generatePeriod = (value) => {
  const format = "YYYY-MM-DD HH:mm:ss";
  let result = {};
  switch (value) {
    case "today":
      result.start_time = moment().startOf("day").format(format)
      result.end_time = moment().endOf("day").format(format)
      break
    case "yesterday":
      result.start_time = moment()
        .subtract(1, "days")
        .startOf("day")
        .format(format)
      result.end_time = moment()
        .subtract(1, "days")
        .endOf("day")
        .format(format)
      break
    case "last_7_days":
      result.start_time = moment()
        .subtract(7, "days")
        .startOf("day")
        .format(format);
      result.end_time = moment().endOf("day").format(format);
      break;
    case "last_28_days":
      result.start_time = moment()
        .subtract(28, "days")
        .startOf("day")
        .format(format);
      result.end_time = moment().endOf("day").format(format);
      break;
    case "last_30_days":
      result.start_time = moment()
        .subtract(30, "days")
        .startOf("day")
        .format(format);
      result.end_time = moment().endOf("day").format(format);
      break;
    case "last_365_days":
      result.start_time = moment()
        .subtract(365, "days")
        .startOf("day")
        .format(format);
      result.end_time = moment().endOf("day").format(format);
      break;

    case "weeks_4":
      result = createCohortDatePeriod(4, "weeks");
      break;
    case "weeks_8":
      result = createCohortDatePeriod(8, "weeks");
      break;
    case "weeks_12":
      result = createCohortDatePeriod(12, "weeks");
      break;
    case "weeks_24":
      result = createCohortDatePeriod(24, "weeks");
      break;
    case "weeks_48":
      result = createCohortDatePeriod(48, "weeks");
      break;

    case "months_3":
      result = createCohortDatePeriod(3, "months");
      break;
    case "months_6":
      result = createCohortDatePeriod(6, "months");
      break;
    case "months_12":
      result = createCohortDatePeriod(12, "months");
      break;
    case "months_18":
      result = createCohortDatePeriod(18, "months");
      break;
    case "months_24":
      result = createCohortDatePeriod(24, "months");
      break;

    case "quarters_4":
      result = createCohortDatePeriod(4, "quarters");
      break;
    case "quarters_8":
      result = createCohortDatePeriod(8, "quarters");
      break;
    case "quarters_12":
      result = createCohortDatePeriod(12, "quarters");
      break;
    case "quarters_18":
      result = createCohortDatePeriod(18, "quarters");
      break;
    case "quarters_24":
      result = createCohortDatePeriod(24, "quarters");
      break;

    case "years_1":
      result = createCohortDatePeriod(1, "years");
      break;
    case "years_2":
      result = createCohortDatePeriod(2, "years");
      break;
    case "years_3":
      result = createCohortDatePeriod(3, "years");
      break;
    case "years_4":
      result = createCohortDatePeriod(4, "years");
      break;
    case "years_5":
      result = createCohortDatePeriod(5, "years");
      break;

    case "this_month":
      result.start_time = moment().startOf("month").format(format);
      result.end_time = moment().endOf("day").format(format);
      break;
    case "last_month":
      result.start_time = moment()
        .subtract(1, "months")
        .startOf("month")
        .format(format);
      result.end_time = moment()
        .subtract(1, "months")
        .endOf("month")
        .format(format);
      break;
    case "last_3_months":
      result.start_time = moment()
        .subtract(3, "months")
        .startOf("month")
        .format(format);
      result.end_time = moment()
        .subtract(1, "months")
        .endOf("month")
        .format(format);
      break;
    case "last_6_months":
      result.start_time = moment()
        .subtract(6, "months")
        .startOf("month")
        .format(format);
      result.end_time = moment().endOf("day").format(format);
      break;
    case "this_year":
      result.start_time = moment().startOf("year").format(format);
      result.end_time = moment().endOf("day").format(format);
      break;
    case "all":
      result.start_time = moment()
        .subtract(1000, "days")
        .startOf("day")
        .format(format);
      result.end_time = moment().endOf("day").format(format);
      break;
    default:
      break;
  }
  return result;
};

export const isStringValidJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const track = (name, params = {}) => {
  if(window.analytics) {
    window.analytics.track(name, {
      url: window.location.href,
      ...params
    });
  }
}
