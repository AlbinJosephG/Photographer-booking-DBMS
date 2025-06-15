// server/config/initAdmin.js
// server/config/initAdmin.js
import User from '../models/User.js';

export const createAdminUser = async () => {
  const existingAdmin = await User.findOne({ username: 'admin' });
  if (!existingAdmin) {
    const admin = new User({
      username: 'admin',
      password: 'admin', // plain text
      role: 'admin'
    });
    await admin.save();
    console.log('✅ Admin user created: username=admin, password=admin');
  } else {
    console.log('ℹ️ Admin user already exists.');
  }
};

