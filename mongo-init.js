// Initialize MongoDB with user and database
db = db.getSiblingDB('snapai');

// Create application user
db.createUser({
  user: 'snapai_app',
  pwd: 'app_password_change_in_production',
  roles: [
    {
      role: 'readWrite',
      db: 'snapai'
    }
  ]
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.modules.createIndex({ user: 1, createdAt: -1 });
db.modules.createIndex({ status: 1 });

print('Database initialized successfully!');
