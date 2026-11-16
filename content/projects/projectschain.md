---
title: "ProjectsChain"
description: "A blockchain plugin for design e-shops that grants intellectual property and fair royalty distribution among coauthors via smart contracts."
weight: 203
ps2:
  card: "uni"
  order: 3
  model: "PC"
  hue: 40
  save: "ProjectsChain"
  short: "ProjectsChain"
  subtitle: "MSc · Blockchain"
  summary: "Plugin for design e-shops: IP protection and fair royalty splits via smart contracts."
  tags: ["Solidity", "Chainlink", "Node.js", "Redis"]
  meta: "MSc course: Blockchain"
stack: ["HTML", "CSS", "JavaScript", "Vue", "Web3JS", "Solidity", "Chainlink", "NodeJS", "ExpressJS", "Redis"]
links:
  - {label: "Open Repository", url: "https://github.com/vicentinileonardo/projectschain"}
  - {label: "Read Report", url: "/projects/reports/projectschain.pdf"}
  - {label: "Watch Demo", url: "https://drive.google.com/file/d/1NBfR3Tln6dz7mGiXHSfOW1VU1A21XQo1/view?usp=sharing"}
---
## Overview

- ProjectsChain is a plugin developed in order to be integrated with already existing e-shops of industrial designs and is able to grant, through **blockchain** and **smart contracts**, the intellectual property of the projects and a fair royalty distribution between coauthors of a final project.
- The straightforward and transparent mechanism developed also will prevent non-payment and miscommunication risks, representing common scenarios among freelancers.

## My role

- I was responsible for the design and implementation of a web server and related **RESTful APIs** that performs CRUD operations against a properly configured NoSQL database (**Redis**), which are critical for the pre-mint operation, IPFS upload and catalog fetching.
- I proposed and implemented a **digital signature** mechanism into the server code and into Master smart contract.
- I was responsible for the **Chainlink node** setup and Chainlink jobs configurations together with the CustomChainlinkClient smart contract development and integration with ProjectNFT.
- I contributed to the initial high-level smart contracts design together with final smart contract **optimization** and **testing**
