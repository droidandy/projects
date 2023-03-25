import React from "react";
import SvgImageHome from "./assets/person-home-2.svg";
import SvgImageChecker from "./assets/apple-receipt-checker.svg";
import SvgImageCalendar from "./assets/apple-fiscal-calendar.svg";
import SvgImageMetrics from "./assets/img2.svg";
import SvgImageSubscribers from "./assets/img.svg";
import SvgImageMakingInApp from "./assets/making-in-app.svg";
import SvgImageChart from "./assets/chart.svg";
import SvgImageInHouse from "./assets/inhouse1.svg";
import styles from "./index.module.scss";

export function AnimationHome() {
    return <SvgImageHome className={styles.home} />
}

export function AnimationChecker() {
  return <SvgImageChecker />
}

export function AnimationCalendar() {
  return <SvgImageCalendar />
}

export function AnimationMetrics() {
    return <SvgImageMetrics className={styles.metrics} />
}

export function AnimationSubscribers() {
    return <SvgImageSubscribers />
}

export function AnimationMakingInApp() {
    return <SvgImageMakingInApp />
}

export function AnimationChart() {
    return <SvgImageChart className={styles.charts} />
}

export function AnimationInHouse() {
    return <SvgImageInHouse className={styles.inHouse} />
}
