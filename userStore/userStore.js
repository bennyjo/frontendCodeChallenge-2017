/* exported UserStore */

class UserStore {
  constructor(id, webStore) {
    if (!id) {
      throw new Error('UserStore: a store id is required.');
    }

    // TODO: Deserialize web store data, assign to this.users
    this.id = id;
    this.webStore = webStore || localStorage;

    const storedUsersString = this.webStore.getItem('id');
    const users = storedUsersString ? JSON.parse(storedUsersString) : [];

    this.users = users;
    this.onAddCallbacks = [];
    this.onRemoveCallbacks = [];
    this.onChangeCallbacks = [];
  }

  add(user) {
    const userStore = this;

    if (!hasUniqueEmail(user)) {
      throw new Error('UserStore: user email "' + user.email + '" has already been added.');
    }

    userStore.users.push(user);

    userStore.webStore.setItem(userStore.id + '>' + user.email, JSON.stringify(user));

    userStore.onAddCallbacks.forEach(onAddCallback => onAddCallback(user));
    userStore.onChangeCallbacks.forEach(onChangeCallback => onChangeCallback());

    function hasUniqueEmail(newUser) {
      return userStore.users.every(storedUser => storedUser.email !== newUser.email);
    }
  }

  remove(userToRemove) {
    const userStore = this;
    const userIndex = userStore.users.findIndex(storedUser => storedUser.email === userToRemove.email);

    if (userIndex >= 0) {
      userStore.users.splice(userIndex, 1);
      userStore.onRemoveCallbacks.forEach(onRemoveCallback => onRemoveCallback(userToRemove));
      userStore.onChangeCallbacks.forEach(onChangeCallback => onChangeCallback());
    }

    userStore.webStore.removeItem(userStore.id + '>' + userToRemove.email);
  }

  // TODO:
  // Rename to reset
  // onReset
  empty() {
    const userStore = this;

    userStore.users.forEach(user => userStore.webStore.removeItem(userStore.id + '>' + user.email));
    userStore.users = [];

    userStore.onChangeCallbacks.forEach(onChangeCallback => onChangeCallback());
  }

  onAdd(callback) {
    if (typeof callback === 'function') {
      this.onAddCallbacks.push(callback);
    }
  }

  onRemove(callback) {
    if (typeof callback === 'function') {
      this.onRemoveCallbacks.push(callback);
    }
  }

  // TODO: remove?
  onChange(callback) {
    if (typeof callback === 'function') {
      this.onChangeCallbacks.push(callback);
    }
  }
}