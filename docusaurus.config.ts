import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'SciForge 使用文档',
  tagline: '从科研问题到可复查证据',
  favicon: 'img/brand/sciforge-icon.svg',

  future: {
    v4: true,
  },

  url: 'https://hanhuiyang5-web.github.io',
  baseUrl: '/sciforge-docs/',
  organizationName: 'hanhuiyang5-web',
  projectName: 'sciforge-docs',
  trailingSlash: false,
  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
    localeConfigs: {
      'zh-Hans': {
        label: '简体中文',
        htmlLang: 'zh-CN',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/hanhuiyang5-web/sciforge-docs/edit/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docs/quickstart/quickstart-first-task.jpg',
    metadata: [
      {
        name: 'keywords',
        content:
          'SciForge, 科研智能体, Codex, Claude Code, 虚拟细胞, 可复现研究',
      },
    ],
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'source_verified',
      content:
        '文档内容以 SciForge 当前源码与真实界面为准；实验性能力会明确标注。',
      backgroundColor: '#e7f7f2',
      textColor: '#153b34',
      isCloseable: true,
    },
    navbar: {
      title: 'SciForge Docs',
      logo: {
        alt: 'SciForge',
        src: 'img/brand/sciforge-icon.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: '使用文档',
        },
        {
          to: '/docs/category/端到端案例',
          label: '案例',
          position: 'left',
        },
        {
          to: '/docs/category/功能与扩展',
          label: '功能与扩展',
          position: 'left',
        },
        {
          href: 'https://github.com/hanhuiyang5-web/sciforge-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '开始使用',
          items: [
            {label: '五分钟快速开始', to: '/docs/getting-started/five-minute-quickstart'},
            {label: 'Runtime 与模型', to: '/docs/getting-started/runtime-and-models'},
            {label: '只读沙箱', to: '/docs/getting-started/read-only-sandbox'},
          ],
        },
        {
          title: '科研案例',
          items: [
            {label: '虚拟细胞证据图', to: '/docs/cases/virtual-cell-evidence-atlas'},
            {label: '扰动预测评测', to: '/docs/cases/virtual-cell-benchmark'},
          ],
        },
        {
          title: '更多',
          items: [
            {label: '功能状态', to: '/docs/reference/feature-status'},
            {label: '故障排查', to: '/docs/reference/troubleshooting'},
            {label: 'GitHub', href: 'https://github.com/hanhuiyang5-web/sciforge-docs'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SciForge Documentation.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'python'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
