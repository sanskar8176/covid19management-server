import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';

// ROute Level Middleware - To Protect Route

router.use('/addstatecoviddata/:state', checkUserAuth)
router.use('/editstatecoviddata/:state/:id', checkUserAuth)
router.use('/deletestatecoviddata/:state/:id', checkUserAuth)
router.use('/getstatecoviddata/:state/:id', checkUserAuth)

router.use('/getstatecoviddataforuser/:state', checkUserAuth)
router.use('/getstatecoviddataforAdmin', checkUserAuth)

router.use('/approvestatecoviddata/:id', checkUserAuth)


// Public Routes
router.post('/login', UserController.userLogin)
router.post('/getstatecoviddataforpublic/', UserController.getStateCovidDataForPublic)


// Protected Routes

router.post('/addstatecoviddata/:state', UserController.addStateCovidData)
router.put('/editstatecoviddata/:state/:id', UserController.editStateCovidData)
router.delete('/deletestatecoviddata/:state/:id', UserController.deleteStateCovidData)
router.get('/getstatecoviddata/:state/:id', UserController.getStateCovidData)

router.get('/getstatecoviddataforuser/:state', UserController.getStateCovidDataForUser)
router.get('/getstatecoviddataforAdmin/', UserController.getStateCovidDataForAdmin)

router.get('/approvestatecoviddata/:id', UserController.approveStateCovidData)



export default router