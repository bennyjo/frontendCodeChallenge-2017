/* exported UserForm */

class UserForm {
  constructor(element) {
    if (!element) {
      throw new Error('UserForm: element required');
    }

    this.element = element;
  }
  
  render(users) {
    const userForm = this;
    const rows = [];

    // TODO:
    // On input blur, save value to store
    users.forEach((user) => rows.push(userForm._getRowTemplate(user)));

    this.element.innerHTML = rows.join('').trim();
  }

  _getRowTemplate(user) {
    return `
      <div class='userForm__row' data-id='${user.id}'>
        <input class='userForm__input' name='username' value='${user.name}'></input>
        <input class='userForm__input' name='email' type='email' value='${user.email}'></input>
        <span class='userForm__bin'></span>
      </div>
    `;
  }

  addRow(user) {
    const userForm = this;
    const row = userForm._getRowTemplate(user);

    userForm.element.insertAdjacentHTML('beforeend', row);
  }

  removeRow(user) {
    const userForm = this;
    const formRows = [... userForm.element.getElementsByClassName('form__row')];
    const userRow = formRows.find(formRow => formRow.getAttribute('data-id') === user.id);

    if (userRow) {
      userForm.element.removeChild(userRow);
    }
  }
}
