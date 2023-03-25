import React from "react";
import DocIcon from "./assets/doc.svg"
import CheckIcon from "./assets/check.svg"
import EllipseGreen from "./assets/ellipse1.svg"
import EllipseYellow from "./assets/ellipse2.svg"
import styles from "./index.module.scss";

export default function CalendarFooter() {
    return <>
        <p className={`${styles.textCenter}`}>
            <span className={`${styles.filled}`}>
                This calendar is an estimation because Apple doesn’t publish the official payout dates.
            </span>
        </p>
        <br/><br/>
        <div className={styles.footer}>
            <EllipseYellow className={styles.ellipseGreen} />
            <div className={styles.link}>
                <a
                    className={styles.label}
                    href="https://itunesconnect.apple.com/WebObjects/iTunesConnect.woa/wa/jumpTo?page=fiscalcalendar"
                    target="_blank">
                    <CheckIcon />
                    <span>App Store Connect Link</span>
                </a>
                <div className={styles.text}>
                    Sign-in required
                </div>
            </div>
            <div className={styles.link}>
                <a
                    download
                    className={styles.label}
                    href={"/apple-fiscal-calendar.pdf"}
                    target="_blank">
                    <DocIcon />
                    <span>PDF File</span>
                </a>
                <div className={styles.text}  />
            </div>
            <EllipseGreen className={styles.ellipseYellow} />
        </div>
        <p className={styles.textCenter}>
            Apple will release the 2022 fiscal calendar in September of 2021. We will update the calendar once the next fiscal calendar arrives.
        </p>
    </>
}
