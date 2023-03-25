import React, {useState} from "react";
import Description from "./Description";
import QuarterLabel from "./QuarterLabel";
import CalendarList from "./CalendarList";
import CalendarFooter from "./CalendarFooter";

export const CalendarContext = React.createContext();

export default function AppleFiscalCalendar(props){
    const { labels, events, quarters } = props;
    const [state, setState] = useState(null);
    return <CalendarContext.Provider value={{ state, setState }}>
        <Description />
        {quarters.map((quarter, key) => {
            const { label, months } = quarter
            return <div>
                <QuarterLabel quarter={key+1} label={label} />
                <CalendarList
                    key={key}
                    months={months}
                    focused={state}
                />
            </div>
        })}
        <CalendarFooter />
    </CalendarContext.Provider>
}
