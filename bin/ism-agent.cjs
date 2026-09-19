#!/usr/bin/env node
"use strict";

/**
 * ism-ai-agent-controls CLI
 * Generates ASD ISM AI agent compliance manifests and evidence registers.
 */

const fs = require("node:fs");
const path = require("node:path");

const controlsPath = path.join(__dirname, "../data/controls.json");
if (!fs.existsSync(controlsPath)) {
  console.error("Error: controls.json definition not found at " + controlsPath);
  process.exit(1);
}
const controlsDef = JSON.parse(fs.readFileSync(controlsPath, "utf8"));

const command = process.argv[2] || "help";

function printHelp() {
  console.log(`
ism-ai-agent-controls - ASD ISM AI Agent Evidence Register Tool

Usage:
  npx ism-agent init [filename]       Create a sample agent manifest (default: agent-manifest.json)
  npx ism-agent check [manifest]      Check an agent manifest against September 2026 ISM requirements
  npx ism-agent report [manifest]     Generate a Markdown evidence register for audit review
  npx ism-agent list                  List all tracked September 2026 ISM AI agent controls

Reference:
  Australian Signals Directorate (ASD) ISM September 2026
  ASD Guidance: Agentic AI harnesses - The layer above the model (11 Sep 2026)
`);
}

function handleList() {
  console.log(`\nTracked ASD ISM AI Agent Controls (${controlsDef.release}):\n`);
  for (const c of controlsDef.controls) {
    console.log(`[${c.id}] (Rev ${c.revision}) - ${c.topic}`);
    console.log(`  Harness Component: ${c.harness_component}`);
    console.log(`  Requirement: ${c.requirement}`);
    console.log(`  Evidence Rule: ${c.evidence_criteria}\n`);
  }
}

function handleInit(targetFile = "agent-manifest.json") {
  const template = {
    agent_id: "agent-customer-support-01",
    owner: "Platform Engineering / Support Ops",
    business_purpose: "Automated triage and account query responses for authenticated clients",
    assigned_identities: [
      "sp-agent-support-prod@internal.iam.gserviceaccount.com"
    ],
    credentials_used: [
      "vault:secret/ai/support-agent-oauth"
    ],
    tools: [
      {
        name: "search_knowledge_base",
        description: "Vector search over public documentation",
        permission_level: "read-only",
        data_repositories: ["pinecone:public-docs-index"]
      },
      {
        name: "fetch_account_status",
        description: "Fetch subscription and billing status",
        permission_level: "user-scoped-read",
        data_repositories: ["db:billing-replica"]
      }
    ],
    harness_controls: {
      ISM_2133: {
        implemented: true,
        evidence: "Agent runs with dedicated IAM service principal, distinct from any human user account."
      },
      ISM_2134: {
        implemented: true,
        evidence: "Manifest committed to Git repository and validated in CI/CD pipeline."
      },
      ISM_2135: {
        implemented: true,
        evidence: "All five mandatory fields (id, owner/purpose, identity, credentials, tool/data access) declared."
      },
      ISM_2156: {
        implemented: true,
        evidence: "Tool registry strictly limits execution to read-only search and account fetch functions."
      },
      ISM_2157: {
        implemented: true,
        evidence: "Runtime API gateway enforces dual-token check: agent token + invoking end-user JWT."
      },
      ISM_2158: {
        implemented: true,
        evidence: "Retrieved documents wrapped in explicit XML data tags; system instructions quarantined."
      },
      ISM_2159: {
        implemented: true,
        evidence: "Audit sidecar streams every tool call, parameters, and output to central SIEM."
      },
      ISM_2113: {
        implemented: true,
        evidence: "No destructive or high-impact tools exposed. Write operations require human approval gate."
      }
    }
  };

  fs.writeFileSync(targetFile, JSON.stringify(template, null, 2));
  console.log(`\nCreated template agent manifest: ${targetFile}`);
  console.log(`Edit this file with your agent deployment details, then run:`);
  console.log(`  npx ism-agent check ${targetFile}\n`);
}

