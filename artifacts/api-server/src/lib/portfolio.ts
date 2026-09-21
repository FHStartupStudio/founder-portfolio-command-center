import { createSign } from "node:crypto";
import type { ChangeLogEntry, PortfolioSnapshot, Project } from "@workspace/api-zod";

type SheetRow = Record<string, string>;

let lastLiveSnapshot: PortfolioSnapshot | null = null;

const DEFAULT_SHEET_ID = "1qyRNNfgZm5wy4kOdgyyHHrmm0qjhZ_mwC1AVH-TVFXY";

const sampleDate = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

const sampleProjects: Project[] = [
  {
    projectId: "catch",
    project: "CATch",
    portfolioFamily: "Animal Care & Rescue Technology",
    chatGptProjectName: "CATch",
    category: "Animal rescue coordination",
    lifecycleStage: "Founder Beta Verification",
    levelPercent: 50,
    status: "Active",
    latestCompletedGate: "Founder Alpha Build",
    currentGate: "Founder Alpha Verification",
    blocker: "Need a final pass on intake and matching flows.",
    exactNextAction: "Run the verification checklist against the three core rescue scenarios.",
    doNotRedo: "Do not rebuild the intake flow or replace the current matching model.",
    technicalStackProductType: "Web app",
    currentWorkPlatform: "Replit",
    betaStatus: "Founder Beta / Pre-Beta",
    launchStatus: "Not launch ready",
    lastActivity: sampleDate(2),
    lastTrackerUpdate: sampleDate(2),
    evidenceCheckpoint: "Alpha flow is usable end-to-end in the current preview.",
    notes: "High-priority rescue workflow with a narrow first beta.",
  },
  {
    projectId: "pawfolio",
    project: "Pawfolio",
    portfolioFamily: "Animal Care & Rescue Technology",
    chatGptProjectName: "Pawfolio",
    category: "Pet health records",
    lifecycleStage: "Prototype",
    levelPercent: 30,
    status: "Waiting on Gate",
    latestCompletedGate: "Product Decisions",
    currentGate: "Prototype review",
    blocker: "Need a decision on the initial record taxonomy.",
    exactNextAction: "Choose the smallest health-record schema that supports the first dog and cat flows.",
    doNotRedo: "Do not restart discovery or add a marketplace layer before the taxonomy is decided.",
    technicalStackProductType: "Web app",
    currentWorkPlatform: "No active build",
    betaStatus: "Founder Beta / Pre-Beta",
    launchStatus: "Not launch ready",
    lastActivity: sampleDate(12),
    lastTrackerUpdate: sampleDate(12),
    evidenceCheckpoint: "Prototype screens exist for pet profile and vaccination history.",
    notes: "Blocked on a narrow product decision.",
  },
  {
    projectId: "resqlink",
    project: "ResQLink",
    portfolioFamily: "Animal Care & Rescue Technology",
    chatGptProjectName: "ResQLink",
    category: "Emergency animal response",
    lifecycleStage: "Idea & Research",
    levelPercent: 5,
    status: "Validation",
    latestCompletedGate: "Initial problem framing",
    currentGate: "Validation",
    blocker: "Need five interviews with rescue coordinators.",
    exactNextAction: "Schedule and complete five coordinator interviews focused on urgent placement handoffs.",
    doNotRedo: "Do not build an app before the handoff problem is validated.",
    technicalStackProductType: "Research / validation",
    currentWorkPlatform: "Research / validation",
    betaStatus: "Founder Beta / Pre-Beta",
    launchStatus: "Not launch ready",
    lastActivity: sampleDate(21),
    lastTrackerUpdate: sampleDate(21),
    evidenceCheckpoint: "",
    notes: "Research queue is intentionally small.",
  },
  {
    projectId: "offhours-vet",
    project: "OffHours Vet",
    portfolioFamily: "Animal Care & Rescue Technology",
    chatGptProjectName: "OffHours Vet",
    category: "Veterinary access",
    lifecycleStage: "Product Decisions",
    levelPercent: 10,
    status: "Planned",
    latestCompletedGate: "Idea & Research",
    currentGate: "Product Decisions",
    blocker: "",
    exactNextAction: "Define the first geography and service boundary.",
    doNotRedo: "Do not build a directory until the geographic scope is explicit.",
    technicalStackProductType: "Directory / marketplace",
    currentWorkPlatform: "Parked",
    betaStatus: "Founder Beta / Pre-Beta",
    launchStatus: "Not launch ready",
    lastActivity: sampleDate(5),
    lastTrackerUpdate: sampleDate(5),
    evidenceCheckpoint: "",
    notes: "Parked while the rescue products move forward.",
  },
  {
    projectId: "founder-ops",
    project: "Founder Ops Console",
    portfolioFamily: "Business Automation & AI Operations",
    chatGptProjectName: "Founder Ops Console",
    category: "Founder productivity",
    lifecycleStage: "Closed Beta Ready",
    levelPercent: 80,
    status: "Ready",
    latestCompletedGate: "Founder Beta / Pre-Beta",
    currentGate: "Closed Beta Ready",
    blocker: "",
    exactNextAction: "Invite the first three internal testers and capture their first-session notes.",
    doNotRedo: "Do not rebuild the dashboard shell or change the project data model during beta.",
    technicalStackProductType: "Web + API",
    currentWorkPlatform: "Replit",
    betaStatus: "Closed Beta Ready",
    launchStatus: "Not launch ready",
    lastActivity: sampleDate(1),
    lastTrackerUpdate: sampleDate(1),
    evidenceCheckpoint: "Read-only portfolio dashboard is functional in Sample Mode.",
    notes: "This command center is itself tracked as a portfolio project.",
  },
  {
    projectId: "benefits-navigator",
    project: "Benefits Navigator",
    portfolioFamily: "Government & Public Benefits",
    chatGptProjectName: "Benefits Navigator",
    category: "Public benefits discovery",
    lifecycleStage: "Founder Alpha Build",
    levelPercent: 40,
    status: "Active",
    latestCompletedGate: "Prototype",
    currentGate: "Founder Alpha Build",
    blocker: "Need to verify source freshness rules.",
    exactNextAction: "Document the source update cadence and mark stale program records.",
    doNotRedo: "Do not redesign the eligibility questionnaire until source freshness is handled.",
    technicalStackProductType: "Web app",
    currentWorkPlatform: "Codex",
    betaStatus: "Founder Beta / Pre-Beta",
    launchStatus: "Not launch ready",
    lastActivity: sampleDate(8),
    lastTrackerUpdate: sampleDate(8),
    evidenceCheckpoint: "Questionnaire prototype is mapped to a first set of benefit programs.",
    notes: "High potential, but source quality is the gating issue.",
  },
  {
    projectId: "quiet-faith",
    project: "Quiet Faith",
    portfolioFamily: "Faith & Daily Life",
    category: "Daily reflection",
    lifecycleStage: "Founder Beta / Pre-Beta",
    levelPercent: 70,
    status: "Active",
    latestCompletedGate: "Founder Alpha Verification",
    currentGate: "Founder Beta / Pre-Beta",
    blocker: "",
    exactNextAction: "Run a seven-day founder-only usage cycle and record retention friction.",
    doNotRedo: "Do not add social features or public profiles in the first beta.",
    technicalStackProductType: "Native app",
    currentWorkPlatform: "Base44",
    betaStatus: "Founder Beta / Pre-Beta",
    launchStatus: "Not launch ready",
    lastActivity: sampleDate(4),
    lastTrackerUpdate: sampleDate(4),
    evidenceCheckpoint: "Core reflection flow is complete and repeatable.",
    notes: "Keep the first experience private and focused.",
  },
  {
    projectId: "directory-factory",
    project: "Directory Factory",
    portfolioFamily: "Directory Factory",
    category: "Directory platform",
    lifecycleStage: "Launch Ready",
    levelPercent: 95,
    status: "Ready",
    latestCompletedGate: "Closed Beta Active",
    currentGate: "Launch Ready",
    blocker: "",
    exactNextAction: "Complete the launch checklist and verify the first directory's data import.",
    doNotRedo: "Do not revisit the directory template architecture; focus only on launch readiness.",
    technicalStackProductType: "Web + Supabase",
    currentWorkPlatform: "GitHub Copilot / VS Code",
    betaStatus: "Closed Beta Active",
    launchStatus: "Launch Ready",
    lastActivity: sampleDate(3),
    lastTrackerUpdate: sampleDate(3),
    evidenceCheckpoint: "Closed beta users completed the core discovery flow.",
    notes: "Ready for a controlled first launch.",
  },
];

