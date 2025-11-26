# Frontend Testing Strategy

## Current State

- **Test Files**: 5 test files in `__tests__/` directory
- **Coverage Target**: 40% minimum (per plan)
- **Test Framework**: Jest + React Native Testing Library

## Test Structure

```
__tests__/
  ├── App.test.tsx              # App entry point tests
  ├── components/
  │   └── Button.test.tsx       # Component tests
  ├── services/
  │   └── authService.test.ts   # Service layer tests
  └── utils/
      ├── formatters.test.ts    # Utility function tests
      ├── validators.test.ts    # Validation tests
      └── testHelpers.tsx       # Test utilities
```

## Priority Test Areas

### High Priority

1. **Service Layer** (`src/services/`)
   - API client tests
   - Authentication service
   - Cart service
   - Order service
   - Error handling

2. **Utility Functions** (`src/utils/`)
   - Formatters
   - Validators
   - Helpers
   - Error handlers

3. **Context Providers** (`src/contexts/`)
   - CartContext
   - NetworkContext

### Medium Priority

4. **Common Components** (`src/components/common/`)
   - Button
   - ErrorBoundary
   - Card components

5. **Navigation** (`src/navigation/`)
   - Navigation structure
   - Route definitions

### Lower Priority

6. **Screen Components** (`src/screens/`)
   - Critical user flows only
   - Integration tests for main screens

## Testing Guidelines

### Unit Tests

Test individual functions and components in isolation:

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Hello')).toBeTruthy();
  });
});
```

### Service Tests

Mock API calls and test service logic:

```typescript
import { authService } from '../services/auth/authService';
import * as apiClient from '../services/api/client';

jest.mock('../services/api/client');

describe('authService', () => {
  it('handles login successfully', async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({ data: { token: 'abc' } });
    const result = await authService.login('1234567890', '123456');
    expect(result.token).toBe('abc');
  });
});
```

### Snapshot Tests

Use sparingly for complex UI components:

```typescript
it('matches snapshot', () => {
  const tree = render(<MyComponent />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

## Test Coverage Goals

- **Services**: 70%+ coverage (critical business logic)
- **Utils**: 80%+ coverage (pure functions)
- **Components**: 40%+ coverage (focus on logic, not rendering)
- **Screens**: 30%+ coverage (integration tests for key flows)

## Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Next Steps

1. Add tests for all service files
2. Add tests for all utility functions
3. Add tests for context providers
4. Add integration tests for critical user flows
5. Set up coverage thresholds in `jest.config.js`

## CI Integration

Tests should run automatically in CI:
- On every pull request
- On every push to main branch
- Fail build if coverage drops below threshold

