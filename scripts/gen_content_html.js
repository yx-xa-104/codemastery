// Script to generate content_html UPDATE statements for all freeCodeCamp lessons
// Reads MDX files and converts to simple HTML, then appends UPDATE SQL to seed file

const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '..', 'content');
const sqlFile = path.join(__dirname, '..', 'supabase', 'seed_freecodecamp.sql');

// Lesson ID to MDX file mapping
const lessonMap = [
  // Course 1: Responsive Web Design
  ['fcc30001-0000-4000-a000-000000000001', 'responsive-web-design/01-html-structure.mdx'],
  ['fcc30002-0000-4000-a000-000000000001', 'responsive-web-design/02-html-forms-media.mdx'],
  ['fcc30003-0000-4000-a000-000000000001', 'responsive-web-design/03-html-practice.mdx'],
  ['fcc30004-0000-4000-a000-000000000001', 'responsive-web-design/04-css-selectors.mdx'],
  ['fcc30005-0000-4000-a000-000000000001', 'responsive-web-design/05-css-box-model.mdx'],
  ['fcc30006-0000-4000-a000-000000000001', 'responsive-web-design/06-css-practice.mdx'],
  ['fcc30007-0000-4000-a000-000000000001', 'responsive-web-design/07-visual-design.mdx'],
  ['fcc30008-0000-4000-a000-000000000001', 'responsive-web-design/08-css-animation.mdx'],
  ['fcc30009-0000-4000-a000-000000000001', 'responsive-web-design/09-accessibility.mdx'],
  ['fcc3000a-0000-4000-a000-000000000001', 'responsive-web-design/10-flexbox.mdx'],
  ['fcc3000b-0000-4000-a000-000000000001', 'responsive-web-design/11-grid.mdx'],
  ['fcc3000c-0000-4000-a000-000000000001', 'responsive-web-design/12-responsive-practice.mdx'],
  // Course 2: JavaScript
  ['fcc3000d-0000-4000-a000-000000000001', 'javascript-fcc/01-js-variables.mdx'],
  ['fcc3000e-0000-4000-a000-000000000001', 'javascript-fcc/02-js-conditions.mdx'],
  ['fcc3000f-0000-4000-a000-000000000001', 'javascript-fcc/03-js-basic-practice.mdx'],
  ['fcc30010-0000-4000-a000-000000000001', 'javascript-fcc/04-es6-basics.mdx'],
  ['fcc30011-0000-4000-a000-000000000001', 'javascript-fcc/05-es6-destructuring.mdx'],
  ['fcc30012-0000-4000-a000-000000000001', 'javascript-fcc/06-es6-async.mdx'],
  ['fcc30013-0000-4000-a000-000000000001', 'javascript-fcc/07-js-arrays.mdx'],
  ['fcc30014-0000-4000-a000-000000000001', 'javascript-fcc/08-js-objects.mdx'],
  ['fcc30015-0000-4000-a000-000000000001', 'javascript-fcc/09-js-map-set.mdx'],
  ['fcc30016-0000-4000-a000-000000000001', 'javascript-fcc/10-algo-string.mdx'],
  ['fcc30017-0000-4000-a000-000000000001', 'javascript-fcc/11-algo-sort.mdx'],
  ['fcc30018-0000-4000-a000-000000000001', 'javascript-fcc/12-algo-practice.mdx'],
  ['fcc30019-0000-4000-a000-000000000001', 'javascript-fcc/13-fp-concepts.mdx'],
  ['fcc3001a-0000-4000-a000-000000000001', 'javascript-fcc/14-fp-hof.mdx'],
  ['fcc3001b-0000-4000-a000-000000000001', 'javascript-fcc/15-fp-practice.mdx'],
  // Course 3: Frontend Libraries
  ['fcc3001c-0000-4000-a000-000000000001', 'frontend-libraries/01-bootstrap-grid.mdx'],
  ['fcc3001d-0000-4000-a000-000000000001', 'frontend-libraries/02-jquery-dom.mdx'],
  ['fcc3001e-0000-4000-a000-000000000001', 'frontend-libraries/03-jquery-events.mdx'],
  ['fcc3001f-0000-4000-a000-000000000001', 'frontend-libraries/04-sass-basics.mdx'],
  ['fcc30020-0000-4000-a000-000000000001', 'frontend-libraries/05-sass-advanced.mdx'],
  ['fcc30021-0000-4000-a000-000000000001', 'frontend-libraries/06-sass-practice.mdx'],
  ['fcc30022-0000-4000-a000-000000000001', 'frontend-libraries/07-react-components.mdx'],
  ['fcc30023-0000-4000-a000-000000000001', 'frontend-libraries/08-react-state.mdx'],
  ['fcc30024-0000-4000-a000-000000000001', 'frontend-libraries/09-react-practice.mdx'],
  ['fcc30025-0000-4000-a000-000000000001', 'frontend-libraries/10-redux-basics.mdx'],
  ['fcc30026-0000-4000-a000-000000000001', 'frontend-libraries/11-redux-react.mdx'],
  ['fcc30027-0000-4000-a000-000000000001', 'frontend-libraries/12-redux-practice.mdx'],
  // Course 4: Python
  ['fcc30028-0000-4000-a000-000000000001', 'python-fcc/01-py-basics.mdx'],
  ['fcc30029-0000-4000-a000-000000000001', 'python-fcc/02-py-conditions.mdx'],
  ['fcc3002a-0000-4000-a000-000000000001', 'python-fcc/03-py-functions.mdx'],
  ['fcc3002b-0000-4000-a000-000000000001', 'python-fcc/04-py-lists.mdx'],
  ['fcc3002c-0000-4000-a000-000000000001', 'python-fcc/05-py-dicts.mdx'],
  ['fcc3002d-0000-4000-a000-000000000001', 'python-fcc/06-py-comprehensions.mdx'],
  ['fcc3002e-0000-4000-a000-000000000001', 'python-fcc/07-py-classes.mdx'],
  ['fcc3002f-0000-4000-a000-000000000001', 'python-fcc/08-py-inheritance.mdx'],
  ['fcc30030-0000-4000-a000-000000000001', 'python-fcc/09-py-oop-practice.mdx'],
  ['fcc30031-0000-4000-a000-000000000001', 'python-fcc/10-py-fileio.mdx'],
  ['fcc30032-0000-4000-a000-000000000001', 'python-fcc/11-py-regex.mdx'],
  ['fcc30033-0000-4000-a000-000000000001', 'python-fcc/12-py-modules.mdx'],
  // Course 5: Relational Databases
  ['fcc30034-0000-4000-a000-000000000001', 'relational-databases/01-bash-intro.mdx'],
  ['fcc30035-0000-4000-a000-000000000001', 'relational-databases/02-bash-filesystem.mdx'],
  ['fcc30036-0000-4000-a000-000000000001', 'relational-databases/03-bash-scripting.mdx'],
  ['fcc30037-0000-4000-a000-000000000001', 'relational-databases/04-sql-crud.mdx'],
  ['fcc30038-0000-4000-a000-000000000001', 'relational-databases/05-sql-joins.mdx'],
  ['fcc30039-0000-4000-a000-000000000001', 'relational-databases/06-sql-practice.mdx'],
  ['fcc3003a-0000-4000-a000-000000000001', 'relational-databases/07-pg-types.mdx'],
  ['fcc3003b-0000-4000-a000-000000000001', 'relational-databases/08-pg-advanced.mdx'],
  ['fcc3003c-0000-4000-a000-000000000001', 'relational-databases/09-pg-design.mdx'],
  // Course 6: Backend & APIs
  ['fcc3003d-0000-4000-a000-000000000001', 'backend-apis/01-node-intro.mdx'],
  ['fcc3003e-0000-4000-a000-000000000001', 'backend-apis/02-node-modules.mdx'],
  ['fcc3003f-0000-4000-a000-000000000001', 'backend-apis/03-node-practice.mdx'],
  ['fcc30040-0000-4000-a000-000000000001', 'backend-apis/04-express-routing.mdx'],
  ['fcc30041-0000-4000-a000-000000000001', 'backend-apis/05-express-req-res.mdx'],
  ['fcc30042-0000-4000-a000-000000000001', 'backend-apis/06-express-practice.mdx'],
  ['fcc30043-0000-4000-a000-000000000001', 'backend-apis/07-mongo-crud.mdx'],
  ['fcc30044-0000-4000-a000-000000000001', 'backend-apis/08-mongoose-schema.mdx'],
  ['fcc30045-0000-4000-a000-000000000001', 'backend-apis/09-mongo-practice.mdx'],
  ['fcc30046-0000-4000-a000-000000000001', 'backend-apis/10-api-design.mdx'],
  ['fcc30047-0000-4000-a000-000000000001', 'backend-apis/11-api-auth.mdx'],
  ['fcc30048-0000-4000-a000-000000000001', 'backend-apis/12-api-practice.mdx'],
];

