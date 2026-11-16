---
title: "Master's Thesis Research"
description: "Policy-driven, Kubernetes-based resource management across multiple clouds, developed with Krateo PlatformOps and published as a journal paper."
weight: 2
ps2:
  card: "career"
  order: 2
  model: "TH"
  hue: 150
  save: "Master's Thesis Research"
  short: "Thesis Research"
  subtitle: "Krateo"
  summary: "Policy-driven, Kubernetes-based resource management across multiple clouds, developed with Krateo PlatformOps and published as a journal paper."
  tags: ["Kubernetes", "Open Policy Agent", "Helm", "AWS", "GCP", "Azure", "MLflow", "KServe", "PyTorch"]
  meta: "Master thesis researcher – Kubernetes, Cloud & Platform · Oct 2024 – Apr 2025"
stack: ["Kubernetes", "Open Policy Agent", "Helm", "AWS", "GCP", "Azure", "MLflow", "KServe", "PyTorch"]
links:
  - {label: "Read Paper", url: "https://doi.org/10.1016/j.future.2026.108749"}
---
## Thesis

- *“A Policy-Driven Kubernetes-based Architecture for Resource Management in Multi-Cloud Environments”*, University of Trento, in collaboration with Krateo PlatformOps.

## What I did

- Integrated **Open Policy Agent** as a Kubernetes mutating webhook to enforce latency-SLA, GDPR data-residency and carbon-aware scheduling policies, contributing to a system achieving up to **13% CO2 emission reductions** vs. round-robin baseline scheduling.
- Developed **Helm** templates that dynamically select the best-fit VM size, gate provisioning on cloud provider and scheduling time, and drive VM and networking infrastructure creation across **AWS, GCP and Azure** via native Kubernetes Operators.
- Architected and deployed an **MLOps pipeline** serving ~15 PyTorch carbon-forecasting models using MLflow and KServe on Kubernetes.
