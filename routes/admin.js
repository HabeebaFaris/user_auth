const express = require( 'express' );
const router = express.Router();
const adminController = require('../controller/adminController')
const adminAuth = require('../middleware/adminAuth')

router.get('/login', adminAuth.isLogin, adminController.loadLogin)
router.post('/login', adminController.login)

router.get('/dashboard',adminAuth.checkSession, adminController.loadDashboard)

router.get('/logout', adminAuth.checkSession, adminController.logout)



router.get('/delete-user/:id', adminAuth.checkSession, adminController.deleteUser);
router.get('/edit-user/:id', adminAuth.checkSession, adminController.loadEditUser);
router.post('/edit-user/:id', adminAuth.checkSession, adminController.editUser);
// Add User - പേജ് ലോഡ് ചെയ്യാൻ
router.get('/add-user', adminAuth.checkSession, adminController.loadAddUser);

// Add User - ഫോം സബ്മിറ്റ് ചെയ്യാൻ
router.post('/add-user', adminAuth.checkSession, adminController.addUser);


module.exports = router;