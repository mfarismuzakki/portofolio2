"""Build the Pine Yield Simulator architecture diagrams used on the case-study page.

Run: python use-cases/tools/build_architecture.py
Writes self-contained SVGs into use-cases/assets/. Client and infrastructure identifiers are intentionally omitted.
"""
from pathlib import Path

from diagram import Diagram

OUT = Path(__file__).resolve().parent.parent / "assets"


def platform():
    d = Diagram(1600, 975, "Pine Yield Simulator · platform",
                "End-to-end architecture",
                "One Django platform on AWS serves the web app, WhatsApp and Microsoft Teams, backed by ML inference and an AI agent.")
    top, h = 140, 770
    d.zone(40, top, 220, h, "Users & channels", "users")
    d.zone(290, top, 230, h, "Microsoft cloud", "ms", icon="ms-azure")
    d.zone(550, top, 730, h, "AWS cloud", "aws", icon="aws-cloud", tag="region ap-southeast-3")
    d.zone(1310, top, 250, h, "Data sources", "data")

    web = d.card(150, 245, "users", "Web browser", "planners · managers")
    teams = d.card(150, 380, "ms-teams", "Microsoft Teams", "personal & group chat")
    wa = d.card(150, 625, "whatsapp", "WhatsApp", "registered numbers only")

    bot = d.card(405, 380, "ms-bot", "Azure Bot Service", "Bot Framework connector")
    d.card(405, 505, "ms-entra", "Entra ID", "SSO · bot token")
    graph = d.card(405, 785, "mail", "Microsoft Graph", "harvest report mailbox")

    alb = d.row(590, 245, "aws-elb", "Application Load Balancer", "HTTPS 443 · ACM certificate", w=255)
    d.zone(570, 305, 330, 590, "ECS Fargate · shared cluster", "sub", icon="aws-fargate", dashed=True)
    app = d.row(590, 385, "django", "Web app", "Django · simulator · dashboards", w=255)
    worker = d.row(590, 505, "aws-fargate", "Channel worker", "AI agent for Teams & WhatsApp", w=255)
    gw = d.row(590, 625, "nodejs", "WhatsApp gateway", "Node · linked device · outbound", w=255)
    pipe = d.row(590, 785, "aws-eventbridge", "ML pipeline task", "EventBridge hourly · retrain", w=255)

    d.zone(950, 305, 312, 170, "Data · SQL & files", "sub", dashed=True)
    d.card(1028, 400, "aws-rds", "Amazon RDS", "PostgreSQL · queues", w=140, h=104)
    d.card(1184, 400, "aws-s3", "Amazon S3", "models · decks", w=140, h=104)
    d.zone(950, 500, 312, 170, "AI · messaging", "sub", dashed=True)
    d.card(1028, 595, "aws-bedrock", "Bedrock", "LLM · agent", w=140, h=104)
    d.card(1184, 595, "aws-ses", "Amazon SES", "plantation reports", w=140, h=104)
    d.zone(950, 695, 312, 200, "Operations", "sub", dashed=True)
    d.card(1028, 800, "aws-cloudwatch", "CloudWatch", "logs · alarms", w=140, h=104)
    d.card(1184, 800, "aws-secrets", "Secrets", "keys & config", w=140, h=104)

    dp = d.card(1435, 330, "aws-redshift", "Data platform", "Amazon Redshift", w=196)
    sens = d.card(1435, 505, "mssql", "Field sensor platform", "SQL Server · irrigation", w=196)
    fms = d.card(1435, 680, "client", "Field management app", "notes & photos API", w=196)

    d.edge([web["r"], alb["l"]], "HTTPS · SSO", at=(415, 245))
    d.edge([teams["r"], bot["l"]])
    d.edge([bot["r"], app["l"]], "webhook · JWT", at=(546, 380))
    d.edge([wa["r"], gw["l"]], "linked device", at=(546, 625))
    d.edge([(722, 280), (722, 350)])
    d.edge([(712, 420), (712, 470)], dashed=True)
    d.note(722, 452, "queue", 11, "#16a34a")
    d.edge([(845, 625), (876, 625), (876, 385), (845, 385)], "HMAC API", at=(876, 560))
    d.edge([graph["r"], pipe["l"]], "Graph API", at=(546, 785))
    for y in (400, 595, 800):
        d.edge([(900, y), (948, y)])
    for node in (dp, sens, fms):
        d.edge([node["l"], (1282, node["l"][1])])
    d.note(1296, 418, "read-only", 11, "#6b3fd6", "middle")
    d.legend(40, 945, [("solid", "request & data"), ("dashed", "queued work")])
    d.note(1560, 949, "Simplified view · identifiers and network detail omitted", 11.5, "#94a3b8", "end")
    d.save(OUT / "pine-architecture.svg")


