/* global UserStore */

const { test } = QUnit;

// TODO: .addAnonymous()
// In order to deal with the "Add another colleage" scenario

// TODO: Add .onEmpty
// TODO: Possibly remove .onChange as .onEmpty might fill its role

QUnit.module('UserStore', {
  afterEach: () => { localStorage.clear(); }
}, () => {
  test('it requires an id', (assert) => {
    assert.throws(() => new UserStore());
  });

  test('it defaults to the localStorage Web Storage API', (assert) => {
    const userStore = new UserStore('myUserStore');

    assert.strictEqual(userStore.webStore, localStorage);
  });

  QUnit.module('.add()', () => {
    test('it adds a user', assert => {
      const storeId = 'myUserStore';
      const userStore = new UserStore(storeId, localStorage);
      const user = { name: 'John Doe', email: 'john.doe@idf.org'};

      userStore.add(user);

      assert.deepEqual(userStore.users[0], user, 'to the users property');
      assert.deepEqual(JSON.parse(localStorage.getItem(storeId + '>' + user.email)), user, 'to web storage');
    });

    test('it adds multiple users', assert => {
      const userStore = new UserStore('myUserStore', localStorage);
      const user = { name: 'John Doe', email: 'john.doe@idf.org'};
      const user2 = { name: 'Johanna Doe', email: 'johanna.doe@idf.org'};

      userStore.add(user);
      userStore.add(user2);

      assert.strictEqual(userStore.users.length, 2);
    });

    test('it triggers a change', assert => {
      const userStore = new UserStore('myUserStore', localStorage);
      const user = { name: 'John Doe', email: 'john.doe@idf.org'};
      let onChangeCallCount = 0;
      userStore.onChange(() => onChangeCallCount++);

      userStore.add(user);

      assert.strictEqual(onChangeCallCount, 1);
    });

    test('it triggers an add change', assert => {
      const userStore = new UserStore('myUserStore', localStorage);
      const user = { name: 'John Doe', email: 'john.doe@idf.org'};
      let onAddCallCount = 0;
      let addedUser;
      userStore.onAdd((user) => { 
        onAddCallCount++;
        addedUser = user;
      });

      userStore.add(user);

      assert.strictEqual(onAddCallCount, 1, 'add callback is called');
      assert.strictEqual(addedUser, user, 'add callback is called with the added user');
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
      const user = { name: 'John Doe', email: 'john.doe@idf.org'};
      userStore.add(user);

      userStore.remove(user);

      assert.strictEqual(userStore.users[0], undefined, 'from the users property');
      assert.strictEqual(localStorage.getItem(storeId + '>' + user.email), null, 'from web storage');
    });

    test('it triggers a change', assert => {
      const userStore = new UserStore('myUserStore', localStorage);
      const user = { name: 'John Doe', email: 'john.doe@idf.org'};
      let onChangeCallCount = 0;
      userStore.add(user);
      userStore.onChange(() => onChangeCallCount++);

      userStore.remove(user);

      assert.strictEqual(onChangeCallCount, 1);
    });

    test('it triggers an remove change', assert => {
      const userStore = new UserStore('myUserStore', localStorage);
      const user = { name: 'John Doe', email: 'john.doe@idf.org'};
      let onRemoveCallCount = 0;
      let removedUser;
      userStore.add(user);
      userStore.onRemove((user) => { 
        onRemoveCallCount++;
        removedUser = user;
      });

      userStore.remove(user);

      assert.strictEqual(onRemoveCallCount, 1, 'remove callback is called');
      assert.strictEqual(removedUser, user, 'remove callback is called with the removed user');
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

    test('it triggers a change', assert => {
      const userStore = new UserStore('myUserStore', localStorage);
      let onChangeCallCount = 0;
      userStore.onChange(() => onChangeCallCount++);

      userStore.set();

      assert.strictEqual(onChangeCallCount, 1);
    });
  });
});