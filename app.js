/*global stepper*/

const app = (function () {
  'use strict';

  const stepperElement = document.getElementById('stepper');

  function render() {
    stepper.render(stepperElement, [
      { text: 'Step 1', isActive: true },
      { text: 'Step 2'},
      { text: 'Step 3'},
    ]);
  }

  return { render };
})();