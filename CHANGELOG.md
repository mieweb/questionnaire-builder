# Changelog

All notable changes to the questionnaire-builder monorepo and its packages will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-24

Complete UI/UX overhaul with modern blue theme design system and enhanced editor experience.

#### @mieweb/forms-engine v1.0.0

##### Added
- **Blue Theme Design System** - Modern blue color palette throughout all field components
  - Primary blue: `blue-600` for selections and CTAs
  - Focus states: `blue-400` borders with ring effects
  - Hover states: `blue-50` backgrounds with `blue-300` borders
  - Consistent gray palette for borders and text
- **Enhanced Focus States** - All input fields and textareas now have blue focus rings (`focus:border-blue-400 focus:ring-1 focus:ring-blue-400`)
- **Improved Field Wrapper Component**
  - Modern gradient header bar (`bg-gradient-to-r from-gray-50 to-gray-100`)
  - Collapsible field sections with smooth animations
  - Better visual hierarchy with consistent padding and spacing
  - Selection on any header button interaction (edit, collapse, delete)
  - Padding automatically removed when fields are collapsed
- **Better Preview Mode Interactions**
  - Blue selection highlights for radio buttons and boolean fields
  - Hover states on all interactive elements (`hover:bg-blue-50`)
  - Improved cursor pointers for better UX
- **Signature Field Enhancements**
  - Settings box with improved visual styling
  - Blue focus states on all inputs
  - Better spacing with `space-y-3` wrapper
  - Cursor pointer on checkbox labels
- **Image Field Improvements**
  - Blue gradient upload area (`from-blue-50 to-gray-50`)
  - Enhanced focus states on all text inputs and dropdowns
  - Better hover effects on upload zone
  - Improved delete button with red hover state
  - Consistent `gap-3` spacing in grid layout

##### Changed
- **All 10 Basic Field Components** (Radio, Check, DropDown, MultiText, Slider, Rating, Ranking, SingleMatrix, MultiMatrix, multiSelectDropDown)
  - Edit mode: Gray borders replaced with `border-gray-300`, improved spacing with `space-y-2` and `space-y-3`
  - Option rows: Consistent padding (`px-3 py-2`), shadow styling, and hover effects
  - Delete buttons: Gray with red hover (`text-gray-400 hover:text-red-600`)
  - Add buttons: Full-width blue theme with centered content and icons
  - Input fields: Flex layout with `flex-1 min-w-0` for proper text truncation
- **Boolean Field**
  - Updated selected state styling to use `bg-blue-600 text-white`
  - Border styling now uses `border-2` for better visual weight
  - Improved transition animations with `transition-all`
- **Text and LongText Fields**
  - Preview inputs now have blue focus states
  - Edit mode disabled fields use `bg-gray-50` background
  - Consistent `space-y-2` wrapper spacing
- **Section Field**
  - Title input has blue focus states and improved border styling
  - Consistent rounded corners (`rounded-lg`)
- **Matrix Fields** (Single and Multi)
  - Row/column labels now use `text-gray-600` for better contrast
  - Improved spacing between sections
  - "Max reached" messages now properly styled
- **Rating and Slider Fields**
  - Selected state now uses `text-blue-600` instead of gray
  - Hover effects updated to blue theme
  - Better visual indicators for active selections
- **MultiSelectDropDown Field**
  - Selected pills now use `bg-blue-600` instead of teal
  - Menu hover states changed to `hover:bg-blue-50`
  - Better border styling with blue theme

##### Fixed
- **React Hooks Violations** - Fixed "Rendered fewer hooks than expected" error in Ranking_Field by moving useEffect to component level
- **FieldWrapper Undefined Display** - Fixed "undefined" appearing in field headers when question/title is empty
- **FieldWrapper Duplicate Header** - Removed redundant label section that was causing double headers
- **Collapsed Field Padding** - Fields now properly remove padding when collapsed (replaces `p-6` with `p-0`)
- **Collapse Button Selection** - Clicking collapse/expand now properly selects the field before toggling
- **Option Input Overflow** - Fixed text overflow in option inputs using `flex-1 min-w-0` pattern
- **Icon Sizing Consistency** - All icons now use consistent `h-5 w-5` sizing
- **Border Radius Consistency** - All fields now use `rounded-lg` for consistent appearance
- **ID Generation** - Improved unique ID generation for fields and options
- **EnableWhen Logic** - Fixed conditional visibility logic issues
- **Section Field Additions** - Resolved issues with adding fields to sections
- **Custom Scrollbar** - Fixed scrollbar styling and behavior
- **Auto-scroll** - Improved auto-scroll behavior when selecting fields

##### Deprecated
- Old black/gray color scheme (`border-black/40`, `border-black/10`) replaced with semantic gray values

#### @mieweb/forms-editor v1.0.0

##### Added
- **Code Editor Mode** - Monaco-powered YAML/JSON editor with syntax highlighting and validation
  - Toggle between visual and code editing modes
  - Real-time validation for YAML and JSON syntax
  - Auto-formatting and error detection
- **Redesigned Mobile Controls** - Streamlined mobile editing experience
  - Bottom sheet controls for better touch interactions
  - Responsive header with collapsible navigation
  - Improved mobile toolbar layout

##### Changed
- All field components now inherit the blue theme from forms-engine
- Edit panel redesigned with modern blue design system and improved layout
- Logic panel updated with blue theme and better UX
- Tool panel enhanced with consistent blue theme styling
- Field selection now works consistently across all interaction points
- Header component redesigned with better mobile responsiveness
- Desktop layout optimized with better panel management

##### Fixed
- Hot-reload issues with Vite configuration
- CSS order violations preventing proper styling
- Constraint width issues in EditPanel and Logic panels
- Height calculation problems in responsive layouts
- Overlapping UI elements in various panels
- Boolean field UI inconsistencies

#### @mieweb/forms-renderer v1.0.0

##### Changed
- All rendered field components now use the blue theme
- Preview mode selections now have clear blue highlights
- Better hover states and focus management for accessibility
- QuestionnaireRenderer component updated with improved styling
- FieldNode component enhanced with better rendering logic
- RendererBody component improved with blue theme integration

---

#### Demo Applications

##### Added
- **Complete Demo Redesign** - Brand new landing page and demo structure
  - Landing page with package showcase and resources
  - Separate editor and renderer demo views
  - Example dropdown with pre-loaded forms
  - Back button navigation between views
  - Menu dropdown for additional options
  - Hide unsupported fields toggle
  - Reusable demo card components
- **Routing Support** - Added routing for better navigation between demos
- **Icon Assets** - New icon components for consistent branding

##### Changed
- Demo package structure completely reorganized with components directory
- Vite configuration updated for improved build process
- Main.jsx redesigned to support new routing and component structure
