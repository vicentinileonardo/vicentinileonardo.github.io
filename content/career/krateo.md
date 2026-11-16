---
title: "Krateo"
description: "Software Engineer – Kubernetes, Cloud & Platform at a Kubernetes-based developer platform startup for enterprise clients."
weight: 1
ps2:
  card: "career"
  order: 1
  model: "KR"
  hue: 220
  save: "Krateo"
  short: "Krateo"
  subtitle: "Software Engineer · 2025–2026"
  summary: "Software Engineer – Kubernetes, Cloud & Platform at a Kubernetes-based developer platform startup for enterprise clients."
  tags: ["Go", "Kubernetes", "Operators", "OpenAPI", "Postgres", "OpenTelemetry", "Prometheus", "Grafana"]
  meta: "May 2025 – Jun 2026 · Verona, Italy (remote)"
stack: ["Go", "Kubernetes", "Operators", "OpenAPI", "Postgres", "OpenTelemetry", "Prometheus", "Grafana"]
links: []
---
## Platform components

- As **primary maintainer**, evolved a Kubernetes Operator framework that generates CRDs from OpenAPI specs and deploys controllers for external REST APIs without hand-written reconcilers, isolating failures per resource type; shipped **10+ features in 6 releases**.
- **Independently** migrated and extended 2 legacy integrations (Azure DevOps, GitHub) onto the OpenAPI-driven operator framework, growing coverage to **20 production resource types** published to the platform marketplace, backed by **171 unit tests** in CI and e2e tests.
- Built a **Postgres-backed Go query API** with RBAC-aware filtering and keyset pagination, replacing slow on-demand resource queries that degraded frontend UX: latency cut from **~7 s to ~400 ms**, sustaining **270+ req/s** in 150+ load-test runs.

## Observability & operations

- Configured **OpenTelemetry** metrics export for 5 platform services to Prometheus/Grafana, including per-phase API latency.
- Provided rotational **L1–L3 support** for 4 enterprise deployments spanning **12 Kubernetes clusters** (dev/test/prod), diagnosing incidents and performing root cause analysis across clusters, platform components and external integrations.
- Designed, documented and oversaw the rollout of **near-zero-downtime platform upgrades** across 4 enterprise deployments, validated against replicated client environments and codified into reusable runbooks.

## AI agents

- Evaluated agent frameworks (kagent, Google ADK), memory systems and **MCP/A2A** protocols for Krateo’s multi-agent Autopilot.

## Related projects

- OASGen Provider, Rest Dynamic Controller, resources-presenter, Azure DevOps Provider and GitHub Provider: see **Memory Card /1-B**.
