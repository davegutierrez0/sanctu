import assert from "node:assert/strict";
import test from "node:test";

import {
  PRAYER_HOURS,
  getSuggestedPrayerHour,
} from "../lib/data/prayer-rhythm.ts";

const localDateAt = (hour: number) => new Date(2026, 6, 21, hour, 0, 0);

test("suggests the appropriate Hour throughout the local day", () => {
  const expectations = [
    [0, "night-prayer"],
    [4, "night-prayer"],
    [5, "morning-prayer"],
    [8, "morning-prayer"],
    [9, "office-readings"],
    [10, "office-readings"],
    [11, "daytime-prayer"],
    [15, "daytime-prayer"],
    [16, "evening-prayer"],
    [20, "evening-prayer"],
    [21, "night-prayer"],
    [23, "night-prayer"],
  ] as const;

  for (const [hour, id] of expectations) {
    assert.equal(getSuggestedPrayerHour(localDateAt(hour)).id, id);
  }
});

test("exposes all five Hours with bilingual labels and offline alternatives", () => {
  assert.equal(PRAYER_HOURS.length, 5);

  for (const hour of PRAYER_HOURS) {
    assert.ok(hour.title.en);
    assert.ok(hour.title.es);
    assert.ok(hour.officialHref);
    assert.ok(hour.offlineHref.startsWith("/"));
    assert.ok(hour.offlineLabel.en);
    assert.ok(hour.offlineLabel.es);
  }

  const morningPrayer = PRAYER_HOURS.find(
    (hour) => hour.id === "morning-prayer",
  );
  assert.equal(morningPrayer?.officialHref, "/morning-prayer");
  assert.equal(morningPrayer?.officialExternal, false);
});
