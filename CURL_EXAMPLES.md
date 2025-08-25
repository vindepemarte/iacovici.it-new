# Iacovici.it API - Complete cURL Examples

## 🔧 Database Schema Updates

**IMPORTANT**: If you encounter errors about missing `seo_title` or `seo_description` columns when creating templates, this means your database schema needs to be updated. The backend now automatically handles this migration.

### Quick Fix for Missing Columns:

```bash
# Option 1: Restart the backend service (recommended)
./restart-backend.sh

# Option 2: Manual restart
docker-compose restart backend

# Option 3: Check backend logs to see migration status
docker-compose logs backend
```

The backend will automatically detect missing columns and add them during startup.

---

Replace `YOUR_API_KEY` with your actual API key and `YOUR_DOMAIN` with your domain.

## Authentication
All requests require the API key in the header:
```bash
-H "X-API-Key: YOUR_API_KEY"
```

## Templates API

### Get All Templates
```bash
curl -X GET "https://YOUR_DOMAIN/api/n8n/templates" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### Create New Template
```bash
curl -X POST "https://YOUR_DOMAIN/api/n8n/templates" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Email Automation Template",
    "description": "Automate your email marketing campaigns with this powerful n8n workflow",
    "category": "Marketing",
    "is_pro": false,
    "price": 0,
    "workflow_data_json": {
      "nodes": [
        {
          "id": "1",
          "name": "Start",
          "type": "n8n-nodes-base.start"
        }
      ],
      "connections": {}
    },
    "tutorial_link": "https://youtube.com/watch?v=example",
    "icon_name": "mail"
  }'
```

### Create Pro Template
```bash
curl -X POST "https://YOUR_DOMAIN/api/n8n/templates" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced CRM Integration",
    "description": "Complete CRM automation with lead scoring and nurturing",
    "category": "CRM",
    "is_pro": true,
    "price": 29.99,
    "workflow_data_json": {
      "nodes": [
        {
          "id": "1",
          "name": "Webhook",
          "type": "n8n-nodes-base.webhook"
        }
      ],
      "connections": {}
    },
    "tutorial_link": "https://youtube.com/watch?v=pro-example",
    "icon_name": "users"
  }'
```

### Update Template
```bash
curl -X PUT "https://YOUR_DOMAIN/api/n8n/templates/1" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Email Automation Template",
    "description": "Enhanced email marketing automation with advanced features",
    "category": "Marketing",
    "is_pro": false,
    "price": 0,
    "workflow_data_json": {
      "nodes": [
        {
          "id": "1",
          "name": "Start",
          "type": "n8n-nodes-base.start"
        },
        {
          "id": "2",
          "name": "Email",
          "type": "n8n-nodes-base.emailSend"
        }
      ],
      "connections": {
        "Start": {
          "main": [
            [
              {
                "node": "Email",
                "type": "main",
                "index": 0
              }
            ]
          ]
        }
      }
    },
    "tutorial_link": "https://youtube.com/watch?v=updated-example",
    "icon_name": "mail"
  }'
```

### Delete Template
```bash
curl -X DELETE "https://YOUR_DOMAIN/api/n8n/templates/1" \
  -H "X-API-Key: YOUR_API_KEY"
```

## Blog Posts API

### Get All Blog Posts
```bash
curl -X GET "https://YOUR_DOMAIN/api/n8n/blog-posts" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### Create New Blog Post
```bash
curl -X POST "https://YOUR_DOMAIN/api/n8n/blog-posts" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "How to Automate Your Business with n8n",
    "slug": "automate-business-n8n",
    "content_markdown": "# Introduction\n\nBusiness automation is crucial for scaling...\n\n## Getting Started\n\n1. Install n8n\n2. Create your first workflow\n3. Connect your tools\n\n## Conclusion\n\nAutomation saves time and reduces errors.",
    "excerpt": "Learn how to streamline your business processes using n8n automation workflows",
    "author": "Iacovici.it",
    "publication_date": "2024-01-15T10:00:00Z",
    "featured_image": "/images/blog/automation-guide.jpg",
    "tags": ["automation", "n8n", "business", "productivity"],
    "is_published": true,
    "seo_title": "Business Automation Guide with n8n - Complete Tutorial",
    "seo_description": "Complete guide to automating your business processes with n8n. Learn workflows, integrations, and best practices."
  }'
```

