// Imports
import { IStorageService } from '../types/services';
import { CalendarService, KalendarDayInfo } from './CalendarService';
import { LiturgicalTextPart } from './TextParsingService';
import { DirectoriumService } from './DirectoriumService';
import { LiturgicalEngineService, OfficeComponentPaths } from './LiturgicalEngineService';
import {
  CachedLiturgicalData,
  JournalEntry,
  SaintInfo,
  MartyrologicalEntry,
  ParishInfo,
  ParishEvent,
  Newsletter,
  BilingualText,
  LiturgicalDay,
  VoiceNote,
  // New types for 6 UI screens
  TextAnnotation,
  MassBookmark,
  CommunityPost,
  PostComment,
  Announcement,
  ConcordanceDay,
} from '../types/liturgical';

const CREATE_CALENDAR_DAYS_TABLE = `
CREATE TABLE IF NOT EXISTS calendar_days (
  date TEXT PRIMARY KEY NOT NULL,
  season TEXT,
  celebration TEXT,
  rank INTEGER,
  color TEXT,
  commemorations TEXT,
  raw_kalendar_line TEXT
);`;

const CREATE_MASS_TEXTS_TABLE = `
CREATE TABLE IF NOT EXISTS mass_texts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  celebration_key TEXT NOT NULL,
  part_type TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  latin TEXT NOT NULL,
  english TEXT NOT NULL,
  is_rubric BOOLEAN DEFAULT 0,
  FOREIGN KEY (celebration_key) REFERENCES calendar_days(date)
);`;

const CREATE_OFFICE_TEXTS_TABLE = `
CREATE TABLE IF NOT EXISTS office_texts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  celebration_key TEXT NOT NULL,
  hour TEXT NOT NULL,
  part_type TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  latin TEXT NOT NULL,
  english TEXT NOT NULL,
  is_rubric BOOLEAN DEFAULT 0,
  FOREIGN KEY (celebration_key) REFERENCES calendar_days(date)
);`;

const CREATE_VOICE_NOTES_TABLE = `
CREATE TABLE IF NOT EXISTS voice_notes (
  id TEXT PRIMARY KEY NOT NULL,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  duration INTEGER NOT NULL,
  transcription TEXT
);`;

const CREATE_CACHED_LITURGICAL_DATA_TABLE = `
CREATE TABLE IF NOT EXISTS cached_liturgical_data (
  date TEXT PRIMARY KEY NOT NULL,
  liturgical_data TEXT NOT NULL,
  cached_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);`;

const CREATE_JOURNAL_ENTRIES_TABLE = `
CREATE TABLE IF NOT EXISTS journal_entries (
  id TEXT PRIMARY KEY NOT NULL,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  liturgical_context TEXT,
  tags TEXT,
  created TEXT NOT NULL,
  modified TEXT NOT NULL
);`;

const CREATE_SAINTS_INFO_TABLE = `
CREATE TABLE IF NOT EXISTS saints_info (
  name TEXT PRIMARY KEY NOT NULL,
  feast_day TEXT NOT NULL,
  biography TEXT NOT NULL,
  patronage TEXT,
  sources TEXT
);`;

const CREATE_MARTYROLOGY_TABLE = `
CREATE TABLE IF NOT EXISTS martyrology (
  date TEXT PRIMARY KEY NOT NULL,
  entries TEXT NOT NULL
);`;

const CREATE_PARISH_INFO_TABLE = `
CREATE TABLE IF NOT EXISTS parish_info (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  pastor TEXT NOT NULL,
  mass_schedule TEXT NOT NULL
);`;

const CREATE_PARISH_EVENTS_TABLE = `
CREATE TABLE IF NOT EXISTS parish_events (
  id TEXT PRIMARY KEY NOT NULL,
  parish_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  location TEXT,
  category TEXT NOT NULL,
  FOREIGN KEY (parish_id) REFERENCES parish_info(id)
);`;

const CREATE_NEWSLETTERS_TABLE = `
CREATE TABLE IF NOT EXISTS newsletters (
  id TEXT PRIMARY KEY NOT NULL,
  parish_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  publish_date TEXT NOT NULL,
  author TEXT NOT NULL,
  FOREIGN KEY (parish_id) REFERENCES parish_info(id)
);`;

const CREATE_USER_SETTINGS_TABLE = `
CREATE TABLE IF NOT EXISTS user_settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);`;

