---
title: "systemslabs"
description: "Deterministic systems simulator with fault injection, live at systemslabs.dev."
weight: 106
ps2:
  card: "pro"
  order: 6
  model: "SL"
  hue: 186
  save: "systemslabs"
  short: "systemslabs"
  subtitle: "Personal project · 2026"
  summary: "Deterministic systems simulator with fault injection, live at systemslabs.dev."
  tags: ["Go", "React", "TypeScript", "OpenTofu", "Podman"]
  meta: "Personal project · 2026"
stack: ["Go", "React", "TypeScript", "OpenTofu", "Podman"]
links:
  - {label: "Visit Site", url: "https://systemslabs.dev"}
---
## Overview

- A **deterministic discrete-event Go simulator** with fault injection, live at systemslabs.dev.
- **100+ scenarios**: Raft, rate limiting, retries, caching, disaster recovery, LLM serving.
- Runs are reproducible from spec and seed, so any config change can be A/B compared metric by metric (p99, goodput, errors).

## What I did

- Built the simulator and deployed it to production on an **OpenTofu**-provisioned **Hetzner** VM, reachable only through **Cloudflare**.
- **Podman** releases promoted by image digest, with health-gated automatic rollback in **~2 min**.
- Per-client rate limits and a spend guard capping monthly cost.