function loadManifest(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    console.error(`Error parsing JSON in ${filePath}:`, e.message);
    process.exit(1);
  }
}

function handleCheck(manifestPath = "agent-manifest.json") {
  const manifest = loadManifest(manifestPath);
  console.log(`\nVerifying Agent Manifest: ${manifest.agent_id || "unnamed"}\n`);

  let passing = 0;
  let failing = 0;

  for (const c of controlsDef.controls) {
    const key = c.id.replace("-", "_");
    const record = manifest.harness_controls && manifest.harness_controls[key];

    if (record && record.implemented && record.evidence) {
      console.log(`[PASS] ${c.id}: ${c.topic}`);
      console.log(`       Evidence: ${record.evidence}`);
      passing++;
    } else {
      console.log(`[FAIL] ${c.id}: ${c.topic}`);
      console.log(`       Missing required evidence criteria: ${c.evidence_criteria}`);
      failing++;
    }
  }

  console.log(`\nResults: ${passing} compliant, ${failing} missing evidence.`);
  if (failing > 0) {
    console.log("Action: Update manifest evidence fields before publishing register.\n");
    process.exit(1);
  } else {
    console.log("Status: Fully compliant with September 2026 ISM AI agent controls.\n");
  }
}

function handleReport(manifestPath = "agent-manifest.json") {
  const manifest = loadManifest(manifestPath);
  const now = new Date().toISOString().split("T")[0];

  let md = `# AI Agent Compliance & Evidence Register\n\n`;
  md += `**Agent ID:** \`${manifest.agent_id || "unspecified"}\`  \n`;
  md += `**Owner / Purpose:** ${manifest.owner || "N/A"} - ${manifest.business_purpose || "N/A"}  \n`;
  md += `**Generated Date:** ${now}  \n`;
  md += `**Standard:** Australian Signals Directorate (ASD) ISM (September 2026)  \n\n`;

  md += `## Assigned Identities & Credentials\n\n`;
  md += `* **Identities:** ${(manifest.assigned_identities || []).join(", ") || "None"}  \n`;
  md += `* **Credentials Used:** ${(manifest.credentials_used || []).join(", ") || "None"}  \n\n`;

  md += `## Tool Registry & Data Permissions (ISM-2135, ISM-2156)\n\n`;
  md += `| Tool Name | Permission Level | Data Repositories / APIs |\n`;
  md += `|:---|:---|:---|\n`;
  for (const t of manifest.tools || []) {
    md += `| \`${t.name}\` | ${t.permission_level} | ${(t.data_repositories || []).join(", ")} |\n`;
  }
  md += `\n## ISM AI Agent Control Evidence Matrix\n\n`;
  md += `| Control | Requirement | Status | Verification Evidence |\n`;
  md += `|:---|:---|:---|:---|\n`;

  for (const c of controlsDef.controls) {
    const key = c.id.replace("-", "_");
    const rec = manifest.harness_controls && manifest.harness_controls[key];
    const status = rec && rec.implemented ? "COMPLIANT" : "ACTION REQUIRED";
    const ev = rec && rec.evidence ? rec.evidence : "No verifiable evidence recorded.";
    md += `| **${c.id}** (${c.topic}) | ${c.plain} | **${status}** | ${ev} |\n`;
  }

  md += `\n---\n\n`;
  md += `*This register is an engineering evidence record generated by \`ism-ai-agent-controls\`. It is not an ASD endorsement or formal audit attestation.*\n`;

  const reportFile = `evidence-register-${manifest.agent_id || "agent"}.md`;
  fs.writeFileSync(reportFile, md);
  console.log(`\nGenerated Evidence Register Report: ${reportFile}\n`);
}

switch (command) {
  case "list":
    handleList();
    break;
  case "init":
    handleInit(process.argv[3]);
    break;
  case "check":
    handleCheck(process.argv[3]);
    break;
  case "report":
    handleReport(process.argv[3]);
    break;
  default:
    printHelp();
    break;
}
