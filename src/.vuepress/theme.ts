import { hopeTheme } from "vuepress-theme-hope";

export const theme = hopeTheme({
  logo: "/images/avatar.webp",
  hostname: "https://haipeng-lin.cn",
  author: "𝙝𝙖𝙥𝙥𝙮𝙝𝙖𝙞",
  darkmode: "toggle",
  repo: "https://github.com/haipeng-lin/vuepress-hope-blog",
  docsRepo: "https://github.com/haipeng-lin/vuepress-hope-blog",
  docsBranch: "main",
  docsDir: "src",

  iconAssets: "fontawesome",

  navbar: [
    { text: "随笔", link: "/posts/", icon: "blog" },
    { text: "后端", link: "/backend/", icon: "code" },
    { text: "AI应用", link: "/AI/", icon: "fa fa-robot" },
    {
      text: "备忘录",
      icon: "book",
      children: [
        { text: "部署", link: "/note/5.deploy.html" },
        { text: "Docker", link: "/note/3.Docker.html" },
        { text: "Git", link: "/note/1.Git.html" },
        { text: "Linux", link: "/note/2.Linux.html" },
        { text: "Maven", link: "/note/4.Maven.html" },
        { text: "Nginx", link: "/note/6.Nginx.html" },
      ],
    },
    {
      text: "更多",
      icon: "fa fa-th-large",
      children: [
        { text: "藏宝阁", link: "/more/movie/", icon: "fa fa-film" },
        { text: "诗词", link: "/more/poem/", icon: "fa fa-pen-fancy" },
        { text: "足迹", link: "/more/foot-map/", icon: "fa fa-map-marked-alt" },
      ],
    },
    {
      text: "好玩",
      icon: "fa fa-gamepad",
      children: [
        {
          text: "相册馆",
          link: "https://picture.haipeng-lin.cn",
          icon: "fa fa-images",
        },
        {
          text: "音乐馆",
          link: "https://music.haipeng-lin.cn",
          icon: "fa fa-music",
        },
        {
          text: "烟花秀",
          link: "https://firework.haipeng-lin.cn",
          icon: "fa fa-fire",
        },
        {
          text: "站点监测",
          link: "https://status.haipeng-lin.cn",
          icon: "fa fa-server",
        },
      ],
    },
  ],

  sidebar: {
    "/AI/": "structure",
    "/backend/": "structure",
    "/database/": "structure",
    "/note/": "structure",
    "/middleware/": "structure",
  },

  blog: {
    avatar: "",
    description: `<p style="text-align: left; font-size: 1.4rem; hyphens: auto; margin: 0;"><strong>关于我</strong></p>
                  <p style="text-align: left;">基本信息: </p>
                  <p style="text-align: left; text-indent: 2rem;">哈喽，很幸运遇见你。我叫𝙝𝙖𝙥𝙥𝙮𝙝𝙖𝙞👋, 是一名已工作一年多的全栈工程师社畜, 现阶段正在研究领域为AI与旅游相结合的领域🌈</p>
                  <p style="text-align: left; text-indent: 2rem;">2025年于<a href="https://www.zhku.edu.cn/" target="_blank">仲恺农业工程学院</a>取得计算机科学与技术学士学位。四年仲园时光，宝贵，难忘，怀念。</p>
                  <p style="text-align: left;"><span style="text-indent: 2rem;">微信: happyhai</span><br />
                  <span style="text-indent: 2rem;">邮箱: haipeng-lin@163.com</span>
                  </p>`,
  },

  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  contributors: true,
  lastUpdated: true,
  article: false,

  footer: "© Copyright 2024-2026 All Rights Reserved. 版权所有者：𝙝𝙖𝙥𝙥𝙮𝙝𝙖𝙞",

  markdown: {
    component: true,
  },

  displayFooter: true,

  plugins: {
    blog: true,

    comment: {
      provider: "Twikoo",
      envId: "https://twikoo.haipeng-lin.cn",
      region: "ap-guangzhou",
    },

    mdEnhance: {
      container: true,
      codeblock: {
        theme: "one-dark-pro",
        lineNumbers: true,
      },
      footnote: true,
      tasklist: true,
      mermaid: true,
      chart: true,
      sub: true,
      sup: true,
      vPre: true,
    },
  },
});
