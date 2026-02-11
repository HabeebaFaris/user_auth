const userSchema = require('../model/userModel')

const registerUser = async (req, res) => {
  try {
    
    const { email, password} = req.body;

    const user = await userSchema.findOne({email})

    if(user) {
      return res.render('user/register', {message: 'User already exists...'})
    }

    const newUser = new userSchema({
      email,
      password
    })

    await newUser.save();
    res.render('user/login', {message: 'User created succesfully...'})
    console.log('user created ',newUser);
  } catch (error) {
    res.render('user/register')
    
  }
}

module.exports = {registerUser}