import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetDir = path.join(root, "public", "fonts", "gotham");
const licensedDir = path.join(root, "fonts-source", "gotham");
const montserratDir = path.join(root, "node_modules", "@fontsource", "montserrat", "files");

const licensedMap = [
  ["Gotham-Light.woff2", ["Gotham-Light.woff2", "GothamLight.woff2", "gotham-light.woff2"]],
  ["Gotham-Book.woff2", ["Gotham-Book.woff2", "GothamBook.woff2", "Gotham-Book.otf", "gotham-book.woff2"]],
  ["Gotham-Medium.woff2", ["Gotham-Medium.woff2", "GothamMedium.woff2", "gotham-medium.woff2"]],
  ["Gotham-Bold.woff2", ["Gotham-Bold.woff2", "GothamBold.woff2", "gotham-bold.woff2"]],
];

const interimMap = [
  ["Gotham-Light.woff2", "montserrat-latin-300-normal.woff2"],
  ["Gotham-Book.woff2", "montserrat-latin-400-normal.woff2"],
  ["Gotham-Medium.woff2", "montserrat-latin-500-normal.woff2"],
  ["Gotham-Bold.woff2", "montserrat-latin-700-normal.woff2"],
];

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  console.log(`  ✓ ${path.basename(to)}`);
}

function findLicensed(nameCandidates) {
  if (!fs.existsSync(licensedDir)) return null;
  for (const name of nameCandidates) {
    const full = path.join(licensedDir, name);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

fs.mkdirSync(targetDir, { recursive: true });

const allTargetsExist = licensedMap.every(([targetName]) =>
  fs.existsSync(path.join(targetDir, targetName))
);
if (allTargetsExist) {
  console.log("Polices Gotham déjà installées dans public/fonts/gotham/.");
  process.exit(0);
}

let mode = "licensed";
for (const [targetName, candidates] of licensedMap) {
  if (!findLicensed(candidates)) {
    mode = "interim";
    break;
  }
}

console.log(
  mode === "licensed"
    ? "Installation des fichiers Gotham licenciés (fonts-source/gotham/)…"
    : "Fichiers Gotham licenciés introuvables — secours Montserrat (provisoire)…\n  → Déposez vos .woff2 dans fonts-source/gotham/ puis relancez: npm run fonts:gotham"
);

for (const [targetName, candidates] of licensedMap) {
  const dest = path.join(targetDir, targetName);
  const licensed = findLicensed(candidates);
  if (licensed) {
    copyFile(licensed, dest);
    continue;
  }

  const interim = interimMap.find(([t]) => t === targetName)?.[1];
  const from = path.join(montserratDir, interim);
  if (!fs.existsSync(from)) {
    console.error(`  ✗ Source manquante: ${from}`);
    process.exit(1);
  }
  copyFile(from, dest);
}

console.log(`\nPolices prêtes dans public/fonts/gotham/ (${mode}).`);
