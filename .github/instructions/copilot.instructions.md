# Co-Pilot Instructions — Clean, Simple, Consistent

## Core Principles

- **KISS — Keep It Simple & Stupid**
  - Prefer the *simplest* working solution.
  - Remove optional parameters, layers, or abstractions unless proven necessary.

- **DRY — Don’t Repeat Yourself**
  - Extract small helpers only when repetition is real (≥2 places now, likely 3+).
  - Reuse existing utilities before creating new ones.

- **YAGNI — You Aren’t Gonna Need It**
  - No speculative features, flags, or extensibility points.
  - Implement only what today’s requirement needs.

- **Minimal Diff**
  - Change as little code as possible to solve the problem.
  - Prefer **surgical edits** over rewrites; keep file count stable.
  - Avoid introducing new dependencies and new files unless unavoidable.

- **Consistency Over Cleverness**
  - Match the project’s **naming, patterns, and structure**.
  - Prefer patterns already used in the codebase to new paradigms.

---

## Guardrails for Copilot

When proposing code, **adhere to all of the following**:

1. **Stay in Place**
   - Modify existing functions before adding new ones.
   - If a helper is needed, place it near its first use within the same file.

2. **Match Style**
   - Mirror existing naming, file layout, import style, and error handling patterns.
   - Keep public API shapes and function signatures stable unless a bug requires change.

3. **No New Files by Default**
   - Do not create new modules/components/hooks unless duplication or complexity becomes worse without them.

4. **Zero Surprises**
   - Avoid side effects, global state changes, or cross-cutting refactors.
   - Keep behavior backward-compatible unless the task explicitly requests otherwise.

---

## Decision Checklist (run before editing)

- [ ] Is the change the **simplest** that works?  
- [ ] Does it **reuse** existing utilities/components?  
- [ ] Is the **diff minimal** (fewest lines/files touched)?  
- [ ] Does it **preserve names** and coding style?  
- [ ] Did I avoid **new files/deps/config**?  
- [ ] Are error cases handled like nearby code handles them?  
- [ ] Are performance and readability balanced (favor readability if perf is fine)?

If any box is unchecked, **simplify**.

---

## Preferred Patterns

- **Early returns** instead of nested `if`s.  
- **Small helpers** only when repeated or clearly improves clarity.  
- **Immutable updates** where the codebase already does so.  
- **Localize complexity**: keep tricky logic private/internal.  
- **Keep functions short** (< ~40 lines when possible).

---

## Anti-Patterns to Avoid

- New abstractions “just in case.”  
- Wide-ranging renames or stylistic rewrites.  
- Introducing a new library for a trivial utility.  
- Creating new configuration, environment flags, or build steps.  
- Over-generalization (factories, strategy classes) without proof of need.

---

## When a New File Is Allowed (rare)

Only if **all** are true:

- The same logic appears in **≥3** places or will immediately be reused in multiple modules.  
- Keeping it inline measurably **increases** duplication or cognitive load.  
- The file fits existing folder conventions and naming patterns.  
- The public API is **tiny** and documented with a short header comment.

---

## Naming & Structure Preservation

- Keep function, variable, and component names **unchanged** unless:
  - The name is incorrect or misleading relative to behavior.
  - A bug fix requires a signature change.  
  In those cases, **prefer a wrapper** to keep external call sites stable.

- Respect the **current layering** (e.g., components → hooks → utils). Don’t invert it.

---

## Commenting & Tests (light touch)

- Prefer **self-evident code**. Add a one-line comment only for non-obvious decisions.  
- If tests exist:
  - Update the **smallest** set of tests needed.  
  - Add a focused test only when fixing a bug without coverage.

---

## Example: Minimal Diff Refactor

**Before**
```ts
function getTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price ? items[i].price : 0;
  }
  return total;
}
```

**After (KISS + guard clause)**
```ts
function getTotal(items) {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, it) => sum + (it.price || 0), 0);
}
```

- No new files, same name, same signature, clearer & smaller.

---

## “Do / Don’t” Quick Rules

**Do**
- Keep changes local.  
- Use existing helpers and error patterns.  
- Write short, obvious code.

**Don’t**
- Rename broadly.  
- Add new dependencies/config.  
- Create new architectural layers.

---

## Copilot Prompt Template (paste into chat)

> **Role:** You are my coding copilot for this repository.  
> **Prime Directives:** KISS, DRY (only for real duplication), YAGNI, Minimal Diff, Preserve Style/Names/Structure.  
> **Constraints:**  
> - Prefer single-file, surgical edits; avoid new files/deps.  
> - Keep behavior backward-compatible unless the task states otherwise.  
> - Match existing naming, patterns, and error handling.  
> - Avoid speculative abstractions.  
> **Output:** Provide the smallest workable patch, with a brief note explaining *why* it’s minimal and how it matches existing style. If a new file seems required, justify against the rules above.

---

## Review Snippet (commit message footer)

```
KISS/DRY/YAGNI: yes
Minimal diff: yes (N lines, M files)
Naming/structure preserved: yes
No new deps/files: yes
Tests/docs touched minimally: yes
```