// New tables for 6 UI screens implementation
const CREATE_TEXT_ANNOTATIONS_TABLE = `
CREATE TABLE IF NOT EXISTS text_annotations (
  id TEXT PRIMARY KEY NOT NULL,
  text_id TEXT NOT NULL,
  word TEXT NOT NULL,
  position INTEGER NOT NULL,
  type TEXT NOT NULL,
  definition TEXT,
  grammar TEXT,
  annotation_type TEXT,
  content TEXT,
  media_path TEXT,
  created_at TEXT NOT NULL
);`;

const CREATE_MASS_BOOKMARKS_TABLE = `
CREATE TABLE IF NOT EXISTS mass_bookmarks (
  id TEXT PRIMARY KEY NOT NULL,
  date TEXT NOT NULL,
  mass_part_id TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL
);`;

const CREATE_COMMUNITY_POSTS_TABLE = `
CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT PRIMARY KEY NOT NULL,
  parish_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  is_admin BOOLEAN DEFAULT 0,
  content TEXT NOT NULL,
  visibility TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);`;

const CREATE_POST_COMMENTS_TABLE = `
CREATE TABLE IF NOT EXISTS post_comments (
  id TEXT PRIMARY KEY NOT NULL,
  post_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (post_id) REFERENCES community_posts(id)
);`;

const CREATE_ANNOUNCEMENTS_TABLE = `
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY NOT NULL,
  parish_id TEXT NOT NULL,
  title TEXT NOT NULL,
  date_label TEXT NOT NULL,
  time_label TEXT,
  image_url TEXT,
  category TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL
);`;

const CREATE_CONCORDANCE_CACHE_TABLE = `
CREATE TABLE IF NOT EXISTS concordance_cache (
  date TEXT PRIMARY KEY NOT NULL,
  display_date TEXT NOT NULL,
  day_of_week TEXT NOT NULL,
  calendar_1962 TEXT NOT NULL,
  modern_calendar TEXT NOT NULL,
  cached_at TEXT NOT NULL
);`;

interface MergedTextPart {
  celebration_key: string;
  part_type: string;
  sequence: number;
  latin: string;
  english: string;
  is_rubric: boolean;
  hour?: string;
}

export class DataManager {
  private storageService: IStorageService;
  private calendarService: CalendarService;
  private directoriumService: DirectoriumService;
  private liturgicalEngineService: LiturgicalEngineService;
  private currentLiturgicalVersionId: string = "Rubrics 1960 - 1960";
  private _isInitialized: boolean = false;

  constructor(storageService: IStorageService) {
    this.storageService = storageService;
    this.calendarService = new CalendarService();
    this.directoriumService = new DirectoriumService();
    this.liturgicalEngineService = new LiturgicalEngineService(this.directoriumService);
  }

  private mergeTexts(latinParts: LiturgicalTextPart[], englishParts: LiturgicalTextPart[]): MergedTextPart[] {
    const merged: MergedTextPart[] = [];
    const englishMap = new Map<string, LiturgicalTextPart>();

    englishParts.forEach(ep => {
      const key = `${ep.part_type}_${ep.sequence}`;
      englishMap.set(key, ep);
    });

    latinParts.forEach(lp => {
      const key = `${lp.part_type}_${lp.sequence}`;
      const ep = englishMap.get(key);
      merged.push({
        celebration_key: '',
        part_type: lp.part_type,
        sequence: lp.sequence,
        latin: lp.text_content,
        english: ep ? ep.text_content : '',
        is_rubric: lp.is_rubric,
      });
      if (ep) englishMap.delete(key);
    });

    englishMap.forEach(ep => {
      merged.push({
        celebration_key: '',
        part_type: ep.part_type,
        sequence: ep.sequence,
        latin: '',
        english: ep.text_content,
        is_rubric: ep.is_rubric,
      });
    });

    merged.sort((a, b) => a.sequence - b.sequence);
    return merged;
  }

