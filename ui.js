const menu = document.getElementById('menu');
const openButton = document.getElementById('menu-open');
const closeButton = document.getElementById('menu-close');
const backdrop = document.getElementById('menu-backdrop');
const menuLinks = menu.querySelectorAll('.menu__link');

function setMenu(open) {
  menu.classList.toggle('is-open', open);
  menu.setAttribute('aria-hidden', String(!open));
  openButton.setAttribute('aria-expanded', String(open));

  if (open) {
    closeButton.focus({ preventScroll: true });
  } else {
    openButton.focus({ preventScroll: true });
  }
}

openButton.addEventListener('click', () => setMenu(true));
closeButton.addEventListener('click', () => setMenu(false));
backdrop.addEventListener('click', () => setMenu(false));
menuLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.classList.contains('is-open')) {
    setMenu(false);
  }
});
