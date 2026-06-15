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
  province: string;  // 省份
  city: string;      // 城市
  district?: string; // 区/县（直辖市填区，非直辖市填县/区）
  intro: string;     // 介绍（限制50字）
  rating: number;    // 评分 1-5
  lat: number;       // 纬度 (18-54)
  lng: number;       // 经度 (73-135)
  x: number;         // 地图上的x坐标百分比 (0-100)，由 lat/lng 计算
  y: number;         // 地图上的y坐标百分比 (0-100)
  date: string;      // 打卡日期
}

/** Convert lat/lng to map x/y percentage */
export function latLngToXY(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - 73) / 62) * 100;
  const y = ((54 - lat) / 36) * 100;
  return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
}

/** Convert map x/y percentage to lat/lng */
export function xyToLatLng(x: number, y: number): { lat: number; lng: number } {
  const lng = 73 + (x / 100) * 62;
  const lat = 54 - (y / 100) * 36;
  return { lat, lng };
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
      signature: "在中建隧道做税务与信息化，用创新思维工作更高效",
    },
    avatar: "/avatar.jpg",
    bio: "1998 年生于四川，南京审计大学会计学专业毕业。2019 年入职中建隧道建设有限公司，历经项目-总部岗位。相信技术改变生活，正在探索 AI 大模型在财务领域的应用。",
    skills: [
      {
        name: "税务管理",
        level: 90,
        shape: "triangle",
        color: "#4F8CFF",
        detail: "负责中建隧道的税务管理工作，包括未认证发票清理、税金抵扣分析、税务检查应对等。利用 AI 工具大幅提升税务处理效率，发票匹配工具已在多个兄弟单位推广使用。",
      },
      {
        name: "财务信息化",
        level: 85,
        shape: "circle",
        color: "#86CCCA",
        detail: "主导财务信息化建设，开发多个内部工具解决实际业务痛点。包括制度查询助手、发票匹配工具、研发辅助账生成工具、工资表拆分工具等，累计节省数百小时人工操作。",
      },
      {
        name: "四川大学MPA在读",
        level: 80,
        shape: "zigzag",
        color: "#FFCE5C",
        detail: "2025年入学四川大学公共管理硕士（MPA），研究方向聚焦数字化治理与公共财政管理，期望将财务信息化实践与公共管理理论结合。",
      },
      {
        name: "基层项目经验",
        level: 88,
        shape: "wave",
        color: "#5B6FA8",
        detail: "从正安至习水高速公路A7标段项目部见习出纳做起，积累了扎实的基层项目财务实操经验。熟悉项目全周期资金管理、成本核算和报表编制，为后续总部信息化建设奠定了业务基础。",
      },
      {
        name: "vibe coding",
        level: 75,
        shape: "dot",
        color: "#4F8CFF",
        detail: "用轻松、直觉驱动的方式与 AI 协作，把想法快速变成可用的小工具。",
      },
    ],
    hobbies: [
      {
        name: "猪猪侠忠实粉丝",
        detail: "猪门永存",
      },
      {
        name: "研究 AI 新工具",
        detail: "每天花至少一小时研究最新的 AI 工具和大模型应用。喜欢把学到的东西做成小工具，解决工作中的实际问题。",
      },
      {
        name: "游戏爱好者",
        detail: "喜欢玩各种类型的游戏，从像素风独立游戏到 3A 大作都感兴趣。",
      },
      {
        name: "港乐爱好者",
        detail: "最喜欢的女歌手是容祖儿（不唱挥着翅膀的女孩版）",
      },
      {
        name: "老吃家",
        detail: "热爱探索各地美食，喜欢找藏在巷子里的宝藏小店。",
      },
    ],
    timeline: [
      {
        year: "2025",
        title: "四川大学 MPA",
        desc: "入学四川大学公共管理硕士",
        memphis: {
          shape: "circle",
          color: "#4F8CFF",
          rotate: -3,
        },
      },
      {
        year: "2021",
        title: "税务与信息化",
        desc: "调入总部财务资金部，负责税务管理与信息化建设",
        memphis: {
          shape: "circle",
          color: "#86CCCA",
          rotate: -5,
        },
      },
      {
        year: "2020",
        title: "项目部出纳",
        desc: "正安至习水高速公路 A7 标段项目部见习出纳",
        memphis: {
          shape: "triangle",
          color: "#FFCE5C",
          rotate: 3,
        },
      },
      {
        year: "2019",
        title: "毕业入职",
        desc: "南京审计大学双学位毕业，进入中建隧道",
        memphis: {
          shape: "wave",
          color: "#5B6FA8",
          rotate: -2,
        },
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
      memphis: {
        shape: "triangle",
        primary: "#4F8CFF",
        accent: "#FFCE5C",
        badge: "NEW",
      },
      media: {
        cover: "/tool-system.jpg",
      },
      docs: `## 功能介绍

制度查询助手依托中建 AI 平台搭建，旨在帮助员工快速查询制度规范。单次查询从 5 分钟压缩到 30 秒，效率提升超过九成。

### 核心功能

- **AI 制度查询**：基于中建 AI 平台，智能检索制度原文
- **原文溯源**：自动定位到制度出处，确保权威准确
- **零基础搭建**：已将搭建方法形成操作指引，共享给局财务信息化
- **跨线条推广**：具备向其他业务线条推广的条件

## 效果数据

- 查询时间：5 分钟 → 30 秒
- 效率提升：90%+
- 已形成标准化操作指引

## 技术栈

- **中建 AI 平台** - 大模型底座
- **RAG 检索增强** - 制度文档索引
- **自然语言处理** - 语义理解与匹配`,
      download: {
        file: "#",
        size: "Web",
        version: "2.0",
        platforms: [
          "web",
        ],
      },
      links: {
        demo: "#",
        source: "#",
      },
      updated: "2026-05",
    },
    {
      id: "invoice-match",
      name: "发票匹配工具",
      tagline: "AI 辅助编码，未认证发票与 SAP 项目客商智能匹配",
      category: "工作应用",
      memphis: {
        shape: "circle",
        primary: "#86CCCA",
        accent: "#5B6FA8",
      },
      media: {
        cover: "/tool-invoice.jpg",
      },
      docs: `## 功能介绍

未认证发票清理是税务管理的重要工作，直接影响税金抵扣和资金流出。发票匹配工具将未认证发票池与 SAP 项目客商智能匹配，精确输出每张发票的可能归属项目。

### 核心功能

- **智能匹配**：AI 辅助编码，将发票数据与 SAP 项目客商自动匹配
- **精确归属**：输出每张发票的可能归属项目
- **月度分析**：每月向局做一次分析报告
- **兄弟单位复用**：已在多个兄弟单位推广使用

## 效果数据

- 匹配效率：大幅提升
- 精确度：智能匹配，人工复核即可
- 已推广至多个兄弟单位

## 技术栈

- **AI 辅助编码** - 匹配算法开发
- **SAP 数据接口** - 项目客商数据读取
- **Python** - 数据处理与匹配引擎`,
      download: {
        file: "#",
        size: "12MB",
        version: "1.5",
        platforms: [
          "win",
        ],
      },
      links: {
        demo: "#",
        source: "#",
      },
      updated: "2026-04",
    },
    {
      id: "rd-ledger",
      name: "研发辅助账自动生成工具",
      tagline: "SAP 数据一键生成符合总局检查要求的研发支出辅助账",
      category: "审核应用",
      memphis: {
        shape: "zigzag",
        primary: "#FFCE5C",
        accent: "#4F8CFF",
        badge: "HOT",
      },
      media: {
        cover: "/tool-ledger.jpg",
      },
      docs: `## 功能介绍

国税总局入驻检查时，要求两天内提供全局研发费用的格式化台账。本工具将 SAP 数据一键生成符合总局检查要求的《研发支出辅助账》，单项目处理时间压缩到分钟级。

### 核心功能

- **一键生成**：导入 SAP 研发辅助明细账，自动生成格式化台账
- **格式转换**：自动将 SAP 数据转换为总局检查要求的标准格式
- **批量处理**：支持一个公司批量生成上百个课题的文件
- **智能审核（升级中）**：自动审核课题结构是否合理、摘要是否合规

## 效果数据

- 单项目处理时间：压缩到分钟级
- 曾帮助一个公司批量生成上百个课题文件

## 技术栈

- **AI 辅助写代码** - 逻辑开发
- **SAP 数据解析** - 辅助明细账读取
- **Python** - 数据处理与格式化`,
      download: {
        file: "#",
        size: "18MB",
        version: "3.0",
        platforms: [
          "win",
        ],
      },
      links: {
        demo: "#",
        source: "#",
      },
      updated: "2026-06",
    },
    {
      id: "salary-split",
      name: "工资表快速拆分工具",
      tagline: "导入算税后的工资总表，两分钟按项目生成标准工资表",
      category: "协同应用",
      memphis: {
        shape: "wave",
        primary: "#5B6FA8",
        accent: "#86CCCA",
      },
      media: {
        cover: "/tool-salary.jpg",
      },
      docs: `## 功能介绍

每月薪酬管理中，需要先做工资表、算税、再把个税一个个粘贴，虽有 VLOOKUP 等函数仍需 2 天，手工粘贴极易出错。本工具导入算完税后的工资总表，两分钟内按项目生成标准工资表，零差错。

### 核心功能

- **一键拆分**：导入算税后的工资总表，按项目自动拆分
- **标准格式**：生成符合公司标准的工资表
- **PDF 导出**：支持导出标准格式 PDF
- **零差错**：自动化处理，避免手工粘贴错误

## 效果数据

- 处理时间：2 天 → 2 分钟
- 差错率：零差错
- 已对接人力部薪酬管理流程

## 技术栈

- **Python** - 数据处理引擎
- **Excel 自动化** - 表格读写与格式化
- **PDF 生成** - 标准格式导出`,
      download: {
        file: "#",
        size: "8MB",
        version: "1.2",
        platforms: [
          "win",
        ],
      },
      links: {
        demo: "#",
        source: "#",
      },
      updated: "2026-03",
    },
  ],
  ideas: [
    {
      id: "idea-01",
      content: "研发费用审核软件",
      detail: "每月处理研发费用时，需要人工核对 SAP 数据、辅助账和大量凭证，耗时且容易遗漏。如果能做一个审核软件，自动读取项目数据，结合 AI 判断研发费用的合规性，并输出审核报告，将大幅提升审核效率和准确性。",
      category: "设计",
      color: "#4F8CFF",
      rotation: -3,
      date: "2026-05-28",
    },
  ],
  foodSpots: [
    {
      name: "齐齐哈尔烤肉",
      province: "重庆",
      city: "重庆",
      district: "巴南区",
      intro: "美味的东北烤肉",
      rating: 5,
      lat: 32.3925,
      lng: 106.77,
      x: 54.46774193548386,
      y: 60.020833333333336,
      date: "2026-06",
      id: "food-1781530138988",
    },
  ],
  contact: {
    email: "hello@dt1998.com",
    social: [
      {
        name: "GitHub",
        url: "#",
        icon: "github",
      },
      {
        name: "Twitter",
        url: "#",
        icon: "twitter",
      },
      {
        name: "Bilibili",
        url: "#",
        icon: "video",
      },
    ],
  },
};

/** Serialize the SITE_DATA object back to a TypeScript snippet that can be merged into siteData.ts. */
export function serializeSiteData(data: SiteData): string {
  const indent = (depth: number) => '  '.repeat(depth);

  function serializeValue(value: unknown, depth: number): string {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'string') {
      if (value.includes('\n') || value.includes('"') || value.includes("'") || value.includes('`')) {
        return '`' + value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$') + '`';
      }
      return JSON.stringify(value);
    }
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      const items = value.map((item) => serializeValue(item, depth + 1)).join(',\n' + indent(depth + 1));
      return `[\n${indent(depth + 1)}${items},\n${indent(depth)}]`;
    }
    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${k}: ${serializeValue(v, depth + 1)}`)
        .join(',\n' + indent(depth + 1));
      if (!entries) return '{}';
      return `{\n${indent(depth + 1)}${entries},\n${indent(depth)}}`;
    }
    return JSON.stringify(value);
  }

  return `export const SITE_DATA: SiteData = ${serializeValue(data, 0)};\n`;
}