def agent():
    d = Diagram(1600, 990, "Pine AI · conversational agent",
                "One agent, three channels",
                "Web, WhatsApp and Teams share the same LangChain agent, tools and guardrails; only the adapter differs.")
    top, h = 140, 690
    d.zone(40, top, 250, h, "Channels", "users")
    d.zone(320, top, 330, h, "Adapters on ECS Fargate", "aws", icon="aws-fargate")
    d.zone(680, top, 450, h, "AI agent", "ai", icon="aws-bedrock")
    d.zone(1160, top, 400, h, "Tools · read-only", "data")

    web = d.card(165, 270, "users", "Web chat", "streamed answers")
    wa = d.card(165, 450, "whatsapp", "WhatsApp", "text, image, chart")
    teams = d.card(165, 630, "ms-teams", "Microsoft Teams", "via Azure Bot Service")

    a_web = d.row(345, 270, "django", "Web app", "server-sent events", w=280)
    a_wa = d.row(345, 450, "nodejs", "WhatsApp gateway", "allowlist · outbox replies", w=280)
    a_teams = d.row(345, 630, "ms-bot", "Teams webhook", "JWT verified · HTTP 200 fast", w=280)
    q = d.row(345, 770, "aws-rds", "Inbound queue", "PostgreSQL · retried safely", w=280)

    core = d.box(705, 205, 400, 215, ("AI agent", "LangChain create_agent · Amazon Bedrock"), [
        "39 domain tools, chosen per question",
        "max 14 model calls and 20 tool calls per turn",
        "figures must come from tool results (number guard)",
        "charts rendered in a restricted Python sandbox",
        "session memory per user and channel",
    ], icon="aws-bedrock")
    worker = d.row(705, 520, "aws-fargate", "Channel worker", "dequeue · user check · run agent", w=400)
    d.row(705, 650, "aws-cloudwatch", "Audit & usage log", "every question, tool call and cost", w=400)

    tools = [("model", "ML inference", "CatBoost models, in-process"),
             ("aws-redshift", "Data platform SQL", "Redshift, read-only role"),
             ("aws-rds", "Application data", "predictions, notes, history"),
             ("book", "Knowledge base", "agronomy docs & lessons"),
             ("code", "Chart sandbox", "restricted Python, no I/O"),
             ("aws-s3", "Files & exports", "Excel, PNG, signed links")]
    ys = [225 + i * 100 for i in range(6)]
    rows = [d.row(1180, y, ic, ti, su, w=360, h=72) for (ic, ti, su), y in zip(tools, ys)]

    d.edge([web["r"], a_web["l"]], step=1, at=(305, 270))
    d.edge([wa["r"], a_wa["l"]], step=1, at=(305, 450))
    d.edge([teams["r"], a_teams["l"]], step=1, at=(305, 630))
    d.edge([(625, 450), (640, 450), (640, 770), (625, 770)], dashed=True)
    d.edge([(625, 630), (640, 630)], dashed=True)
    d.edge([(625, 770), (665, 770), (665, 520), (705, 520)], "dequeue", at=(665, 690), step=2)
    d.edge([(905, 485), (905, 420)], step=3, at=(930, 452))
    d.edge([a_web["r"], (705, 270)], "stream", at=(665, 270))
    d.mid.append(f'<line x1="1145" y1="{ys[0]}" x2="1145" y2="{ys[-1]}" stroke="#475569" stroke-width="1.7"/>')
    for y in ys:
        d.edge([(1145, y), (1180, y)])
    d.edge([(1105, 355), (1145, 355)], step=4, at=(1125, 330))

    d.zone(40, 860, 1520, 92, "Guardrails on every channel", "gov")
    x = 64
    for c in ["Entra ID / phone allowlist", "role-based data scope", "read-only data access",
              "tool & model call budget", "number guard", "audit log + 19-case regression eval"]:
        x += d.chip(x, 904, c, "#ffffff", "#0f7a53", "#b9e8d3") + 12
    d.note(1560, 975, "Replies return the same way: SSE stream, WhatsApp outbox, Teams serviceUrl.", 11.5, "#94a3b8", "end")
    d.save(OUT / "pine-agent.svg")


