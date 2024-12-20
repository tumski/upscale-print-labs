# Project Rules and Conventions

## Package Management

- Always use pnpm for package management
- Lock file (pnpm-lock.yaml) must be committed
- Use semantic versioning (^) for better dependency management
- Regular updates through automated tools (Renovate)

## Code Style

- Use TypeScript for all files
- Enforce strict TypeScript mode
- Use ESLint with Next.js recommended rules
- Follow Prettier formatting
- Use named exports instead of default exports
- Use arrow functions for consistency

## TypeScript and Data Validation

- Define Zod schemas for all data structures
- Always provide default values for optional fields
- Match Prisma schema types exactly in Zod schemas
- Use strict type checking (no any, unknown when possible)
- Define reusable type definitions in separate files
- Use type inference where possible
- Document complex types with JSDoc comments
- Handle nullable and optional fields explicitly

## Database and Models

- Always define complete Zod schemas for Prisma models
- Include all required fields in create/update operations
- Use enums for status and type fields
- Validate data before database operations
- Handle JSON fields with proper type definitions
- Keep Prisma schema and Zod schemas in sync

## UI Components

- Mobile-first approach for all components and layouts
- Design and test on mobile before desktop
- Use shadcn/ui as the primary component library
- Customize components through tailwind.config.ts
- Follow shadcn/ui's styling conventions
- Keep components atomic and reusable
- Use CSS variables for theming
- Ensure touch-friendly interactions
- Minimum tap target size of 44x44px
- Avoid hover-only interactions

## Responsive Design

- Start with mobile layout (375px width)
- Add breakpoints only when needed
- Use relative units (rem, em) over pixels
- Test on real mobile devices
- Consider network conditions
- Optimize images for mobile
- Ensure readable font sizes (min 16px)
- Account for touch interactions
- Consider offline capabilities

## Project Structure

- Follow the structure defined in PRD.md
- Keep components atomic and reusable
- Place types in separate .d.ts files
- Use barrel exports (index.ts) for cleaner imports

## State Management

- Use React Query for server state
- Use React Context for global UI state
- Implement proper loading and error states

## Internationalization

- All text must be in translation files
- Use next-intl for translations
- Follow the locale structure: /[locale]/[path]

## API and Backend

- Use tRPC for type-safe API endpoints
- Implement proper error handling
- Follow REST principles for API design
- Use Prisma for database operations
- Define complete input/output types for all endpoints
- Validate all incoming data with Zod

## Environment Variables

- Never commit .env files
- Use .env.example for documentation
- Prefix all environment variables with NEXT*PUBLIC* for client usage
- Document all required environment variables

## Git Conventions

- Use conventional commits
- Branch naming: feature/, bugfix/, hotfix/
- Squash commits when merging
- Write descriptive commit messages

## Testing

- Write unit tests for utilities
- Write integration tests for API endpoints
- Use React Testing Library for component tests
- Test error states and edge cases
- Test data validation

## Performance

- Optimize images using next/image
- Implement proper code splitting
- Use proper caching strategies
- Monitor and optimize bundle size

## Security

- Implement proper input validation
- Use proper CORS settings
- Follow OWASP security guidelines
- Handle sensitive data appropriately
- Validate all user inputs
- Sanitize data before storage
