/* global UserForm */

const { test, todo } = QUnit;

QUnit.module('UserForm', () => {
  test('it requires an element', (assert) => {
    assert.throws(() => new UserForm());
  });

  QUnit.module('.render()', () => {
    test('it renders form rows in the given element', (assert) => {
      const element = document.getElementById('qunit-fixture');
      const userForm = new UserForm(element);

      userForm.render([
        { name: 'John Doe', email: 'john.doe@idf.com' }
      ]);

      assert.strictEqual(document.getElementsByName('username')[0].value, 'John Doe', 'has an input with user name');
      assert.strictEqual(document.getElementsByName('email')[0].value, 'john.doe@idf.com', 'has an email input');
      assert.strictEqual(document.getElementsByClassName('icon__bin').length, 1, 'has a bin icon');
    });

    todo('it stores user input when inputs are blurred', () => {

    });
  });

  QUnit.module('.addRow()', () => {
    test('it appends a user row to the form', assert => {
      const element = document.getElementById('qunit-fixture');
      const userForm = new UserForm(element);
      userForm.render([
        { name: 'John Doe', email: 'john.doe@idf.com' }
      ]);

      userForm.addRow({ name: 'Johanna Doe', email: 'johanna.doe@idf.com' });

      assert.strictEqual(document.getElementsByName('username')[1].value, 'Johanna Doe', 'appends an input with user name');
      assert.strictEqual(document.getElementsByName('email')[1].value, 'johanna.doe@idf.com', 'appends an input with user email');
      assert.strictEqual(document.getElementsByClassName('icon__bin').length, 2, 'appends a bin icon');
    });
  });

  QUnit.module('.removeRow()', () => {
    test('it removes the user\'s row from the form', assert => {
      const element = document.getElementById('qunit-fixture');
      const userForm = new UserForm(element);
      const userJohn = { name: 'John Doe', email: 'john.doe@idf.com' };
      userForm.render([ userJohn ]);

      userForm.removeRow(userJohn);

      assert.strictEqual(document.getElementsByName('username').length, 0, 'removes the user name input');
      assert.strictEqual(document.getElementsByName('email').length, 0, 'removes the user email input');
      assert.strictEqual(document.getElementsByClassName('icon__bin').length, 0, 'removes the bin icon');
    });

    test('it does NOT remove other users', assert => {
      const element = document.getElementById('qunit-fixture');
      const userForm = new UserForm(element);
      const userJohn = { name: 'John Doe', email: 'john.doe@idf.com' };
      const userJohanna = { name: 'Johanna Doe', email: 'johanna.doe@idf.com' };
      userForm.render([ userJohn, userJohanna ]);

      userForm.removeRow(userJohn);

      assert.strictEqual(document.getElementsByName('username')[0].value, 'Johanna Doe', 'keeps the correct user name input');
      assert.strictEqual(document.getElementsByName('email')[0].value, 'johanna.doe@idf.com', 'keeps the correct user email input');
      assert.strictEqual(document.getElementsByClassName('icon__bin').length, 1, 'keeps the bin icon');
    });

    test('it does NOT remove any row when the user is not in the form', assert => {
      const element = document.getElementById('qunit-fixture');
      const userForm = new UserForm(element);
      const userJohn = { name: 'John Doe', email: 'john.doe@idf.com' };
      const userJohanna = { name: 'Johanna Doe', email: 'johanna.doe@idf.com' };
      userForm.render([ userJohn ]);

      userForm.removeRow(userJohanna);

      assert.strictEqual(document.getElementsByName('username')[0].value, 'John Doe', 'keeps the correct user name input');
      assert.strictEqual(document.getElementsByName('email')[0].value, 'john.doe@idf.com', 'keeps the correct user email input');
      assert.strictEqual(document.getElementsByClassName('icon__bin').length, 1, 'keeps the bin icon');
    });
  });
});