def workers():
    d = Diagram(1600, 900, "Hybrid command center",
                "AI workers with a human in the loop",
                "Missions from the 3D virtual office, Teams or WhatsApp run on Bedrock AgentCore; people approve before anything goes out.")
    top, h = 140, 620
    d.zone(40, top, 250, h, "Requesters", "users")
    d.zone(320, top, 300, h, "Pine platform", "aws", icon="aws-fargate")
    d.zone(650, top, 520, h, "Amazon Bedrock AgentCore", "ai", icon="aws-agentcore", tag="ap-southeast-1")
    d.zone(1200, top, 360, h, "Data & delivery", "data")

    vo = d.card(165, 270, "users", "Virtual office", "3D office · kanban")
    tm = d.card(165, 450, "ms-teams", "Teams /tugas", "mission from chat")
    wa = d.card(165, 630, "whatsapp", "WhatsApp /tugas", "mission from phone")

    mq = d.row(340, 300, "aws-rds", "Mission queue", "kanban states · events", w=260)
    rv = d.row(340, 560, "users", "Human review", "approve · revise · reject", w=260, accent="#0f7a53")

    orch = d.box(675, 190, 470, 120, ("Orchestrator", "splits the mission, assigns AI workers"),
                 ["Claude on Bedrock · persona & guardrails"], accent="#0f7a53", icon="aws-agentcore")
    w1 = d.row(675, 410, "aws-bedrock", "AI worker · input", "retrieve & check data", w=225)
    w2 = d.row(920, 410, "aws-bedrock", "AI worker · output", "analyse, write, chart", w=225)
    d.row(675, 520, "aws-bedrock", "Bedrock Guardrails", "persona · topic & PII filters", w=470)
    d.row(675, 630, "aws-cloudwatch", "Audit trail", "JSON logs per step and decision", w=470)

    api = d.row(1220, 260, "django", "Pine API", "read-only tools", w=320)
    dp = d.row(1220, 380, "aws-redshift", "Data platform", "Redshift · read-only", w=320)
    ses = d.row(1220, 520, "aws-ses", "Email delivery", "report to requester", w=320)
    d.row(1220, 640, "ms-teams", "Teams & WhatsApp", "status and result", w=320)

    d.edge([vo["r"], (305, 270), (305, 290), (340, 290)], step=1, at=(305, 245))
    d.edge([tm["r"], (305, 450), (305, 330), (340, 330)])
    d.edge([wa["r"], (305, 630), (305, 450)])
    d.edge([(600, 300), (675, 300)], "mission", at=(637, 300), step=2)
    d.edge([(790, 310), (790, 375)])
    d.edge([(1030, 310), (1030, 375)])
    d.edge([(900, 410), (920, 410)])
    d.edge([(1145, 410), (1180, 410), (1180, 260), (1220, 260)], step=3, at=(1180, 335))
    d.edge([(1180, 380), (1220, 380)])
    d.edge([(1032, 445), (1032, 470), (630, 470), (630, 560), (600, 560)], "draft for review", at=(800, 470),
           dashed=True, step=4)
    d.edge([(470, 595), (470, 700), (1190, 700), (1190, 520), (1220, 520)], "approved", at=(830, 700), step=5)
    d.edge([(1190, 600), (1190, 640), (1220, 640)])

    d.zone(40, 790, 1520, 80, "Governance", "gov")
    x = 64
    for c in ["Entra ID SSO for approvers", "persona & guardrails", "audit trail", "read-only tools",
              "CloudFormation stacks", "GitHub OIDC deploy role", "account-agnostic CI/CD"]:
        x += d.chip(x, 830, c, "#ffffff", "#334155", "#d9e1ec") + 12
    d.save(OUT / "pine-ai-workers.svg")