  async initialize(): Promise<void> {
    if (this._isInitialized) {
      console.log('DataManager: Already initialized. Skipping.');
      return;
    }

    console.log('DataManager: Initializing self-contained liturgical database...');
    await this.storageService.initialize();

    await this.storageService.transaction(async () => {
      await this.storageService.executeQuery(CREATE_CALENDAR_DAYS_TABLE);
      await this.storageService.executeQuery(CREATE_MASS_TEXTS_TABLE);
      await this.storageService.executeQuery(CREATE_OFFICE_TEXTS_TABLE);
      await this.storageService.executeQuery(CREATE_VOICE_NOTES_TABLE);
      await this.storageService.executeQuery(CREATE_CACHED_LITURGICAL_DATA_TABLE);
      await this.storageService.executeQuery(CREATE_JOURNAL_ENTRIES_TABLE);
      await this.storageService.executeQuery(CREATE_SAINTS_INFO_TABLE);
      await this.storageService.executeQuery(CREATE_MARTYROLOGY_TABLE);
      await this.storageService.executeQuery(CREATE_PARISH_INFO_TABLE);
      await this.storageService.executeQuery(CREATE_PARISH_EVENTS_TABLE);
      await this.storageService.executeQuery(CREATE_NEWSLETTERS_TABLE);
      await this.storageService.executeQuery(CREATE_USER_SETTINGS_TABLE);
      // New tables for 6 UI screens
      await this.storageService.executeQuery(CREATE_TEXT_ANNOTATIONS_TABLE);
      await this.storageService.executeQuery(CREATE_MASS_BOOKMARKS_TABLE);
      await this.storageService.executeQuery(CREATE_COMMUNITY_POSTS_TABLE);
      await this.storageService.executeQuery(CREATE_POST_COMMENTS_TABLE);
      await this.storageService.executeQuery(CREATE_ANNOUNCEMENTS_TABLE);
      await this.storageService.executeQuery(CREATE_CONCORDANCE_CACHE_TABLE);
    });

    console.log('DataManager: Ready with self-contained liturgical database.');
    this._isInitialized = true;
  }

  // Query methods for accessing pre-populated SQLite database

  async getMassTextsForDate(date: string): Promise<Array<{
    part_type: string;
    sequence: number;
    latin: string;
    english: string;
    is_rubric: boolean;
  }>> {
    const results = await this.storageService.executeQuery(
      `SELECT part_type, sequence, latin, english, is_rubric 
       FROM mass_texts 
       WHERE celebration_key = ? 
       ORDER BY sequence ASC`,
      [date]
    );
    return results;
  }

  async getOfficeTextsForDate(date: string, hour?: string): Promise<Array<{
    hour: string;
    part_type: string;
    sequence: number;
    latin: string;
    english: string;
    is_rubric: boolean;
  }>> {
    let sql = `SELECT hour, part_type, sequence, latin, english, is_rubric 
               FROM office_texts 
               WHERE celebration_key = ?`;
    const params: any[] = [date];

    if (hour) {
      sql += ` AND hour = ?`;
      params.push(hour);
    }

    sql += ` ORDER BY hour, sequence ASC`;

    const results = await this.storageService.executeQuery(sql, params);
    return results;
  }

  async getLiturgicalDayInfo(date: string): Promise<{
    date: string;
    celebration: string | null;
    season: string | null;
    rank: number;
    color: string | null;
    commemorations: string[];
    raw_kalendar_line: string | null;
  } | null> {
    const results = await this.storageService.executeQuery(
      `SELECT date, celebration, season, rank, color, commemorations, raw_kalendar_line
       FROM calendar_days 
       WHERE date = ?`,
      [date]
    );

    if (results.length === 0) return null;

    const row = results[0];
    return {
      ...row,
      commemorations: row.commemorations ? JSON.parse(row.commemorations) : []
    };
  }

  private isMassPartHeuristic(partType: string): boolean {
    const massParts = ['Introitus', 'Graduale', 'Alleluia', 'Tractus', 'Sequentia', 'Evangelium', 'Credo', 'Offertorium', 'Secreta', 'Praefatio', 'Pater Noster', 'Communio', 'Postcommunio', 'Oratio super populum', 'Lectio Epistolae', 'Kyrie', 'Gloria', 'Sanctus', 'Agnus Dei', 'Ite missa est', 'Benedicamus Domino'];
    if (partType === 'Oratio') return false;
    return massParts.includes(partType) || massParts.some(mp => partType.startsWith(mp) && mp !== partType);
  }

  private getHourFromPartType(partType: string): string {
    const p = partType.toLowerCase();
    if (p.includes('matutinum')) return 'Matutinum';
    if (p.includes('laudes')) return 'Laudes';
    if (p.includes('prima')) return 'Prima';
    if (p.includes('tertia')) return 'Tertia';
    if (p.includes('sexta')) return 'Sexta';
    if (p.includes('nona')) return 'Nona';
    if (p.includes('vespera')) return 'Vespera';
    if (p.includes('completorium')) return 'Completorium';
    return 'Unknown';
  }

