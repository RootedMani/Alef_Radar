import { CommunityMessage } from '../types';

export interface ParseResult {
  messages: CommunityMessage[];
  errors: string[];
  filename?: string;
  sourceType: 'csv' | 'json' | 'text' | 'manual';
}

/**
 * Robust CSV/TSV Parser that handles quoted multi-line values and comma/tab delimiters
 */
export function parseCsv(content: string, filename = 'imported.csv'): ParseResult {
  const errors: string[] = [];
  const delimiter = content.includes('\t') && !content.includes(',') ? '\t' : ',';
  
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // Skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === delimiter && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip \r\n
      }
      currentRow.push(currentField.trim());
      if (currentRow.some((field) => field.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  // Flush any trailing field
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((field) => field.length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length === 0) {
    return { messages: [], errors: ['File is empty'], filename, sourceType: 'csv' };
  }

  // Detect header row
  const headerRow = rows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9_]/g, ''));
  const hasHeaders = headerRow.some((h) =>
    ['text', 'message', 'body', 'content', 'post', 'comment', 'selftext', 'author', 'user'].includes(h)
  );

  let textColIdx = -1;
  let authorColIdx = -1;
  let platformColIdx = -1;
  let communityColIdx = -1;
  let timestampColIdx = -1;
  let dataRows = rows;

  if (hasHeaders) {
    dataRows = rows.slice(1);
    textColIdx = headerRow.findIndex((h) =>
      ['text', 'message', 'content', 'body', 'post', 'comment', 'selftext', 'description', 'full_text'].includes(h)
    );
    authorColIdx = headerRow.findIndex((h) =>
      ['author', 'user', 'username', 'screen_name', 'name', 'from', 'sender'].includes(h)
    );
    platformColIdx = headerRow.findIndex((h) =>
      ['platform', 'source', 'network', 'site', 'channel_type'].includes(h)
    );
    communityColIdx = headerRow.findIndex((h) =>
      ['community', 'subreddit', 'group', 'channel', 'feed', 'source_community'].includes(h)
    );
    timestampColIdx = headerRow.findIndex((h) =>
      ['timestamp', 'date', 'created_at', 'time', 'datetime', 'published_at'].includes(h)
    );
  }

  // If text column not found by header, find the column with the highest average length
  if (textColIdx === -1 && dataRows.length > 0) {
    const colCount = Math.max(...dataRows.map((r) => r.length));
    let bestCol = 0;
    let maxAvgLen = 0;
    for (let c = 0; c < colCount; c++) {
      let sumLen = 0;
      let count = 0;
      for (const row of dataRows) {
        if (row[c]) {
          sumLen += row[c].length;
          count++;
        }
      }
      const avg = count ? sumLen / count : 0;
      if (avg > maxAvgLen) {
        maxAvgLen = avg;
        bestCol = c;
      }
    }
    textColIdx = bestCol;
  }

  const messages: CommunityMessage[] = [];

  dataRows.forEach((row, idx) => {
    const rawText = row[textColIdx] || '';
    if (!rawText || rawText.trim().length < 5) return;

    const rawAuthor = (authorColIdx !== -1 ? row[authorColIdx] : '') || `community_user_${idx + 1}`;
    const rawPlatform = (platformColIdx !== -1 ? row[platformColIdx] : '') || 'Reddit';
    const rawCommunity = (communityColIdx !== -1 ? row[communityColIdx] : '') || 'Imported Community Feed';
    const rawTimestamp = (timestampColIdx !== -1 ? row[timestampColIdx] : '') || 'Recent';

    // Normalize platform
    let platform: CommunityMessage['platform'] = 'Reddit';
    const pLower = rawPlatform.toLowerCase();
    if (pLower.includes('telegram') || pLower.includes('tg')) platform = 'Telegram';
    else if (pLower.includes('discord')) platform = 'Discord';
    else if (pLower.includes('twitter') || pLower.includes('x')) platform = 'Twitter/X';
    else if (pLower.includes('linkedin')) platform = 'LinkedIn';
    else if (pLower.includes('forum') || pLower.includes('discourse')) platform = 'Forum';

    messages.push({
      id: `imported-csv-${Date.now()}-${idx}`,
      author: rawAuthor.replace(/^@/, ''),
      platform,
      sourceCommunity: rawCommunity,
      timestamp: rawTimestamp,
      text: rawText.trim(),
      likesOrUpvotes: Math.floor(Math.random() * 20),
      repliesCount: Math.floor(Math.random() * 10)
    });
  });

  return { messages, errors, filename, sourceType: 'csv' };
}

