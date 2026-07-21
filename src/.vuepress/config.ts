import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import { slimsearchPlugin } from "@vuepress/plugin-slimsearch";
import { theme } from "./theme";

export default defineUserConfig({
  lang: "zh-CN",
  title: "𝙝𝙖𝙥𝙥𝙮𝙝𝙖𝙞",
  description: "保持热爱，奔赴山海",

  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        size: "32x32",
        href: "/images/avatar.webp",
      },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
      },
    ],
    ["link", { rel: "stylesheet", href: "/css/custom.css" }],
    // [
    //   "script",
    //   {
    //     defer: true,
    //     src: "https://umami.haipeng-lin.cn/script.js",
    //     "data-website-id": "cd6d1d13-8962-4997-a516-a31e563bec5c",
    //     "data-domains": "blog.haipeng-lin.cn",
    //   },
    // ],
  ],

  bundler: viteBundler(),

  theme,

  plugins: [
    slimsearchPlugin({
      // 全文搜索
      indexContent: true,
      // 自定义字段
      customFields: [
        {
          name: "title",
          getter: (page) => page.frontmatter.title,
          formatter: "📁 $content",
        },
      ],
    }),
  ],
});
