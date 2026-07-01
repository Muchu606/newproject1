/**
 * FAQ Accordion Module
 * Handles the toggle behavior for FAQ items.
 */

/**
 * Toggles the open/closed state of an FAQ item.
 * Closes all other open items (accordion behavior).
 * @param {HTMLElement} btn - The FAQ question button that was clicked.
 */
function toggleFaq(btn) {
  if (!btn) return;

  const item = btn.closest('.faq-item');
  if (!item) return;

  const isOpen = item.classList.contains('open');

  // Close all FAQ items
  const allItems = document.querySelectorAll('.faq-item');
  allItems.forEach(i => i.classList.remove('open'));

  // If it wasn't open, open it
  if (!isOpen) {
    item.classList.add('open');
  }
}

/**
 * Initializes FAQ accordion event listeners.
 * Attaches click handlers to all .faq-q buttons.
 */
function initFaq() {
  const buttons = document.querySelectorAll('.faq-q');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => toggleFaq(btn));
  });
}

module.exports = { toggleFaq, initFaq };
