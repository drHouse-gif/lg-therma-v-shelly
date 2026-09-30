# LG HVAC for Shelly — public plugin source

This directory contains the public, skills-only source for **LG HVAC for Shelly**.

**Publisher:** Георги Германов (individual)  
**Status:** independent community project  
**Affiliation:** not an official LG Electronics or Shelly Group product, integration, certification, or support channel.

## What it does

The skill prepares evidence-backed, model-specific LG HVAC ↔ Shelly integration plans: interface selection, wiring evidence, Modbus mapping checks, Shelly hardware choice, script requirements, Smart Control presentation, commissioning and rollback.

It deliberately does **not** claim universal compatibility across LG HVAC families.

## Public-source scope

The repository includes:
- the plugin manifest;
- the main skill;
- a documented LG HN1616HC.NK0 direct-Modbus example;
- profile schema/contract;
- runtime and commissioning requirements;
- source index.

The private development copy also contains a user-supplied register workbook and derived discovery profiles. Those files are **not redistributed here** pending permission.

## Use in ChatGPT development

Package the contents of this `plugin-source/` directory as a ZIP with `plugin.json` at the archive root, then use a supported private/development plugin installation flow.

Public ChatGPT directory listing is a separate OpenAI review process and is not implied by this repository.

## Safety

Always verify the exact LG model, board/controller, firmware, protocol map, Shelly model/add-on and addressing convention before enabling writes. Start read-only and commission reversible writes with readback.

## Policies and support

- [Support](../SUPPORT.md)
- [Privacy Policy](../PRIVACY.md)
- [Terms of Service](../TERMS.md)
