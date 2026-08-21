![Suijin](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/q1m5904rw60erlv6bxow.png)

[Check out Suijin on GitHub →](https://github.com/0xwi11iam/Suijin)

Security testing, defense, and penetration testing today is completely broken. Manual pentesting is too slow to keep up with the rapidly evolving security landscape. Packaged, simple script-based security tools can no longer keep up with the creative methods of the attackers of 2026.

The developer community's answer was fully autonomous AI agents. These agents are smart and work in theory, but come with massive caveats — they fall apart in the field.

What if your red/blue team could run 24/7, adapt to what it finds, write dynamic exploits, write reports, defend your site, and find bug bounties all at the same time? What if you could snap the modules together like Lego to adapt to each and every scenario?

Meet Suijin.

## Introduction

I'm William, the dev behind Suijin — a fully open-source, automatic, dual-mode offensive/defensive cybersecurity framework.

The Red Team is an AI agent powered by SOTA models that can autonomously do reconnaissance, save leaked credentials, and write and chain exploits — it thinks like a real red-teamer, finding vulnerabilities in your own software or chasing bug bounties on web apps and services.

The Blue Team is a team of AI agents, like an SOC running in your terminal. It intelligently discerns between threats and normal requests and responds by deceiving the attacker, creating honeypots, and blocking the IP before they even have time to think.

Both teams share one toolkit, one knowledge graph, and one knowledge base. They run independently or together, all at the same time.

## What really sets us apart

Most AI tools are paperweights when air-gapped or without an API key. Suijin can use its heuristic bypass and built-in knowledge base to defend or attack in an air-gapped environment.

We've all seen what an AI agent does with too much autonomy. Suijin has built-in human governance, strict scope enforcement, cost caps, zero-cost supervisors that detect when something is going wrong, and a policy engine that catches dangerous patterns before the agent hits enter.

The Red Team can attack and the Blue Team can defend in Suijin **Battle mode**, where you watch AI agents battle each other with live tarpitting, exploits, network blocks, and scripts — the closest thing to a real purple-teaming exercise you'll ever see on your own laptop.

## Inspiration

One day I was doing a classic penetration test on a web service when I realized I was running the same commands and similar exploits over and over again on the same few endpoints. Why couldn't this be automatic?

I tried the other automatic, script-based tools. But there was always an issue: the moment a single character was wrong, the whole pipeline failed. Why?

From that day onward, I began my work on Suijin — many days of planning, coding, iterating, and debugging before the v1 release, then adding tools, commands, and skills until it was an MVP.

## What Suijin brings

- **260+ agent tools** — nmap, sqlmap, gobuster, Metasploit, custom KB tools, and more
- **Offline knowledge base** — HackTricks, GTFOBins, PayloadsAllTheThings, SecLists — all indexed with FTS5
- **Built-in labs** — 8 deliberately vulnerable apps (SQLi, XSS, Log4j, SSTI, command injection, and more)
- **Supervisor** — zero-cost pattern detector that catches loops, stalls, and missed flags with no LLM cost
- **Battle mode** — red vs blue live, with scoring, tarpitting, network blocks, and battle reports
- **Modular OS architecture** — kernel + tiers + installable modules = extensible and maintainable
- **HITL + governance** — human approvals, policy enforcement, scope controls, audit trails

## Built-in labs

We didn't want you to learn on real targets. Suijin ships with 8 deliberately vulnerable Flask apps, including blue_target — a 25-endpoint app with SQLi, XSS, SSTI, command injection, IDOR, XXE, and more. Launch one, point Suijin at it, and watch the agent get to work.

It's the safest way to learn red teaming and blue teaming at the same time.

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
