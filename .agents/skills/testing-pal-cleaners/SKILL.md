---
name: testing-pal-cleaners-site
description: Test the Pal Cleaners & Janitors static website end-to-end. Use when verifying FAQ accordion, contact form validation, or JavaScript module changes.
---

# Testing: Pal Cleaners & Janitors Website

## Overview

This is a static HTML/CSS/JS website (single `index.html`). No backend required. JavaScript is inline in `<script>` tags at the bottom of the file.

## Running Locally

```bash
cd /home/ubuntu/repos/newproject1
python3 -m http.server 8080
# Open http://localhost:8080 in browser
```

## Running Unit Tests

```bash
npm install  # First time only
npm test     # Runs Jest with coverage report
```

Expected: 61 tests across 3 suites, ~97% statement coverage.

## Key Testable Features

### FAQ Accordion
- Located in the "FAQ" section (scroll down ~60% of page)
- Each question is a `<button class="faq-q">` with `onclick="toggleFaq(this)"`
- Clicking opens the answer (`.faq-item` gains class `open`)
- Only one answer visible at a time (accordion behavior)
- Clicking an already-open item closes it

### Contact Form
- Located in the "Get In Touch" section (bottom of page)
- Form has `id="contact-form"` with fields: first_name, last_name, phone, email, service_type, message
- Client-side validation runs on submit (no backend)
- Error messages appear in `#form-status` div (red background)
- Success message appears after valid submission (green background) + form resets

## Known Pitfalls

- **Double-fire bug**: If `src/faq.js` is loaded via `<script src="...">` AND buttons have inline `onclick`, `toggleFaq` fires twice per click (open then immediately close). The module should only be loaded by Jest, not the browser. If FAQ clicks appear to do nothing, check for this.
- **Click coordinates**: FAQ buttons shift position when items expand. After opening Q1, Q2's y-coordinate is lower than initial. Use the button text/element directly rather than fixed coordinates.
- **Service type dropdown**: Programmatic selection via JS (`document.querySelector('[name="service_type"]').value = 'weekly'`) is more reliable than trying to click dropdown options.

## Architecture

- `index.html` — Full website with inline JS for browser runtime
- `src/faq.js` — Testable module version of FAQ logic (Jest only, uses `module.exports`)
- `src/formValidation.js` — Testable form validation functions (Jest only)
- `src/navigation.js` — Testable navigation utilities (Jest only)
- `tests/*.test.js` — Jest test suites

The `src/` modules mirror the inline JS but are structured for Node.js/Jest testing with `module.exports`. They are NOT loaded by the browser.

## Devin Secrets Needed

None — this is a static site with no authentication or API keys required.