  // Dynamic liturgical data with caching
  async getLiturgicalDataForDate(date: string): Promise<CachedLiturgicalData> {
    // Check cache first
    const cached = await this.getCachedLiturgicalData(date);
    if (cached && new Date(cached.expiresAt) > new Date()) {
      console.log(`DataManager: Using cached liturgical data for ${date}`);
      return cached;
    }

    console.log(`DataManager: Calculating fresh liturgical data for ${date}`);
    
    // Calculate using liturgical engine
    const liturgicalDay = await this.liturgicalEngineService.calculateLiturgicalDay(date);
    const massTexts = await this.liturgicalEngineService.getMassTexts(date);
    const officeTexts = await this.liturgicalEngineService.getOfficeTexts(date);
    const martyrology = await this.getMartyrologicalEntry(date);
    const saintInfo = await this.getSaintInfoForDate(date);

    const cachedData: CachedLiturgicalData = {
      date,
      liturgicalDay,
      massTexts,
      officeTexts,
      martyrology,
      saintInfo,
      cachedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };

    // Cache the result
    await this.cacheLiturgicalData(cachedData);
    return cachedData;
  }

  private async getCachedLiturgicalData(date: string): Promise<CachedLiturgicalData | null> {
    const results = await this.storageService.executeQuery(
      'SELECT liturgical_data FROM cached_liturgical_data WHERE date = ? AND expires_at > ?',
      [date, new Date().toISOString()]
    );
    
    if (results.length > 0) {
      return JSON.parse(results[0].liturgical_data);
    }
    return null;
  }

  private async cacheLiturgicalData(data: CachedLiturgicalData): Promise<void> {
    await this.storageService.executeQuery(
      `INSERT OR REPLACE INTO cached_liturgical_data 
       (date, liturgical_data, cached_at, expires_at) 
       VALUES (?, ?, ?, ?)`,
      [data.date, JSON.stringify(data), data.cachedAt, data.expiresAt]
    );
  }

  // Cache Management
  async getCacheStats(): Promise<{
    totalEntries: number;
    expiredEntries: number;
    totalSizeBytes: number;
    oldestEntry: string | null;
    newestEntry: string | null;
  }> {
    const [totalResult, expiredResult, sizeResult, oldestResult, newestResult] = await Promise.all([
      this.storageService.executeQuery('SELECT COUNT(*) as count FROM cached_liturgical_data'),
      this.storageService.executeQuery('SELECT COUNT(*) as count FROM cached_liturgical_data WHERE expires_at < ?', [new Date().toISOString()]),
      this.storageService.executeQuery('SELECT SUM(LENGTH(liturgical_data)) as size FROM cached_liturgical_data'),
      this.storageService.executeQuery('SELECT MIN(cached_at) as oldest FROM cached_liturgical_data'),
      this.storageService.executeQuery('SELECT MAX(cached_at) as newest FROM cached_liturgical_data')
    ]);

    return {
      totalEntries: totalResult[0]?.count || 0,
      expiredEntries: expiredResult[0]?.count || 0,
      totalSizeBytes: sizeResult[0]?.size || 0,
      oldestEntry: oldestResult[0]?.oldest || null,
      newestEntry: newestResult[0]?.newest || null
    };
  }

  async cleanupExpiredCache(preserveMajorFeasts: boolean = true): Promise<{ deleted: number; preserved: number }> {
    const majorFeastDates = preserveMajorFeasts ? this.getMajorFeastDates() : [];
    
    // Get all expired entries
    const expiredResults = await this.storageService.executeQuery(
      'SELECT date FROM cached_liturgical_data WHERE expires_at < ?',
      [new Date().toISOString()]
    );

    let deleted = 0;
    let preserved = 0;

    for (const row of expiredResults) {
      const date = row.date;
      
      // Check if this is a major feast date (Christmas, Easter, etc.)
      if (majorFeastDates.some(feastDate => this.isSameLiturgicalDate(date, feastDate))) {
        preserved++;
        continue; // Skip deletion for major feasts
      }

      await this.storageService.executeQuery(
        'DELETE FROM cached_liturgical_data WHERE date = ?',
        [date]
      );
      deleted++;
    }

    console.log(`Cache cleanup: ${deleted} entries deleted, ${preserved} major feasts preserved`);
    return { deleted, preserved };
  }

  async clearCacheForDate(date: string): Promise<void> {
    await this.storageService.executeQuery(
      'DELETE FROM cached_liturgical_data WHERE date = ?',
      [date]
    );
  }

  async clearAllCache(): Promise<void> {
    await this.storageService.executeQuery('DELETE FROM cached_liturgical_data');
  }

