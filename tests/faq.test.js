/**
 * @jest-environment jsdom
 */

const { toggleFaq, initFaq } = require('../src/faq');

function createFaqDOM() {
  document.body.innerHTML = `
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q">
          <span>Question 1</span>
          <div class="faq-arrow">&#x25BE;</div>
        </button>
        <div class="faq-a">Answer 1</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">
          <span>Question 2</span>
          <div class="faq-arrow">&#x25BE;</div>
        </button>
        <div class="faq-a">Answer 2</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">
          <span>Question 3</span>
          <div class="faq-arrow">&#x25BE;</div>
        </button>
        <div class="faq-a">Answer 3</div>
      </div>
    </div>
  `;
}

describe('FAQ Module', () => {
  beforeEach(() => {
    createFaqDOM();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('toggleFaq', () => {
    test('opens a closed FAQ item when clicked', () => {
      const btn = document.querySelectorAll('.faq-q')[0];
      const item = btn.closest('.faq-item');

      expect(item.classList.contains('open')).toBe(false);
      toggleFaq(btn);
      expect(item.classList.contains('open')).toBe(true);
    });

    test('closes an open FAQ item when clicked again', () => {
      const btn = document.querySelectorAll('.faq-q')[0];
      const item = btn.closest('.faq-item');

      // Open it
      toggleFaq(btn);
      expect(item.classList.contains('open')).toBe(true);

      // Close it
      toggleFaq(btn);
      expect(item.classList.contains('open')).toBe(false);
    });

    test('closes other open items when a new one is opened (accordion)', () => {
      const buttons = document.querySelectorAll('.faq-q');
      const item1 = buttons[0].closest('.faq-item');
      const item2 = buttons[1].closest('.faq-item');

      // Open first item
      toggleFaq(buttons[0]);
      expect(item1.classList.contains('open')).toBe(true);
      expect(item2.classList.contains('open')).toBe(false);

      // Open second item - first should close
      toggleFaq(buttons[1]);
      expect(item1.classList.contains('open')).toBe(false);
      expect(item2.classList.contains('open')).toBe(true);
    });

    test('only one item is open at a time', () => {
      const buttons = document.querySelectorAll('.faq-q');

      toggleFaq(buttons[0]);
      toggleFaq(buttons[1]);
      toggleFaq(buttons[2]);

      const openItems = document.querySelectorAll('.faq-item.open');
      expect(openItems.length).toBe(1);
    });

    test('handles null button gracefully', () => {
      expect(() => toggleFaq(null)).not.toThrow();
    });

    test('handles button without parent .faq-item gracefully', () => {
      document.body.innerHTML = '<button class="faq-q">Orphan</button>';
      const btn = document.querySelector('.faq-q');
      expect(() => toggleFaq(btn)).not.toThrow();
    });

    test('all items are closed when last open item is toggled off', () => {
      const btn = document.querySelectorAll('.faq-q')[0];

      toggleFaq(btn);
      toggleFaq(btn);

      const openItems = document.querySelectorAll('.faq-item.open');
      expect(openItems.length).toBe(0);
    });
  });

  describe('initFaq', () => {
    test('attaches click handlers to all FAQ buttons', () => {
      initFaq();

      const buttons = document.querySelectorAll('.faq-q');
      const item = buttons[0].closest('.faq-item');

      // Simulate click
      buttons[0].click();
      expect(item.classList.contains('open')).toBe(true);
    });

    test('accordion behavior works via click events after init', () => {
      initFaq();

      const buttons = document.querySelectorAll('.faq-q');
      const item1 = buttons[0].closest('.faq-item');
      const item2 = buttons[1].closest('.faq-item');

      buttons[0].click();
      expect(item1.classList.contains('open')).toBe(true);

      buttons[1].click();
      expect(item1.classList.contains('open')).toBe(false);
      expect(item2.classList.contains('open')).toBe(true);
    });

    test('does not throw when no FAQ buttons exist', () => {
      document.body.innerHTML = '<div></div>';
      expect(() => initFaq()).not.toThrow();
    });
  });
});
