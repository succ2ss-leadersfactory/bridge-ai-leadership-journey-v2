const SHEET_NAMES = {
  PARTICIPANTS: 'Participants',
  RESPONSES: 'Responses',
};

const PARTICIPANTS_COLUMNS = [
  'participant_id',
  'team_name',
  'nickname',
  'created_at',
  'updated_at',
];

const RESPONSES_V2_COLUMNS = [
  'response_id',
  'participant_id',
  'team_name',
  'nickname',
  'round_id',
  'current_step',
  'junior_reading',
  'first_choice',
  'first_reason',
  'development_dilemma',
  'second_choice',
  'final_action_id',
  'development_direction',
  'generated_prompt',
  'edited_prompt',
  'ai_use_as_is',
  'ai_revise',
  'ai_risky',
  'growth_goal',
  'two_week_task',
  'leader_support',
  'check_timing',
  'watch_out',
  'final_line_1',
  'final_line_2',
  'final_line_3',
  'final_line_4',
  'final_line_5',
  'is_completed',
  'created_at',
  'updated_at',
];

function doGet(e) {
  try {
    const action = e && e.parameter ? e.parameter.action : '';

    if (action === 'getDashboardDataV2') {
      return getDashboardDataV2();
    }

    if (action === 'setupSheetsV2') {
      return setupSheetsV2();
    }

    return jsonResponse({
      ok: true,
      app: 'Bridge AI Leadership Journey v2.0',
      message: 'Apps Script endpoint is running.',
      supportedActions: ['saveLearnerResultV2', 'getDashboardDataV2', 'setupSheetsV2'],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error && error.message ? error.message : String(error),
    });
  }
}

function doPost(e) {
  try {
    const payload = parsePayload(e);

    if (!payload || !payload.action) {
      return jsonResponse({ ok: false, error: 'Missing action.' });
    }

    if (payload.action === 'saveLearnerResultV2') {
      return saveLearnerResultV2(payload);
    }

    if (payload.action === 'getDashboardDataV2') {
      return getDashboardDataV2();
    }

    if (payload.action === 'setupSheetsV2') {
      return setupSheetsV2();
    }

    return jsonResponse({ ok: false, error: 'Unknown action: ' + payload.action });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error && error.message ? error.message : String(error),
    });
  }
}

function parsePayload(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return null;
  }

  return JSON.parse(e.postData.contents);
}

function saveLearnerResultV2(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const ss = getSpreadsheet();
    const participantSheet = getOrCreateSheet(ss, SHEET_NAMES.PARTICIPANTS, PARTICIPANTS_COLUMNS);
    const responseSheet = getOrCreateSheet(ss, SHEET_NAMES.RESPONSES, RESPONSES_V2_COLUMNS);

    const participant = payload.participant || {};
    const response = payload.response || {};
    const now = new Date().toISOString();

    participant.updated_at = participant.updated_at || now;
    participant.created_at = participant.created_at || now;
    response.updated_at = response.updated_at || now;
    response.created_at = response.created_at || now;

    upsertRowByKey(participantSheet, PARTICIPANTS_COLUMNS, 'participant_id', participant);
    upsertRowByKey(responseSheet, RESPONSES_V2_COLUMNS, 'response_id', response);

    return jsonResponse({
      ok: true,
      action: 'saveLearnerResultV2',
      participant_id: participant.participant_id || '',
      response_id: response.response_id || '',
      saved_at: now,
    });
  } finally {
    lock.releaseLock();
  }
}

function getDashboardDataV2() {
  const ss = getSpreadsheet();
  const participantSheet = getOrCreateSheet(ss, SHEET_NAMES.PARTICIPANTS, PARTICIPANTS_COLUMNS);
  const responseSheet = getOrCreateSheet(ss, SHEET_NAMES.RESPONSES, RESPONSES_V2_COLUMNS);

  return jsonResponse({
    ok: true,
    participants: rowsToObjects(participantSheet),
    responses: rowsToObjects(responseSheet),
    loaded_at: new Date().toISOString(),
  });
}

function setupSheetsV2() {
  const ss = getSpreadsheet();
  const participantSheet = getOrCreateSheet(ss, SHEET_NAMES.PARTICIPANTS, PARTICIPANTS_COLUMNS);
  const responseSheet = getOrCreateSheet(ss, SHEET_NAMES.RESPONSES, RESPONSES_V2_COLUMNS);

  return jsonResponse({
    ok: true,
    action: 'setupSheetsV2',
    spreadsheetName: ss.getName(),
    sheets: [
      {
        name: participantSheet.getName(),
        columns: PARTICIPANTS_COLUMNS,
      },
      {
        name: responseSheet.getName(),
        columns: RESPONSES_V2_COLUMNS,
      },
    ],
    checked_at: new Date().toISOString(),
  });
}

function getSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error('Active spreadsheet not found. Open Apps Script from the target Google Sheet, or bind this script to the sheet.');
  }
  return ss;
}

function getOrCreateSheet(ss, name, columns) {
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  ensureHeader(sheet, columns);
  return sheet;
}

function ensureHeader(sheet, columns) {
  const lastColumn = Math.max(sheet.getLastColumn(), columns.length);
  const existingHeader = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const needsHeader = columns.some(function (column, index) {
    return existingHeader[index] !== column;
  });

  if (needsHeader) {
    sheet.getRange(1, 1, 1, columns.length).setValues([columns]);
    sheet.setFrozenRows(1);
  }
}

function upsertRowByKey(sheet, columns, keyColumn, data) {
  const keyValue = data[keyColumn];

  if (!keyValue) {
    throw new Error('Missing key value for ' + keyColumn);
  }

  const keyIndex = columns.indexOf(keyColumn);
  if (keyIndex < 0) {
    throw new Error('Key column not found: ' + keyColumn);
  }

  const rowValues = columns.map(function (column) {
    const value = data[column];
    if (value === undefined || value === null) return '';
    return String(value);
  });

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    sheet.appendRow(rowValues);
    return;
  }

  const keyRange = sheet.getRange(2, keyIndex + 1, lastRow - 1, 1).getValues();
  for (let i = 0; i < keyRange.length; i += 1) {
    if (String(keyRange[i][0]) === String(keyValue)) {
      sheet.getRange(i + 2, 1, 1, columns.length).setValues([rowValues]);
      return;
    }
  }

  sheet.appendRow(rowValues);
}

function rowsToObjects(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const header = values[0];
  return values.slice(1).filter(function (row) {
    return row.some(function (cell) { return cell !== ''; });
  }).map(function (row) {
    const item = {};
    header.forEach(function (column, index) {
      if (column) {
        item[column] = row[index];
      }
    });
    return item;
  });
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
