export default {
  routes: [
    {
     method: 'POST',
     path: '/auth-services/send-otp',
     handler: 'backend-services.sendOTP',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
     method: 'POST',
     path: '/auth-services/verify-otp',
     handler: 'backend-services.verifyOTP',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
