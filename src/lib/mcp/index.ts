import { auth, defineMcp } from "@lovable.dev/mcp-js";

// Vite inlines the stable ref; the published SUPABASE_URL may be a proxy.
const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

import listEducationalPosts from "./tools/list-educational-posts";
import getEducationalPost from "./tools/get-educational-post";
import listResearchArticles from "./tools/list-research-articles";
import getResearchArticle from "./tools/get-research-article";
import listWeeklyReads from "./tools/list-weekly-reads";
import getMacroSnapshot from "./tools/get-macro-snapshot";
import listCountryIndicators from "./tools/list-country-indicators";
import listInterestRates from "./tools/list-interest-rates";

export default defineMcp({
  name: "macro-india-insights",
  title: "macro-india-insights",
  version: "0.1.0",
  instructions:
    "Tools for IndianMacro (indianmacro.com), an India-focused macroeconomics and markets publication. Use the read tools to list and fetch published educational posts, research articles and weekly reads, and to read the latest macro data (India at a glance, country economic indicators, and interest rates & bonds). Visibility of drafts follows the signed-in caller's permissions.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
    requireOAuthClientClaim: true,
  }),
  tools: [
    listEducationalPosts,
    getEducationalPost,
    listResearchArticles,
    getResearchArticle,
    listWeeklyReads,
    getMacroSnapshot,
    listCountryIndicators,
    listInterestRates,
  ],
});
