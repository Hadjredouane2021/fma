/**
 * Génère un PDF à partir d'un fichier Markdown dans docs/
 * Usage :
 *   npm run docs:manuel          → manuel site public
 *   npm run docs:manuel:admin    → manuel administration
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { marked } from "marked";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const defaultMd = path.join(root, "docs", "manuel-site-public.md");
const mdPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultMd;
const pdfPath = mdPath.replace(/\.md$/i, ".pdf");

const md = fs.readFileSync(mdPath, "utf8");
const bodyHtml = marked.parse(md);

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Manuel site public FMA</title>
  <style>
    @page { margin: 18mm 16mm 20mm; }
    * { box-sizing: border-box; }
    body {
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      font-size: 10.5pt;
      line-height: 1.55;
      color: #1a2332;
      max-width: 100%;
    }
    h1 {
      font-size: 22pt;
      color: #7b1e3a;
      border-bottom: 2px solid #c9a86c;
      padding-bottom: 0.35em;
      margin-top: 0;
    }
    h2 {
      font-size: 14pt;
      color: #7b1e3a;
      margin-top: 1.6em;
      page-break-after: avoid;
    }
    h3 {
      font-size: 11.5pt;
      color: #2d3a4a;
      margin-top: 1.2em;
      page-break-after: avoid;
    }
    p, li { orphans: 3; widows: 3; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #d4d8de;
      padding: 0.45em 0.6em;
      text-align: left;
      vertical-align: top;
    }
    th { background: #f4f0f2; font-weight: 700; }
    tr:nth-child(even) td { background: #fafbfc; }
    hr {
      border: none;
      border-top: 1px solid #e2e6ea;
      margin: 1.5em 0;
    }
    strong { color: #2d3a4a; }
    em { color: #5a6573; }
    code {
      font-size: 9pt;
      background: #f0f2f5;
      padding: 0.1em 0.35em;
      border-radius: 3px;
    }
    ul, ol { padding-left: 1.4em; }
    li { margin: 0.25em 0; }
    blockquote {
      margin: 1em 0;
      padding: 0.5em 1em;
      border-left: 3px solid #7b1e3a;
      background: #faf8f9;
      color: #5a6573;
    }
  </style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log(`PDF généré : ${pdfPath}`);
} finally {
  await browser.close();
}
