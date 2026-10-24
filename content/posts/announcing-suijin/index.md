![Suijin](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/q1m5904rw60erlv6bxow.png)

[Check out Suijin on GitHub →](https://github.com/0xwi11iam/Suijin)

Security testing, defense, and penetration testing today is completely broken. Manual pentesting is too slow to keep up with the rapidly evolving security landscape. Packaged, simple script-based security tools can no longer keep up with the creative methods of the attackers of 2026.

The developer community's answer was fully autonomous AI agents. These agents are smart and work in theory, but come with massive caveats — they fall apart in the field.

What if a red team could run 24/7, adapt to what it finds, write dynamic exploits, write reports, and find bug bounties all at the same time? What if you could snap the modules together like Lego to adapt to each and every scenario?

Meet Suijin.

## Introduction

I'm William, the dev behind Suijin — a fully open-source, fully autonomous red teaming framework.

The Red Team is an AI agent powered by SOTA models that can autonomously do reconnaissance, save leaked credentials, and write and chain exploits — it thinks like a real red-teamer, finding vulnerabilities in your own software or chasing bug bounties on web apps and services.

And it doesn't run alone — it runs as a session mesh: parallel agents claim their own attack surfaces, discuss findings with each other, and share every confirmed POC through one blackboard, so nobody re-exploits what the team already owns.

Every agent shares one toolkit, one knowledge graph, and one knowledge base.

## What really sets us apart

Most AI tools are paperweights when air-gapped or without an API key. Suijin can use its heuristic bypass and built-in knowledge base to keep hunting in an air-gapped environment.

We've all seen what an AI agent does with too much autonomy. Suijin has built-in human governance, strict scope enforcement, cost caps, zero-cost supervisors that detect when something is going wrong, and a policy engine that catches dangerous patterns before the agent hits enter.

And you supervise all of it from the **Operator Console** — a command center where you watch every agent's phase and cost live, pause the team, talk to any agent, or impersonate one and drive it yourself.

## Inspiration

One day I was doing a classic penetration test on a web service when I realized I was running the same commands and similar exploits over and over again on the same few endpoints. Why couldn't this be automatic?

I tried the other automatic, script-based tools. But there was always an issue: the moment a single character was wrong, the whole pipeline failed. Why?

From that day onward, I began my work on Suijin — many days of planning, coding, iterating, and debugging before the v1 release, then adding tools, commands, and skills until it was an MVP.

## What Suijin brings

- **260+ agent tools** — nmap, sqlmap, gobuster, Metasploit, custom KB tools, and more
- **Offline knowledge base** — HackTricks, GTFOBins, PayloadsAllTheThings, SecLists — all indexed with FTS5
- **Onboard lab** — NorthBridge: 15 services, ~100+ vulnerability instances, cross-service chains, and 22 flags
- **Supervisor** — zero-cost pattern detector that catches loops, stalls, and missed flags with no LLM cost
- **Operator Console** — pause, steer, and impersonate any agent mid-run
- **Modular OS architecture** — kernel + tiers + installable modules = extensible and maintainable
- **HITL + governance** — human approvals, policy enforcement, scope controls, audit trails

## The onboard lab

We didn't want you to learn on real targets. `suijin lab up` boots NorthBridge — a 15-service target behind a gateway/auth/core plane with ~100+ vulnerability instances, cross-service attack chains, decoys, and 22 flags. Point Suijin at it and watch the team get to work.

It's the safest way to learn red teaming without touching anything real.

## Get started

```bash
curl -fsSL https://raw.githubusercontent.com/0xwi11iam/Suijin/main/install.sh | bash
suijin doctor && suijin selftest
suijin
```

That's it. A security OS on your machine.

We built Suijin because we believe open-source security tools should be powerful, accessible, and safe. We've put hundreds of hours into making this work — and we're just getting started.

Star the repo. File an issue. Contribute a module. Share this with your team.

The future of security is autonomous. Let's build it together!
