# README

## Table Of Content

1. [Project Name](#project-name)
2. [Project Description](#project-description)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started Locally](#getting-started-locally)
6. [Available Scripts](#available-scripts)
7. [Security Tests Documentation](#security-tests-documentation)
8. [Login and register](#login-and-register)
9. [Issues](#issues)
10. [TODO](#todo)
11. [Changelog](#changelog)

- [[1.0.0] - Internationalization (i18n) System](#100---internationalization-i18n-system---2025-04-10)
- [[0.9.93] - User Registration Management](#0993---user-registration-management---2025-04-03)
- [[0.9.92] - Security Enhancements: Token Security Enhancements](#0992---security-enhancements-token-handling--notifications---2025-04-02)
- [[0.9.91] - Security Enhancements: Cookie Protection](#0991---security-enhancements-cookie-protection---2025-03-31)
- [[0.9.9] - Security Enhancements: Search Functionality](#099---security-enhancements-search-functionality---2025-03-29)
- [[0.9.8] - Image Upload Validation & UI Improvements](#098---image-upload-validation---2025-03-28)
- [[0.9.7] - Enhanced Search Functionality](#097---enhanced-search-functionality---2025-03-27)
- [[0.9.6] - Pagination Enhancement](#096---pagination-enhancement---2025-03-26)
- [[0.9.5] - Security Enhancements: Password](#095---security-enhancements-password---2025-03-25)
- [[0.9.43] - Posts: API Optimization](#0943---posts-api-optimization---2025-03-18)
- [[0.9.42] - Security Enhancements: Posts, API improvements Improvements](#0942---security-enhancements-posts-api-improvements---2025-03-17)
- [[0.9.41] - Posts: Delete Implementation](#0941---posts-delete-implementation---2025-03-16)
- [[0.9.4] - Posts: Edit Implementation](#094---posts-edit-implementation---2025-03-15)
- [[0.9.3] - Security Enhancements: Authentication](#093---security-enhancements-authentication---2025-03-14)
- [[0.9.2] - Hooks Refactoring and Improvements](#092---hooks-refactoring-and-improvements---2025-03-12)
- [[0.9.1] - Email Verification Process Improvements](#091---email-verification-process-improvements---2025-03-11)
- [[0.9.0] - Error Handling and API Tests](#090---error-handling-and-api-tests---2025-03-11)
- [[0.8.9] - Security & Editor Enhancements](#089---security--editor-enhancements---2025-03-07)
- [[0.8.8] - Tests](#088---tests---2025-03-05)
- [[0.8.7] - Loader and Testing Enhancements](#087---loader-and-testing-enhancements---2025-03-01)
- [[0.8.61] - Security Enhancements Part 2](#0861---security-enhancements-part-2---2025-03-02)
- [[0.8.6] - Security Enhancements](#086---security-enhancements---2025-02-25---2025-02-26)
- [[0.8.5] - "Editor's pick"](#085---editors-pick---2025-02-24)
- [[0.8.4] - Caching and Hidden Posts Enhancements](#084---caching-and-hidden-posts-enhancements---2025-02-24)
- [[0.8.3] - 404 Page and UI Improvements](#083---404-page-and-ui-improvements---2025-02-21)
- [[0.8.2] - Admin Panel Tabs](#082---admin-panel-tabs---2025-01-24)
- [[0.8.1] - Admin Panel Posts List](#081---admin-panel-posts-list---2025-01-17)
- [[0.8.0] - Admin Panel](#080---admin-panel---2025-01-16)

## Project Name

BNF Blog

**Live version**: [https://blog-preprod.vercel.app/pl](https://blog-preprod.vercel.app/pl)

## Project Description

BNF blog is a full-stack Next.js application for managing blog posts. It uses Next-Auth for secure authentication and implements security features like input sanitization and two-factor authentication. The project includes internationalization supporting Polish (default) and English.

## Tech Stack

- **Framework**: Next.js
- **Frontend**: React, TypeScript
- **Backend**: Prisma ORM, Next-Auth, and API endpoints built within Next.js
- **Styling**: Tailwind CSS, CSS
- **Authentication & Security**: bcryptjs, Next-Auth, CSRF protection, XSS sanitization
- **Utilities**: react-hook-form, react-i18next, i18next, next-i18next, and others

## Project Structure

```
src/
├── app/                    # Next.js routing and pages
│   ├── (protected)/        # Protected routes (requires authentication)
│   ├── api/                # Backend API endpoints (route handlers)
│   │   ├── posts/
│   │   ├── comments/
│   │   ├── categories/
│   │   ├── admin/
│   │   └── auth/
│   ├── write/              # Post creation page
│   ├── category/           # Category view page
│   ├── register/           # User registration page
│   ├── reset/              # Password reset page
│   ├── new-verification/   # Email verification page
│   ├── new-password/       # New password setup page
│   ├── login/              # Login page
│   ├── error/              # Error page
│   └── posts/              # Blog posts pages
│
├── features/               # Main application features
│   ├── auth/               # Authentication feature
│   │   └── utils/          # Auth utilities
│   │       └── data/       # Auth data handling functions
│   │           ├── paswordResetToken.tsx
│   │           ├── twoFactorToken.tsx
│   │           ├── accout.tsx
│   │           ├── twoFactorConfirmation.tsx
│   │           ├── verificationToken.tsx
│   │           └── user.tsx
│   │
│   ├── settings/           # Settings feature
│   │   └── utils/          # Settings utilities
│   │       └── settings.service.ts  # Settings management functions
│   │
│   └── blog/              # Blog feature
│       ├── api/           # Client-side API communication functions
│       │   ├── comments/
│       │   ├── posts/
│       │   ├── pickPosts/
│       │   ├── popularPosts/
│       │   ├── singlePost/
│       │   ├── cardList/
│       │   └── categories/
│       └── utils/        # Blog utilities
│
├── hooks/                # Custom React hooks
│   ├── auth/
│   └── blog/
│
├── shared/               # Shared resources
│   ├── components/       # All React components
│   │   ├── atoms/        # Basic components (buttons, inputs, etc.)
│   │   ├── molecules/    # Composite components (forms, cards, etc.)
│   │   ├── organisms/    # Complex components (headers, footers, etc.)
│   │   ├── pages/        # Page components
│   │   └── ui/           # UI components
│   │
│   ├── utils/            # Shared utilities
│   ├── context/          # React contexts
│   └── middleware.ts     # Application middleware
│
├── providers/            # React providers
│
└── config/               # Application configuration
```

## Getting Started Locally

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Generate Prisma client (if not already generated):
   ```bash
   pnpm postinstall
   ```
4. Run the development server:
   ```bash
   pnpm dev
   ```
5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `pnpm dev` - Runs the development server.
- `pnpm build` - Builds the application for production.
- `pnpm start` - Starts the production server.
- `pnpm lint` - Lints the codebase and auto-fixes issues.
- `pnpm postinstall` - Generates the Prisma client.
- `pnpm vercel-build` - Prepares the project for deployment on Vercel.
- `pnpm test` - Runs the test suite.
- `pnpm test:watch` - Runs tests in watch mode.
- `pnpm test:coverage` - Generates a test coverage report.

## Security Tests Documentation

Refer to [Security Tests Documentation](./docs/security-tests.md).

## Login and register:

- Use of bcrypt
- Password hashing + salt
- next-auth v5
- Middleware
- Login using server actions
- Used "sanitize" library - DOMPurify, with a minor issue: most libraries work in an environment that must have access to the window object. DOMPurify works on the client side, as it doesn't rely on DOM, which is only available in the browser. Therefore, to avoid changing the component to a client component, we had to find a library that performs sanitization on the server side, i.e., one that doesn't depend on browser API.
- There is a security measure that prevents creating an account using a specific email (either from Google or GitHub) and then registering using the same email via another method. For example, if we created an account by logging in with "Google" and the email "abc@def.com", and then we try to log in/register using "GitHub" which is registered with the same email, "abc@def.com", we won't be able to do so. It will redirect us to the default page:

  <img src="https://i.gyazo.com/87876e9860c8c226ad0ee7e75515cb3e.png" alt="Default login page" width="400" />

  but to avoid using this default page, I created my own view:

  <img src="https://i.gyazo.com/04c933853cf5c8f5416103c1c402b0f2.png" alt="New view login page" width="400" />

  and the situation where we try to log in using the same email but a different method is handled by simply displaying an error on the login page:

  <img src="https://i.gyazo.com/d738c07b5b76a49080f626b23243aae3.png" alt="New view login page" width="400" />

  And returning to the issue of logging in with the same email but a different method and why it's not possible by default, the answer can be found at:
  https://next-auth.js.org/faq
  in the "security" section and the question "When I sign in with another account with the same email address, why are accounts not linked automatically?"

- Added protection against creating a mixed account (e.g., registered via Google and OAuth (email + password)) - using password reset
- Used resend.com for sending confirmation emails during registration

## Issues

- If we hide a post and return to the main page, it looks like the page doesn't reload, because the post doesn't hide, e.g., from the "What's hot" section until after refreshing the page

## TODO

### TODO

### Two Factor Authentication:

- When enabling/disabling 2FA, it should log out
- When disabling 2FA, it should send a confirmation email

### "DEFAULT" post images:

- Each category should have a different default image

  Additionally, fun:

  - Graphic when trying to access a post that doesn't exist
  - Graphic when trying to access a page that doesn't exist, e.g., /aaa

## Changelog

### [1.0.0] - Internationalization (i18n) System - 2025-04-10

#### Added

- Implemented comprehensive internationalization (i18n) system:
  - Added support for multiple languages: Polish (default) and English
  - Created JSON translation files for both languages
  - Implemented middleware for detecting and setting language based on URL path
  - Used nested translation keys with namespaces for better organization
- Built localized routing system:
  - Refactored routes function to handle paths with language prefix
  - Added getLocalizedRoutes function to generate paths with language prefix
  - Updated all navigation components to support localized paths
- Developed hooks for client and server components:
  - Created useClientTranslation for client-side components
  - Implemented getSharedViewData for server-side translations
  - Added default value support for missing translations
- API improvements:
  - Modified backend to handle translation keys instead of direct messages
  - Applied consistent translation key format across the application
  - Enhanced error handling with translation support

#### Changed

- Rebuilt application routing structure:
  - Added dynamic [locale] segments to all routes
  - Updated layout components to handle locale parameter
- Unified user interface:
  - All messages and labels now handled by translation system
  - Added language switcher in UI
  - Ensured consistent user experience regardless of selected language
- Form hooks adapted for multilingual support:
  - Modified usePostForm and useEditPostForm to handle localized routes
  - Added language extraction from current URL path
  - Updated redirect logic after form submission

### [0.9.93] - User Registration Management - 2025-04-03

#### Added

- Implemented centralized settings management system:
  - Created `settings.service.ts` to manage application settings
  - Standardized API for checking and updating registration status
  - Added proper error handling and default values for settings
- Enhanced user registration control:
  - Added SuperAdmin panel with registration toggle
  - Implemented visual indication of registration status (button colors)
  - Prevented new user registration through both form and OAuth when disabled
  - Added clear user feedback for disabled registration state
- Improved error handling for social login:
  - Implemented custom error type for disabled registration
  - Enhanced error messaging for better user experience
  - Fixed toast notification behavior to prevent duplicate messages

#### Changed

- Refactored duplicated code into centralized service
- Updated button styling with new "success" variant for enabled registration
- Improved toast notification colors to match actions (green for enabling, red for disabling)
- Enhanced user interface with consistent error messages

### [0.9.92] - Security Enhancements: Token Handling & Notifications - 2025-04-02

#### Added

- Implemented HTTP Strict Transport Security (HSTS) for enforcing secure connections
- Enhanced email templates with improved security information and context
- Strengthened 2FA security with 8-digit tokens (increased from 6 digits)

#### Changed

- Reduced token lifetimes to enhance security:
  - Password reset tokens: from 1 hour to 30 minutes
  - Email verification tokens: from 48 hours to 24 hours
- Improved email templates with precise expiration times and security warnings
- Enhanced user guidance with security best practices in all notification emails

### [0.9.91] - Security Enhancements: Cookie Protection - 2025-03-31

#### Added

- Implemented secure cookie configuration for improved authentication security:
  - Added httpOnly, secure, and sameSite attributes to prevent XSS and CSRF attacks
  - Configured environment-aware cookie naming with security prefixes in production
  - Implemented proper CSRF protection through secure token cookies

#### Changed

- Improved session security through enhanced cookie management
- Optimized authentication flow for both development and production environments
- Added conditional security features based on environment (NODE_ENV)

### [0.9.9] - Security Enhancements: Search Functionality - 2025-03-29

#### Added

- Implemented comprehensive input sanitization across API endpoints:
  - Added XSS protection on the backend
  - Implemented string escaping for search queries
  - Applied sanitization to all user-provided inputs in search endpoints
  - Strengthened defense against injection attacks in API parameters

#### Changed

- Improved error handling for sanitized inputs
- Enhanced search query processing pipeline with multi-level protection
- Optimized security without impacting performance

### [0.9.8] - Image Upload Validation - 2025-03-28

#### Added

- Implemented image size validation for blog posts:
  - Added 1.5 MB size limit for post images on both frontend and backend
  - Implemented client-side validation in useImageUpload hook
  - Added server-side validation in POST and PATCH API endpoints

#### Changed

- Consolidated image size validation constants for better maintainability
- Optimized error handling in image upload processes
- Improved user experience with clear feedback on upload size limitations

### [0.9.7] - Enhanced Search Functionality - 2025-03-27

#### Added

- Improved search overlay with enhanced UX:
  - Added animated loading indicator using AnimatedText component
  - Implemented search query debouncing to reduce unnecessary API calls
- Performance optimizations:
  - Optimized search API request with improved typing
  - Implemented smart search triggering only on actual query changes

### [0.9.6] - Pagination Enhancement - 2025-03-26

#### Added

- Completely refactored pagination component for improved user experience:
  - Replaced simple "page/total" display with interactive numbered pagination
  - Added visual indication of current page
  - Implemented responsive design
- Enhanced accessibility features:
  - Added proper ARIA attributes for screen readers
  - Improved keyboard navigation with focus indicators
  - Included semantic HTML5 navigation elements
  - Implemented `aria-current` for current page indication

#### Changed

- Made pagination UI more intuitive and user-friendly
- Improved visual feedback for button interactions
- Optimized mobile experience with appropriate sizing and spacing

### [0.9.5] - Security Enhancements: Password - 2025-03-25

#### Added

- Implemented password breach checking using Have I Been Pwned (HiBP) API:
  - Real-time password security validation during registration and password change
  - Secure password checking using k-anonymity (only password prefix sent to API)
  - Server-side action for password checking to address CSP restrictions
  - Visual feedback with animated loading indicators during security checks
- Refactored password schemas for consistent validation:
  - Centralized password validation logic in schemas
  - Standardized minimum password length requirements across all forms
  - Implemented password confirmation validation everywhere
  - Created a single source of truth for all password-related validation messages
- Added enhanced user experience features:
  - Debounced password security checks to prevent excessive API calls
  - Automatic redirects after successful password reset
  - Cleaned up UI messages to avoid message stacking
  - Improved error handling for password-related operations

#### Changed

- Updated registration, password reset, and settings forms with consistent validation
- Improved server-side error handling in settings action
- Refactored form components to use shared password validation hooks
- Enhanced security by removing unnecessary password confirmation fields from database storage
- Fixed UI issues in all password management screens

### [0.9.43] - Posts: API Optimization - 2025-03-18

#### Changed

- API optimization for fetching post lists:
  - Removed the `desc` field from API responses for post lists, significantly reducing the amount of data transferred
  - Created a dedicated `ListPost` type for posts in lists (without large HTML fields)
  - Updated all client components to use the new type
  - Improved Prisma queries to fetch only the necessary fields, improving performance and reducing cache memory issues
- Resolved Next.js cache memory limit issues:
  - Reduced the size of API responses for post lists by excluding large HTML descriptions
  - Optimized `$transaction` calls to precisely fetch only required data
  - Updated components displaying post lists (admin panel, homepage)

### [0.9.42] - Security Enhancements: Posts, API improvements - 2025-03-17

#### Added

- Enhanced security and access control for posts:
  - Administrators can always view posts (including hidden ones)
  - Other users can only see posts marked as visible (isVisible: true)
  - View counter (views) increased only for non-administrators
  - Strengthened access control when retrieving a single post
- Extended API functionality for posts:
  - Improved GET endpoint for retrieving a single post
  - Optimized database data retrieval (including user data in the query)
  - Standard error handling for all HTTP methods
  - Better validation and handling of edge cases
- Updated API error handling:
  - Consistent handling of 404 errors for non-existent posts
  - Proper handling of cases when the post doesn't exist
  - Unified messages confirming post deletion

#### Changed

- Refactored single post retrieval system:
  - Improved data structure returned by the API
  - Optimized performance by eliminating unnecessary database queries
  - Consistent consideration of user permissions
- Improved messages and labels:
  - Standard error messages from the labels module
  - Uniform naming conventions across the project

### [0.9.41] - Posts: Delete Implementation - 2025-03-16

#### Added

- Full post deletion functionality:
  - Implementation of DELETE method in the API for posts
  - User permissions validation (only admin can delete posts)
  - Verification of post existence before deletion
  - Error handling during the deletion process
- Extended API error handling:
  - Standard error messages for missing post ID
  - Proper handling of cases when the post doesn't exist
  - Unified messages confirming post deletion

### [0.9.4] - Posts: Edit Implementation - 2025-03-15

#### Added

- Implementation of full post editing functionality:
  - Post editing form with dynamic loading of existing data
  - Form validation with error messages
  - Ability to edit all fields: title, content, category, and image
  - Automatic saving of the original image if not changed
- Processing changes in the API:
  - Endpoints for updating posts with full server-side validation
  - Safeguards against title duplication
  - Verification of user permissions to edit the post
- Unit tests for the useEditPostForm hook:
  - Tests for initialization with post data
  - Tests for form validation
  - Tests for API error handling
  - Tests for correct update execution

#### Changed

- Extended post API with PATCH method for updates
- Optimized post data retrieval before editing
- Improved UX for the edit form

### [0.9.3] - Security Enhancements: Authentication - 2025-03-14

#### Added

- Implementation of advanced authentication security mechanisms:
  - Normalization of response time for authentication processes
  - Consistent server responses regardless of data correctness
  - Protection against enumeration attacks (user enumeration)
  - Uniform error messages to enhance user privacy
- Comprehensive security tests:
  - Tests for various authentication scenarios
  - Analysis of resistance to potential threats
  - Verification of system behavior consistency
  - Successful security test results (see [test documentation](./docs/security-tests.md))

#### Changed

- Refactoring of authentication processes:
  - Unification of error handling in login, registration, and password reset processes
  - Performance optimization while maintaining a high level of security
  - Improved UX during authentication processes
- Updated configuration for security mechanisms

#### Security

- Strengthened protection against timing attacks
- Protection against brute force attacks through response normalization
- User privacy protection through unified messages

### [0.9.2] - Hooks Refactoring and Improvements - 2025-03-12

#### Added

- Added unit tests for hooks:
  - useTimeCounter
  - useTwoFactorAuth
  - useEmailVerification

#### Changed

- Refactored useTimeCounter hook:
  - Improved countdown logic
  - Better resource management and interval clearing
  - More accurate time formatting (MM:SS format)
- Refactored useTwoFactorAuth hook:
  - Simplified 2FA code management logic
  - Improved error handling and data validation
  - Better integration with useTimeCounter

#### Fixed

- Fixed handling of 2FA code expiration
- Fixed issues with timer reset

### [0.9.1] - Email Verification Process Improvements - 2025-03-11

#### Added

- Improved email verification system:
  - Added time limit between consecutive attempts to send verification email
  - Display of time remaining until ability to resend verification email
  - Visual indication of the "Resend verification email" button state

#### Changed

- Improved login process for unverified accounts:
  - Redirection to verification page instead of displaying toast message
  - Verification of login data correctness before sending verification email
  - Unification of error messages during login
- Refactored LoginPageView component:
  - Extracted logic to dedicated hooks (useEmailVerification, useTwoFactorAuth, useTimeCounter)
  - Division into smaller components (LoginForm, TwoFactorForm, VerificationView)
  - Improved unit tests
  - Increased modularity and code readability
  - Facilitated maintenance and extension of functionality
- Fixed the issue with multiple verification emails being sent
- Improved error handling during verification process
- Enhanced UX during email verification process
- Fixed the issue with incorrect 2FA code checking
- Fixed handling of imports in login-related components

### [0.9.0] - Error Handling and API Tests - 2025-03-11

#### Added

- Implementation of global error handling according to Next.js 14 best practices:
  - Added `error.tsx` component for page-level error handling
  - Added `global-error.tsx` component for root-level error handling
  - Added `loading.tsx` component for loading state handling
  - Implemented dynamic catch-all route for proper 404 handling
  - Removed error logging to console for security reasons
- Standardization of API error handling:
  - Refactored all API endpoints to use the `api-error-handler` module
  - Unified error responses with appropriate HTTP codes
  - Implemented handling of disallowed HTTP methods
  - Added cache headers for performance optimization
- Extended API tests:
  - Added tests for all API endpoints
  - Tests for various error scenarios and correct responses
  - Tests for different HTTP methods
  - Tests for different query parameters

#### Changed

- Removed custom `ErrorBoundary` component in favor of built-in Next.js mechanisms
- Improved navigation from the `not-found` component to the home page
- Optimized `loading` component using native animations
- Enhanced application security by removing detailed error logging

### [0.8.9] - Security & Editor Enhancements - 2025-03-07

#### Added

- Implementation of comprehensive application security:
  - Added security headers in middleware (CSP, X-Content-Type-Options, X-Frame-Options, HSTS)
  - Configuration of access control for different user roles
  - Handling redirects for protected routes
  - Configuration of cache headers for API and pages
- Standardization of API error handling:
  - Created api-error-handler module for unified error handling
  - Added helper functions for typical errors (unauthorized, forbidden, not found)
  - Implementation of HTTP method error handling
- Protection against XSS attacks:
  - Added XSS configuration with whitelist of allowed HTML tags and attributes
  - Configuration of secure HTML content processing in posts
  - Implementation of input data sanitization
- Extended content editor:
  - Added support for inserting and formatting images in ReactQuill editor
  - Implementation of image resizing module
  - Added text formatting options (bold, underline, strikethrough, code)
  - Extended editor configuration with additional formatting options

### [0.8.8] - Tests - 2025-03-05

#### Added

- Added tests for Pages component: LoginPageView, RegisterPageView, ResetPageView, NewPasswordPageView, NewVerificationPageView, AuthErrorPageView, UserInfoPageView, WritePageView
- Added tests for hooks: useCurrentUser, useCurrentRole, usePostForm, useImageUpload

### [0.8.7] - Loader and Testing Enhancements - 2025-03-01

#### Added

- Added animated Loader component with matrix effect
- Configuration of tests using Jest and React Testing Library
- Implementation of unit and integration tests for Loader and WritePageView components
- Optimization of Babel configuration for test environment

#### Changed

- Redesign of WritePageView component with new interface

### [0.8.61] - Security Enhancements Part 2 - 2025-03-02

#### Added

- Implementation of comprehensive rate limiting system:
  - Using Upstash Redis as a database to store limits
  - Implementation of sliding window rate limits for critical actions:
    - Login
    - Registration
    - Password reset
    - Comments
    - Resending verification email
  - Creation of reusable helper function for consistent limit implementation
  - User identification using advanced techniques
  - User-friendly error messages with waiting time information
  - Formatting waiting time in a readable format
  - Standard HTTP 429 codes (Too Many Requests) for exceeding limits
  - Retry-After headers for HTTP standards compliance

#### Changed

- Separation of server and client code:
  - Added appropriate directives to server files
  - Extracted time formatting functions to a separate file for client-side use
- Standardization of error handling throughout the application:
  - Replacement of custom error types with standard HTTP codes
  - Unification of rate limiting error handling in all components
  - Simplification of error checking
- Improved UX by displaying waiting time in error messages
- Enhanced application security against brute force attacks
- Refactored form components (LoginPageView, RegisterPageView, ResetPageView)
- Optimized error handling in Comments component
- Implemented graceful degradation for rate limiting errors

### [0.8.6] - Security Enhancements - 2025-02-25 - 2025-02-26

#### Added

- Added Content Security Policy (CSP) to increase application security
- Implemented protection against common web threats
- Limited resource loading to trusted sources only
- Strengthened protection of user-generated content

Comments

- XSS sanitization for comments on the backend
- Empty comment validation on both frontend and backend
- Comment length validation with character counter
- Configuration of maximum comment length as a shared constant
- Display of remaining character count in the comment form
- Implemented rate limiting for comments using Upstash Redis
- Added waiting time display when comment limit is exceeded
- Improved error handling and user feedback with toast notifications

#### Changed

- Moved Comments component from molecules to organisms
- Updated styles for better compatibility with light/dark mode

### [0.8.5] - "Editor's pick" - 2025-02-24

#### Added

- "Editor's pick" functionality:
  - Administrator can mark up to 3 posts as "pick"
  - New section in Menu showing selected posts
  - Selection/deselection switch in administrator panel
  - Display of number of selected posts
  - Filtering posts by selection status in administrator panel
- New API endpoint for "Editor's pick" with authentication control
- New labels for "Editor's pick" functionality

#### Changed

- Redesigned post filters in administrator panel
- Updated Menu component to display selected posts instead of hardcoded ones

### [0.8.4] - Caching and Hidden Posts Enhancements - 2025-02-24

#### Changed

- Implementation of caching system for popular posts:
  - Adding Cache-Control header with max-age
  - Introduction of stale-while-revalidate mechanism
  - Performance optimization and database load reduction
  - Improved user interface responsiveness
- Hidden posts security:
  - Hidden posts are unavailable through API
  - Attempt to directly access a hidden post returns 404
  - Hidden posts visible only in administrator panel
- Improvements in administrator panel:
  - Blocking hide/show buttons during request processing
  - Preventing multiple clicks during post visibility changes

### [0.8.3] - 404 Page and UI Improvements - 2025-02-21

#### Added

- Implementation of dedicated 404 page for non-existent categories
- Improved UX through better error messages

#### Changed

- User interface redesign:
  - Updated main theme and application background
  - Optimized images for subpages
  - Modernized color palette in navigation and headers
- Fixed responsiveness:
  - Improved hamburger menu functionality on mobile devices
  - Adjusted layout for different screen sizes

### [0.8.2] - Admin Panel Tabs - 2025-01-24

#### Added

- Tab system in admin panel (AdminTabs)
  - Generic component for tabs
  - Two tabs: "Posts" and "Users"

#### Changed

- Reorganized admin panel interface using tab system
- Moved post list to dedicated tab

### [0.8.1] - Admin Panel Posts List - 2025-01-17

#### Added

- Posts list in admin panel (PostsList)
- Ability to view and manage posts
- Option to hide posts

### [0.8.0] - Admin Panel - 2025-01-16

#### Added

- Administrator panel with basic functionalities
- Admin panel access security (role-based access control)
- API and server actions tests in admin panel
