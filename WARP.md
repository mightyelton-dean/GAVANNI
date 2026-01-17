# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

This repository is a static, single-page marketing site for Nigerian-born afro-pop artist **Gavanni**. It is built with plain HTML, CSS, and JavaScript and is designed to be deployed as static assets only (no backend).

Key characteristics from `README.md`:
- One-page layout with sections for hero, about, music, videos, tour dates, contact, and a merch store.
- Custom interactive music player, animated statistics, form validation, and notification toasts.
- Heavy use of animations and visual polish (AOS, GSAP, particles.js, GLightbox, VanillaTilt, Font Awesome, Google Fonts).

There is **no build step, package manager, or automated test setup**. Development is done directly against the static files.

## Running and developing locally

### Quick preview
- The simplest way to preview is to open `index.html` directly in a browser.
  - On Windows/PowerShell from the repo root: `start index.html`

Be aware that some browser security policies may block certain JS features when loaded via `file://` (instead of `http://`). If animations or assets misbehave, use a simple static HTTP server instead.

### Serve via a local HTTP server
Run one of these from the repository root, then open `http://localhost:8000` (or the indicated port) in a browser:
- With Python installed:
  - `python -m http.server 8000`
- With Node.js installed:
  - `npx serve .`

### Build, lint, and tests
- **Build:** There is no build pipeline; `index.html`, `styles.css`, and `script.js` are the deployable artifacts.
- **Linting/formatting:** No linters or formatters are configured in the repo. If needed, you may introduce standard tools (e.g., HTML/CSS/JS linters or a formatter) but they will need to be wired up from scratch.
- **Tests:** There is no test harness or test files. Any tests or automation you add will be net-new.

## Code structure and architecture

### Top-level files
- `index.html` — main page markup and section structure.
- `styles.css` — theme, layout, animations, and responsive behavior.
- `script.js` — all interactive behavior and integration with third-party libraries.
- Assets are referenced from:
  - `New folder/` — local images for hero/about/music artwork.
  - `/music/` — MP3 audio files for the demo player (paths are absolute from the web root).

### HTML architecture (`index.html`)

The page is structured as a single scrollable document with anchored navigation:
- Global UI elements:
  - **Preloader** (`#preloader`) — full-screen loading animation shown before content.
  - **Custom cursor** (`#cursor`, `#cursor-follower`).
  - **Scroll progress bar** (`#scroll-progress`) at the top of the viewport.
  - **Back-to-top button** (`#back-to-top`).
- **Navigation bar** (`<nav id="navbar">`):
  - Brand logo text ("GAVANNI").
  - Desktop menu (`#nav-menu`) with anchor links to sections `#home`, `#about`, `#music`, `#videos`, `#tour`, `#contact`.
  - Mobile hamburger toggle (`#nav-toggle`).
- **Hero section** (`#home.hero`):
  - Background image defined inline via `style="background-image: ..."`.
  - Overlay layer `.hero-overlay` and `#particles-js` container for particles.js.
  - Main hero text (`.hero-title`, `.hero-subtitle`, `.hero-description`), a hero image wrapper, and CTA buttons linking to `#music` and `#about`.
  - Scroll indicator (`.scroll-indicator`) that smoothly scrolls to `#about`.
- **About section** (`#about.about`):
  - Image slideshow wrapper with three layered `.main-image` elements and a play icon overlay.
  - Text content describing Gavanni, plus animated statistics (`.stats` with `.stat-number` spans) and social links.
- **Music section** (`#music.music`):
  - **Current track player** (`.music-player`):
    - Circular artwork container `.track-artwork` with `#current-artwork` image.
    - Main play button `#main-play-btn` containing `#play-icon`.
    - Hidden `<audio id="audio-player">` element with a sample MP3 source.
    - Progress UI: `.progress-bar` containing `.progress-fill`, with `#current-time` and `#total-time` labels.
  - **Track grid** (`.music-grid`): four `.track-card` entries, each with artwork and metadata. Some include their own `<audio class="track-audio">` elements and `data-duration` attributes.
  - **Streaming platforms** section listing Spotify, Apple Music, YouTube, and SoundCloud via `.platform-link` elements.
