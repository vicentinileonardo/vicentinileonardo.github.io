---
title: "Daytrip"
description: "A service-oriented web application that suggests daytrip destinations in Italy based on weather, travel time, and other indicators."
weight: 202
ps2:
  card: "uni"
  order: 2
  model: "DT"
  hue: 150
  save: "Daytrip"
  short: "Daytrip"
  subtitle: "MSc · Service Design"
  summary: "Suggests daytrip destinations in Italy from weather, travel time and other signals."
  tags: ["Node.js", "Python", "Docker", "AWS"]
  meta: "MSc course: Service Design"
stack: ["AWS", "Docker", "NGINX", "HTML", "CSS", "Bootstrap", "JavaScript", "Python", "Flask", "Node.js", "Express", "MongoDB"]
links:
  - {label: "Open Repository", url: "https://github.com/vicentinileonardo/daytrip"}
  - {label: "Read Report", url: "/projects/reports/daytrip.pdf"}
  - {label: "Watch Demo", url: "https://drive.google.com/file/d/1k0KBPMmt-DaVHthZ1S2wKzhBID33X0ad/view?usp=sharing"}
---
## Overview

- The project aims to create a web application that suggests daytrip destinations in Italy based on weather conditions, travel time, and other indicators.
- A service-oriented architecture was used to build decoupled services that can be expanded and modified independently.

## My role

- I was responsible for the design and implementation of many of the core services, spanning from data layer to business logic and process centric services.
- I implemented services both in **Node.js** and **Python** to show the flexibility of this kind of architecture.
- I was responsible for the configuration of the **Docker** images and the **Docker Compose** file.
- I proposed and implemented a workaround for a Docker issue that was preventing the correct execution of a service leveraging **matplotlib** Python library: the service is running in a serverless fashion, leveraging **AWS Lambda** and **AWS API Gateway**.
