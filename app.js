/* global stepper, text, UserStore, UserForm */
/* exported app */

const app = (function () {
  'use strict';

  const stepperElement = document.getElementById('stepper');
  const addColleagueCounter = document.getElementById('add-collegue-counter');
  const currentColleageCounter = document.getElementById('current-colleague-counter');

  const newCollegues = new UserStore('newCollegues');
  const newColleaguesForm = new UserForm(document.getElementById('newColleaguesForm'));

  // TODO: Instead, run newColleagues.addAnynomous();
  newCollegues.add({name: 'John Doe', email: 'john.doe@idf.com'});

  newCollegues.onAdd(user => newColleaguesForm.addRow(user));
  newCollegues.onRemove(user => newColleaguesForm.removeRow(user));
  newCollegues.onSet((users) => newColleaguesForm.render(users));

  function render() {
    stepper.render(stepperElement, [
      { text: 'Step 1', isActive: true },
      { text: 'Step 2'},
      { text: 'Step 3'},
    ]);

    text.render(addColleagueCounter, 10);
    text.render(currentColleageCounter, 0);

    newColleaguesForm.render(newCollegues.users);
  }

  return { render };
})();