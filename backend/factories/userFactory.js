class User {
  constructor({ username, password, role }) {
    this.username = username;
    this.password = password;
    this.role = role;
  }
}

class ManagerUser extends User {
  constructor(data) {
    super({ ...data, role: 'manager' });
  }
}

class AdminUser extends User {
  constructor(data) {
    super({ ...data, role: 'admin' });
  }
}

class GuestUser extends User {
  constructor(data) {
    super({ ...data, role: 'guest' });
  }
}

class UserFactory {
  static createUser(role, data) {
    switch (role) {
      case 'manager':
        return new ManagerUser(data);
      case 'admin':
        return new AdminUser(data);
      case 'guest':
        return new GuestUser(data);
      default:
        throw new Error('Неизвестная роль пользователя');
    }
  }
}

module.exports = UserFactory;
