/* global stepper, text, UserStore, UserForm */
/* exported app */

const app = (function () {
  'use strict';

  const stepperElement = document.getElementById('stepper');
  const addColleagueCounter = document.getElementById('add-collegue-counter');
  const currentColleageCounter = document.getElementById('current-colleague-counter');

  const newColleagues = new UserStore('newColleagues');
  const newColleaguesForm = new UserForm(document.getElementById('newColleaguesForm'));

  if (!newColleagues.users.length) {
    newColleagues.addAnonymous();
  }

  newColleagues.onAdd(user => newColleaguesForm.addRow(user));
  newColleagues.onRemove(userId => newColleaguesForm.removeRow(userId));
  newColleagues.onSet((users) => newColleaguesForm.render(users));

  function render() {
    stepper.render(stepperElement, [
      { text: 'Step 1', isActive: true },
      { text: 'Step 2'},
      { text: 'Step 3'},
    ]);

    text.render(addColleagueCounter, 10);
    text.render(currentColleageCounter, 0);

    newColleaguesForm.render(newColleagues.users);
  }

  return { render };
})();