  private getMajorFeastDates(): string[] {
    // Major feasts that should be preserved in cache
    // These are dates that users are likely to revisit
    const currentYear = new Date().getFullYear();
    const majorFeasts: string[] = [];

    // Christmas (Dec 25) - for current and next year
    majorFeasts.push(`${currentYear}-12-25`);
    majorFeasts.push(`${currentYear + 1}-12-25`);

    // Easter dates (these vary by year - simplified approximation)
    // Easter is first Sunday after first full moon on or after March 21
    // For 2025-2030, these are the Easter dates:
    const easterDates = ['2025-04-20', '2026-04-05', '2027-03-28', '2028-04-16', '2029-04-01', '2030-04-21'];
    majorFeasts.push(...easterDates);

    // Pentecost (50 days after Easter)
    // Major solemnities
    const fixedFeasts = [
      `${currentYear}-01-01`, // Mary Mother of God
      `${currentYear}-01-06`, // Epiphany
      `${currentYear}-03-19`, // St Joseph
      `${currentYear}-03-25`, // Annunciation
      `${currentYear}-08-15`, // Assumption
      `${currentYear}-11-01`, // All Saints
      `${currentYear}-12-08`, // Immaculate Conception
      `${currentYear + 1}-01-01`,
      `${currentYear + 1}-01-06`,
    ];
    majorFeasts.push(...fixedFeasts);

    return majorFeasts;
  }

  private isSameLiturgicalDate(date1: string, date2: string): boolean {
    // Compare dates ignoring year (for recurring feasts)
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }

  // Journal entries
  async createJournalEntry(entry: Omit<JournalEntry, 'id' | 'created' | 'modified'>): Promise<JournalEntry> {
    const id = `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const fullEntry: JournalEntry = {
      ...entry,
      id,
      created: now,
      modified: now
    };

    await this.storageService.executeQuery(
      `INSERT INTO journal_entries 
       (id, date, title, content, liturgical_context, tags, created, modified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullEntry.id,
        fullEntry.date,
        fullEntry.title,
        fullEntry.content,
        fullEntry.liturgicalContext || null,
        JSON.stringify(fullEntry.tags),
        fullEntry.created,
        fullEntry.modified
      ]
    );

