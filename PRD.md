# Print-on-Demand AI Upscaling Service

## Core Components

- Next.js app (TypeScript)
- Vercel Blob storage
- PostgreSQL + Prisma
- Topaz AI for upscaling
- Stripe Checkout for payments (Polish business)
  - Hosted checkout page
  - Automatic tax handling
  - Built-in fraud prevention
  - Customer email receipts
- Prodigi for printing/fulfillment
- React Query for server state management:
  - Automatic caching and revalidation
  - Optimistic updates for better UX
  - Background refetching
  - Infinite loading for order history
  - Error handling and retries
  - Used via tRPC's wrapper for type safety
- Internationalization (i18n)
  - next-intl for translations
  - Language detection and routing
  - RTL support
  - Locale-specific formatting
  - Multi-currency support via Stripe

## Flow

1. Customer uploads image
2. AI upscales for print quality
3. Customer selects size/options
4. Redirect to Stripe Checkout for payment
5. Auto-order to Prodigi on successful payment
6. Prodigi fulfills and ships

## Technical Stack

```typescript
// Database Schema
model Order {
  id          String   @id
  status      OrderStatus
  imageUrl    String   // Vercel Blob URL
  enhancedUrl String?  // Vercel Blob URL
  price       Float
  currency    String   // EUR, USD, etc.
  locale      String   // User's locale
  language    String   // User's preferred language
  stripeId    String?  // Stripe Checkout Session ID
  prodigiId   String?
  shipping    Json
  createdAt   DateTime @default(now())
}

enum OrderStatus {
  UPLOADED
  PROCESSING
  READY
  PAID
  ORDERED
  SHIPPED
}
```

## Integration Points

- Topaz API for image processing
- Stripe Checkout for secure payments
  - Hosted payment page
  - Webhook integration for order status
  - Automatic receipt emails
  - Multi-currency support
- Prodigi API for order fulfillment
- Vercel Blob for image storage
- React Query + tRPC for API integration
- next-intl for i18n

## Market Focus

- Primary markets:
  - Germany (Berlin, Munich)
  - Netherlands (Amsterdam)
  - Denmark (Copenhagen)
  - Poland (Warsaw)
- Secondary markets:
  - Rest of EU
  - USA
- Premium quality prints
- Custom sizes

## Internationalization Requirements

### Language Support

- Phase 1 Languages:
  - English (default)
  - German
  - Dutch
  - Danish
  - Polish
- Future expansion languages based on market demand

### Content Management

- Translation files in YAML format
- Separate translations for:
  - UI elements
  - Marketing copy
  - Error messages
  - Email templates
  - Legal documents

### Technical Implementation

- URL structure: /[locale]/[path]
- Language detection:
  1. URL parameter
  2. Browser settings
  3. IP-based geolocation
  4. Default to English
- RTL support (future-proofing)
- Number and date formatting based on locale
- Currency display based on location

### User Experience

- Language selector in header
- Persist language preference
- Auto-detect location for currency
- Localized image size options (cm/inches)
- Localized pricing display

### Regional Considerations

- Location-specific payment methods
- Country-specific legal requirements
- Regional shipping options
- Local customer support hours

## Current Status

Planning phase, decisions made:

- Prodigi as printer
- Custom solution over Shopify
- Vercel Blob for storage
- Stripe Checkout for payments
  - Simpler integration than custom form
  - Built-in compliance and security
  - Mobile-optimized experience
- React Query for state management
- tRPC for type-safe API layer
- next-intl for internationalization

Target: Premium product with automated workflow from upload to fulfillment, fully localized for key European markets.

# Implementation Guidelines

### Project Structure

```
src/
  components/
    upload/
    preview/
    order/
  pages/
    [locale]/
      dashboard/
      processing/
      orders/
  server/
    api/
    topaz/
    prodigi/
    payment/
    blob/      # Vercel Blob utilities
  utils/
    validation/
  locales/    # Translation files
    en/
    de/
    nl/
    da/
    pl/
```

### i18n Components

- LanguageProvider
- LocaleSelector
- FormattedDate
- FormattedCurrency
- TranslatedContent

### Security

- Secure file upload via Vercel Blob
- User authentication
- Payment data handling
- Rate limiting
- Input validation
- GDPR compliance for all markets