### Create Draft Blog Post
```bash
curl -X POST "https://YOUR_DOMAIN/api/n8n/blog-posts" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced n8n Techniques (Draft)",
    "slug": "advanced-n8n-techniques-draft",
    "content_markdown": "# Draft Content\n\nThis is a work in progress...",
    "excerpt": "Advanced techniques for n8n power users",
    "author": "Iacovici.it",
    "tags": ["n8n", "advanced", "techniques"],
    "is_published": false,
    "seo_title": "Advanced n8n Techniques",
    "seo_description": "Master advanced n8n automation techniques"
  }'
```

### Update Blog Post
```bash
curl -X PUT "https://YOUR_DOMAIN/api/n8n/blog-posts/1" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "How to Automate Your Business with n8n - Updated",
    "slug": "automate-business-n8n-updated",
    "content_markdown": "# Updated Introduction\n\nBusiness automation has evolved...\n\n## New Section\n\nLatest features and improvements...",
    "excerpt": "Updated guide to streamline your business processes using n8n automation workflows",
    "author": "Iacovici.it",
    "publication_date": "2024-01-20T10:00:00Z",
    "featured_image": "/images/blog/automation-guide-v2.jpg",
    "tags": ["automation", "n8n", "business", "productivity", "updated"],
    "is_published": true,
    "seo_title": "Business Automation Guide with n8n - Updated Tutorial",
    "seo_description": "Updated complete guide to automating your business processes with n8n."
  }'
```

### Delete Blog Post
```bash
curl -X DELETE "https://YOUR_DOMAIN/api/n8n/blog-posts/1" \
  -H "X-API-Key: YOUR_API_KEY"
```

## Contact Submissions API

### Get All Contact Submissions
```bash
curl -X GET "https://YOUR_DOMAIN/api/n8n/contact-submissions" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

## Analytics API

### Get Dashboard Analytics
```bash
curl -X GET "https://YOUR_DOMAIN/api/n8n/analytics/dashboard" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

## API Key Management

### Get Current API Key
```bash
curl -X GET "https://YOUR_DOMAIN/api/n8n/user/api-key" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### Regenerate API Key
```bash
curl -X POST "https://YOUR_DOMAIN/api/n8n/user/regenerate-api-key" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

## Testing Your API

### Quick Health Check (Get Templates Count)
```bash
curl -X GET "https://YOUR_DOMAIN/api/n8n/templates" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  | jq 'length'
```

### Get Your API Key from Database
```bash
# Connect to your database and run:
# SELECT api_key FROM users WHERE email = 'admin@iacovici.it';
```

## N8N HTTP Request Node Configuration

When using these in n8n HTTP Request nodes:

1. **Method**: GET/POST/PUT/DELETE
2. **URL**: `https://YOUR_DOMAIN/api/n8n/endpoint`
3. **Headers**:
   ```json
   {
     "X-API-Key": "YOUR_API_KEY",
     "Content-Type": "application/json"
   }
   ```
4. **Body** (for POST/PUT): Use the JSON from the examples above

## Common Response Formats

### Success Response (Template)
```json
{
  "id": 1,
  "title": "Email Automation Template",
  "description": "Automate your email marketing campaigns",
  "category": "Marketing",
  "is_pro": false,
  "price": 0,
  "workflow_data_json": {...},
  "tutorial_link": "https://youtube.com/watch?v=example",
  "icon_name": "mail",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

### Error Response
```json
{
  "error": "Template not found"
}
```

### Analytics Response
```json
{
  "templates": 15,
  "blog_posts": 8,
  "contacts": 42,
  "downloads": 156
}
```