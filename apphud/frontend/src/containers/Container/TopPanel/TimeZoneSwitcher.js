import React from "react";
import moment from "moment-timezone";
import axios from "axios";
import CustomSelect from "../../Common/CustomSelect";

const guess = moment.tz.guess();

export const defaultOptions = [
  { value: 0, name: "UTC" },
  { value: moment.tz(guess).utcOffset(), name: `Browser: ${guess} ${moment.tz(guess).format("z")}`, zone: guess, isBrowser: true }
];

// console.log("moment", guess ,moment.tz(guess).format("z"), moment.tz(guess).utcOffset());

const mapperOption = zone => ({
  value: moment.tz(zone).utcOffset(),
  name: `Project: ${zone} ${moment.tz(zone).format("z")}`,
  zone,
  isBrowser: false
});

export default function TimeZoneSwitcher({ onChange, value, options = [] }) {
  const [timezones, setTimezones] = React.useState([]);
  const data = defaultOptions.concat(options.map(mapperOption));
  const items = data.map(i => {
    const currentItem = timezones.find(v => v.value === i?.zone);
    const prefix = i.isBrowser ? "Browser": "Project";
    const name = currentItem ? `${prefix}: ${currentItem.name}` : i.name;
    return ({...i, name});
  });
  const currentValue = items.find((el) => el.value === value) || items[0];

  const getTimezones = async() => {
    try {
      const response = await axios.get("apps/time_zones");
      setTimezones(response?.data?.data?.results || []);
    } catch (e) {}
  }

  React.useEffect(() => {
    getTimezones();
  }, []);

  return (
    <CustomSelect
      value={currentValue}
      onChange={(e) => onChange(currentValue, e.value)}
      options={items}
      className="custom-select_timezone"
      id="timezone"
      labelKey="name"
      valueKey="value"
    />
  );
}
