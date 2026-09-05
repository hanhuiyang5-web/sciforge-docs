const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const sections = {'getting-started': '快速开始', cases: '端到端案例', features: '功能与扩展', workbench: '工作台指南', operations: '配置与运维', reference: '参考手册'};
const files = fs.readdirSync(path.join(root, 'docs'), {recursive: true}).filter(file => /\.mdx?$/.test(file)).sort();
const index = files.map(file => {
  const raw = fs.readFileSync(path.join(root, 'docs', file), 'utf8');
  const title = raw.match(/^title:\s*(.+)$/m)?.[1] || file;
  const description = raw.match(/^description:\s*(.+)$/m)?.[1] || '';
  const body = raw.replace(/^---[\s\S]*?---/, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[#*`|>]/g, ' ').replace(/:::[^\n]*/g, '').replace(/\s+/g, ' ').trim();
  return {title, description, body, section: sections[file.split(path.sep)[0]] || '文档导航', route: '/docs/' + file.replace(/\.mdx?$/, '').split(path.sep).join('/')};
});
fs.mkdirSync(path.join(root, 'src/data'), {recursive: true});
fs.writeFileSync(path.join(root, 'src/data/search-index.json'), JSON.stringify(index));
console.log(`Search index: ${index.length} pages`);