def delivery():
    d = Diagram(1600, 700, "Delivery & MLOps",
                "From commit to production, and an ML pipeline that keeps itself fresh",
                "Infrastructure as code with CloudFormation; the forecast pipeline runs as scheduled ECS tasks.")
    d.zone(40, 140, 1520, 210, "Release", "aws", icon="aws-cloud")
    steps = [("github", "GitHub", "push to main"), ("aws-codebuild", "GitHub Actions", "CodeBuild runner"),
             ("aws-ecr", "Amazon ECR", "container image"), ("aws-cloudformation", "CloudFormation", "stack update"),
             ("aws-fargate", "ECS Fargate", "rolling deploy"), ("aws-elb", "Load balancer", "health checks")]
    xs = [178 + i * 249 for i in range(6)]
    cards = [d.card(x, 255, ic, ti, su, w=196) for (ic, ti, su), x in zip(steps, xs)]
    for a, b in zip(cards, cards[1:]):
        d.edge([a["r"], b["l"]])

    d.zone(40, 380, 1520, 280, "Forecast pipeline", "ai", icon="aws-eventbridge", tag="hourly tick · monthly retrain")
    ev = d.card(150, 520, "aws-eventbridge", "EventBridge", "schedule rule", w=180)
    task = d.box(290, 440, 980, 160, ("ECS task · pipeline", "runs in the same image as the web app"), [], accent="#0f7a53",
                 icon="aws-fargate")
    chips = ["00 retrain CatBoost per crop cycle", "01 query sensor features", "02 predict NSFC / NSSC",
             "03 refresh BI dataset", "04 rolling forecast & accuracy", "05 write fact table", "06 field notes"]
    x, y = 316, 520
    for c in chips:
        w = 16 + len(c) * 6.6
        if x + w > 1250:
            x, y = 316, y + 40
        d.chip(x, y, c, "#effbf6", "#0f7a53", "#b9e8d3")
        x += w + 12
    s3 = d.card(1420, 470, "aws-s3", "Amazon S3", "model archive", w=200, h=100)
    rs = d.card(1420, 590, "aws-redshift", "Data platform", "forecast facts", w=200, h=100)
    d.edge([ev["r"], (290, 520)], "RunTask", at=(255, 490))
    d.edge([(1270, 470), (1320, 470)])
    d.edge([(1270, 590), (1320, 590)])
    d.note(1560, 690, "Promotion is MAPE-gated: a retrained model replaces the active one only when it is more accurate.",
           11.5, "#94a3b8", "end")
    d.save(OUT / "pine-delivery.svg")


