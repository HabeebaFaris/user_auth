
const adminModel = require( '../model/adminModel' )
const bcrypt = require( 'bcrypt' )
const userModel = require('../model/userModel')


// const loadLogin = async (req, res) => {
//    try {
       
        
//         res.render('admin/login');
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const loadLogin = async (req, res) => {
    try {
        // അഡ്മിൻ ഇതിനകം ലോഗിൻ ചെയ്തിട്ടുണ്ടെങ്കിൽ ലോഗിൻ പേജ് കാണിക്കാതെ ഡാഷ്‌ബോർഡിലേക്ക് വിടുന്നു
        if (req.session.admin) {
            return res.redirect('/admin/dashboard');
        }
        res.render('admin/login');
    } catch (error) {
        console.log(error.message);
    }
}

const logout = (req, res)=> {
  req.session.destroy()
   res.redirect('/admin/login')
 
  
}

// const login = async (req, res) => {
//   try {

//     const {email, password} = req.body;

//     const admin = await adminModel.findOne({ email })

//     if( !admin ) return res.render( 'admin/login', {message: 'Invalid credentials'})

//       const isMatch = await bcrypt.compare(password, admin.password)

//       if(!isMatch ) return res.render('admin/login', {message: 'Invalid password'})

//       req.session.admin = true;

//       res.redirect('/admin/dashboard')


//   } catch (error) {
//     res.send(error)
//   }
// }


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await adminModel.findOne({ email });

        if (!admin) return res.render('admin/login', { message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.render('admin/login', { message: 'Invalid password' });

        // സെഷൻ സെറ്റ് ചെയ്യുന്നു
        req.session.admin = true;

        // സുപ്രധാനം: ലോഗിൻ കഴിഞ്ഞാൽ ഡാഷ്‌ബോർഡിലേക്ക് പോകുമ്പോൾ ഹിസ്റ്ററി ക്ലിയർ ചെയ്യാൻ സഹായിക്കും
        res.redirect('/admin/dashboard');

    } catch (error) {
        res.status(500).send(error.message);
    }
}


// const loadDashboard = async (req, res) => {
//   try {
    
//     const admin = req.session.admin;

//     if( !admin ) return res.redirect('/admin/login')

//     const users = await userModel.find({})

//     res.render('admin/dashboard', {users})

//   } catch (error) {
    
//   }
// }








const loadDashboard = async (req, res) => {
    try {
        // ഇമെയിൽ സെർച്ച് ലോജിക് ഉണ്ടെങ്കിൽ അത് കൂടി ഉൾപ്പെടുത്താം
        const users = await userModel.find({});
        
        // Headers സെറ്റ് ചെയ്യുന്നത് വഴി ബാക്ക് ബട്ടൺ അടിച്ചാൽ പഴയ ഡാറ്റ കാണിക്കുന്നത് ഒഴിവാക്കാം
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('admin/dashboard', { users });

    } catch (error) {
        console.log(error.message);
        res.redirect('/admin/login');
    }
}

// 1. യൂസറെ ഡിലീറ്റ് ചെയ്യാനുള്ള ഫംഗ്ഷൻ (Delete User)
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        await userModel.findByIdAndDelete(id);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log("Delete error:", error);
        res.redirect('/admin/dashboard');
    }
};

// 2. എഡിറ്റ് ചെയ്യാനുള്ള പേജ് കാണിക്കാൻ (Load Edit Page)
const loadEditUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userData = await userModel.findById(id);
        if (userData) {
            res.render('admin/editUser', { user: userData });
        } else {
            res.redirect('/admin/dashboard');
        }
    } catch (error) {
        console.log("Load edit error:", error);
        res.redirect('/admin/dashboard');
    }
};

// 3. എഡിറ്റ് ചെയ്ത ഡാറ്റ സേവ് ചെയ്യാൻ (Update User)
const editUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { email } = req.body;
        await userModel.findByIdAndUpdate(id, { $set: { email: email } });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log("Update error:", error);
        res.redirect('/admin/dashboard');
    }
};

const loadAddUser = async (req, res) => {
    try {
        res.render('admin/addUser');
    } catch (error) {
        console.log(error);
    }
};

const addUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // യൂസർ നിലവിലുണ്ടോ എന്ന് പരിശോധിക്കുന്നു
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.render('admin/addUser', { message: 'User already exists!' });
        }

        // പാസ്‌വേഡ് ഹാഷ് ചെയ്യുന്നു
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new userModel({
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
        res.render('admin/addUser', { message: 'Something went wrong!' });
    }
};

module.exports = {
  loadLogin,
  login,
  loadDashboard,
  logout,
  deleteUser,
  loadEditUser,
  editUser,
  loadAddUser,
  addUser
}