import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: '快速开始',
      link: {type: 'generated-index', slug: '/category/快速开始'},
      items: [
        'getting-started/five-minute-quickstart',
        'getting-started/runtime-and-models',
        'getting-started/read-only-sandbox',
      ],
    },
    {
      type: 'category',
      label: '端到端案例',
      link: {type: 'generated-index', slug: '/category/端到端案例'},
      items: [
        'cases/overview',
        'cases/virtual-cell-evidence-atlas',
        'cases/virtual-cell-benchmark',
      ],
    },
    {
      type: 'category',
      label: '功能与扩展',
      link: {type: 'generated-index', slug: '/category/功能与扩展'},
      items: [
        'features/overview',
        'features/evidence-and-reproducibility',
        'features/automation',
        'features/extensions',
      ],
    },
    {
      type: 'category',
      label: '工作台指南',
      items: [
        'workbench/workspaces-and-sessions',
        'workbench/agent-workflows',
        'workbench/tools',
      ],
    },
    {
      type: 'category',
      label: '配置与运维',
      items: [
        'operations/security',
        'operations/remote-and-collaboration',
      ],
    },
    {
      type: 'category',
      label: '参考手册',
      items: [
        'reference/feature-status',
        'reference/troubleshooting',
      ],
    },
  ],
};

export default sidebars;
