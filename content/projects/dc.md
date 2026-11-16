---
title: "Multi-level Distributed Cache"
description: "An Akka-based two-level distributed cache supporting reads/writes with crash detection and recovery, targeting eventual consistency."
weight: 201
ps2:
  card: "uni"
  order: 1
  model: "DC"
  hue: 280
  save: "Multi-level Distributed Cache"
  short: "Distributed Cache"
  subtitle: "MSc · Distributed Systems"
  summary: "Akka-based two-level cache with crash detection and recovery, targeting eventual consistency."
  tags: ["Java", "Akka"]
  meta: "MSc course: Distributed Systems"
stack: ["Java", "Akka"]
links:
  - {label: "Open Repository", url: "https://github.com/vicentinileonardo/distributed-cache"}
  - {label: "Read Report", url: "/projects/reports/distributed_cache.pdf"}
---
## Overview

- This distributed cache system is designed to support multiple clients that read and write data items stored in a database.
- There are **2 levels of cache nodes**, arranged in a tree structure.
- The system is implemented leveraging the **Akka** framework: clients, caches, and the main database are all modeled as actors within the Akka actor system.
- Clients interact with the system through the cache nodes, which are responsible for processing read and write requests.
- These requests include basic operations namely **Read** and **Write**, as well as critical variants, **Critical Read** and **Critical Write**, each with specific guarantees.
- Additionally, the system considers the possibility of cache crashes and implements a crash detection algorithm based on timeouts.
- A **recovery procedure** is also implemented to restore the system to a consistent state after a crash.
- The goal of the system is to maintain **eventual consistency** between the database and the cache nodes, even in the presence of crashes.
- A web server was created to interact with the system, firing: client operations, cache crashes and recoveries, system consistency check.

## My role

- Designed **protocols for each operation** (Read, Write, Critical Read, Critical Write) along with the other team member.
- I proposed and implemented the request and response message mechanisms to correctly **route messages** through the system.
- I implemented **Critical Write**, **Crash Detection** and **Recovery** algorithms.
- I proposed and implemented the **web server** to interact with the system.
