import React from "react";
import EmptyPaywallIcon from "./assets/emptyPaywall.svg";
import styles from "./index.module.scss";

export default function EmptyPaywall({ onCreateConfig }) {
    return <div className={styles.emptyPaywall}>
        <div className={styles.image}>
            <img src={EmptyPaywallIcon} />
        </div>
        <div  className={styles.content}>
            <div>
                <label>The most convenient way to organize in-app purchases on paywalls</label>
                <p>
                    Create paywall for each paywall in the app. Update available products in a real time. Launch paywall configs A/B tests to maximize app revenue.
                </p>
                <div style={{display: "flex", marginTop: 10 }}>
                    <button className="button button_green fr" style={{flex:1, marginRight: 10}} onClick={onCreateConfig}>
                        <span>Create paywall</span>
                    </button>
                    <a
                        href="https://docs.apphud.com/getting-started/product-hub/paywalls"
                        target="_blank"
                        className="button button_grey fl" style={{flex:1, marginLeft: 10}}>
                        <span>Learn more</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
}
