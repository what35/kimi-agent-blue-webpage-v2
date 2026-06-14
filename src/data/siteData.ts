export interface Skill {
  name: string;
  level: number;
  shape: 'triangle' | 'circle' | 'zigzag' | 'wave' | 'dot';
  color: string;
  detail?: string;
}

export interface Hobby {
  name: string;
  detail?: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  desc: string;
  memphis: {
    shape: string;
    color: string;
    rotate: number;
  };
}

export interface Tool {
  id: string;
  name: string;
  tagline: string;
  category: string;
  memphis: {
    shape: string;
    primary: string;
    accent: string;
    badge?: string;
  };
  media: {
    cover: string;
    video?: string;
  };
  docs: string;
  download: {
    file: string;
    size: string;
    version: string;
    platforms: string[];
  };
  links: {
    demo: string;
    source: string;
  };
  updated: string;
}

export interface Idea {
  id: string;
  content: string;
  detail?: string;
  category: string;
  color: string;
  rotation: number;
  date: string;
}

export interface FoodSpot {
  id: string;
  name: string;      // 店名
  city: string;      // 城市
  province: string;  // 省份
  intro: string;     // 介绍（限制50字）
  rating: number;    // 评分 1-5
  x: number;         // 地图上的x坐标百分比 (0-100)
  y: number;         // 地图上的y坐标百分比 (0-100)
  date: string;      // 打卡日期
}

export interface SiteData {
  profile: {
    brand: {
      name: string;
      tagline: string;
      signature: string;
    };
    avatar: string;
    bio: string;
    skills: Skill[];
    hobbies: Hobby[];
    timeline: TimelineItem[];
    honors: string[];
  };
  tools: Tool[];
  ideas: Idea[];
  foodSpots: FoodSpot[];
  contact: {
    email: string;
    social: { name: string; url: string; icon: string }[];
  };
}

