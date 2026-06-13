export type Locale = "fr" | "en" | "ar";
export type Status = "DRAFT" | "PUBLISHED";
export type Role = "ADMIN" | "EDITOR" | "VIEWER";

export interface LocalizedString {
  fr: string;
  en?: string;
  ar?: string;
}

export interface SEOMeta {
  title?: string;
  description?: string;
  ogImage?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Post {
  id: string;
  slug: string;
  titleFr: string;
  titleEn?: string | null;
  titleAr?: string | null;
  contentFr: string;
  contentEn?: string | null;
  contentAr?: string | null;
  excerptFr?: string | null;
  excerptEn?: string | null;
  excerptAr?: string | null;
  featuredImage?: string | null;
  status: Status;
  featured: boolean;
  publishedAt?: Date | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImage?: string | null;
  categoryId?: string | null;
  category?: Category | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  slug: string;
  nameFr: string;
  nameEn?: string | null;
  nameAr?: string | null;
  color?: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  _count?: { posts: number };
}

export interface Publication {
  id: string;
  slug: string;
  type: string;
  titleFr: string;
  titleEn?: string | null;
  titleAr?: string | null;
  descriptionFr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  pdfFile?: string | null;
  coverImage?: string | null;
  readMoreUrl?: string | null;
  year?: number | null;
  status: Status;
  featured: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Member {
  id: string;
  nameFr: string;
  nameEn?: string | null;
  nameAr?: string | null;
  logo?: string | null;
  website?: string | null;
  descriptionFr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  category?: string | null;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  nameFr: string;
  nameEn?: string | null;
  nameAr?: string | null;
  titleFr?: string | null;
  titleEn?: string | null;
  titleAr?: string | null;
  photo?: string | null;
  email?: string | null;
  department?: string | null;
  bioFr?: string | null;
  bioEn?: string | null;
  bioAr?: string | null;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Formation {
  id: string;
  slug: string;
  titleFr: string;
  titleEn?: string | null;
  titleAr?: string | null;
  descriptionFr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  organizer?: string | null;
  duration?: string | null;
  format?: string | null;
  level?: string | null;
  price?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  location?: string | null;
  registrationUrl?: string | null;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsefulLink {
  id: string;
  titleFr: string;
  titleEn?: string | null;
  titleAr?: string | null;
  url: string;
  descriptionFr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  category?: string | null;
  icon?: string | null;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GlossaryTerm {
  id: string;
  termFr: string;
  termEn?: string | null;
  termAr?: string | null;
  definitionFr: string;
  definitionEn?: string | null;
  definitionAr?: string | null;
  letter: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string | null;
  locale: Locale;
  active: boolean;
  confirmedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Convention {
  id: string;
  slug: string;
  titleFr: string;
  titleEn?: string | null;
  titleAr?: string | null;
  descriptionFr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  pdfFile?: string | null;
  category?: string | null;
  signedAt?: Date | null;
  status: Status;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  icon?: string;
}

export interface KeyFigure {
  value: string;
  label: string;
  suffix?: string;
  prefix?: string;
}
