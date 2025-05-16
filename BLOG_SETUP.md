# TechTo.Earth Blog Setup Guide

This guide explains how to set up and use the blog functionality in the TechTo.Earth platform.

## Overview

The TechTo.Earth blog system provides:

1. A public blog with categories and posts
2. Admin interface for managing blog content
3. Content management for authors
4. Success stories and knowledge sharing

## Database Setup

### Step 1: Run the Migration Script

To add the required database tables for blog functionality, run:

```bash
node scripts/setup-blog-tables.js
```

This script will create the following tables:
- `blog_categories`: For blog category management
- `blog_posts`: For blog post content
- `blog_post_categories`: Junction table for post-category relationships

## Blog Content Management

### Creating Categories

Before publishing posts, you should create some categories. You can do this through the Supabase dashboard or by running SQL directly:

```sql
INSERT INTO blog_categories (name, slug, description)
VALUES 
  ('Success Stories', 'success-stories', 'Stories from tech professionals who successfully transitioned to earth-based careers'),
  ('Farming Tips', 'farming-tips', 'Advice and guidance for farming and agriculture'),
  ('Restaurant Business', 'restaurant-business', 'Information about starting and running food service businesses'),
  ('Craftsmanship', 'craftsmanship', 'Posts about artisanal skills and trades');
```

### Creating Blog Posts

Blog posts can be created through the admin dashboard at `/dashboard/blog/create` by authorized users.

Each post requires:
- Title: The post title
- Slug: URL-friendly version of the title
- Excerpt: Brief summary for previews
- Content: Main post content (supports Markdown)
- Featured Image: URL to a header image
- Categories: One or more categories

## Building a Robust Blog

To ensure your blog is resilient to errors:

1. **Database Integrity**:
   - All relationships between posts and categories are properly maintained
   - Slugs are unique to prevent URL conflicts

2. **Error Handling**:
   - All pages have fallback mechanisms for missing data
   - Proper error logging helps identify issues

3. **Content Management**:
   - Draft mode allows saving posts before publishing
   - Published status controls visibility

## Troubleshooting

If you encounter issues with the blog functionality:

1. Verify that all required tables exist in your database
2. Check that the blog category slugs match those used in URLs
3. Ensure all required fields are populated in your blog posts
4. Look at server logs for any API or database errors

## Database Schema

Here's the schema for the blog tables:

```sql
-- Blog Categories
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id),
  published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Blog Post Categories (Junction Table)
CREATE TABLE blog_post_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, category_id)
);