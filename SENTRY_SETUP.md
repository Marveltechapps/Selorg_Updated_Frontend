# Sentry Error Tracking Setup

## Frontend Setup

### Installation

```bash
npm install @sentry/react-native
```

### Configuration

1. Get your Sentry DSN from [sentry.io](https://sentry.io)

2. Add to `.env`:
```env
SENTRY_DSN=https://your-key@sentry.io/project-id
```

3. The app will automatically initialize Sentry if `SENTRY_DSN` is set.

### Manual Setup (Alternative)

If you prefer manual initialization, update `App.tsx`:

```typescript
import * as Sentry from '@sentry/react-native';
import { getEnvConfigSafe } from './src/config/env';

const envConfig = getEnvConfigSafe();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: envConfig.env,
  enableAutoSessionTracking: true,
});
```

### Features

- Automatic error tracking
- Performance monitoring
- Session tracking
- Source maps support (for production builds)

### Testing

To test Sentry, you can manually capture an error:

```typescript
import * as Sentry from '@sentry/react-native';

Sentry.captureException(new Error('Test error'));
```

## Backend Setup

See backend `SENTRY_SETUP.md` for Node.js/Express setup instructions.

