// superseded by tests/boussole.test.ts (native tsx harness; vitest not installed in this project)
// This file documents the v2 invariants that tests/boussole.test.ts enforces.
//
// Expected failures on first run (data bugs, not code):
//   - ex_analyse_photosynthesis_07: no numeric values → missing_unit via an_c2
//   - ex_explain_leaf_08: "يعود ذلك إلى" saves unsupported_claim but exercise is a false فسّر
//
// Fix the data, not the thresholds.
