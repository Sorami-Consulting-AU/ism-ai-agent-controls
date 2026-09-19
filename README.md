# ism-ai-agent-controls

> Australian Signals Directorate (ASD) Information Security Manual (ISM) controls for autonomous AI agent deployments, structured as machine-readable data with an evidence register CLI.

Upstream release tracked: **ASD ISM September 2026** (OSCAL release `v2026.09.4`).

---

## Overview

In the September 2026 update to the Information Security Manual (ISM), the Australian Signals Directorate introduced 44 new controls and amended existing requirements. Among them are specific requirements governing autonomous and agentic AI systems across access control, excessive agency, and sensitive action approval.

This repository provides:
1. **Structured Data:** Machine-readable JSON/YAML definitions for each AI agent control, mapped directly to ASD ISM identifiers and upstream OSCAL catalog entries.
2. **Interpretation Layer:** Plain-English requirements, verifiable evidence criteria, and explicit non-requirements (what the control does *not* mandate).
3. **Evidence Register CLI:** A lightweight CLI that reads deployment metadata and generates an audit-ready Markdown/JSON evidence register.

---

## Tracked Controls (September 2026)

| Identifier | Revision | Status | Section | Topic |
|---|---|---|---|---|
| **ISM-2133** | Rev 0 | New | System Access | Unique identity for each AI agent |
| **ISM-2134** | Rev 0 | New | System Access | Implementation and maintenance of an AI agent register |
| **ISM-2135** | Rev 0 | New | System Access | Mandatory fields for each agent register record |
| **ISM-2156** | Rev 0 | New | Software Development | Least privilege applied to tool and function sets |
| **ISM-2157** | Rev 0 | New | Software Development | Effective permissions limited to user/agent intersection |
| **ISM-2158** | Rev 0 | New | Software Development | External retrieved content treated as untrusted data |
| **ISM-2159** | Rev 0 | New | Software Development | Centralised logging of all tool calls and agent outputs |
| **ISM-2113** | Rev 1 | Amended | System Hardening | Human approval required before sensitive/high-impact actions |

---

## What This Repository Is and Is Not

- **This is an engineering interpretation and evidence collection aid.** It helps technical teams structure evidence against ASD guidelines.
- **This is not an assessment, certification, or audit attestation.** It does not confer ASD endorsement, IRAP certification, or compliance guarantees.
- **This is not a republication of the full ISM.** The official and complete ISM catalog is published authoritatively in OSCAL by the Australian Cyber Security Centre at [cyber.gov.au/ism/oscal](https://www.cyber.gov.au/ism/oscal).

---

## Detailed Guide

For an in-depth breakdown of the architecture, evidence models, and what these controls mean for Kubernetes and cloud infrastructure:

Read the technical guide: [ASD ISM September 2026 AI Agent Controls Breakdown](https://sorami.com.au/guides/asd-ism-september-2026-ai-agent-controls/)

---

## License

- **Data & Definitions:** [Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE-DATA)
- **Tooling & Code:** [MIT License](LICENSE)

Maintained by **[Sorami Consulting](https://sorami.com.au)** (Melbourne, Australia).
