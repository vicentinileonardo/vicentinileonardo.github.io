# Multi-level Distributed Cache

## Project description

This distributed cache system is designed to support multiple clients that read and write data items stored in a database.
There are **2 levels of cache nodes**, arranged in a tree structure.

The system is implemented leveraging the **Akka** framework: clients, caches, and the main database are all modeled as actors within the Akka actor system.

Clients interact with the system through the cache nodes, which are responsible for processing read and write requests. These requests include basic operations namely **Read** and **Write**, as well as critical variants, **Critical Read** and **Critical Write**, each with specific guarantees.

Additionally, the system considers the possibility of cache crashes and implements a crash detection algorithm based on timeouts.
A**recovery procedure** is also implemented to restore the system to a consistent state after a crash.

The goal of the system is to maintain **eventual consistency** between the database and the cache nodes, even in the presence of crashes.

A web server was created to interact with the system, firing: client operations, cache crashes and recoveries, system consistency check.

## Repository, Report and Demo

<center>
  <div style="display: flex; flex-direction: row; justify-content: center; align-items: center; flex-wrap: wrap;">
  <a href="https://github.com/vicentinileonardo/distributed-cache" target="_blank" class="btn">
  <img src="/img/icons8-github-90.png" alt="GitHub" width="80%" height=auto>
  </a>
  <a href="/projects/reports/distributed_cache.pdf" target="_blank" class="btn">
  <img src="/img/icons8-pdf-100.png" alt="Video" width="70%" height=auto>
  </a>
  </div>
</center>

## Team and role

Team size: 2

+ Designed **protocols for each operation** (Read, Write, Critical Read, Critical Write) along with the other team member.
+ I proposed and implemented the request and response message mechanisms to correctly **route messages** through the system.
+ I implemented **Critical Write**, **Crash Detection** and **Recovery** algorithms.
+ I proposed and implemented the **web server** to interact with the system.

## Tech stack

<center>
  <div style="display: flex; flex-direction: row; justify-content: center; align-items: center; flex-wrap: wrap;">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="Java" style="margin: 5px;">
  </div>
</center>

<br>
