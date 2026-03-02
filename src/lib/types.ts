// ==========================================
// Существующие типы (не трогаем)
// ==========================================

export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  forWhom: string[];
  benefits: string[];
  duration: string;
  price: string;
  format: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  age: number;
  text: string;
  rating: number;
  service: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  service: string;
  format: string;
  message: string;
  preferredTime: string;
}

// ==========================================
// Новые типы: Auth, Posts, Comments
// ==========================================

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: "user" | "admin";
}

export interface DBPost {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  read_time: string;
  image_url: string | null;
  status: "draft" | "published";
  author_id: string | null;
  views_count: number;
}

export interface DBPostWithAuthor extends DBPost {
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  } | null;
}

export interface Comment {
  id: string;
  created_at: string;
  post_id: string;
  author_id: string;
  content: string;
  is_approved: boolean;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  } | null;
}

export interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  read_time: string;
  status: "draft" | "published";
}