def ismart():
    d = Diagram(1600, 1010, "I-Smart Water Management · platform",
                "Architecture",
                "A Django WebGIS on AWS for irrigation planning, field execution, monitoring and an AI assistant.")
    top, h = 140, 600
    d.zone(40, top, 230, h, "Users", "users")
    d.zone(300, top, 220, h, "Microsoft cloud", "ms", icon="ms-azure")
    d.zone(550, top, 720, h, "AWS cloud", "aws", icon="aws-cloud", tag="shared ALB & ECS cluster")
    d.zone(1300, top, 260, h, "Data sources", "data")

    ops = d.card(155, 260, "users", "Operators", "plans · actuals · costs")
    mgr = d.card(155, 400, "client", "Managers", "monitoring · insight")
    mail = d.card(155, 620, "mail", "Email inbox", "AI insight digest")
    d.card(410, 480, "ms-entra", "Entra ID", "SSO · plantation scope", w=180)

    alb = d.row(580, 260, "aws-elb", "Load balancer", "HTTPS 443 · host rule", w=250)
    d.zone(570, 320, 290, 400, "ECS Fargate", "sub", icon="aws-fargate", dashed=True)
    app = d.row(588, 395, "django", "WebGIS app", "Leaflet maps · dashboards", w=254)
    eng = d.row(588, 505, "model", "Planning engine", "versioned irrigation plans", w=254)
    ai = d.row(588, 625, "aws-bedrock", "AI assistant", "LangChain · read-only tools", w=254)

    d.zone(890, 320, 360, 400, "Data · AI · messaging", "sub", dashed=True)
    d.card(980, 420, "aws-rds", "Amazon RDS", "PostgreSQL · plans", w=150, h=104)
    d.card(1160, 420, "aws-bedrock", "Bedrock", "chat & insight", w=150, h=104)
    d.card(980, 610, "aws-ses", "Amazon SES", "insight email", w=150, h=104)
    d.card(1160, 610, "aws-cloudwatch", "CloudWatch", "logs · alarms", w=150, h=104)

    srcs = [("erp", "ERP · SAP", "cost & material data"), ("mssql", "Field sensors", "irrigation telemetry"),
            ("client", "Field management app", "field notes"), ("book", "Work orders", "Excel imports"),
            ("weather", "Weather service", "rainfall forecast")]
    sy = [230 + i * 105 for i in range(5)]
    snodes = [d.row(1318, y, ic, ti, su, w=226, h=70) for (ic, ti, su), y in zip(srcs, sy)]

    d.edge([ops["r"], alb["l"]], "HTTPS · SSO", at=(410, 260))
    d.edge([mgr["r"], (535, 400), (535, 282), (580, 282)])
    d.edge([(790, 295), (790, 360)])
    d.edge([(860, 420), (888, 420)])
    d.edge([(860, 610), (888, 610)])
    d.edge([(980, 662), (980, 700), (545, 700), (545, 620), (243, 620)], "daily insight", at=(760, 700), dashed=True)
    for n in snodes:
        d.edge([n["l"], (1272, n["l"][1])])
    d.note(1286, 216, "import · sync", 11, "#6b3fd6", "end")

    d.zone(40, 770, 1520, 200, "Release", "aws", icon="aws-cloud")
    steps = [("github", "GitHub", "push to branch"), ("aws-codebuild", "GitHub Actions", "build & test"),
             ("aws-ecr", "Amazon ECR", "container image"), ("aws-cloudformation", "CloudFormation", "dev · staging · prod"),
             ("aws-fargate", "ECS Fargate", "rolling deploy")]
    xs = [200 + i * 300 for i in range(5)]
    cards = [d.card(x, 880, ic, ti, su, w=196, h=100) for (ic, ti, su), x in zip(steps, xs)]
    for a, b in zip(cards, cards[1:]):
        d.edge([a["r"], b["l"]])
    d.note(1560, 998, "Simplified view · identifiers and network detail omitted", 11.5, "#94a3b8", "end")
    d.save(OUT / "smart-architecture.svg")