// Simple markdown to HTML converter (no external deps)
function mdToHtml(md) {
  // Remove frontmatter
  md = md.replace(/^---[\s\S]*?---\s*/, '');

  let html = md
    // Code blocks first (before inline processing)
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      return `<pre><code class="language-${lang || 'text'}">${escaped}</code></pre>`;
    })
    // Tables
    .replace(/\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)*)/g, (_, header, rows) => {
      const ths = header.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
      const trs = rows.trim().split('\n').map(row => {
        const tds = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
        return `<tr>${tds}</tr>`;
      }).join('');
      return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
    })
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold and inline code
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Paragraphs: wrap non-tag text lines
    .replace(/^(?!<[a-z/]|$)(.+)$/gm, '<p>$1</p>')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return html;
}

function escapeSQL(str) {
  return str.replace(/'/g, "''");
}

// Generate UPDATE statements
let sql = '\n\n-- ============================================================================\n';
sql += '-- CONTENT_HTML updates for all 72 lessons\n';
sql += '-- ============================================================================\n\n';

let count = 0;
let errors = [];

for (const [lessonId, mdxPath] of lessonMap) {
  const fullPath = path.join(contentDir, mdxPath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing: ${mdxPath}`);
    continue;
  }

  const mdContent = fs.readFileSync(fullPath, 'utf-8');
  const htmlContent = mdToHtml(mdContent);
  const escaped = escapeSQL(htmlContent);

  sql += `UPDATE lessons SET content_html = '${escaped}' WHERE id = '${lessonId}';\n`;
  count++;
}

// Append to seed file
fs.appendFileSync(sqlFile, sql);

console.log(`✅ Appended ${count} content_html UPDATE statements to seed_freecodecamp.sql`);
if (errors.length > 0) {
  console.log(`⚠️ Errors: ${errors.join(', ')}`);
}