const sampleChangeLog: ChangeLogEntry[] = [
  {
    timestamp: sampleDate(1),
    project: "Founder Ops Console",
    previousStage: "Founder Beta / Pre-Beta",
    newStage: "Closed Beta Ready",
    previousStatus: "Active",
    newStatus: "Ready",
    gateChange: "Beta readiness review",
    evidence: "Read-only dashboard is functional in Sample Mode.",
    updatedBy: "Founder",
  },
  {
    timestamp: sampleDate(2),
    project: "CATch",
    previousStage: "Founder Alpha Build",
    newStage: "Founder Alpha Verification",
    previousStatus: "Active",
    newStatus: "Active",
    gateChange: "Moved into verification",
    evidence: "Core rescue flow is usable end-to-end.",
    updatedBy: "Founder",
  },
  {
    timestamp: sampleDate(3),
    project: "Directory Factory",
    previousStage: "Closed Beta Active",
    newStage: "Launch Ready",
    previousStatus: "Active",
    newStatus: "Ready",
    gateChange: "Launch checklist opened",
    evidence: "Closed beta flow completed.",
    updatedBy: "Founder",
  },
];

export const sampleSnapshot = (): PortfolioSnapshot => ({
  mode: "SAMPLE MODE",
  syncedAt: new Date().toISOString(),
  projects: sampleProjects,
  changeLog: sampleChangeLog,
  warning: null,
});

