/* global Bin */
/* exported UserForm */

class UserForm {
  constructor(element, userStore) {
    if (!element) {
      throw new Error('UserForm: element required');
    }

    userStore.onAdd(user => addRow(user));
    userStore.onRemove(userId => removeRow(userId));
    userStore.onSet(() => render());

    render();

    function render() {
      const rows = [];

      // TODO:
      // On input blur, save value to store
      userStore.users.forEach((user) => rows.push(getRowTemplate(user)));

      element.innerHTML = rows.join('').trim();

      const fromRows = [...element.getElementsByClassName('userForm__row')];
      fromRows.forEach(initBin);
    }

    function addRow(user) {
      const rowTemplate = getRowTemplate(user);

      element.insertAdjacentHTML('beforeend', rowTemplate);

      const rowElements = element.getElementsByClassName('userForm__row');
      const lastRowElement = rowElements[rowElements.length-1];
      initBin(lastRowElement);
    }

    function removeRow(rowId) {
      const formRows = [...element.getElementsByClassName('userForm__row')];
      const rowToRemove = formRows.find(formRow => formRow.getAttribute('data-id') === rowId);

      if (rowToRemove) {
        element.removeChild(rowToRemove);
      }
    }

    function getRowTemplate(user) {
      return `
        <div class='userForm__row' data-id='${user.id}'>
          <input class='userForm__input' name='username' value='${user.name}'></input>
          <input class='userForm__input' name='email' type='email' value='${user.email}'></input>
          <span class='userForm__bin'></span>
        </div>
      `;
    }

    function initBin(formRow) {
      const binElement = formRow.querySelector('.userForm__bin');
      const bin = new Bin(binElement);

      bin.onClick(() => {
        const rowId = formRow.getAttribute('data-id');
        removeRow(rowId);
      });
    }
  }
}