    return fullEntry;
  }

  async getJournalEntries(date?: string): Promise<JournalEntry[]> {
    let sql = 'SELECT * FROM journal_entries';
    const params: any[] = [];
    
    if (date) {
      sql += ' WHERE date = ?';
      params.push(date);
    }
    
    sql += ' ORDER BY created DESC';

    const results = await this.storageService.executeQuery(sql, params);
    return results.map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]')
    }));
  }

  // Saints information
  async getSaintInfo(saintName: string): Promise<SaintInfo | null> {
    const results = await this.storageService.executeQuery(
      'SELECT * FROM saints_info WHERE name = ?',
      [saintName]
    );
    
    if (results.length > 0) {
      const row = results[0];
      return {
        name: row.name,
        feastDay: row.feast_day,
        biography: row.biography,
        patronage: JSON.parse(row.patronage || '[]'),
        sources: JSON.parse(row.sources || '[]')
      };
    }
    return null;
  }

  async getSaintInfoForDate(date: string): Promise<SaintInfo[]> {
    // Get saints for this date from martyrology
    const martyrology = await this.getMartyrologicalEntry(date);
    if (!martyrology) return [];

    const saints: SaintInfo[] = [];
    for (const entry of martyrology.entries) {
      const saintInfo = await this.getSaintInfo(entry.saint);
      if (saintInfo) {
        saints.push(saintInfo);
      }
    }
    return saints;
  }

  // Martyrology
  async getMartyrologicalEntry(date: string): Promise<MartyrologicalEntry | null> {
    const results = await this.storageService.executeQuery(
      'SELECT entries FROM martyrology WHERE date = ?',
      [date]
    );
    
    if (results.length > 0) {
      return {
        date,
        entries: JSON.parse(results[0].entries)
      };
    }
    return null;
  }

  // Parish features
  async getParishInfo(parishId: string): Promise<ParishInfo | null> {
    const results = await this.storageService.executeQuery(
      'SELECT * FROM parish_info WHERE id = ?',
      [parishId]
    );
    
    if (results.length > 0) {
      const row = results[0];
      return {
        id: row.id,
        name: row.name,
        address: row.address,
        phone: row.phone,
        email: row.email,
        website: row.website,
        pastor: row.pastor,
        massSchedule: JSON.parse(row.mass_schedule)
      };
    }
    return null;
  }

  async getParishEvents(parishId: string, date?: string): Promise<ParishEvent[]> {
    let sql = 'SELECT * FROM parish_events WHERE parish_id = ?';
    const params: any[] = [parishId];
    
    if (date) {
      sql += ' AND date = ?';
      params.push(date);
    }
    
    sql += ' ORDER BY date ASC, time ASC';

    const results = await this.storageService.executeQuery(sql, params);
    return results;
  }

  async getNewsletters(parishId: string): Promise<Newsletter[]> {
    const results = await this.storageService.executeQuery(
      'SELECT * FROM newsletters WHERE parish_id = ? ORDER BY publish_date DESC',
      [parishId]
    );
    return results;
  }

  async createParishEvent(event: Omit<ParishEvent, 'id'>): Promise<ParishEvent> {
    const id = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullEvent: ParishEvent = { ...event, id };

    await this.storageService.executeQuery(
      `INSERT INTO parish_events 
       (id, parish_id, title, description, date, time, location, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullEvent.id,
        fullEvent.parishId,
        fullEvent.title,
        fullEvent.description,
        fullEvent.date,
        fullEvent.time || null,
        fullEvent.location || null,
        fullEvent.category
      ]
    );

    return fullEvent;
  }

  async createNewsletter(newsletter: Omit<Newsletter, 'id'>): Promise<Newsletter> {
    const id = `newsletter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullNewsletter: Newsletter = { ...newsletter, id };

    await this.storageService.executeQuery(
      `INSERT INTO newsletters 
       (id, parish_id, title, content, publish_date, author)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        fullNewsletter.id,
        fullNewsletter.parishId,
        fullNewsletter.title,
        fullNewsletter.content,
        fullNewsletter.publishDate,
        fullNewsletter.author
      ]
    );

    return fullNewsletter;
  }

  // Voice Notes / Voice Journal
  async getVoiceNotesForDate(date: string): Promise<VoiceNote[]> {
    const results = await this.storageService.executeQuery(
      'SELECT * FROM voice_notes WHERE date = ? ORDER BY duration DESC',
      [date]
    );
    
    return results.map((row: any) => ({
      id: row.id,
      date: row.date,
      title: row.title,
      filePath: row.file_path,
      duration: row.duration,
      transcription: row.transcription
    }));
  }

  async saveVoiceNote(voiceNote: Omit<VoiceNote, 'id'>): Promise<VoiceNote> {
    const id = `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullVoiceNote: VoiceNote = { ...voiceNote, id };

    await this.storageService.executeQuery(
      `INSERT INTO voice_notes 
       (id, date, title, file_path, duration, transcription)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        fullVoiceNote.id,
        fullVoiceNote.date,
        fullVoiceNote.title,
        fullVoiceNote.filePath,
        fullVoiceNote.duration,
        fullVoiceNote.transcription || null
      ]
    );

    return fullVoiceNote;
  }

  async deleteVoiceNote(id: string): Promise<void> {
    await this.storageService.executeQuery(
      'DELETE FROM voice_notes WHERE id = ?',
      [id]
    );
  }

  async updateVoiceNoteTranscription(id: string, transcription: string): Promise<void> {
    await this.storageService.executeQuery(
      'UPDATE voice_notes SET transcription = ? WHERE id = ?',
      [transcription, id]
    );
  }

  // User Settings
  async getUserSetting(key: string, defaultValue?: string): Promise<string | null> {
    const results = await this.storageService.executeQuery(
      'SELECT value FROM user_settings WHERE key = ?',
      [key]
    );
    return results.length > 0 ? results[0].value : (defaultValue || null);
  }

  async setUserSetting(key: string, value: string): Promise<void> {
    await this.storageService.executeQuery(
      `INSERT OR REPLACE INTO user_settings (key, value, updated_at) VALUES (?, ?, ?)`,
      [key, value, new Date().toISOString()]
    );
  }

  // Rubrics display setting - defaults to ON
  async getRubricsDisplay(): Promise<boolean> {
    const value = await this.getUserSetting('rubrics_display', 'true');
    return value === 'true';
  }

  async setRubricsDisplay(enabled: boolean): Promise<void> {
    await this.setUserSetting('rubrics_display', enabled ? 'true' : 'false');
  }

  // Date Flags - Get all data types associated with a date
  async getDateFlags(date: string): Promise<{
    hasMartyrology: boolean;
    hasVoiceNotes: boolean;
    hasJournalEntries: boolean;
    voiceNoteCount: number;
    journalEntryCount: number;
  }> {
    const [martyrology, voiceNotes, journalEntries] = await Promise.all([
      this.getMartyrologicalEntry(date),
      this.getVoiceNotesForDate(date),
      this.getJournalEntriesForDate(date)
    ]);

    return {
      hasMartyrology: !!martyrology && martyrology.entries.length > 0,
      hasVoiceNotes: voiceNotes.length > 0,
      hasJournalEntries: journalEntries.length > 0,
      voiceNoteCount: voiceNotes.length,
      journalEntryCount: journalEntries.length
    };
  }

  private async getJournalEntriesForDate(date: string): Promise<JournalEntry[]> {
    const results = await this.storageService.executeQuery(
      'SELECT * FROM journal_entries WHERE date = ? ORDER BY created DESC',
      [date]
    );

    return results.map((row: any) => ({
      id: row.id,
      date: row.date,
      title: row.title,
      content: row.content,
      liturgicalContext: row.liturgical_context ? JSON.parse(row.liturgical_context) : undefined,
      tags: row.tags ? JSON.parse(row.tags) : [],
      created: row.created,
      modified: row.modified
    }));
  }

  // ============================================
  // New CRUD Methods for 6 UI Screens
  // ============================================

  // Text Annotations (Interactive Mass Text)
  async createAnnotation(annotation: Omit<TextAnnotation, 'id' | 'createdAt'>): Promise<TextAnnotation> {
    const id = `annotation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullAnnotation: TextAnnotation = {
      ...annotation,
      id,
      createdAt: new Date().toISOString(),
    };

    await this.storageService.executeQuery(
      `INSERT INTO text_annotations
       (id, text_id, word, position, type, definition, grammar, annotation_type, content, media_path, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullAnnotation.id,
        fullAnnotation.textId,
        fullAnnotation.word,
        fullAnnotation.position,
        fullAnnotation.type,
        fullAnnotation.definition || null,
        fullAnnotation.grammar || null,
        fullAnnotation.annotationType || null,
        fullAnnotation.content || null,
        fullAnnotation.mediaPath || null,
        fullAnnotation.createdAt,
      ]
    );

    return fullAnnotation;
  }

  async getAnnotationsForText(textId: string): Promise<TextAnnotation[]> {
    const results = await this.storageService.executeQuery(
      'SELECT * FROM text_annotations WHERE text_id = ? ORDER BY position ASC',
      [textId]
    );

    return results.map((row: any) => ({
      id: row.id,
      textId: row.text_id,
      word: row.word,
      position: row.position,
      type: row.type,
      definition: row.definition,
      grammar: row.grammar,
      annotationType: row.annotation_type,
      content: row.content,
      mediaPath: row.media_path,
      createdAt: row.created_at,
    }));
  }

  async deleteAnnotation(id: string): Promise<void> {
    await this.storageService.executeQuery(
      'DELETE FROM text_annotations WHERE id = ?',
      [id]
    );
  }

  // Mass Bookmarks (Mass Timeline)
  async createBookmark(bookmark: Omit<MassBookmark, 'id' | 'createdAt'>): Promise<MassBookmark> {
    const id = `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullBookmark: MassBookmark = {
      ...bookmark,
      id,
      createdAt: new Date().toISOString(),
    };

    await this.storageService.executeQuery(
      `INSERT INTO mass_bookmarks (id, date, mass_part_id, note, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [fullBookmark.id, fullBookmark.date, fullBookmark.massPartId, fullBookmark.note || null, fullBookmark.createdAt]
    );

    return fullBookmark;
  }

  async getBookmarksForDate(date: string): Promise<MassBookmark[]> {
    const results = await this.storageService.executeQuery(
      'SELECT * FROM mass_bookmarks WHERE date = ? ORDER BY created_at ASC',
      [date]
    );

    return results.map((row: any) => ({
      id: row.id,
      date: row.date,
      massPartId: row.mass_part_id,
      note: row.note,
      createdAt: row.created_at,
    }));
  }

  async deleteBookmark(id: string): Promise<void> {
    await this.storageService.executeQuery(
      'DELETE FROM mass_bookmarks WHERE id = ?',
      [id]
    );
  }

  // Community Posts (Fellowship)
  async getCommunityPosts(parishId: string, limit: number = 50): Promise<CommunityPost[]> {
    const results = await this.storageService.executeQuery(
      'SELECT * FROM community_posts WHERE parish_id = ? ORDER BY created_at DESC LIMIT ?',
      [parishId, limit]
    );

    return results.map((row: any) => ({
      id: row.id,
      parishId: row.parish_id,
      authorName: row.author_name,
      authorAvatar: row.author_avatar,
      isAdmin: !!row.is_admin,
      content: row.content,
      visibility: row.visibility,
      likesCount: row.likes_count,
      commentsCount: row.comments_count,
      createdAt: row.created_at,
    }));
  }

  async createCommunityPost(post: Omit<CommunityPost, 'id' | 'createdAt'>): Promise<CommunityPost> {
    const id = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullPost: CommunityPost = {
      ...post,
      id,
      createdAt: new Date().toISOString(),
    };

    await this.storageService.executeQuery(
      `INSERT INTO community_posts
       (id, parish_id, author_name, author_avatar, is_admin, content, visibility, likes_count, comments_count, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullPost.id,
        fullPost.parishId,
        fullPost.authorName,
        fullPost.authorAvatar || null,
        fullPost.isAdmin ? 1 : 0,
        fullPost.content,
        fullPost.visibility,
        fullPost.likesCount,
        fullPost.commentsCount,
        fullPost.createdAt,
      ]
    );

    return fullPost;
  }

  async likePost(postId: string): Promise<void> {
    await this.storageService.executeQuery(
      'UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = ?',
      [postId]
    );
  }

  async unlikePost(postId: string): Promise<void> {
    await this.storageService.executeQuery(
      'UPDATE community_posts SET likes_count = MAX(0, likes_count - 1) WHERE id = ?',
      [postId]
    );
  }

  async getPostComments(postId: string): Promise<PostComment[]> {
    const results = await this.storageService.executeQuery(
      'SELECT * FROM post_comments WHERE post_id = ? ORDER BY created_at ASC',
      [postId]
    );

    return results.map((row: any) => ({
      id: row.id,
      postId: row.post_id,
      authorName: row.author_name,
      authorAvatar: row.author_avatar,
      content: row.content,
      createdAt: row.created_at,
    }));
  }

  async createPostComment(comment: Omit<PostComment, 'id' | 'createdAt'>): Promise<PostComment> {
    const id = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullComment: PostComment = {
      ...comment,
      id,
      createdAt: new Date().toISOString(),
    };

    await this.storageService.executeQuery(
      `INSERT INTO post_comments (id, post_id, author_name, author_avatar, content, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [fullComment.id, fullComment.postId, fullComment.authorName, fullComment.authorAvatar || null, fullComment.content, fullComment.createdAt]
    );

    // Update comment count
    await this.storageService.executeQuery(
      'UPDATE community_posts SET comments_count = comments_count + 1 WHERE id = ?',
      [comment.postId]
    );

    return fullComment;
  }

  // Announcements (Fellowship)
  async getAnnouncements(parishId: string, limit: number = 20): Promise<Announcement[]> {
    const results = await this.storageService.executeQuery(
      'SELECT * FROM announcements WHERE parish_id = ? ORDER BY created_at DESC LIMIT ?',
      [parishId, limit]
    );

    return results.map((row: any) => ({
      id: row.id,
      title: row.title,
      dateLabel: row.date_label,
      timeLabel: row.time_label,
      imageUrl: row.image_url,
      category: row.category,
      description: row.description,
    }));
  }

  async createAnnouncement(announcement: Omit<Announcement, 'id'> & { parishId: string }): Promise<Announcement & { parishId: string }> {
    const id = `announcement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullAnnouncement = { ...announcement, id };
    const createdAt = new Date().toISOString();

    await this.storageService.executeQuery(
      `INSERT INTO announcements
       (id, parish_id, title, date_label, time_label, image_url, category, description, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullAnnouncement.id,
        fullAnnouncement.parishId,
        fullAnnouncement.title,
        fullAnnouncement.dateLabel,
        fullAnnouncement.timeLabel || null,
        fullAnnouncement.imageUrl || null,
        fullAnnouncement.category,
        fullAnnouncement.description || null,
        createdAt,
      ]
    );

    return fullAnnouncement;
  }

  // Concordance Cache (Calendar Concordance)
  async getConcordanceForMonth(year: number, month: number): Promise<ConcordanceDay[]> {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

    const results = await this.storageService.executeQuery(
      'SELECT * FROM concordance_cache WHERE date >= ? AND date <= ? ORDER BY date ASC',
      [startDate, endDate]
    );

    return results.map((row: any) => ({
      date: row.date,
      displayDate: row.display_date,
      dayOfWeek: row.day_of_week,
      calendar1962: JSON.parse(row.calendar_1962),
      modernCalendar: JSON.parse(row.modern_calendar),
    }));
  }

  async cacheConcordanceDay(day: ConcordanceDay): Promise<void> {
    await this.storageService.executeQuery(
      `INSERT OR REPLACE INTO concordance_cache
       (date, display_date, day_of_week, calendar_1962, modern_calendar, cached_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        day.date,
        day.displayDate,
        day.dayOfWeek,
        JSON.stringify(day.calendar1962),
        JSON.stringify(day.modernCalendar),
        new Date().toISOString(),
      ]
    );
  }

  async cacheConcordanceMonth(days: ConcordanceDay[]): Promise<void> {
    for (const day of days) {
      await this.cacheConcordanceDay(day);
    }
  }
}