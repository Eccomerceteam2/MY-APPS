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
      username: 'm86velg',
      email: 'mvelgbandarlampung@gmail.com',
      password: 'm86velgbalam',
      full_name: 'Bengkel M86 Velg',
      business_name: 'BengkelM86Velg',
      business_type: 'business',
      phone: null,
      address: null,
      is_verified: true,
      verification_token: null
    });

    console.log('Company user created successfully!');
    console.log('Username: m86velg');
    console.log('Password: m86velgbalam');
    console.log('Email: mvelgbandarlampung@gmail.com');
    console.log('Business Name: BengkelM86Velg');
    console.log('Verified: Yes');

    process.exit(0);
  } catch (error) {
    console.error('Error creating temp user:', error);
    process.exit(1);
  }
}

createTempUser();
