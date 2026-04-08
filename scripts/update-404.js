import fs from 'fs';
import path from 'path';

// 读取构建后的index.html文件
const indexHtmlPath = path.join(import.meta.dirname, '../docs/index.html');
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

// 提取脚本和样式的引用路径
const scriptMatch = indexHtmlContent.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
const cssMatch = indexHtmlContent.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);

if (scriptMatch && cssMatch) {
  const scriptSrc = scriptMatch[1];
  const cssHref = cssMatch[1];
  
  // 读取404.html文件
  const fourOhFourPath = path.join(import.meta.dirname, '../docs/404.html');
  let fourOhFourContent = fs.readFileSync(fourOhFourPath, 'utf8');
  
  // 更新脚本和样式的引用路径
  fourOhFourContent = fourOhFourContent
    .replace(/<script type="module" crossorigin src="[^"]+"><\/script>/, `<script type="module" crossorigin src="${scriptSrc}"></script>`)
    .replace(/<link rel="stylesheet" crossorigin href="[^"]+">/, `<link rel="stylesheet" crossorigin href="${cssHref}">`);
  
  // 写回404.html文件
  fs.writeFileSync(fourOhFourPath, fourOhFourContent);
  console.log('Updated 404.html with correct asset paths');
} else {
  console.error('Could not find script or css references in index.html');
}