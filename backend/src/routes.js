// Import controlers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const checkUserFn = require('./middlewares/checkUserFn');
const verifyFn = require('./middlewares/verifyFn');

// Match URL's with controllers
exports.appRoute = router => {

    router.post('/api/user/login', authController.processLogin);
    router.post('/api/user/register', authController.processRegister);
    router.post('/api/user/process-submission', verifyFn.verifyToken, checkUserFn.getClientUserId, userController.processDesignSubmission);
    router.put('/api/user/', verifyFn.verifyToken, verifyFn.verifyAdmin, userController.processUpdateOneUser);
    router.put('/api/user/design/', verifyFn.verifyToken, userController.processUpdateOneDesign);
    router.post('/api/user/processInvitation/', verifyFn.verifyToken, checkUserFn.getClientUserId, userController.processSendInvitation);

    router.get('/api/user/process-search-design/:pagenumber/:search?', verifyFn.verifyToken, checkUserFn.getClientUserId, userController.processGetSubmissionData);
    router.get('/api/user/process-search-user/:pagenumber/:search?', verifyFn.verifyToken, verifyFn.verifyAdmin, checkUserFn.getClientUserId, userController.processGetUserData);
    router.get('/api/user/process-search-user-design/:pagenumber/:search?', verifyFn.verifyToken, verifyFn.verifyAdmin, userController.processGetSubmissionsbyEmail,);
    router.get('/api/user/:recordId', verifyFn.verifyToken, userController.processGetOneUserData);
    router.get('/api/admin/:recordId', verifyFn.verifyAdmin, userController.processGetOneUserData);
    router.get('/api/user/design/:fileId', verifyFn.verifyToken, userController.processGetOneDesignData);

};