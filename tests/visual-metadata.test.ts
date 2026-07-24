import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();
const globalCss = readFileSync(path.join(projectRoot, "app/globals.css"), "utf8");
const rootLayout = readFileSync(path.join(projectRoot, "app/layout.tsx"), "utf8");
const socialCardPath = path.join(projectRoot, "public/social/sanctu-social-card.png");

test("keeps global stone lighting without vertical seams behind prayer content", () => {
  const bodyRule = globalCss.match(/body\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

  assert.doesNotMatch(bodyRule, /linear-gradient\(90deg/);
  assert.doesNotMatch(bodyRule, /164px 100%/);
  assert.match(bodyRule, /radial-gradient/);
});

test("publishes a large Open Graph and X social preview", () => {
  assert.match(rootLayout, /openGraph\s*:/);
  assert.match(rootLayout, /twitter\s*:/);
  assert.match(rootLayout, /summary_large_image/);
  assert.match(rootLayout, /\/social\/sanctu-social-card\.png/);
  assert.ok(existsSync(socialCardPath), "social preview image is missing");

  const image = readFileSync(socialCardPath);
  assert.equal(image.toString("ascii", 1, 4), "PNG");
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);
});
