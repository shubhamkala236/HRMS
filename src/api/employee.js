const EmployeeService = require('../services/employee-services');
// const { PublishCustomerEvent, PublishShoppingEvent } = require('../utils');
// const UserAuth = require('./middlewares/auth')
const {isAuthenticatedUser, authorizeRoles} = require('./middlewares/newauth'); 
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');
// const reset = require('reset');


module.exports = (app) => {
    const service = new EmployeeService();
    
    // registeration form over email 
    // add employee from link with /:id
    // REGISTER 
    // app.post('/employee/register/:id', async(req,res,next) => {
        
    //     try {
    //         const { name, email, dateOfBirth, phoneNumber,current_address, perma_address, adhaarNumber, panNumber,bankAccountNumber,ifsc,passBookNumber,role,designation,password} = req.body;
    //         const {id} = req.params
    //         // validation
    //         const { data } =  await service.CreateEmployee({ name, email, dateOfBirth, phoneNumber,current_address, perma_address, adhaarNumber, panNumber,bankAccountNumber,ifsc,passBookNumber,role,designation,password,id });
            
    //         return res.json(data);
            
    //     } catch (err) {
    //         next(err)    
    //     }
        
    // });

    // registeration form over email 
    // add employee from link with /:id
    // REGISTER 
    app.post('/employee/register/:id', async(req,res,next) => {
        
        try {
            //cloudinary upload
            const file = req.files.photo
            // cloudinary.uploader.upload(file.tempFilePath,(err,res)=>{
            // console.log(res);
        // })
            const { name, email, dateOfBirth, phoneNumber,current_address, perma_address, adhaarNumber, panNumber,bankAccountNumber,ifsc,passBookNumber,role,designation,password} = req.body;
            const {id} = req.params
            // validation
            const { data } =  await service.CreateEmployee({ name, email, dateOfBirth, phoneNumber,current_address, perma_address, adhaarNumber, panNumber,bankAccountNumber,ifsc,passBookNumber,role,designation,password,id, file });
            
            return res.json(data);
            
        } catch (err) {
            console.log(err);
            next(err)    
        }
        
    });

    // LOGIN
    app.post('/employee/login',  async (req,res,next) => {
        
        try {
            
            const { email, password } = req.body;
            
            //here below got user id and token then set cookies
            const { data } = await service.LoginIn({ email, password});
            
            //cookies set from token recieved
            const options = {
                expire: new Date(
                    Date.now() + 1 * 24 * 60 * 60 * 1000
                ),
                httpOnly:true
            }
            const token = data.token;
            const userId = data.id;
            // req.user = userId;
            //saving token in cookie
            return res.status(200).cookie('token',token,options).json({
                success:true,
                userId,
                token,
            });
            // return res.json(data);
        } catch (err) {
            console.log(err);
            next(err)
        }


    });

    //Logout
    app.get('/employee/logout',  async (req,res,next) => {
        
        try {
            //setting cookie as null to logout
           res.cookie('token',null,{
            expires: new Date(Date.now()),
            httpOnly: true,
           });

           res.status(200).json({
            success: true,
            message: "Logged Out",
          });
        } catch (err) {
            console.log(err);
            next(err)
        }
    });

    //Fortgot password
    app.post('/employee/password-forgot',  async (req,res,next) => {
        
        try {
           const {email} = req.body;
            await service.ForgotPassword({ email});

           return res.json("Reset Password Email has been send to your mail");

        } catch (err) {
            console.log(err);
            next(err)
        }
    });
    
    //reset-password from email link -- get
    app.get('/employee/password-forgot/:id/:token',  async (req,res,next) => {
        const id = req.params.id;
        const token = req.params.token;
        // console.log(token);
        
        try {   
           
        // check user is valid or not 
            const {data} = await service.ResetTokenAuth(id,token);
            // return res.json(data)
            if(data){

                return res.render("reset-password")
            }


        } catch (err) {
            console.log(err);
            next(err)
        }
    });

    // reset password final form---post
    app.post('/employee/password-forgot/:id/:token',  async (req,res,next) => {
        const {id,token} = req.params;
        const {password} = req.body;
        
        try {   
            
            await service.ResetPass(id,token,password);
            //validate new passwords
            return res.json("updated successfully")

        } catch (err) {
            console.log(err);
            next(err)
        }
    });

    //Employee -USER Home page single employee details 
    app.get('/employee/me',isAuthenticatedUser,async (req,res,next) => {
        const employeeId = req.user._id;
        try {
            const { data} = await service.GetEmployeeById(employeeId);        
            return res.status(200).json(data);
        } catch (error) {
            next(err)
        }
        
    });

    //Employee- Update users own password
    app.put('/employee/me/change-password',isAuthenticatedUser,async(req,res,next)=>{
        const newPassword = req.body.newPassword;

        try {
            const Id = req.user.id;
            const {data} = await service.UpdateMyPassword(Id,newPassword);  
            if(data){

                return res.status(200).json("password updated successfully");
            }      
        } catch (err) {
            next(err)
        }
    })

    







    
    // app.post('/employee/register', async(req,res,next) => {
        
    //     try {
    //         const { name, email, dateOfBirth, phoneNumber,current_address, perma_address, adhaarNumber, panNumber,bankAccountNumber,ifsc,passBookNumber,role,designation,password} = req.body; 
    //         // validation
    //         const { data } =  await service.CreateEmployee({ name, email, dateOfBirth, phoneNumber,current_address, perma_address, adhaarNumber, panNumber,bankAccountNumber,ifsc,passBookNumber,role,designation,password });
            
    //         return res.json(data);
            
    //     } catch (err) {
    //         next(err)    
    //     }
    
    // });
    
    //get all employees-----------------ADMIN-------------------
    app.get('/admin/employees',isAuthenticatedUser,authorizeRoles("admin"), async (req,res,next) => {
        // const quer = req.query.page;
        const queryStr = req.query;
        try {
            const { data} = await service.GetAllEmployees(queryStr);        
            return res.status(200).json(data);
        } catch (error) {
            next(err)
        }
        
    });
    
    //get employee by SINGLE USER id-----------------ADmin only role-----------------
    app.get('/admin/employee/:id',isAuthenticatedUser,authorizeRoles("admin"), async (req,res,next) => {
        const employeeId = req.params.id;
        try {
            const {data} = await service.GetEmployeeById(employeeId);        
            return res.status(200).json(data);
        } catch (err) {
            next(err)
        }
        
    });
    // app.get('/user/employee',isAuthenticatedUser,authorizeRoles("user"), async (req,res,next) => {
    //     const employeeId = req.user._id;
    //     try {
    //         const { data} = await service.GetEmployeeById(employeeId);        
    //         return res.status(200).json(data);
    //     } catch (error) {
    //         next(err)
    //     }
        
    // });
    ///get a Single Employee BY ------------------------ADMIN--------------------------
    // app.get('admin/employee/:id',isAuthenticatedUser, async (req,res,next) => {
    //     const employeeId = req.params.id;
    //     try {
    //         const {data} = await service.GetEmployeeById(employeeId);        
    //         return res.status(200).json(data);
    //     } catch (err) {
    //         next(err)
    //     }
        
    // });


    // user signup or register
    // app.post('/user/signup',upload.single("image"), async (req,res,next) => {
    //     try {
    //         const { name, } = req.name;
    //         const { data } = await service.UserSignUp({ email, password, details, role}); 
    //         //cookies set from token recieved
    //         const options = {
    //             expire: new Date(
    //                 Date.now() + 1 * 24 * 60 * 60 * 1000
    //             ),
    //             httpOnly:true
    //         }
    //         const token = data.token;
    //         const userId = data.id;
            
    //         return res.status(200).cookie('token',token,options).json({
    //             success:true,
    //             userId,
    //             token,
    //         });
           
    //     //    return res.json(data);
            
    //     } catch (err) {
    //         next(err)
    //     }

    // });

    //   ----------------------ADMIN UPDATE EMPLOYEE-------------------
    app.put('/admin/employee/:id',isAuthenticatedUser,authorizeRoles("admin"), async (req,res,next) => {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
        };
        try {
            // const {name,role} = req.body;
            const Id = req.params.id;
            const {data} = await service.UpdateUserDetail(Id,newUserData);        
            return res.status(200).json(data);
        } catch (err) {
            next(err)
        }
        
    });

    //   ----------------------ADMIN DELETE EMPLOYEE-------------------
    app.delete('/admin/employee/:id',isAuthenticatedUser,authorizeRoles("admin"), async (req,res,next) => {
       
        try {
            const Id = req.params.id;
            const {data} = await service.DeleteEmployee(Id);        
            return res.status(200).json(data);
        } catch (err) {
            next(err)
        }
        
    });

//    -------------------------------LOGIN-----------------------------
    // app.post('/user/login',  async (req,res,next) => {
        
    //     try {
            
    //         const { email, password } = req.body;
    
    //         const { data } = await service.SignIn({ email, password});
            
    //         //cookies set from token recieved
    //         const options = {
    //             expire: new Date(
    //                 Date.now() + 1 * 24 * 60 * 60 * 1000
    //             ),
    //             httpOnly:true
    //         }
    //         const token = data.token;
    //         const userId = data.id;
    //         //saving token in cookie
    //         return res.status(200).cookie('token',token,options).json({
    //             success:true,
    //             userId,
    //             token,
    //         });



    
            // return res.json(data);

    //     } catch (err) {
    //         console.log(err);
    //         next(err)
    //     }

    // });

    //Admin will add email of employee in dummy database
    app.post('/employee/dummyAdd', async(req,res,next) => {
        
        try {
            const {email} = req.body; 
            // validation
            const { data } =  await service.CreateDummyEmployee({email});
       
            return res.json(data);
            
        } catch (err) {
            next(err)    
        }
        
    });

}
    

    
