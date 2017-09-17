/* global stepper, text, UserStore, UserForm */
/* exported app */

const app = (function () {
  'use strict';

  const stepperElement = document.getElementById('stepper');
  const addColleagueCounter = document.getElementById('add-collegue-counter');
  const currentColleageCounter = document.getElementById('current-colleague-counter');

  const newColleagues = new UserStore('newColleagues');
  const newColleaguesForm = new UserForm(document.getElementById('newColleaguesForm'), newColleagues);

  if (!newColleagues.users.length) {
    newColleagues.addAnonymous();
  }

  const addColleageElement = document.getElementById('addColleague');
  addColleageElement.addEventListener('click', () => newColleagues.addAnonymous());
  addColleageElement.addEventListener('onKeyUp', (event) => {
    const spaceBarKeyCode = 32;

    if (event.keyCode === spaceBarKeyCode) {
      newColleagues.addAnonymous();
    }
  });

  function render() {
    stepper.render(stepperElement, [
      { text: 'Step 1', isActive: true },
      { text: 'Step 2'},
      { text: 'Step 3'},
    ]);

    text.render(addColleagueCounter, 10);
    text.render(currentColleageCounter, 0);
  }

  return { render };
})();