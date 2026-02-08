import { MetadataRoute } from "next";
import { appConfig } from "../../app.config.mjs";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${appConfig.baseUrl}/sitemap.xml`,
  };
}
