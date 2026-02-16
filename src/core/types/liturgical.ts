export enum LiturgicalSeason {
  ADVENT = 'ADVENT',
  CHRISTMASTIDE = 'CHRISTMASTIDE',
  SEPTUAGESIMA = 'SEPTUAGESIMA',
  LENT = 'LENT',
  PASCHALTIDE = 'PASCHALTIDE',
  TIME_AFTER_PENTECOST = 'TIME_AFTER_PENTECOST',
}

export interface BilingualText {
  latin: string;
  english: string;
  isRubric?: boolean;
}

export interface LiturgicalDay {
  date: string;
  season: LiturgicalSeason;
  celebration?: string;
  rank: number;
  color: string;
  commemorations: string[];
}

export interface VoiceNote {
  id: string;
  date: string;
  title: string;
  filePath: string;
  duration: number;
  transcription?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  liturgicalContext?: string;
  tags: string[];
  created: string;
  modified: string;
}

export interface SaintInfo {
  name: string;
  feastDay: string;
  biography: string;
  patronage: string[];
  sources: string[];
}

export interface MartyrologicalEntry {
  date: string;
  entries: Array<{
    saint: string;
    location?: string;
    description: string;
    rank?: number;
  }>;
}

export interface ParishInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  pastor: string;
  massSchedule: Array<{
    day: string;
    time: string;
    type: string;
  }>;
}

export interface ParishEvent {
  id: string;
  parishId: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  category: 'liturgical' | 'social' | 'educational' | 'charitable';
}

export interface Newsletter {
  id: string;
  parishId: string;
  title: string;
  content: string;
  publishDate: string;
  author: string;
}

export interface CachedLiturgicalData {
  date: string;
  massTexts?: { [key: string]: BilingualText };
  officeTexts?: { [hour: string]: { [key: string]: BilingualText } };
  liturgicalDay: LiturgicalDay;
  martyrology?: MartyrologicalEntry;
  saintInfo?: SaintInfo[];
  cachedAt: string;
  expiresAt: string;
}

// New types for 6 UI screens implementation

export interface TextAnnotation {
  id: string;
  textId: string;
  word: string;
  position: number;
  type: 'definition' | 'user';
  definition?: string;
  grammar?: string;
  annotationType?: 'audio' | 'text' | 'drawing' | 'picture' | 'url';
  content?: string;
  mediaPath?: string;
  createdAt: string;
}

export interface MassPart {
  id: string;
  key: string;
  name: string;
  latinName?: string;
  section: 'catechumens' | 'faithful' | 'communion';
  sequence: number;
  type: 'ordinary' | 'proper';
  nodeType: 'icon' | 'dot' | 'gold';
  icon?: string;
}

export interface ConcordanceDay {
  date: string;
  displayDate: string;
  dayOfWeek: string;
  calendar1962: {
    celebration: string;
    rank: string;
    color: string;
  };
  modernCalendar: {
    celebration: string;
    rank: string;
    color: string;
  };
}

export interface CommunityPost {
  id: string;
  parishId: string;
  authorName: string;
  authorAvatar?: string;
  isAdmin: boolean;
  content: string;
  visibility: 'public' | 'private' | 'journal';
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  dateLabel: string;
  timeLabel?: string;
  imageUrl?: string;
  category: string;
  description?: string;
}

export interface WeeklyScheduleItem {
  id: string;
  title: string;
  latinTitle?: string;
  day: string;
  time: string;
  location: string;
  iconName: string;
  iconColor: string;
}

export interface MassBookmark {
  id: string;
  date: string;
  massPartId: string;
  note?: string;
  createdAt: string;
}

export interface PostComment {
  id: string;
  postId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

// Liturgical colors for theming
export const LITURGICAL_COLORS = {
  green: '#2d6a4f',
  red: '#b91c1c',
  white: '#f8f9fa',
  violet: '#7209b7',
  rose: '#f4c2c2',
  gold: '#d4af37',
  black: '#1a1a1a',
} as const;

export type LiturgicalColorName = keyof typeof LITURGICAL_COLORS;