def presales():
    d = Diagram(1600, 1000, "Presales Hub · platform",
                "Architecture",
                "One Django app on a Docker host: a planner and worker agents behind a model gateway, "
                "grounded in a Drive knowledge base and published back to Google Workspace.")
    top, h = 140, 640
    d.zone(40, top, 220, h, "Users", "users")
    d.zone(290, top, 830, h, "Docker host · VPS", "gov", icon="docker", tag="docker compose")
    d.zone(1150, top, 410, 300, "Google Workspace", "ms", icon="g-google")
    d.zone(1150, top + 330, 410, 310, "Model gateway", "ai", icon="model", tag="LiteLLM")

    team = d.card(150, 260, "g-google", "Presales team", "Google SSO")
    partner = d.card(150, 420, "users", "Partners", "invited accounts")
    cal = d.card(150, 640, "g-calendar", "Calendar app", "private iCal feed")

    nginx = d.card(400, 340, "nginx", "Nginx", "TLS · reverse proxy", w=160)
    web = d.box(510, 210, 300, 260, ("Django web", "Gunicorn · HTMX UI"),
                ["Customer 360 workspace", "Chat with numbered citations", "Deck, proposal, diagram studio",
                 "Guardrail checks", "Tender and news radar", "Usage, cost, adoption"], icon="django")
    pg = d.card(965, 260, "postgres", "PostgreSQL", "data · chunks · embeddings", w=200)
    redis = d.card(965, 420, "redis", "Redis", "broker · cache", w=200)
    worker = d.box(510, 530, 300, 210, ("Celery worker + beat", "background jobs"),
                   ["Drive sync and indexing", "Deck and proposal generation", "Meeting transcription",
                    "Tender and news crawling"], icon="celery")
    d.card(965, 640, "internet", "Public sources", "SPSE · World Bank · news", w=200)

    drive = d.row(1172, 240, "g-drive", "Google Drive", "knowledge folders", w=170)
    slides = d.row(1366, 240, "g-slides", "Google Slides", "editable decks", w=170)
    docs = d.row(1172, 340, "g-docs", "Google Docs", "editable proposals", w=170)
    d.row(1366, 340, "mail", "Email", "date reminders", w=170)

    plan = d.row(1172, 560, "model", "Planner agent", "top-tier model · plan + review", w=366)
    work = d.row(1172, 650, "model", "Worker agents", "lower-cost models · write, design, fix", w=366)
    cx = 1172
    for name in ("Claude", "Gemini", "GPT", "GLM", "Bedrock"):
        cx += d.chip(cx, 712, name) + 8

    d.edge([team["r"], (300, 260), (300, 330), (320, 330)], "HTTPS", at=(300, 295))
    d.edge([partner["r"], (300, 420), (300, 350), (320, 350)])
    d.edge([nginx["r"], (510, 340)])
    d.edge([(810, 260), (865, 260)])
    d.edge([(810, 420), (865, 420)])
    d.edge([(915, 472), (915, 575), (810, 575)], "jobs", at=(915, 545))
    d.edge([(865, 640), (810, 640)], "crawl", at=(838, 616))
    d.edge([(660, 210), (660, 185), (1110, 185), (1110, 240), (1150, 240)], "sync · publish", at=(900, 185), both=True)
    d.edge([(810, 455), (840, 455), (840, 500), (1120, 500), (1120, 560), (1172, 560)], "chat", at=(1000, 500))
    d.edge([(810, 720), (1130, 720), (1130, 650), (1172, 650)], "generation", at=(990, 720))
    d.edge([(1355, 595), (1355, 615)])
    d.edge([(660, 740), (660, 760), (150, 760), cal["b"]], "reminders · iCal", at=(400, 760), dashed=True)

    d.zone(40, 810, 1520, 150, "Quality gates", "ai")
    gates = [("book", "Grounded answers", "every claim cites a KB source"),
             ("code", "Template rules", "fonts, colours, structure, density"),
             ("model", "Planner review", "rewrites weak slides before export"),
             ("users", "Human approval", "presales edits in Slides / Docs")]
    xs = [60 + i * 375 for i in range(4)]
    rows = [d.row(x, 895, ic, ti, su, w=345, h=70) for (ic, ti, su), x in zip(gates, xs)]
    for a, b in zip(rows, rows[1:]):
        d.edge([a["r"], b["l"]])
    d.note(1560, 990, "Simplified view · customer data and hostnames omitted", 11.5, "#94a3b8", "end")
    d.save(OUT / "presales-architecture.svg")


if __name__ == "__main__":
    platform()
    agent()
    workers()
    delivery()
    ismart()
    presales()
