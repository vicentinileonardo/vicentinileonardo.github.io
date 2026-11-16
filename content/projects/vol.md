---
title: "Video Outpainting Localizer"
description: "A deep learning model (based on RAFT) that localizes outpainted regions in video frames and generates a binary mask highlighting them."
weight: 207
ps2:
  card: "uni"
  order: 7
  model: "VO"
  hue: 345
  save: "Video Outpainting Localizer"
  short: "Outpainting Localizer"
  subtitle: "MSc · Multimedia Data Security"
  summary: "RAFT-based model that masks outpainted regions in video frames. F1 0.786."
  tags: ["Python", "Deep learning"]
  meta: "MSc course: Multimedia Data Security"
stack: ["Python", "NumPy"]
links:
  - {label: "Read Report", url: "/projects/reports/video_outpainting_localizer.pdf"}
---
## Overview

- Deep learning model for video outpainting localization. The model is able to localize the outpainted region in a video frame and to generate a binary mask that highlights the outpainted region. The implementation is based on the [RAFT model](https://arxiv.org/pdf/2003.12039.pdf).
- The main goal of the project was to modify the RAFT model and in particular we focused on data augmentation and loss function.
- The model has achieved a F1 score of 0.786 on the test set.
- Code not available due to non-disclosure agreement.

## My role

- The project was carried with a pair programming approach.
- I was responsible for the implementation of the data augmentation and the loss function.
