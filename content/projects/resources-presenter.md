---
title: "resources-presenter"
description: "Postgres-backed Go API for querying current Kubernetes resources, with RBAC-aware filtering and keyset pagination."
weight: 103
ps2:
  card: "pro"
  order: 3
  model: "RP"
  hue: 200
  save: "resources-presenter"
  short: "resources-presenter"
  subtitle: "Krateo · 2025–2026"
  summary: "Postgres-backed Go API for querying current Kubernetes resources, with RBAC-aware filtering and keyset pagination."
  tags: ["Go", "Postgres", "Kubernetes", "RBAC"]
  meta: "Krateo · 2025–2026"
stack: ["Go", "Postgres", "Kubernetes", "RBAC"]
links:
  - {label: "Open Repository", url: "https://github.com/krateoplatformops/resources-presenter"}
---
## Overview

- A **read-only HTTP API** for querying current Kubernetes resources.
- **Postgres**-backed Go query API with **RBAC-aware filtering** and **keyset pagination**.
- One of the core platform components I evolved at Krateo PlatformOps.

## What I did

- Replaced slow on-demand resource queries that degraded frontend UX, cutting latency from **~7 s to ~400 ms**.
- Sustained **270+ req/s** across 150+ load-test runs.
