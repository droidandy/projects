import React from "react";
import Link from "next/link";
import cn from "classnames";
import styles from "./styles.module.scss";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={cn("container", styles.list)}>
        <div className={styles.logo}>
          <Link href="/">
            <a>
              <img src={require("./logo.svg")} alt="Apphud" />
            </a>
          </Link>
          <span>Copyright © {new Date().getFullYear()}</span>
        </div>

        <div className={styles.item}>
          <strong>Product</strong>

          <Link href="/development">Apphud for development</Link>
          <Link href="/marketing">Apphud for marketing</Link>
          <Link href="/product">Apphud for product</Link>
          <Link href="/integrations">Integrations</Link>
          <Link href="/pricing">Pricing</Link>
        </div>

        <div className={styles.item}>
          <strong>Compare</strong>

          <Link href="/in-house">Apphud vs in-house</Link>
          <Link href="/revenuecat">Apphud vs RevenueCat</Link>
        </div>

        <div className={styles.item}>
          <strong>Resources</strong>

          <Link href="/contact">Contact us</Link>
          <a rel="nofollow" href="https://docs.apphud.com">Documentation</a>
          <a rel="nofollow" href="https://blog.apphud.com">Blog</a>
          <Link href="/about">About us</Link>
          <a rel="nofollow" href="https://legal.apphud.com/terms">Terms</a>
          <a rel="nofollow" href="https://legal.apphud.com/privacy">Privacy</a>
          <Link href="/apple-receipt-checker">Apple Receipt Checker</Link>
          <Link href="/fiscal-calendar">Apple’s Fiscal Calendar</Link>
        </div>

        <div className={styles.item}>
          <strong>Links</strong>

          <a rel="nofollow" href="https://status.apphud.com">System status</a>
          <a href="https://facebook.com/apphud">Facebook</a>
          <a href="https://twitter.com/apphud">Twitter</a>
          <a href="https://crunchbase.com/organization/apphud">Crunchbase</a>
          <a href="https://angel.co/company/apphud">AngelList</a>
          <a href="https://linkedin.com/company/apphud">LinkedIn</a>
          <a href="https://github.com/apphud">GitHub</a>
          <a href="/for-investors">For investors</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
