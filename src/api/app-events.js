const EmployeeService = require('../services/employee-services');

module.exports = (app) => {
     
    const service = new EmployeeService(); 
    
    app.use('/app-events', async (req,res,next) => {
        try {
            const { payload } = req.body;
            // console.log(payload.data.salaryDetail);
            await service.SubscribeEvents(payload);
            
            console.log("===============  ATTENDANCE Service Received Event  ====== ");
            return res.status(200).json({status:"success",message:"Employee Payroll generated"});
            
        } catch (error) {
            next(error);
        }
    });

}