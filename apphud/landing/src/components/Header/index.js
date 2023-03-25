import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import Link from "next/link";
import Dropdown from "./Dropdown";
import styles from "./styles.module.scss";

const itemProduct = [
  {
    id: "1",
    title: "Apphud for development",
    description: "Easily integrate in-app subscriptions",
    img: "build",
    link: "/development",
  },

  {
    id: "2",
    title: "Apphud for marketing",
    description: "Analyze app revenue metrics",
    img: "measure",
    link: "/marketing",
  },

  {
    id: "3",
    title: "Apphud for product",
    description: "Win back lapsed customers, reduce churn, run A/B experiments",
    img: "grow",
    link: "/product",
  },

  {
    id: "4",
    title: "Integrations",
    description: "Send subscription events to third-party tools",
    img: "infrastructure",
    link: "/integrations",
  },
];

const Header = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, [router]);

  const onToggle = useCallback(() => {
    const newOpen = !open;

    if (newOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    setOpen(newOpen);
  }, [open]);

  return (
    <div className={styles.header}>
      <div className={cn(styles.container, "container")}>
        <Link href="/">
          <img
            src="/images/logo-header.svg"
            alt="Apphud"
            className={styles.logo}
          />
        </Link>

        <div
          className={cn(styles.burger, { _active: open })}
          onClick={onToggle}
        ></div>

        <div className={cn(styles.nav, { _open: open })}>
          <Dropdown items={itemProduct} large>
            <>
              <Link href="/product">Product</Link>
              <span>Product</span>
            </>
          </Dropdown>

          <Link href="/why-apphud">Why Apphud?</Link>

          <Link href="/pricing">Pricing</Link>

          <Dropdown
            items={[
              {
                id: "1",
                title: "Quickstart guide",
                img: "quickstart",
                link: "https://docs.apphud.com/#getting-started",
                rel: "nofollow",
                blank: true,
              },

              {
                id: "2",
                title: "Installation",
                rel: "nofollow",
                link:
                  "https://docs.apphud.com/getting-started/sdk-integration ",
                description: (
                  <>
                    <a rel="nofollow" href="https://docs.apphud.com/getting-started/sdk-integration/ios">
                      iOS
                    </a>{" "}
                    <a rel="nofollow" href="https://docs.apphud.com/getting-started/sdk-integration/android">
                      Android
                    </a>
                  </>
                ),
                img: "installation",
              },

              {
                id: "3",
                title: "System status",
                img: "system-status",
                link: "https://status.apphud.com",
                rel: "nofollow",
                blank: true,
              },

              {
                id: "4",
                title: "Explore documentation",
                img: "doc",
                link: "https://docs.apphud.com/",
                rel: "nofollow",
                blank: true,
              },
            ]}
            docs
          >
            <>
              <span>Docs</span>
              <span>Docs</span>
            </>
          </Dropdown>

          <a rel="nofollow" href="https://blog.apphud.com">Blog</a>

          <Link href="/contact">Contact</Link>

          <a rel="nofollow" href="https://app.apphud.com/">Sign in</a>

          <a rel="nofollow" href="https://app.apphud.com/sign_up">Start for Free</a>
        </div>
      </div>
    </div>
  );
};

export default Header;
