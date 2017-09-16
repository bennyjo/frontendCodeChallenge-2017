/* global UserStore */

const { test } = QUnit;
let withId;

// TODO, userId: .addAnonymous()
// In order to deal with the "Add another colleage" scenario

QUnit.module('UserStore', {
  afterEach: () => {
    localStorage.clear();
    sessionStorage.clear();
    withId = (obj, id) => {
      obj.id = id;
      return obj;
    };
  }
}, () => {
  test('it requires an id', (assert) => {
    assert.throws(() => new UserStore());
  });

  test('it defaults to the localStorage Web Storage API', (assert) => {
    const userStore = new UserStore('myUserStore');

    assert.strictEqual(userStore.webStore, localStorage);
  });

  test('it initialises using data stored in web storage', assert => {
    const userStoreId = 'myUserStore';
    const users = [{ name: 'John Doe', email: 'john.doe@idf.com' }];
    localStorage.setItem(userStoreId, JSON.stringify(users));

    const userStore = new UserStore(userStoreId, localStorage);

    assert.deepEqual(userStore.users, users);
  });

  QUnit.module('.add()', () => {
    test('it adds a user', assert => {
      const storeId = 'myUserStore';
      const userStore = new UserStore(storeId, localStorage);
      const user = { name: 'John Doe', email: 'john.doe@idf.org'};

      const userId = userStore.add(user);

      const usersInWebStore = JSON.parse(localStorage.getItem(storeId));
      assert.deepEqual(userStore.users[0], withId(user, userId), 'to the users property');
      assert.deepEqual(usersInWebStore[0], withId(user, userId), 'to web storage');
    });

    test('it makes sure the user is assigned an ID', assert => {
      const storeId = 'myUserStore';
      const userStore = new UserStore(storeId, localStorage);
      const userWithId = { id: 123, name: 'John Doe', email: 'john.doe@idf.org'};
      const userWithoutId = { name: 'Johanna Doe', email: 'johanna.doe@idf.org'};

      userStore.add(userWithId);
      userStore.add(userWithoutId);

      const usersInWebStore = JSON.parse(localStorage.getItem(storeId));
      assert.strictEqual(userStore.users[0].id, userWithId.id, 'user with initial ID, in the users property');
      assert.strictEqual(usersInWebStore[0].id, userWithId.id, 'user with initial ID, in web storage');
      assert.strictEqual(typeof userStore.users[1].id, 'string', 'user without initial ID, in web storage');
      assert.strictEqual(typeof usersInWebStore[1].id, 'string', 'user without initial ID, in web storage');
    });

    test('it returns the user\'s ID', assert => {
      const storeId = 'myUserStore';
      const userStore = new UserStore(storeId, localStorage);
      const user = { name: 'John Doe', email: 'john.doe@idf.org'};

      const userId = userStore.add(user);

      const usersInWebStore = JSON.parse(localStorage.getItem(storeId));
      assert.strictEqual(userId, userStore.users[0].id, 'that is present in the users property');
      assert.strictEqual(userId, usersInWebStore[0].id, 'that is present in the web storage');
    });

    test('it does not have unexpected side-effects', assert => {
      const storeId = 'myUserStore';
      const userStore = new UserStore(storeId, localStorage);
      const user = { name: 'John Doe', email: 'john.doe@idf.org'};

      userStore.add(user);

      assert.strictEqual(user.id, undefined, 'by adding an ID to the user');
    });

    test('it adds multiple users', assert => {
      const storeId = 'myUserStore';
      const userStore = new UserStore(storeId, localStorage);
      const user = { name: 'John Doe', email: 'john.doe@idf.org'};
      const user2 = { name: 'Johanna Doe', email: 'johanna.doe@idf.org'};

      userStore.add(user);
      userStore.add(user2);

      const usersInWebStore = JSON.parse(localStorage.getItem(storeId));
      assert.strictEqual(userStore.users.length, 2, 'to the users property');
      assert.strictEqual(usersInWebStore.length, 2, 'to web storage');
    });

    test('it triggers an add change', assert => {
      const userStore = new UserStore('myUserStore', localStorage);
      const johnUser = { name: 'John Doe', email: 'john.doe@idf.org'};
      let onAddCallCount = 0;
      let addedUserId;
      userStore.onAdd((userId) => {
        onAddCallCount++;
        addedUserId = userId;
      });

      const johnUserId = userStore.add(johnUser);

      assert.strictEqual(onAddCallCount, 1, 'add callback is called');
      assert.deepEqual(addedUserId, johnUserId, 'add callback is called with the added user\'s id');
    });

    test('it only allows users with unique email addresses', assert => {
      const userStore = new UserStore('myUserStore', localStorage);
      const user = { name: 'John Doe', email: 'john.doe@idf.org'};
      const duplicateEmailUser = { name: 'Laura Doe', email: 'john.doe@idf.org'};

      userStore.add(user);

      assert.throws(() => { userStore.add(duplicateEmailUser); });
    });
  });

  QUnit.module('.remove()', () => {
    test('it removes a user', assert => {
      const storeId = 'myUserStore';
      const userStore = new UserStore(storeId, localStorage);
      const johnUser = { name: 'John Doe', email: 'john.doe@idf.org'};
      const johannaUser = { name: 'Johanna Doe', email: 'johanna.doe@idf.org'};
      const johnUserId = userStore.add(johnUser);
      const johannaUserId = userStore.add(johannaUser);

      userStore.remove(johnUserId);

      const usersInWebStore = JSON.parse(localStorage.getItem(storeId));
      assert.strictEqual(userStore.users.length, 1, 'from the users property');
      assert.strictEqual(usersInWebStore.length, 1, 'from web storage');
      assert.deepEqual(userStore.users[0], withId(johannaUser, johannaUserId), 'the correct user is removed from the users property');
      assert.deepEqual(usersInWebStore[0], withId(johannaUser, johannaUserId), 'the correct user is removed from web store');
    });

    test('it triggers an remove change', assert => {
      const userStore = new UserStore('myUserStore', localStorage);
      const johnUser = { name: 'John Doe', email: 'john.doe@idf.org'};
      let onRemoveCallCount = 0;
      let removeUserId;
      const johnUserId = userStore.add(johnUser);
      userStore.onRemove((userId) => {
        onRemoveCallCount++;
        removeUserId = userId;
      });

      userStore.remove(johnUserId);

      assert.strictEqual(onRemoveCallCount, 1, 'remove callback is called');
      assert.strictEqual(removeUserId, johnUserId, 'remove callback is called with the removed user\'s id');
    });
  });

  QUnit.module('.set()', () => {
    test('it empties the store given no users', assert => {
      const storeId = 'myUserStore';
      const userStore = new UserStore(storeId, localStorage);
      userStore.add({ name: 'Ivana Doe', email: 'ivana.doe@idf.org'});
      userStore.add({ name: 'Irvine Doe', email: 'irvine.doe@idf.org'});
      userStore.add({ name: 'Maya Doe', email: 'maya.doe@idf.org'});

      userStore.set();

      const webStorageItems = [
        localStorage.getItem(storeId + '>ivana.doe@idf.org'),
        localStorage.getItem(storeId + '>irvine.doe@idf.org'),
        localStorage.getItem(storeId + '>maya.doe@idf.org')
      ].filter(item => typeof item === 'string');
      assert.strictEqual(userStore.users.length, 0, 'the users property');
      assert.strictEqual(webStorageItems.length, 0, 'the web storage');
    });

    test('it sets the store to given users', assert => {
      const storeId = 'myUserStore';
      const userStore = new UserStore(storeId, localStorage);
      const lauraUser = { name: 'Laura Williams', email: 'laura.williams@idf.org' };
      userStore.add({ name: 'Ivana Doe', email: 'ivana.doe@idf.org'});
      userStore.add({ name: 'Irvine Doe', email: 'irvine.doe@idf.org'});
      userStore.add({ name: 'Maya Doe', email: 'maya.doe@idf.org'});

      userStore.set([ lauraUser ]);

      const webStorageItems = [
        localStorage.getItem(storeId + '>ivana.doe@idf.org'),
        localStorage.getItem(storeId + '>irvine.doe@idf.org'),
        localStorage.getItem(storeId + '>maya.doe@idf.org'),
        localStorage.getItem(storeId + '>laura.williams@idf.org')
      ].filter(item => typeof item === 'string');
      assert.strictEqual(userStore.users[0], lauraUser, 'the users property');
      assert.deepEqual(JSON.parse(webStorageItems[0]), lauraUser, 'the web storage');
    });

    test('it triggers an set change', assert => {
      const userStore = new UserStore('myUserStore', localStorage);
      const johnUser = { name: 'John Doe', email: 'john.doe@idf.org'};
      const lauraUser = { name: 'Laura Williams', email: 'laura.williams@idf.org' };
      let onSetCallCount = 0;
      let onSetUsers;
      userStore.onSet((users) => {
        onSetCallCount++;
        onSetUsers = users;
      });

      userStore.set([ johnUser, lauraUser ]);

      assert.strictEqual(onSetCallCount, 1, 'onSet callback is called');
      assert.deepEqual([ johnUser, lauraUser ], onSetUsers, 'onSet callback is called with the set users');
    });
  });
});