- **Videos section** (`#videos.videos`):
  - Cards (`.video-card`) with thumbnail images and `.video-play-btn` links wired for GLightbox/lightbox behavior.
- **Tour section** (`#tour.tour`):
  - A vertical list of `.tour-date-card` entries each containing date, venue/time info, and action buttons (`.btn-outline` or `.btn-disabled`).
- **Contact section** (`#contact.contact`):
  - Left column with contact categories and social links.
  - Right column with `#contact-form` containing `.form-group` inputs, a `<select>` for subject, and a message `<textarea>`.
- **Store section** (`#store.store`):
  - `.merch-grid` of `.merch-card` entries with merch images and "Buy Now" buttons.
- **Footer** (`.footer`):
  - Four columns (about text, quick links, music platforms, newsletter + social icons).
  - Newsletter form `.newsletter` with an email input and subscribe button.

Each section relies heavily on specific class names and IDs; JavaScript selectors in `script.js` assume this structure. If you rename or restructure elements, update the corresponding selectors.

### Styling architecture (`styles.css`)

`styles.css` acts as both a design system and layout sheet:
- **Design tokens & typography**
  - CSS custom properties defined in `:root` for colors, font families, and transition speed.
  - Typographic scale and weights specified for `h1`–`h4` and `p` for a consistent visual hierarchy.
- **Global layout & utilities**
  - Reset-like rules for `*` and base `body` typography.
  - `.container` sets a max width and horizontal padding.
  - Shared section header styles via `.section-header`, `.section-title`, `.section-divider`.
- **Component-level styling**
  - Preloader, custom cursor, scroll progress bar, back-to-top button.
  - Navigation bar with glassmorphism; mobile nav uses `.nav-menu.active` and `.nav-toggle.active`.
  - Hero section background, overlay, hero text, and scroll indicator animation.
  - About section layout, image slideshow (`.main-image.active`), stats display, and social links.
  - Music player box, rotating artwork (`.track-artwork.playing`), track cards, and streaming platform pills.
  - Video cards, overlays, badges, and info blocks.
  - Tour date cards with hover transitions, sold-out variants, and CTA button styles.
  - Contact layout, form fields (including floating labels), and social connect styling.
  - Store/merch cards (`.merch-card`, `.merch-image`, `.merch-info`, `.merch-price`).
  - Footer grid, newsletter form, and social icons.
- **Animations & effects**
  - Keyframes such as `spinVinyl`, `glowPulse`, `shimmer`, `bounce`, `heroFadeIn`, and `aboutFadeIn`.
  - Many components are styled for integration with external JS libraries (AOS, GSAP, VanillaTilt).
- **Responsive behavior**
  - Media queries at ~992px, 768px, 576px, 900px, and 600px adjust typography, layout (e.g., stack columns), nav behavior, and hero/about image sizes.

When adding new sections or components, reuse existing tokens (colors, fonts, transitions) and patterns (e.g., `.section-header`, `.btn`, `.container`) to maintain visual consistency.

### JavaScript architecture (`script.js`)

All interactive behavior is contained in a single script file; it is organized into logical blocks rather than modules.

#### 3rd-party libraries & initialization

`index.html` pulls several libraries from CDNs before `script.js` is loaded:
- AOS (`AOS` global)
- particles.js (`particlesJS` global)
- GLightbox (`GLightbox` global)
- GSAP + ScrollTrigger (`gsap`, `ScrollTrigger` globals)
- VanillaTilt (`VanillaTilt` global)

`script.js` checks for the existence of these globals (`typeof ... !== 'undefined'`) before configuring them, so the page will degrade gracefully if a CDN fails.

Key initialization points:
- `window.addEventListener('load', ...)` hides the preloader after a delay.
- `document.addEventListener('DOMContentLoaded', ...)` calls a series of setup functions:
  - `setupLazyLoading()` and `optimizeImages()` for image loading.
  - `setupFormLabels()` and `setupNewsletter()` for form UX.
  - `setupParallax()` and `setupLoadingAnimation()` for additional visual polish.
  - `setupStatsCounter()` and `setupImageSlideshow()` for scroll-based counters and about-section slideshow.
  - `updateCurrentTrack(0)` to seed the music player state.

#### Global state and DOM references

