/**
 * @jest-environment jsdom
 */

const { getNavLinks, isSectionValid, getActiveSection, validateNavigation } = require('../src/navigation');

function createPageDOM() {
  document.body.innerHTML = `
    <nav>
      <ul class="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#About">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#Contact">Contact</a></li>
      </ul>
    </nav>
    <section id="home" style="height: 600px;"></section>
    <section id="About" style="height: 600px;"></section>
    <section id="services" style="height: 600px;"></section>
    <section id="Contact" style="height: 600px;"></section>
  `;
}

describe('Navigation Module', () => {
  beforeEach(() => {
    createPageDOM();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('getNavLinks', () => {
    test('returns all navigation link hrefs', () => {
      const links = getNavLinks(document);
      expect(links).toEqual(['#home', '#About', '#services', '#Contact']);
    });

    test('returns empty array when no nav links exist', () => {
      document.body.innerHTML = '<div></div>';
      const links = getNavLinks(document);
      expect(links).toEqual([]);
    });

    test('returns empty array for null document', () => {
      const links = getNavLinks(null);
      expect(links).toEqual([]);
    });

    test('filters out links without href', () => {
      document.body.innerHTML = `
        <ul class="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a>No Href</a></li>
        </ul>
      `;
      const links = getNavLinks(document);
      expect(links).toEqual(['#home']);
    });
  });

  describe('isSectionValid', () => {
    test('returns true for existing sections', () => {
      expect(isSectionValid(document, '#home')).toBe(true);
      expect(isSectionValid(document, '#About')).toBe(true);
      expect(isSectionValid(document, '#services')).toBe(true);
      expect(isSectionValid(document, '#Contact')).toBe(true);
    });

    test('returns false for non-existing sections', () => {
      expect(isSectionValid(document, '#nonexistent')).toBe(false);
      expect(isSectionValid(document, '#pricing')).toBe(false);
    });

    test('returns false for invalid href formats', () => {
      expect(isSectionValid(document, '')).toBe(false);
      expect(isSectionValid(document, 'nohash')).toBe(false);
      expect(isSectionValid(document, null)).toBe(false);
      expect(isSectionValid(document, undefined)).toBe(false);
    });

    test('returns false for null document', () => {
      expect(isSectionValid(null, '#home')).toBe(false);
    });

    test('returns false for non-string href', () => {
      expect(isSectionValid(document, 123)).toBe(false);
      expect(isSectionValid(document, {})).toBe(false);
    });
  });

  describe('getActiveSection', () => {
    test('returns null for null document', () => {
      expect(getActiveSection(null, 0)).toBeNull();
    });

    test('returns null for non-numeric scrollY', () => {
      expect(getActiveSection(document, 'abc')).toBeNull();
      expect(getActiveSection(document, null)).toBeNull();
    });

    test('returns null when no sections match scroll position', () => {
      // jsdom doesn't compute offsetTop/offsetHeight, so they default to 0
      // With all sections at offset 0 and height 0, high scrollY won't match
      expect(getActiveSection(document, 99999)).toBeNull();
    });

    test('handles document with sections at position 0', () => {
      // In jsdom, offsetTop is 0 for all elements
      // scrollY 0 should be within the first section's range (0 - 100 to 0 + 0 - 100 = -100 to -100)
      // Since jsdom doesn't layout, this tests the logic path without real offsets
      const result = getActiveSection(document, 0);
      // With offsetTop=0 and offsetHeight=0: 0 >= 0-100 && 0 < 0+0-100 => 0 >= -100 && 0 < -100 => false
      expect(result).toBeNull();
    });
  });

  describe('validateNavigation', () => {
    test('returns valid for correct navigation structure', () => {
      const result = validateNavigation(document);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    test('reports missing target sections', () => {
      document.body.innerHTML = `
        <ul class="nav-links">
          <li><a href="#nonexistent">Missing</a></li>
        </ul>
      `;
      const result = validateNavigation(document);
      expect(result.valid).toBe(false);
      expect(result.issues[0]).toContain('does not exist');
    });

    test('reports links without href', () => {
      document.body.innerHTML = `
        <ul class="nav-links">
          <li><a>No Href</a></li>
        </ul>
      `;
      const result = validateNavigation(document);
      expect(result.valid).toBe(false);
      expect(result.issues[0]).toContain('missing href');
    });

    test('reports links without text content', () => {
      document.body.innerHTML = `
        <ul class="nav-links">
          <li><a href="#home"></a></li>
        </ul>
        <section id="home"></section>
      `;
      const result = validateNavigation(document);
      expect(result.valid).toBe(false);
      expect(result.issues[0]).toContain('no text content');
    });

    test('reports non-anchor links', () => {
      document.body.innerHTML = `
        <ul class="nav-links">
          <li><a href="https://external.com">External</a></li>
        </ul>
      `;
      const result = validateNavigation(document);
      expect(result.valid).toBe(false);
      expect(result.issues[0]).toContain('not an anchor link');
    });

    test('reports no navigation links found', () => {
      document.body.innerHTML = '<div></div>';
      const result = validateNavigation(document);
      expect(result.valid).toBe(false);
      expect(result.issues[0]).toContain('No navigation links found');
    });

    test('returns error for null document', () => {
      const result = validateNavigation(null);
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('Document is required');
    });
  });
});
