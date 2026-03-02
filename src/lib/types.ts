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