
# Backend Integration Guide for Chariot Analytics

This document provides guidance for backend engineers on how to integrate backend services with the Chariot Analytics frontend application.

## API Endpoints

### Authentication
- **Login**: `/api/auth/login`
- **Logout**: `/api/auth/logout` 
- **Register**: `/api/auth/register`
- **Forgot Password**: `/api/auth/forgot-password`

### Campaign Management
- **List Campaigns**: `/api/campaigns`
- **Campaign Details**: `/api/campaigns/:id`
- **Create Campaign**: `/api/campaigns` (POST)
- **Update Campaign**: `/api/campaigns/:id` (PUT/PATCH)
- **Delete Campaign**: `/api/campaigns/:id` (DELETE)

### Product Management
- **List Products**: `/api/products`
- **Product Details**: `/api/products/:id`
- **Add Product**: `/api/products` (POST)
- **Update Product**: `/api/products/:id` (PUT/PATCH)
- **Delete Product**: `/api/products/:id` (DELETE)
- **Save Product**: `/api/saved-products` (POST)
- **List Saved Products**: `/api/saved-products`

### Analytics & Reports
- **Dashboard Summary**: `/api/dashboard/summary`
- **Weekly Profit Data**: `/api/analytics/weekly-profit`
- **Platform Budget Data**: `/api/analytics/budget`
- **Campaign Performance**: `/api/analytics/campaign-performance`
- **Platform Performance**: `/api/analytics/platform-performance`
- **User Activities**: `/api/analytics/user-activities`

### Alerts
- **List Alerts**: `/api/alerts`
- **Create Alert**: `/api/alerts` (POST)
- **Update Alert**: `/api/alerts/:id` (PUT/PATCH)
- **Delete Alert**: `/api/alerts/:id` (DELETE)
- **Read Alert**: `/api/alerts/:id/read` (PUT)

## Realtime Connections

The application will benefit from realtime updates in several areas:

1. **Alerts**: Use WebSockets or Server-Sent Events to push new alerts to users in real-time.
   - Socket endpoint: `/ws/alerts`
   - Implementation location: `src/hooks/useAlerts.ts` (to be created)

2. **Campaign Metrics**: Realtime updates for campaign performance metrics.
   - Socket endpoint: `/ws/campaign-metrics`
   - Implementation location: `src/hooks/useCampaignMetrics.ts` (to be created)

3. **Dashboard Activity Feed**: Live updates for user activities.
   - Socket endpoint: `/ws/activities`
   - Implementation location: `src/components/dashboard/ActivityFeed.tsx` (already exists, add WebSocket connection)

## Authentication Flow

1. JWT tokens are expected to be returned upon successful login
2. Tokens should be stored in localStorage
3. Include tokens in Authorization header for API requests
4. Implement token refresh mechanism

## Data Models

Key data structures the frontend expects:

1. **User**: 
   ```typescript
   {
     id: string;
     name: string;
     email: string;
     role: string;
   }
   ```

2. **Campaign**:
   ```typescript
   {
     id: string;
     name: string;
     status: 'active' | 'paused' | 'draft' | 'completed';
     budget: number;
     spend: number;
     platforms: string[];
     startDate: string; // ISO format
     endDate: string | null; // ISO format
   }
   ```

3. **Product**:
   ```typescript
   {
     id: string;
     name: string;
     price: number;
     description: string;
     imageUrl: string;
     category: string;
   }
   ```

4. **Alert**:
   ```typescript
   {
     id: string;
     title: string;
     message: string;
     type: 'info' | 'warning' | 'error' | 'success';
     createdAt: string; // ISO format
     read: boolean;
   }
   ```

5. **Metric**:
   ```typescript
   {
     title: string;
     value: string | number;
     change: number;
     changeType: 'increase' | 'decrease';
   }
   ```

## Integration Points

The following files should be updated to integrate with the backend:

1. **Login Component**: `src/pages/Login.tsx`
2. **Dashboard**: `src/pages/Dashboard.tsx`
3. **Campaign Management**: `src/pages/Campaign.tsx` and `src/pages/CampaignCreation.tsx`
4. **Products Management**: `src/pages/Products.tsx` and `src/pages/AddProduct.tsx`
5. **Alerts**: `src/pages/Alerts.tsx`
6. **Reports & Analytics**: `src/pages/Reports.tsx` and `src/pages/Analytics.tsx`

## Environment Configuration

Create environment variables for:

1. `API_BASE_URL`: The base URL for all API endpoints
2. `WEBSOCKET_URL`: Base URL for WebSocket connections
3. `AUTH_TOKEN_KEY`: localStorage key for storing auth token

## State Management

The application uses React Query for data fetching and state management. Backend integrations should:

1. Create custom hooks for API calls using React Query
2. Implement proper error handling and loading states
3. Set up appropriate caching strategies

## Next Steps

1. Implement API services in `src/services/` directory
2. Create WebSocket connection manager in `src/services/socket.ts`
3. Develop authentication service in `src/services/auth.ts`
4. Update components to use real data instead of mock data