export const SITE_DATA: SiteData = {
  profile: {
    brand: {
      name: "dt1998",
      tagline: "爱捣鼓的猪猪侠忠实粉丝",
      signature: "在中建隧道做税务与信息化，用代码让财务工作更高效",
    },
    avatar: "/avatar.jpg",
    bio: "1998 年生于四川自贡，南京审计大学金融学 / 会计学双学位。2019 年入职中建隧道建设有限公司，从项目见习出纳成长为总部财务资金部税务与信息化骨干。相信技术的力量，正在探索 AI 大模型在财务领域的应用。",
    skills: [
      { name: "税务管理", level: 90, shape: "triangle", color: "#4F8CFF", detail: "负责中建隧道的税务管理工作，包括未认证发票清理、税金抵扣分析、税务检查应对等。利用 AI 工具大幅提升税务处理效率，发票匹配工具已在多个兄弟单位推广使用。" },
      { name: "财务信息化", level: 85, shape: "circle", color: "#86CCCA", detail: "主导财务信息化建设，开发多个内部工具解决实际业务痛点。包括制度查询助手、发票匹配工具、研发辅助账生成工具、工资表拆分工具等，累计节省数百小时人工操作。" },
      { name: "四川大学MPA在读", level: 80, shape: "zigzag", color: "#FFCE5C", detail: "2025年入学四川大学公共管理硕士（MPA），研究方向聚焦数字化治理与公共财政管理，期望将财务信息化实践与公共管理理论结合。" },
      { name: "基层项目经验", level: 88, shape: "wave", color: "#5B6FA8", detail: "从正安至习水高速公路A7标段项目部见习出纳做起，积累了扎实的基层项目财务实操经验。熟悉项目全周期资金管理、成本核算和报表编制，为后续总部信息化建设奠定了业务基础。" },
      { name: "共青团工作", level: 75, shape: "dot", color: "#4F8CFF", detail: "积极参与共青团工作，获得2026年中建隧道优秀共青团干部、2025年中建五局优秀共青团员等荣誉。善于组织青年活动，带动团队氛围。" },
    ],
    hobbies: [
      { name: "猪猪侠忠实粉丝", detail: "从小看猪猪侠长大，喜欢它的勇敢和乐观。收藏猪猪侠周边，关注每一次新作品上映。" },
      { name: "研究 AI 新工具", detail: "每天花至少一小时研究最新的 AI 工具和大模型应用。喜欢把学到的东西做成小工具，解决工作中的实际问题。" },
      { name: "像素风游戏", detail: "喜欢玩像素风格的独立游戏，被那种用最简单的方块创造无限世界的创意打动。" },
      { name: "手账记录", detail: "用手账记录每天的学习和工作心得，习惯把复杂的技术问题用简单的手绘图解方式整理下来。" },
      { name: "探索 Memphis 设计", detail: "被 Memphis Design 的大胆撞色和不规则几何形状深深吸引，这个网站就是我的实验品。" },
    ],
    timeline: [
      {
        year: "2025",
        title: "四川大学 MPA",
        desc: "入学四川大学公共管理硕士",
        memphis: { shape: "circle", color: "#4F8CFF", rotate: -3 },
      },
      {
        year: "2021",
        title: "税务与信息化",
        desc: "调入总部财务资金部，负责税务管理与信息化建设",
        memphis: { shape: "circle", color: "#86CCCA", rotate: -5 },
      },
      {
        year: "2020",
        title: "项目部出纳",
        desc: "正安至习水高速公路 A7 标段项目部见习出纳",
        memphis: { shape: "triangle", color: "#FFCE5C", rotate: 3 },
      },
      {
        year: "2019",
        title: "毕业入职",
        desc: "南京审计大学双学位毕业，进入中建隧道",
        memphis: { shape: "wave", color: "#5B6FA8", rotate: -2 },
      },
    ],
    honors: [
      "2026年 中建五局人工智能大模型青年应用能手",
      "2026年 中建隧道优秀共青团干部",
      "2025年 中建五局优秀共青团员",
      "2023年 中建隧道十佳青年",
    ],
  },

  tools: [
    {
      id: "system-query",
      name: "制度查询助手",
      tagline: "依托中建 AI 平台，几十秒内查询制度原文并溯源",
      category: "制度应用",
      memphis: { shape: "triangle", primary: "#4F8CFF", accent: "#FFCE5C", badge: "NEW" },
      media: { cover: "/tool-system.jpg" },
      docs: `## 功能介绍\n\n制度查询助手依托中建 AI 平台搭建，旨在帮助员工快速查询制度规范。单次查询从 5 分钟压缩到 30 秒，效率提升超过九成。\n\n### 核心功能\n\n- **AI 制度查询**：基于中建 AI 平台，智能检索制度原文\n- **原文溯源**：自动定位到制度出处，确保权威准确\n- **零基础搭建**：已将搭建方法形成操作指引，共享给局财务信息化\n- **跨线条推广**：具备向其他业务线条推广的条件\n\n## 效果数据\n\n- 查询时间：5 分钟 → 30 秒\n- 效率提升：90%+\n- 已形成标准化操作指引\n\n## 技术栈\n\n- **中建 AI 平台** - 大模型底座\n- **RAG 检索增强** - 制度文档索引\n- **自然语言处理** - 语义理解与匹配`,
      download: { file: "#", size: "Web", version: "2.0", platforms: ["web"] },
      links: { demo: "#", source: "#" },
      updated: "2026-05",
    },
    {
      id: "invoice-match",
      name: "发票匹配工具",
      tagline: "AI 辅助编码，未认证发票与 SAP 项目客商智能匹配",
      category: "工作应用",
      memphis: { shape: "circle", primary: "#86CCCA", accent: "#5B6FA8" },
      media: { cover: "/tool-invoice.jpg" },
      docs: `## 功能介绍\n\n未认证发票清理是税务管理的重要工作，直接影响税金抵扣和资金流出。发票匹配工具将未认证发票池与 SAP 项目客商智能匹配，精确输出每张发票的可能归属项目。\n\n### 核心功能\n\n- **智能匹配**：AI 辅助编码，将发票数据与 SAP 项目客商自动匹配\n- **精确归属**：输出每张发票的可能归属项目\n- **月度分析**：每月向局做一次分析报告\n- **兄弟单位复用**：已在多个兄弟单位推广使用\n\n## 效果数据\n\n- 匹配效率：大幅提升\n- 精确度：智能匹配，人工复核即可\n- 已推广至多个兄弟单位\n\n## 技术栈\n\n- **AI 辅助编码** - 匹配算法开发\n- **SAP 数据接口** - 项目客商数据读取\n- **Python** - 数据处理与匹配引擎`,
      download: { file: "#", size: "12MB", version: "1.5", platforms: ["win"] },
      links: { demo: "#", source: "#" },
      updated: "2026-04",
    },
    {
      id: "rd-ledger",
      name: "研发辅助账自动生成工具",
      tagline: "SAP 数据一键生成符合总局检查要求的研发支出辅助账",
      category: "审核应用",
      memphis: { shape: "zigzag", primary: "#FFCE5C", accent: "#4F8CFF", badge: "HOT" },
      media: { cover: "/tool-ledger.jpg" },
      docs: `## 功能介绍\n\n国税总局入驻检查时，要求两天内提供全局研发费用的格式化台账。本工具将 SAP 数据一键生成符合总局检查要求的《研发支出辅助账》，单项目处理时间压缩到分钟级。\n\n### 核心功能\n\n- **一键生成**：导入 SAP 研发辅助明细账，自动生成格式化台账\n- **格式转换**：自动将 SAP 数据转换为总局检查要求的标准格式\n- **批量处理**：支持一个公司批量生成上百个课题的文件\n- **智能审核（升级中）**：自动审核课题结构是否合理、摘要是否合规\n\n## 效果数据\n\n- 单项目处理时间：压缩到分钟级\n- 曾帮助一个公司批量生成上百个课题文件\n\n## 技术栈\n\n- **AI 辅助写代码** - 逻辑开发\n- **SAP 数据解析** - 辅助明细账读取\n- **Python** - 数据处理与格式化`,
      download: { file: "#", size: "18MB", version: "3.0", platforms: ["win"] },
      links: { demo: "#", source: "#" },
      updated: "2026-06",
    },
    {
      id: "salary-split",
      name: "工资表快速拆分工具",
      tagline: "导入算税后的工资总表，两分钟按项目生成标准工资表",
      category: "协同应用",
      memphis: { shape: "wave", primary: "#5B6FA8", accent: "#86CCCA" },
      media: { cover: "/tool-salary.jpg" },
      docs: `## 功能介绍\n\n每月薪酬管理中，需要先做工资表、算税、再把个税一个个粘贴，虽有 VLOOKUP 等函数仍需 2 天，手工粘贴极易出错。本工具导入算完税后的工资总表，两分钟内按项目生成标准工资表，零差错。\n\n### 核心功能\n\n- **一键拆分**：导入算税后的工资总表，按项目自动拆分\n- **标准格式**：生成符合公司标准的工资表\n- **PDF 导出**：支持导出标准格式 PDF\n- **零差错**：自动化处理，避免手工粘贴错误\n\n## 效果数据\n\n- 处理时间：2 天 → 2 分钟\n- 差错率：零差错\n- 已对接人力部薪酬管理流程\n\n## 技术栈\n\n- **Python** - 数据处理引擎\n- **Excel 自动化** - 表格读写与格式化\n- **PDF 生成** - 标准格式导出`,
      download: { file: "#", size: "8MB", version: "1.2", platforms: ["win"] },
      links: { demo: "#", source: "#" },
      updated: "2026-03",
    },
  ],

  ideas: [
    {
      id: "idea-01",
      content: "做一个把梦境转换成 SVG 动画的工具",
      detail: "每个人每晚都会做梦，有些梦境非常精彩但醒来后很快就忘了。如果能有一个工具，可以在刚醒来的第一时间用语音描述梦境，然后 AI 自动将其转换成 SVG 动画，那一定会很有意思。可以用 Three.js 做简单的 3D 效果，或者用纯 SVG + CSS 动画实现 2D 版本。",
      category: "产品脑洞",
      color: "#4F8CFF",
      rotation: -3,
      date: "2026-06-10",
    },
    {
      id: "idea-02",
      content: "Memphis 风格的代码编辑器主题一定很好看",
      detail: "现在的代码编辑器主题都太沉闷了，不是深色就是浅色。如果做一个 Memphis Design 风格的 VS Code 主题，用高饱和度的撞色来区分不同的代码元素——关键字用亮粉色，字符串用明黄色，注释用波浪线边框...每次写代码都像在画画。",
      category: "设计",
      color: "#FFCE5C",
      rotation: 2,
      date: "2026-05-28",
    },
    {
      id: "idea-03",
      content: "用 AI 自动给老旧网站做 Memphis 风格改造",
      detail: "很多政府网站和企业内网都是十年前的设计风格，灰白配色、表格堆砌。如果有一个工具，可以自动分析网站的 DOM 结构和配色，然后用 AI 生成 Memphis Design 风格的 CSS 覆盖层，一键让这些网站变得活泼有趣。",
      category: "技术",
      color: "#86CCCA",
      rotation: -1,
      date: "2026-05-15",
    },
    {
      id: "idea-04",
      content: "开发一个根据心情推荐几何配色的 Chrome 插件",
      detail: "每天的心情不同，看到的颜色也应该不同。做一个 Chrome 插件，用户每天选择心情（开心/平静/焦虑/兴奋），插件自动推荐一组 Memphis 风格的几何配色，并用 SVG 在 New Tab 页面上生成对应的几何图案。",
      category: "产品脑洞",
      color: "#5B6FA8",
      rotation: 4,
      date: "2026-04-20",
    },
    {
      id: "idea-05",
      content: "做一个能识别手写草图并转成 React 组件的工具",
      detail: "产品经理和设计师经常在白板上画草图，然后前端需要花时间还原。如果有一个工具，拍照上传白板草图，AI 自动识别 UI 元素并生成对应的 React + Tailwind 代码，原型到代码的距离可以缩短到秒级。",
      category: "技术",
      color: "#86CCCA",
      rotation: -2,
      date: "2026-06-05",
    },
    {
      id: "idea-06",
      content: "把个人网站做成一个可交互的 3D 房间",
      detail: "用 Three.js 做一个可以 walkthrough 的 3D 房间，每个区域对应不同的内容板块。书架上放着工具箱，墙面上贴着想法便签，桌子上放着联系方式明信片。用 WASD 控制人物在房间里走动，鼠标点击物品查看详情。",
      category: "设计",
      color: "#FFCE5C",
      rotation: 3,
      date: "2026-03-30",
    },
  ],

  foodSpots: [
    {
      id: "food-01",
      name: "蜀大侠火锅",
      city: "成都",
      province: "四川",
      intro: "春熙路附近的老火锅店，麻辣牛肉和毛肚必点，排队两小时也要吃。",
      rating: 5,
      x: 42,
      y: 56,
      date: "2025-10",
    },
    {
      id: "food-02",
      name: "南京大排档",
      city: "南京",
      province: "江苏",
      intro: "夫子庙店的盐水鸭和鸭血粉丝汤，南京味道的代表，每次去必打卡。",
      rating: 4,
      x: 74,
      y: 46,
      date: "2024-06",
    },
    {
      id: "food-03",
      name: "文和友小龙虾",
      city: "长沙",
      province: "湖南",
      intro: "海信广场店，复古装修很有感觉，口味虾和猪油拌饭绝了。",
      rating: 5,
      x: 62,
      y: 62,
      date: "2025-04",
    },
    {
      id: "food-04",
      name: "点都德",
      city: "广州",
      province: "广东",
      intro: "金沙红米肠和虾饺皇，早茶首选，人均不到一百吃到撑。",
      rating: 4,
      x: 66,
      y: 74,
      date: "2024-11",
    },
  ],

  contact: {
    email: "hello@dt1998.com",
    social: [
      { name: "GitHub", url: "#", icon: "github" },
      { name: "Twitter", url: "#", icon: "twitter" },
      { name: "Bilibili", url: "#", icon: "video" },
    ],
  },
};
