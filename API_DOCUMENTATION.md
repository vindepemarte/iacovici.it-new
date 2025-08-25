# Iacovici.it N8N API Documentation

## Authentication
All API endpoints require authentication using an API key. Include the API key in the request headers:

```
X-API-Key: your_api_key_here
```

Or as a Bearer token:
```
Authorization: Bearer your_api_key_here
```

## Base URL
```
https://your-domain.com/api/n8n
```

## Templates API

### GET /templates
Get all templates
- **Response**: Array of template objects

### POST /templates
Create a new template
- **Body**:
```json
{
  "title": "Template Title",
  "description": "Template description",
  "category": "Automation", // optional, defaults to "General"
  "is_pro": false, // optional, defaults to false
  "price": 0, // optional, defaults to 0
  "workflow_data_json": {}, // n8n workflow JSON
  "tutorial_link": "https://...", // optional
  "icon_name": "workflow" // optional, defaults to "workflow"
}
```

### PUT /templates/:id
Update an existing template
- **Parameters**: `id` - Template ID
- **Body**: Same as POST

### DELETE /templates/:id
Delete a template
- **Parameters**: `id` - Template ID

## Blog Posts API

### GET /blog-posts
Get all blog posts
- **Response**: Array of blog post objects

### POST /blog-posts
Create a new blog post
- **Body**:
```json
{
  "title": "Blog Post Title",
  "slug": "blog-post-slug",
  "content_markdown": "# Blog content in markdown",
  "excerpt": "Short description",
  "author": "Author Name", // optional, defaults to "Iacovici.it"
  "publication_date": "2024-01-01T00:00:00Z", // optional, defaults to now
  "featured_image": "/path/to/image.jpg", // optional
  "tags": ["tag1", "tag2"], // optional
  "is_published": true, // optional, defaults to true
  "seo_title": "SEO Title", // optional
  "seo_description": "SEO Description" // optional
}
```

### PUT /blog-posts/:id
Update an existing blog post
- **Parameters**: `id` - Blog post ID
- **Body**: Same as POST

### DELETE /blog-posts/:id
Delete a blog post
- **Parameters**: `id` - Blog post ID

## Contact Submissions API

### GET /contact-submissions
Get all contact form submissions
- **Response**: Array of contact submission objects

## Analytics API

### GET /analytics/dashboard
Get dashboard analytics
- **Response**:
```json
{
  "templates": 10,
  "blog_posts": 5,
  "contacts": 25,
  "downloads": 150
}
```

## API Key Management

### GET /user/api-key
Get current user's API key
- **Response**: `{ "api_key": "iak_live_..." }`

### POST /user/regenerate-api-key
Generate a new API key for current user
- **Response**: `{ "api_key": "iak_live_..." }`

## Getting Your API Key

1. **From Database**: Connect to your PostgreSQL database and run:
```sql
SELECT api_key FROM users WHERE email = 'admin@iacovici.it';
```

2. **From Admin Dashboard**: Login to your admin dashboard and check the API key section

3. **Default Admin User**:
   - Email: admin@iacovici.it
   - Password: admin123
   - API key is auto-generated on first database setup

## N8N Integration Examples

### Create Template Workflow
1. HTTP Request node: POST to `/templates`
2. Set headers: `X-API-Key: your_key`
3. Set body with template data

### Sync Blog Posts
1. HTTP Request node: GET from `/blog-posts`
2. Process data as needed
3. HTTP Request node: POST/PUT to update

### Monitor Analytics
1. HTTP Request node: GET from `/analytics/dashboard`
2. Set up notifications based on metrics