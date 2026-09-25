function onAttendanceFormSubmit(e) {
  // ==========================================
  // CONFIGURATION
  // Make sure to edit the MASTER_SPREADSHEET_ID and MASTER_SHEET_NAME 
  // to match the actual master spreadsheet and sheet name where attendance 
  // is tracked. This can be found in the Google Sheets URL 
  // of the master spreadsheet and the tab name respectively.
  // ==========================================
  const MASTER_SPREADSHEET_ID = "1fzSJJOuz19VCB8joZTkozI395c_XXpjWDXG6zkgqw3I";
  const MASTER_SHEET_NAME = "Master"; // e.g., "Sheet1" or "Attendance"

  // Master Sheet Layout
  const START_ROW = 3;
  const END_ROW = 354;
  const EMAIL_COL = 1;     // Col A
  const BUID_COL = 5;      // Col E
  const WEEK_1_COL = 11;   // Col K (Week 1)
  const TOTAL_WEEKS = 10;  // Col K (Week 1) through Col T (Week 10)
  // ==========================================
  // SEMESTER SCHEDULE
  // Edit the start and end dates based on when labs are scheduled.
  // ==========================================
  function getWeekColumn(timestamp) {
    const d = new Date(timestamp);

    // Format: [WeekNumber, StartDate 'YYYY-MM-DD', EndDate 'YYYY-MM-DD']
    // End date should be set through 23:59:59 of that week's cutoff day
    const schedule = [
      { week: 1, start: "2026-09-14", end: "2026-09-15" },
      { week: 2, start: "2026-09-21", end: "2026-09-22" },
      { week: 3, start: "2026-09-28", end: "2026-09-29" },
      { week: 4, start: "2026-10-05", end: "2026-10-06" },
      { week: 5, start: "2026-10-19", end: "2026-10-20" },
      { week: 6, start: "2026-10-26", end: "2026-10-27" },
      { week: 7, start: "2026-11-02", end: "2026-11-03" },
      { week: 8, start: "2026-11-09", end: "2026-11-10" },
      { week: 9, start: "2026-11-16", end: "2026-11-17" },
      { week: 10, start: "2026-11-30", end: "2026-12-01" },
    ];

    for (const entry of schedule) {
      const start = new Date(entry.start + "T00:00:00");
      const end = new Date(entry.end + "T23:59:59");
      if (d >= start && d <= end) {
        return WEEK_1_COL + (entry.week - 1); // e.g. Week 1 -> Col 11 (K)
      }
    }
    return null; // Timestamp falls outside defined ranges
  }

  // ==========================================
  // PARSE FORM SUBMISSION
  // ==========================================
  const responses = e.namedValues;
  if (!responses) return;

  // Extract verified email (Google Forms usually names this 'Email Address' or 'Email')
  const emailKey = Object.keys(responses).find(k => k.toLowerCase().includes("email"));
  const studentEmail = emailKey && responses[emailKey][0] ? responses[emailKey][0].trim().toLowerCase() : "";

  // Extract BUID (strip leading 'U' if entered inconsistently, and whitespace)
  const buidKey = Object.keys(responses).find(k => k.toLowerCase().includes("buid") || k.toLowerCase().includes("id"));
  const studentBuid = buidKey && responses[buidKey][0] ? responses[buidKey][0].trim().toUpperCase() : "";

  // Extract Timestamp
  const timestampKey = Object.keys(responses).find(k => k.toLowerCase().includes("timestamp"));
  const timestampStr = timestampKey ? responses[timestampKey][0] : null;

  if (!timestampStr) {
    Logger.log("Missing timestamp.");
    return;
  }

  const targetCol = getWeekColumn(timestampStr);
  if (!targetCol) {
    Logger.log(`Submission at ${timestampStr} did not fall into any defined lab week.`);
    return;
  }

  // ==========================================
  // UPDATE MASTER SHEET
  // ==========================================
  const masterDoc = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
  const masterSheet = masterDoc.getSheetByName(MASTER_SHEET_NAME);

  const numRows = END_ROW - START_ROW + 1;
  // Read Columns A through E in one batch for performance
  const rosterData = masterSheet.getRange(START_ROW, 1, numRows, 5).getValues();

  let matchedRow = -1;

  for (let i = 0; i < rosterData.length; i++) {
    const rowEmail = String(rosterData[i][EMAIL_COL - 1]).trim().toLowerCase();
    const rowBuid = String(rosterData[i][BUID_COL - 1]).trim().toUpperCase();

    // Primary match: Email; Fallback match: BUID
    const emailMatches = studentEmail && (rowEmail === studentEmail || rowEmail.split("@")[0] === studentEmail.split("@")[0]);
    const buidMatches = studentBuid && (rowBuid === studentBuid || rowBuid.replace(/^U/, '') === studentBuid.replace(/^U/, ''));

    if (emailMatches || buidMatches) {
      matchedRow = START_ROW + i;
      break;
    }
  }

  if (matchedRow !== -1) {
    // Write a 1 in the corresponding student row and week column
    masterSheet.getRange(matchedRow, targetCol).setValue(1);
    Logger.log(`Successfully marked row ${matchedRow} for week column ${targetCol}`);
  } else {
    Logger.log(`Student not found in master doc. Email: ${studentEmail}, BUID: ${studentBuid}`);
  }
}