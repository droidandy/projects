import { updateCache } from "../src/scripts/core/api/shopify.storefront/blog/cache";
import fetch from "cross-fetch";
global.fetch = fetch;

updateCache();
