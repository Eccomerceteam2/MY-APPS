const { User, sequelize } = require('./models/userModel');

async function createTempUser() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const existingUser = await User.findOne({ where: { username: 'tempuser' } });
    if (existingUser) {
      console.log('Temp user already exists. Deleting...');
      await existingUser.destroy();
    }

    const tempUser = await User.create({
      username: 'tempuser',
      email: 'temp@example.com',
      password: 'temppass123',
      full_name: 'Temporary User',
      business_name: null,
      business_type: 'personal',
      phone: null,
      address: null,
      is_verified: true,
      verification_token: null
    });

    console.log('Temporary user created successfully!');
    console.log('Username: tempuser');
    console.log('Password: temppass123');
    console.log('Email: temp@example.com');
    console.log('Verified: Yes');

    process.exit(0);
  } catch (error) {
    console.error('Error creating temp user:', error);
    process.exit(1);
  }
}

createTempUser();
