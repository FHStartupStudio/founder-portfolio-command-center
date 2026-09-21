# Founder Portfolio Command Center

Private, read-only founder portfolio dashboard. It reads the Google Sheet named
`Founder Portfolio Command Center` and turns the `Projects` and `Change Log`
tabs into a responsive command center.

## Run the app

The project uses the workspace workflows:

```bash
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/founder-portfolio-command-center run dev
```

For checks:

```bash
pnpm run typecheck
pnpm --filter @workspace/founder-portfolio-command-center run build
```

## Required Replit Secrets

The server accepts these secrets:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEET_ID`

`GOOGLE_SHEET_ID` should be:

```text
1qyRNNfgZm5wy4kOdgyyHHrmm0qjhZ_mwC1AVH-TVFXY
```

The Google private key is only used on the server to create a short-lived
read-only Google Sheets access token. It is never sent to the browser.

## Create and authorize a Google service account

1. In Google Cloud, create or select a project.
2. Enable the Google Sheets API.
3. Create a service account.
4. Create a JSON key for that service account.
5. Store the service-account email as `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
6. Store the JSON key's `private_key` value as `GOOGLE_PRIVATE_KEY`.
7. Share the spreadsheet with the service-account email as a **Viewer**.
8. Store the spreadsheet ID as `GOOGLE_SHEET_ID`.

Do not commit the JSON key or put it in client code.

## Sample Mode and Live Data

When the Google credentials are not configured, the app returns clearly labeled
`SAMPLE MODE` data so the interface can be used immediately. Sample records are
only a development fallback and do not represent the spreadsheet.

When credentials work, the server automatically returns `LIVE DATA`. Projects
and change-log rows are read on each app refresh. Counts, families, filters,
platform groupings, lifecycle groupings, and stale indicators are all derived
from the returned sheet rows; there are no hardcoded portfolio totals.

If a live refresh fails after a successful live sync, the server retains that
last live snapshot for the current process and shows a warning instead of
replacing valid live data with sample data. Before the first successful live
sync, a connection failure stays in Sample Mode with a non-alarming warning.

## Expected Google Sheet tabs and headers

The workbook should contain:

- `Portfolio Dashboard` — optional dashboard/reference tab
- `Projects` — the source for project records
- `Change Log` — the source for change history
- `Stage Rules` — optional lifecycle reference tab

The `Projects` header row should use these names:

`Project ID`, `Project`, `Portfolio Family`, `ChatGPT Project Name`, `Category`,
`Lifecycle Stage`, `Level %`, `Status`, `Latest Completed Gate`, `Current Gate`,
`Blocker`, `Exact Next Action`, `Do Not Redo`, `Technical Stack / Product Type`,
`Current Work Platform`, `Beta Status`, `Launch Status`, `Last Activity`,
`Last Tracker Update`, `Evidence / Checkpoint`, `Notes`

The adapter reads headers by name rather than fixed column letters. New
portfolio families and future ELT or Directory Factory rows appear without
code changes.

The `Change Log` header row should use:

`Timestamp`, `Project`, `Previous Stage`, `New Stage`, `Previous Status`,
`New Status`, `Gate / Change`, `Evidence`, `Updated By`

Blank previous/new values are allowed for baseline entries.

## Architecture

```text
ChatGPT Work
      ↓
Google Sheet (single source of truth)
      ↓
Replit dashboard (read-only V1)
```

ChatGPT Work is responsible for writing project updates to the sheet. The
dashboard only reads the sheet, computes display groupings in the UI, and never
creates a second project database or writes status changes.

The server-side Google Sheets adapter is isolated from the React UI. If the
source changes later, the UI can continue consuming the same typed snapshot
contract.

## Exact next step for real-sheet connection

Add the three secrets above, share the spreadsheet with the service-account
email as **Viewer**, then press **Refresh** in the dashboard. The top bar should
change from `SAMPLE MODE` to `LIVE DATA`, and the synced timestamp should update
from the Google Sheet.