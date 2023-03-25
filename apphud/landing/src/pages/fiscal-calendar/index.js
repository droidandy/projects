import React from "react";
import {DateTime as DT} from "luxon";
import Main from "components/sections/Main";
import AppleFiscalCalendar from "../../components/Calendar/AppleFiscalCalendar";
import Head from "next/head";
import { AnimationCalendar } from "components/Animation";

const quarter = (label, months = []) => {
    return {
        label,
        months
    }
}

const month = (date, from, to, events = []) => {
    return {
        date,
        period: {
            from,
            to
        },
        events
    }
}

const quarters = [
    quarter(
        'Sep 27 - Dec 26',
        [
            month(
                DT.fromISO("2020-10-01"),
                DT.fromISO("2020-09-27"),
                DT.fromISO("2020-10-31"),
                [
                    {
                        date: DT.fromISO("2020-10-01").startOf("day"),
                        disabled: true,
                    },
                    {
                        date: DT.fromISO("2020-10-29").startOf("day"),
                        disabled: true,
                    }
                ]
            ),
            month(
                DT.fromISO("2020-11-01"),
                DT.fromISO("2020-11-01"),
                DT.fromISO("2020-11-28"),
                []
            ),
            month(
                DT.fromISO("2020-12-01"),
                DT.fromISO("2020-11-29"),
                DT.fromISO("2020-12-26"),
                [
                    {
                        date: DT.fromISO("2020-12-03").startOf("day"),
                        focusDate: DT.fromISO("2020-10-01").startOf("day"),
                        paymentDate: "December 3, 2020",
                        salesPeriod: "September 27 - October 31"
                    }
                ]
            )
        ]
    ),
    quarter(
        'Dec 27 - Mar 27',
        [
            month(
                DT.fromISO("2021-01-01"),
                DT.fromISO("2020-12-27"),
                DT.fromISO("2021-01-30"),
                [
                    {
                        date: DT.fromISO("2020-12-31").startOf("day"),
                        focusDate: DT.fromISO("2020-11-01").startOf("day"),
                        paymentDate: "December 31, 2020",
                        salesPeriod: "November 1 - 28"
                    },
                    {
                        date: DT.fromISO("2021-01-28").startOf("day"),
                        paymentDate: "January 28, 2020",
                        salesPeriod: "November 29 - December 26",
                        focusDate: DT.fromISO("2020-12-01").startOf("day"),
                    }
                ]
            ),
            month(
                DT.fromISO("2021-02-01"),
                DT.fromISO("2021-01-31"),
                DT.fromISO("2021-02-27"),
                []
            ),
            month(
                DT.fromISO("2021-03-01"),
                DT.fromISO("2021-02-28"),
                DT.fromISO("2021-03-27"),
                [
                    {
                        date: DT.fromISO("2021-03-04").startOf("day"),
                        paymentDate: "March 4, 2021",
                        salesPeriod: "December 27 - January 30",
                        focusDate: DT.fromISO("2021-01-01").startOf("day"),
                    }
                ]
            )
        ]
    ),
    quarter(
        'Mar 28 - Jun 26',
        [
            month(
                DT.fromISO("2021-04-01"),
                DT.fromISO("2021-03-28"),
                DT.fromISO("2021-05-01"),
                [
                    {
                        date: DT.fromISO("2021-04-01").startOf("day"),
                        paymentDate: "April 1, 2021",
                        salesPeriod: "January 31 - February 27",
                        focusDate: DT.fromISO("2021-02-01").startOf("day"),
                    },
                    {
                        date: DT.fromISO("2021-04-29").startOf("day"),
                        paymentDate: "April 29, 2021",
                        salesPeriod: "February 28 - March 27",
                        focusDate: DT.fromISO("2021-03-01").startOf("day"),
                    }
                ]
            ),
            month(
                DT.fromISO("2021-05-01"),
                DT.fromISO("2021-05-02"),
                DT.fromISO("2021-05-29"),
                []
            ),
            month(
                DT.fromISO("2021-06-01"),
                DT.fromISO("2021-05-29"),
                DT.fromISO("2021-06-26"),
                [
                    {
                        date: DT.fromISO("2021-06-03").startOf("day"),
                        paymentDate: "June 3, 2021",
                        salesPeriod: "March 28 - May 1",
                        focusDate: DT.fromISO("2021-04-01").startOf("day"),
                    }
                ]
            )
        ]
    ),
    quarter(
        'Jun 27 - Sep 25',
        [
            month(
                DT.fromISO("2021-07-01"),
                DT.fromISO("2021-06-27"),
                DT.fromISO("2021-07-31"),
                [
                    {
                        date: DT.fromISO("2021-07-01").startOf("day"),
                        paymentDate: "July 1, 2021",
                        salesPeriod: "May 2 - May 29",
                        focusDate: DT.fromISO("2021-05-01").startOf("day"),
                    },
                    {
                        date: DT.fromISO("2021-07-29").startOf("day"),
                        paymentDate: "July 29, 2021",
                        salesPeriod: "May 30 - June 26",
                        focusDate: DT.fromISO("2021-06-01").startOf("day"),
                    }
                ]
            ),
            month(
                DT.fromISO("2021-08-01"),
                DT.fromISO("2021-08-01"),
                DT.fromISO("2021-08-28"),
                []
            ),
            month(
                DT.fromISO("2021-09-01"),
                DT.fromISO("2021-08-29"),
                DT.fromISO("2021-09-25"),
                [
                    {
                        date: DT.fromISO("2021-09-02").startOf("day"),
                        paymentDate: "September 2, 2021",
                        salesPeriod: "June 27 - July 31",
                        focusDate: DT.fromISO("2021-07-01").startOf("day"),
                    }
                ]
            )
        ]
    )
]

const content = {
  content: <AnimationCalendar />,
  title: <span>Apple’s Fiscal<br/>Calendar and<br/>Payment<br/>Dates 2021</span>,
  description: 'Apple App Store payment cycles are confusing to even experienced developers and companies. Be aware of when you’ll get paid for the App Store earnings.'
};

export default function () {
  return (
    <div className="wrapper">
      <Head>
        <title>Apple’s Fiscal Calendar - Apphud</title>
        <meta property="og:title" content="Apple’s Fiscal Calendar - Apphud" />
      </Head>
      <Main {...content} absolute mainLong />
      <div className="container">
        <AppleFiscalCalendar quarters={quarters} />
      </div>
    </div>
  );
};