The music player maintains simple state:
- `tracks` — array of track metadata (title, artist, artwork path, duration in seconds).
- `currentTrackIndex`, `isPlaying`, and `progressInterval` control which track is active and whether the simulated progress animation is running.

DOM elements are queried once and reused:
- Navigation: `navbar`, `navToggle`, `navMenu`, `navLinks`, `heroScrollIndicator`.
- Music player: `mainPlayBtn`, `playIcon`, `audioPlayer`, `currentArtwork`, `currentTitle`, `currentArtist`, `currentTime`, `totalTime`, `progressBar`, `progressFill`, `trackPlayBtns`.
- Video buttons: `videoPlayBtns`.
- Forms: `contactForm`.
- Global UI: `scrollProgress`, `backToTop`, custom cursor elements.

When modifying HTML IDs/classes, keep these selectors in sync or wrapped with null checks.

#### Navigation, scrolling, and layout behavior
- Navbar scroll effect toggles `.scrolled` on `#navbar` after scrolling past a threshold.
- Mobile menu toggle adds/removes `.active` on `#nav-menu` and `#nav-toggle` and manipulates `document.body.style.overflow` to prevent background scroll.
- Anchor navigation intercepts clicks on `.nav-link` and scrolls smoothly to the target section, offsetting for the fixed navbar height.
- Hero scroll indicator scrolls to the about section.
- Back-to-top button appears after scrolling down and scrolls the page back to top smoothly.
- A separate parallax effect (`setupParallax`) adjusts `.hero` transform based on scroll position.

#### Music player behavior
The music player is intentionally demo-like and not a full audio engine:
- `updateCurrentTrack(trackIndex)` updates artwork, title/artist text, total time label, and the visual state of buttons in `.track-card` elements.
- `togglePlayPause()` flips `isPlaying`, updates the main `#play-icon`, toggles `.playing` on `.track-artwork`, and starts/stops a simulated progress animation.
- `startProgressAnimation()` increments a virtual current time every second and:
  - Updates `.progress-fill` width.
  - Updates `#current-time` text.
  - On reaching the track duration, auto-advances to the next track (if any) after a brief delay.
- `progressBar` click handler allows seeking within the simulated track timeline by computing click position as a percentage.
- Each `.track-play-btn` either toggles pause for the current track or switches to a new track, updating state and restarting the animation.

Note: The `<audio>` element is only used for the main track’s real playback in one code path, while the progress bar in the later block is simulated and not tightly coupled to `audio.currentTime`. If you refactor to use real audio for all tracks, centralize time/progress handling around the `<audio>` element.

#### Forms, notifications, and UX helpers
- **Contact form (`#contact-form`):**
  - On submit, gathers values, performs basic validation, uses `isValidEmail()` regex, and shows success or error notifications via `showNotification(...)`.
  - Resets the form and manually resets label styles after a short delay.
- **Floating labels:** `setupFormLabels()` and `animateLabel()` add/remove inline styles on `<label>`s based on focus and content.
- **Newsletter (`.newsletter`):** `setupNewsletter()` intercepts the subscribe button, validates the email, and shows a notification without reloading the page.
- **Notification system:** `showNotification(message, type)` creates a toast element, slides it in/out with inline styles and timeouts, and automatically removes any previous notification.

#### Visual effects & metrics
- **Stats counter:** `setupStatsCounter()` uses `IntersectionObserver` to detect when `.stat-number` elements enter view, then `animateCounter()` animates from zero up to the final number while preserving suffixes like `+`.
- **Image slideshow:** `setupImageSlideshow()` cycles the `.main-image` elements in the about section by toggling `.active` every 2 seconds.
- **Lazy loading:** `setupLazyLoading()` observes `img[data-src]` elements and swaps `data-src` into `src` when they enter the viewport; `optimizeImages()` ensures all images have `loading="lazy"` unless explicitly disabled.
- **Social/platform/ticket handlers:** Global click listeners on `.social-link`, `.platform-link`, and `.btn-outline` show context-sensitive notifications ("Opening Spotify...", "Redirecting to ticket purchase...") rather than performing real navigation. Links for real navigation are left commented out.

When extending behavior, consider grouping related logic into new functions within `script.js` to keep the structure readable and to avoid scattering `addEventListener` calls across the file.
