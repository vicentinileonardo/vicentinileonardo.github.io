---
title: "Galaxies Image Classifier"
description: "Image classification of galaxies into 10 classes using a VGG19 feature extractor with an SVM classifier, reaching ~85% test accuracy."
weight: 209
ps2:
  card: "uni"
  order: 9
  model: "GX"
  hue: 260
  save: "Galaxies Image Classifier"
  short: "Galaxies Classifier"
  subtitle: "BSc · Machine Learning"
  summary: "Classifies galaxy images into 10 classes, 85.6% test accuracy."
  tags: ["Python", "PyTorch"]
  meta: "BSc course: Machine Learning"
stack: ["Python", "NumPy", "PyTorch"]
links:
  - {label: "Open Repository", url: "https://github.com/vicentinileonardo/galaxies-image-classification"}
  - {label: "Read Report", url: "/projects/reports/galaxies_image_classifier.pdf"}
---
## Overview

- The goal of this project is to classify galaxies images into **10 different classes**.
- In order to achieve this goal, several models have been trained and tested, as explained in the report.
- The final model is leveraging a pre-trained **VGG19** network as a feature extractor and **Support Vector Machines** as a classifier.
- The model has been trained on a dataset of 9928 images, validated on 2487 images and tested on 5321 images.
- It has achieved a sample-wise accuracy of 85.6% and a class-wise accuracy of 83.8% on the test set.

## My role

- I was responsible for the whole project, from model exploration to final implementation.
