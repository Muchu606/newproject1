/**
 * Navigation Module
 * Handles smooth scrolling, active link highlighting, and mobile nav.
 */

/**
 * Returns the section IDs defined in the navigation links.
 * @param {Document} doc - The document object.
 * @returns {string[]} Array of section href targets (e.g., ['#home', '#About']).
 */
function getNavLinks(doc) {
  if (!doc) return [];
  const links = doc.querySelectorAll('.nav-links a');
  return Array.from(links).map(a => a.getAttribute('href')).filter(Boolean);
}

/**
 * Checks whether a given href target corresponds to a valid section in the document.
 * @param {Document} doc - The document object.
 * @param {string} href - The href value (e.g., '#home').
 * @returns {boolean} True if the target section element exists.
 */
function isSectionValid(doc, href) {
  if (!doc || !href || typeof href !== 'string') return false;
  if (!href.startsWith('#')) return false;
  const id = href.substring(1);
  return doc.getElementById(id) !== null;
}

/**
 * Gets the currently active navigation link based on scroll position.
 * @param {Document} doc - The document object.
 * @param {number} scrollY - The current vertical scroll position.
 * @returns {string|null} The href of the active section, or null.
 */
function getActiveSection(doc, scrollY) {
  if (!doc || typeof scrollY !== 'number') return null;

  const navLinks = getNavLinks(doc);
  let activeSection = null;

  for (const href of navLinks) {
    const id = href.substring(1);
    const section = doc.getElementById(id);
    if (!section) continue;

    const offsetTop = section.offsetTop || 0;
    const offsetHeight = section.offsetHeight || 0;

    if (scrollY >= offsetTop - 100 && scrollY < offsetTop + offsetHeight - 100) {
      activeSection = href;
    }
  }

  return activeSection;
}

/**
 * Validates the navigation structure for accessibility.
 * Checks that all nav links have valid targets and text content.
 * @param {Document} doc - The document object.
 * @returns {object} { valid: boolean, issues: string[] }
 */
function validateNavigation(doc) {
  const issues = [];

  if (!doc) {
    return { valid: false, issues: ['Document is required'] };
  }

  const links = doc.querySelectorAll('.nav-links a');
  if (links.length === 0) {
    issues.push('No navigation links found');
    return { valid: false, issues };
  }

  links.forEach((link, index) => {
    const href = link.getAttribute('href');
    const text = link.textContent.trim();

    if (!href) {
      issues.push(`Link ${index + 1} is missing href attribute`);
    } else if (!href.startsWith('#')) {
      issues.push(`Link ${index + 1} href "${href}" is not an anchor link`);
    } else if (!isSectionValid(doc, href)) {
      issues.push(`Link ${index + 1} target "${href}" does not exist in the document`);
    }

    if (!text) {
      issues.push(`Link ${index + 1} has no text content`);
    }
  });

  return {
    valid: issues.length === 0,
    issues
  };
}

module.exports = { getNavLinks, isSectionValid, getActiveSection, validateNavigation };
