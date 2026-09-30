# LG HVAC for Shelly — AI

This folder contains the AI/plugin source for **LG HVAC for Shelly**.

It is intentionally separated from the main LG THERMA V runtime project in this repository.

## Contents

- `plugin.json` — Agent Plugin manifest
- `.codex-plugin/plugin.json` — Codex compatibility manifest
- `skills/prepare-lg-hvac-integration/` — AI workflow, profiles and evidence rules
- `release/` — public-release preparation notes
- `legal/` — support, privacy and terms pages
- `assets/` — plugin icon
- `dist/` — packaged plugin ZIP

## Scope

The AI prepares model-specific LG HVAC ↔ Shelly integration guidance across LG HVAC families. It does **not** claim universal compatibility. Exact model, controller, protocol, register map and Shelly capabilities must be verified before real equipment writes.

Publisher: **Georgi Germanov**, acting as an individual.

This is an independent community project. It is not an official LG Electronics or Shelly Group product, service, certification or support channel.

## ChatGPT plugin status

The personal ChatGPT plugin is maintained separately. This GitHub folder is the public source/distribution location.

## Source-material note

The original third-party register workbook used during research is **not redistributed here**. Derived AI profiles remain explicitly marked with provenance, uncertainty and compatibility limitations.