/**
 * Robust JSON parser for objects, arrays of objects, or arrays of strings
 */
export function parseJson(content: string, filename = 'imported.json'): ParseResult {
  const errors: string[] = [];
  try {
    const parsed = JSON.parse(content);
    let items: any[] = [];

    if (Array.isArray(parsed)) {
      items = parsed;
    } else if (typeof parsed === 'object' && parsed !== null) {
      if (Array.isArray(parsed.messages)) items = parsed.messages;
      else if (Array.isArray(parsed.data)) items = parsed.data;
      else if (Array.isArray(parsed.results)) items = parsed.results;
      else if (Array.isArray(parsed.posts)) items = parsed.posts;
      else if (Array.isArray(parsed.items)) items = parsed.items;
      else items = [parsed];
    }

    const messages: CommunityMessage[] = [];

    items.forEach((item, idx) => {
      let text = '';
      let author = `user_${idx + 1}`;
      let platform: CommunityMessage['platform'] = 'Reddit';
      let community = 'Imported Feed';
      let timestamp = 'Recent';

      if (typeof item === 'string') {
        text = item;
      } else if (typeof item === 'object' && item !== null) {
        text = item.text || item.message || item.content || item.body || item.post || item.comment || '';
        if (item.author || item.user || item.username) author = item.author || item.user || item.username;
        if (item.sourceCommunity || item.community || item.subreddit) {
          community = item.sourceCommunity || item.community || item.subreddit;
        }
        if (item.timestamp || item.date || item.createdAt) {
          timestamp = item.timestamp || item.date || item.createdAt;
        }

        const rawPlatform = (item.platform || '').toLowerCase();
        if (rawPlatform.includes('telegram')) platform = 'Telegram';
        else if (rawPlatform.includes('discord')) platform = 'Discord';
        else if (rawPlatform.includes('twitter') || rawPlatform.includes('x')) platform = 'Twitter/X';
        else if (rawPlatform.includes('linkedin')) platform = 'LinkedIn';
        else if (rawPlatform.includes('forum')) platform = 'Forum';
      }

      if (text && text.trim().length >= 5) {
        messages.push({
          id: `imported-json-${Date.now()}-${idx}`,
          author: author.replace(/^@/, ''),
          platform,
          sourceCommunity: community,
          timestamp,
          text: text.trim(),
          likesOrUpvotes: Math.floor(Math.random() * 20),
          repliesCount: Math.floor(Math.random() * 10)
        });
      }
    });

    return { messages, errors, filename, sourceType: 'json' };
  } catch (err: any) {
    return { messages: [], errors: [`JSON Parse Error: ${err.message}`], filename, sourceType: 'json' };
  }
}

/**
 * Smart Raw Text / Chat Log Parser
 */
export function parseRawText(content: string, filename = 'pasted_text.txt'): ParseResult {
  const lines = content
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 5);

  const messages: CommunityMessage[] = [];

  lines.forEach((line, idx) => {
    let author = `contributor_${idx + 1}`;
    let platform: CommunityMessage['platform'] = 'Telegram';
    let community = 'Raw Community Stream';
    let text = line;

    // Check if line looks like: "@username: text" or "[Reddit] @user: text"
    const matchTagged = line.match(/^\[?(Reddit|Discord|Telegram|Twitter|X|LinkedIn)?\]?\s*@?([a-zA-Z0-9_-]{3,25})[:\s-]+(.+)$/i);
    if (matchTagged) {
      if (matchTagged[1]) {
        const pStr = matchTagged[1].toLowerCase();
        if (pStr.includes('reddit')) platform = 'Reddit';
        else if (pStr.includes('discord')) platform = 'Discord';
        else if (pStr.includes('telegram')) platform = 'Telegram';
        else if (pStr.includes('twitter') || pStr.includes('x')) platform = 'Twitter/X';
      }
      author = matchTagged[2];
      text = matchTagged[3].trim();
    }

    messages.push({
      id: `imported-txt-${Date.now()}-${idx}`,
      author,
      platform,
      sourceCommunity: community,
      timestamp: 'Just now',
      text,
      likesOrUpvotes: Math.floor(Math.random() * 15),
      repliesCount: Math.floor(Math.random() * 8)
    });
  });

  return { messages, errors: [], filename, sourceType: 'text' };
}
