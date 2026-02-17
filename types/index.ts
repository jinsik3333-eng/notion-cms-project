/**
 * 전역 타입 정의
 */

import type { ComponentType } from "react";

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  isActive?: boolean;
  children?: NavItem[];
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mailSupport: string;
  links: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

/**
 * Notion PricingPlan 타입 (F004)
 */
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  description: string;
  isPopular: boolean;
  order: number;
}

/**
 * Notion Testimonial 타입 (F004)
 */
export interface Testimonial {
  id: string;
  author: string;
  content: string;
  rating: number;
  company?: string;
  jobRole?: string;
  submittedAt: string;
  isVerified: boolean;
  order: number;
}

/**
 * Notion ContentPage 타입 (F004)
 */
export interface ContentPage {
  id: string;
  pageName: string;
  slug: string;
  content: string;
  metaDescription: string;
  publishedAt: string;
  updatedAt: string;
  isPublished: boolean;
}