const normalizeHeader = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[%/]+/g, " percent ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+(\w)/g, (_match, letter: string) => letter.toUpperCase());

const asRows = (values: string[][] | undefined): SheetRow[] => {
  if (!values || values.length < 2) return [];
  const headers = values[0].map(normalizeHeader);
  return values.slice(1).filter((row) => row.some(Boolean)).map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index]?.trim() ?? ""])),
  );
};

const first = (row: SheetRow, ...keys: string[]) =>
  keys.map((key) => row[normalizeHeader(key)]).find((value) => value !== undefined) ?? "";

const numberValue = (value: string) => {
  const parsed = Number(value.replace("%", "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
};

const projectFromRow = (row: SheetRow, index: number): Project => {
  const project = first(row, "Project") || `Unnamed project ${index + 1}`;
  const fallbackId = project.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return {
    projectId: first(row, "Project ID", "ProjectID") || fallbackId,
    project,
    portfolioFamily: first(row, "Portfolio Family") || "Uncategorized",
    chatGptProjectName: first(row, "ChatGPT Project Name"),
    category: first(row, "Category"),
    lifecycleStage: first(row, "Lifecycle Stage"),
    levelPercent: numberValue(first(row, "Level %", "Level Percent")),
    status: first(row, "Status"),
    latestCompletedGate: first(row, "Latest Completed Gate"),
    currentGate: first(row, "Current Gate"),
    blocker: first(row, "Blocker"),
    exactNextAction: first(row, "Exact Next Action"),
    doNotRedo: first(row, "Do Not Redo"),
    technicalStackProductType: first(row, "Technical Stack / Product Type"),
    currentWorkPlatform: first(row, "Current Work Platform"),
    betaStatus: first(row, "Beta Status"),
    launchStatus: first(row, "Launch Status"),
    lastActivity: first(row, "Last Activity"),
    lastTrackerUpdate: first(row, "Last Tracker Update"),
    evidenceCheckpoint: first(row, "Evidence / Checkpoint"),
    notes: first(row, "Notes"),
  };
};

const changeLogFromRow = (row: SheetRow): ChangeLogEntry => ({
  timestamp: first(row, "Timestamp", "Date"),
  project: first(row, "Project"),
  previousStage: first(row, "Previous Stage"),
  newStage: first(row, "New Stage"),
  previousStatus: first(row, "Previous Status"),
  newStatus: first(row, "New Status"),
  gateChange: first(row, "Gate / Change", "Gate Change"),
  evidence: first(row, "Evidence"),
  updatedBy: first(row, "Updated By"),
});

const base64Url = (value: string | Buffer) =>
  Buffer.from(value).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const getGoogleAccessToken = async (email: string, privateKey: string) => {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(JSON.stringify({
    iss: email,
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${claim}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const signature = base64Url(signer.sign(privateKey.replace(/\\n/g, "\n")));
  const assertion = `${unsigned}.${signature}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!response.ok) throw new Error(`Google token request failed (${response.status})`);
  const body = (await response.json()) as { access_token?: string };
  if (!body.access_token) throw new Error("Google token response did not include an access token");
  return body.access_token;
};

const fetchLiveSnapshot = async (): Promise<PortfolioSnapshot> => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID || DEFAULT_SHEET_ID;
  if (!email || !privateKey) throw new Error("Google Sheets credentials are not configured");
  const token = await getGoogleAccessToken(email, privateKey);
  const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values:batchGet`);
  url.searchParams.append("ranges", "Projects");
  url.searchParams.append("ranges", "Change Log");
  url.searchParams.set("majorDimension", "ROWS");
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Google Sheets request failed (${response.status})`);
  const body = (await response.json()) as { valueRanges?: Array<{ values?: string[][] }> };
  const ranges = body.valueRanges ?? [];
  const projects = asRows(ranges[0]?.values).map(projectFromRow);
  const changeLog = asRows(ranges[1]?.values).map(changeLogFromRow).sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  if (projects.length === 0) throw new Error("Google Sheets returned no project rows");
  return { mode: "LIVE DATA", syncedAt: new Date().toISOString(), projects, changeLog, warning: null };
};

export const getPortfolioSnapshot = async (): Promise<PortfolioSnapshot> => {
  try {
    const live = await fetchLiveSnapshot();
    lastLiveSnapshot = live;
    return live;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Google Sheets could not be reached";
    if (lastLiveSnapshot) {
      return { ...lastLiveSnapshot, warning: `Live refresh failed. Showing the last successful live sync. (${message})` };
    }
    return { ...sampleSnapshot(), warning: `Sample Mode is active because live Google Sheets data is unavailable. (${message})` };
  }
};

export const getProject = async (projectId: string) => {
  const snapshot = await getPortfolioSnapshot();
  return snapshot.projects.find((project) => project.projectId === projectId);
};