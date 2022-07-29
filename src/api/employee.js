const EmployeeService = require("../services/employee-services");
const {PublishPayrollEvent,PublishAttendanceEvent} = require('../utils');
// const UserAuth = require('./middlewares/auth')

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("./middlewares/newauth");
const { ErrorHander } = require("../utils/app-errors");
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
  app.post("/employee/register/:id", async (req, res, next) => {
    try {
      //cloudinary upload
      const file = req.files.photo;
      // cloudinary.uploader.upload(file.tempFilePath,(err,res)=>{
      // console.log(res);
      // })
      const {
        name,
        email,
        dateOfBirth,
        phoneNumber,
        current_address,
        perma_address,
        adhaarNumber,
        panNumber,
        bankAccountNumber,
        ifsc,
        passBookNumber,
        role,
        designation,
        password,
      } = req.body;
      const { id } = req.params;
      // validation
      const { data } = await service.CreateEmployee({
        name,
        email,
        dateOfBirth,
        phoneNumber,
        current_address,
        perma_address,
        adhaarNumber,
        panNumber,
        bankAccountNumber,
        ifsc,
        passBookNumber,
        role,
        designation,
        password,
        id,
        file,
      });
      if (data) {
        return res.json("User has been registered Successfully");
      }

      // return res.json(data);
    } catch (err) {
      // console.log(err);
      next(err);
      // throw new APIError('Data Not found', err)
    }
  });

  // LOGIN
  app.post("/employee/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      //checking if user has given password and email both
      if (!email || !password) {
        return next(new ErrorHander("Please Enter Email & Password", 400));
      }

      //here below got user id and token then set cookies
      const { data } = await service.LoginIn({ email, password });

      //cookies set from token recieved
      const options = {
        expire: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      const token = data.token;
      const userId = data.id;
      const name = data.name;
      const userEmail = data.email;
      const role = data.role;
      const dateOfBirth = data.dateOfBirth;
      const phoneNumber = data.phoneNumber;
      const current_address = data.current_address;
      const perma_address = data.perma_address;
      const adhaarNumber = data.adhaarNumber;
      const panNumber = data.panNumber;
      const bankAccountNumber = data.bankAccountNumber;
      const ifsc = data.ifsc;
      const passBookNumber = data.passBookNumber;
      const designation = data.designation;
      const status = data.status;
      const imageUrl = data.imageUrl;
      const dateOfJoining = data.dateOfJoining;

      // req.user = userId;
      // console.log(data);
      //saving token in cookie
      return res.status(200).cookie("token", token, options).json({
        userId,
        name,
        userEmail,
        role,
        dateOfBirth,
        phoneNumber,
        current_address,
        perma_address,
        adhaarNumber,
        panNumber,
        bankAccountNumber,
        ifsc,
        passBookNumber,
        designation,
        status,
        imageUrl,
        dateOfJoining,
        message: "success",
        // token,
      });
      // return res.json(data);
    } catch (err) {
      console.log(err);
      return next(new ErrorHander("Invalid details ", 401));
    }
  });

  //Logout
  app.get("/employee/logout", async (req, res, next) => {
    //setting cookie as null to logout
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  });

  //CheckAuth
  app.get("/auth", isAuthenticatedUser, async (req, res, next) => {
    const user = req.user;
    // console.log(user);
    if (!user) {
      return res.json("Please Login to access this resource");
    }
    const userId = user._id;
    const { name, email } = user;

    return res.json({ name, email, userId });
  });

  //Fortgot password
  app.post("/employee/password-forgot", async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email) {
        return next(new ErrorHander("Please Enter Email", 400));
      }
      const emailSend = await service.ForgotPassword({ email });
      if (!emailSend) {
        return res.json(
          "Unable to send email to user as user might not be valid"
        );
      }
      return res.json("Reset Password Email has been send to your mail");
    } catch (err) {
      console.log(err);
      throw next(new ErrorHander("No user found ", 401));
    }
  });

  //reset-password from email link -- get
  app.get("/employee/password-forgot/:id/:token", async (req, res, next) => {
    const id = req.params.id;
    const token = req.params.token;
    // console.log(token);

    try {
      // check user is valid or not
      const { data } = await service.ResetTokenAuth(id, token);
      // return res.json(data)
      if (!data) {
        return res.json("Your are reset token is not valid");
      }
      return res.render("reset-password");
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  // reset password final form---post
  app.post("/employee/password-forgot/:id/:token", async (req, res, next) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
      await service.ResetPass(id, token, password);
      //validate new passwords
      return res.json("updated successfully");
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  //Employee -USER Home page single employee details
  app.get("/employee/me", isAuthenticatedUser, async (req, res, next) => {
    const employeeId = req.user._id;
    try {
      const { data } = await service.GetEmployeeById(employeeId);
      return res.status(200).json(data);
    } catch (error) {
      next(err);
    }
  });

  //Employee- Update users own password
  app.put(
    "/employee/me/change-password",
    isAuthenticatedUser,
    async (req, res, next) => {
      const newPassword = req.body.newPassword;

      try {
        const Id = req.user.id;
        const { data } = await service.UpdateMyPassword(Id, newPassword);
        if (data) {
          return res.status(200).json("password updated successfully");
        }
      } catch (err) {
        next(err);
      }
    }
  );

  //Employee---user update own details
  app.put(
    "/employee/me/update-details",
    isAuthenticatedUser,
    async (req, res, next) => {
      try {
        const newUserData = {
          name: req.body.name,
          email: req.body.email,
          // dateOfBirth: req.body.dateOfBirth,
          phoneNumber: req.body.phoneNumber,
          current_address: req.body.current_address,
          perma_address: req.body.perma_address,
          adhaarNumber: req.body.adhaarNumber,
          panNumber: req.body.panNumber,
          // bankAccountNumber: req.body.bankAccountNumber,
          ifsc: req.body.ifsc,
          passBookNumber: req.body.passBookNumber,
        };
        const Id = req.user.id;
        const { data } = await service.UpdateMyDetails(Id, newUserData);
        if (data) {
          return res.status(200).json("Details updated successfully");
        }
      } catch (err) {
        next(err);
      }
    }
  );

  //get all employees-----------------ADMIN-------------------
  app.get(
    "/admin/employees",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    async (req, res, next) => {
      // const quer = req.query.page;
      const queryStr = req.query;
      try {
        const { data } = await service.GetAllEmployees(queryStr);
        return res.status(200).json(data);
      } catch (error) {
        next(err);
      }
    }
  );

  //get employee by SINGLE USER id-----------------ADmin only role-----------------
  app.get(
    "/admin/employee/:id",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    async (req, res, next) => {
      const employeeId = req.params.id;
      try {
        const { data } = await service.GetEmployeeById(employeeId);
        return res.status(200).json(data);
      } catch (err) {
        next(err);
      }
    }
  );
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
    app.put(
      "/admin/employee/:id",
      isAuthenticatedUser,
      authorizeRoles("admin"),
      async (req, res, next) => {
      
        try {
          // const {name,role} = req.body;
          const Id = req.params.id;
          const imageUrl = req.files.photo;
          const newUserData = {
            name: req.body.name,
            email: req.body.email,
            dateOfBirth: req.body.dateOfBirth,
            phoneNumber: req.body.phoneNumber,
            current_address: req.body.current_address,
            perma_address: req.body.perma_address,
            adhaarNumber: req.body.adhaarNumber,
            panNumber: req.body.panNumber,
            bankAccountNumber: req.body.bankAccountNumber,
            ifsc: req.body.ifsc,
            passBookNumber: req.body.passBookNumber,
            designation:req.body.designation,
            password:req.body.password,
            role:req.body.role,
            status:req.body.status,
            status:req.body.status,
            photo:imageUrl
          };
          const { data } = await service.UpdateUserDetail(Id, newUserData);
  
          return res.status(200).json("User Details updated Successfully");
          // return res.status(200).json(data);
        } catch (err) {
          next(err);
        }
      }
    );

  
    //   ----------------------ADMIN UPDATE EMPLOYEE Status from Table-------------------
  
    app.put(
      "/admin/status-update/:id",
      isAuthenticatedUser,
      async (req, res, next) => {
        try {
          const Id = req.params.id;
          const status = req.body.status;
          const { data } = await service.UpdateUserStatus(Id, status);
          if (data) {
            return res.status(200).json("Details updated successfully");
          }
        } catch (err) {
          next(err);
        }
      }
    );

  
  //   ----------------------ADMIN DELETE EMPLOYEE-------------------
  app.delete(
    "/admin/employee/:id",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    async (req, res, next) => {
      try {
        const Id = req.params.id;
        const { data } = await service.DeleteEmployee(Id);
        return res.status(200).json("User Deleted Successfully");
        // return res.status(200).json(data);
      } catch (err) {
        next(err);
      }
    }
  );

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
  app.post(
    "/employee/dummyAdd",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    async (req, res, next) => {
      try {
        const { email } = req.body;
        // validation
        const { data } = await service.CreateDummyEmployee({ email });
        if (data) {
          return res.json("Email has been sent to the user");
        }
      } catch (err) {
        next(err);
      }
    }
  );

  //Admin will add salary Structure of Employee
  app.post(
    "/add-salary/:id",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    async (req, res, next) => {
      try {
        const Id = req.params.id;
        const { Basic, HRA, Convince, LTA, SPL, PF_Employee, PF_Employer } =
          req.body;
        const { data } = await service.Salary({
          Basic,
          HRA,
          Convince,
          LTA,
          SPL,
          PF_Employee,
          PF_Employer,
          Id,
        });
        if (data) {
          return res.json("Salary Added Successfully");
        }
      } catch (err) {
        next(err);
      }
    }
  );

  //Get single Salary structure of single employee-----------------ADmin only role-----------------
  app.get(
    "/admin/salary-employee/:id",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    async (req, res, next) => {
      const employeeId = req.params.id;
      try {
        const { data } = await service.GetSalaryById(employeeId);
        return res.status(200).json(data);
      } catch (err) {
        next(err);
      }
    }
  );
//--------------------microservice------------------------
  //get attendance details of a employee
  // app.get(
  //   "/attendance-employee/:id",
  //   isAuthenticatedUser,
  //   authorizeRoles("admin"),
  //   async (req, res, next) => {
  //     const employeeId = req.params.id;
  //     //get payload which we will send to our attendance service
  //     try {
      
  //       const {data} = await service.getPayloadAttendance(employeeId,'getEmployeeAttendance');
  //      const val = await PublishAttendanceEvent(data);
  //       console.log(val.data);  
  //       return res.status(200).json(data);
  //     } 
  //     catch (err) {
  //       next(err);
  //     }
  //   }
  // );

  //Create payroll details of employee
  app.post(
    "/create-payroll-employee/:id/:month/:year",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    async (req, res, next) => {
      try {
      const employeeId = req.params.id;
      const month = req.params.month;
      const year = req.params.year;
      //get payload which we will send to our payroll service
        //get salary detail of a employee
        const salaryDetail = await service.GetSalaryByIdForAttendance(employeeId);
        // console.log(salaryDetail);
        //send details to attendance service to create payroll
        if(!salaryDetail){
          return res.json({message:"No salary details of user"});
        }
        const {data} = await service.getPayloadPayroll(employeeId,salaryDetail,month,year,'createEmployeePayroll');
        console.log(data);
        //now publish the payload
        PublishAttendanceEvent(data);  
      //  console.log(val);
        return res.status(200).json(data);
      } 
      catch (err) {
        next(err);
      }
    }
  );

  //Create Salary Slip details of employee
  app.post(
    "/create-salarySlip-employee/:id/:month/:year",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    async (req, res, next)=>{

      //get payload we will send to our attendance service to generate salary slip pdf
      try {
      const employeeId = req.params.id;
      const month = req.params.month;
      const year = req.params.year;
      
      //user details
      const userDetail = await service.UserDetailsForSalarySlip(employeeId);
      if(!userDetail){
        return res.json({message:"No User details for this id"});
      }
      //salary details
      const salaryDetail = await service.GetSalaryByIdForAttendance(employeeId);
      if(!salaryDetail){
        return res.json({message:"No salary details of user"});
      }

      //now generate payload with salary and user details

      const {data} = await service.getPayloadSalarySlip(employeeId,salaryDetail,userDetail,month,year,'getPdf');

      PublishAttendanceEvent(data);
      return res.status(200).json(data);

    } catch (error) {
      next(error);
    }






    }
  )




}
