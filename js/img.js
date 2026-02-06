const button = document.querySelector('button');
const box = document.querySelector('.box');

button.addEventListener('click', () => {
  if (box.classList.contains('show')) {
    box.classList.remove('show');
    button.textContent = 'show';
  } else {
    box.classList.add('show');
    button.textContent = 'hide';
  }
});