/* global stepper, text, UserStore, UserForm */
/* exported app */

const app = (function () {
  'use strict';

  const stepperElement = document.getElementById('stepper');
  const addColleagueCounter = document.getElementById('add-collegue-counter');
  const currentColleageCounter = document.getElementById('current-colleague-counter');

  const newColleagues = new UserStore('newColleagues');
  new UserForm(document.getElementById('newColleaguesForm'), newColleagues);

  if (!newColleagues.users.length) {
    newColleagues.addAnonymous();
  }

  // TODO: Extract into a 'pseudoButton' component
  const addColleageElement = document.getElementById('addNewColleague');
  addColleageElement.addEventListener('click', () => newColleagues.addAnonymous());
  addColleageElement.addEventListener('onKeyUp', (event) => {
    const spaceBarKeyCode = 32;

    if (event.keyCode === spaceBarKeyCode) {
      newColleagues.addAnonymous();
    }
  });

  // TODO: Extract into a 'pseudoButton' component
  const resetFormElement = document.getElementById('resetNewColleaguesForm');
  resetFormElement.addEventListener('click', () => {
    newColleagues.empty();
    newColleagues.addAnonymous();
  });
  resetFormElement.addEventListener('onKeyUp', (event) => {
    const spaceBarKeyCode = 32;

    if (event.keyCode === spaceBarKeyCode) {
      newColleagues.empty();
      newColleagues.addAnonymous();
    }
  });

  // TODO: Extract into a 'button' component
  const addExistingColleaguesButton = document.getElementById('addExistingColleaguesButton');

  newColleagues.onAdd(renderAddButtonText);
  newColleagues.onRemove(renderAddButtonText);
  newColleagues.onEmpty(renderAddButtonText);

  function renderAddButtonText() {
    const newColleagesCount = newColleagues.users.length;

    if (newColleagesCount < 2) {
      addExistingColleaguesButton.innerHTML = 'Add a colleague';
    } else {
      addExistingColleaguesButton.innerHTML = `Add ${newColleagesCount} colleagues`;
    }
  }

  function render() {
    stepper.render(stepperElement, [
      { text: 'Step 1', isActive: true },
      { text: 'Step 2'},
      { text: 'Step 3'},
    ]);

    text.render(addColleagueCounter, 10);
    text.render(currentColleageCounter, 0);

    renderAddButtonText();
  }

  return { render };
})();