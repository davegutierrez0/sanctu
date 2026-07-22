import assert from "node:assert/strict";
import test from "node:test";

import { filterPrayers } from "../lib/prayer-search.ts";

const prayers = [
  {
    id: "morning-offering",
    title: { en: "Morning Offering", es: "Ofrenda de la Mañana" },
    latin: null,
    text: { en: "I offer You my prayers and works", es: "Te ofrezco mis oraciones y obras" },
    category: "devotional",
  },
  {
    id: "hail-mary",
    title: { en: "Hail Mary", es: "Ave María" },
    latin: "Ave Maria",
    text: { en: "Full of grace", es: "Llena eres de gracia" },
    category: "marian",
  },
] as const;

test("returns every prayer when the query and category are empty", () => {
  assert.deepEqual(
    filterPrayers(prayers, "en", "", "all").map((prayer) => prayer.id),
    ["morning-offering", "hail-mary"],
  );
});

test("searches localized titles and text without case sensitivity", () => {
  assert.equal(filterPrayers(prayers, "en", "OFFERING", "all")[0]?.id, "morning-offering");
  assert.equal(filterPrayers(prayers, "es", "gracia", "all")[0]?.id, "hail-mary");
});

test("searches Latin titles and combines search with category filters", () => {
  assert.equal(filterPrayers(prayers, "en", "ave maria", "all")[0]?.id, "hail-mary");
  assert.equal(filterPrayers(prayers, "en", "", "marian").length, 1);
  assert.equal(filterPrayers(prayers, "en", "grace", "devotional").length, 0);
});
