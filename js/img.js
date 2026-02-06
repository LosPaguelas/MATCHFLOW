const button = document.querySelector('button');
const box = document.querySelector('.box');

button.addEventListener('click', () => {
  if (box.classList.contains('show')) {
    box.classList.remove('show');
    button.textContent = 'Para candidatos';
  } else {
    box.classList.add('show');
    button.textContent = 'Para candidatos';
  }
});