const { EmployeeRepository } = require("../database");
const { FormateData,GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require("../utils");
const { APIError } = require('../utils/app-errors');
const {sendMail, sendResetMail} = require('../utils/sendEmail');
const cloudinary = require('../utils/cloudinary');
const { APP_SECRET} = require('../config');
const jwt  = require('jsonwebtoken');





// All Business logic will be here

class EmployeeService{

    constructor(){
        this.repository = new EmployeeRepository();
    }
    
    // ---------------------REGISTER/CREATE EMPLOYEEE------------------------
    async CreateEmployee(employeeInputs){

        const { name, email, dateOfBirth, phoneNumber,current_address, perma_address, adhaarNumber, panNumber,bankAccountNumber,ifsc,passBookNumber,role,designation,password,id,file  } = employeeInputs; //path
        // cloudinary upload
        const uploaded = await cloudinary.uploader.upload(file.tempFilePath);
        
        const url = uploaded.url;

        // create salt
        let salt = await GenerateSalt();
        
        let userPassword = await GeneratePassword(password, salt);
        
        try{
            const employeeResult = await this.repository.CreateEmployee({ name, email, dateOfBirth, phoneNumber,current_address, perma_address, adhaarNumber, panNumber,bankAccountNumber,ifsc,passBookNumber,role,designation,password: userPassword,id,salt,imageUrl:url}); 
            return FormateData(employeeResult);
        }catch(err){
            console.log(err);
            throw new APIError('Data Not found')
        }
    }

    //Admin Update User/id:
    async UpdateUserDetail(Id,userData){
        
        try {
            const existingUser = await this.repository.FindAndUpdate(Id,userData);
            if(existingUser)
            {
                return FormateData(existingUser);
            }

    
            return FormateData(null);

        } catch (err) {
            console.log(err);
            throw new APIError('Data Not found', err)
        }

       
    }

    //Admin Delete User/id:
    async DeleteEmployee(Id){
        
        try {
            const existingUser = await this.repository.Delete(Id);
            const res = "user Deleted Successfully"
            if(existingUser)
            {
                return FormateData(res);
            }

    
            return FormateData(null);

        } catch (err) {
            console.log(err);
            throw new APIError('Data Not found', err)
        }

       
    }

    
    //Employee login
    async LoginIn(userInputs){

        const { email, password } = userInputs;
        
        try {
            
            const existingUser = await this.repository.FindEmployee({ email});

            if(existingUser){
            
                const validPassword = await ValidatePassword(password, existingUser.password, existingUser.salt);
                
                if(validPassword){
                    const token = await GenerateSignature({ email: existingUser.email, _id: existingUser._id});
                    return FormateData({id: existingUser._id, token });
                } 
            }
    
            return FormateData(null);

        } catch (err) {
            console.log(err);
            throw new APIError('Data Not found', err)
        }

       
    }

    //forgotPassword
    async ForgotPassword(userInputs){

        const { email } = userInputs;
        
        try {
            
            const user = await this.repository.FindEmployee({ email});

            //create link to reset password using tokens
            if(user){
                const secret = APP_SECRET + user.password
                const payload = {
                    email: user.email,
                    id:user._id
                }
                const resetToken = jwt.sign(payload,secret,{expiresIn:'15m'});


                sendResetMail(user.email,user._id,resetToken);

            }
                
            return;
            
        } catch (err) {
            console.log(err);
            throw new APIError('Data Not found', err)
        }
    }

    //Reset token auth -- GET Form 
    async ResetTokenAuth(id,token){
        
        try {
            const employee = await this.repository.FindById(id);
            // console.log(employee);
           
            if(employee)
            {
                const secret = APP_SECRET + employee.password
                    //payload has email and id of user
                    const payload = jwt.verify(token,secret)
                    if(payload){
                        await this.repository.newResetPass(payload)
                    }
                    
            }
               
            return FormateData(employee)
                    
                
        } catch (err) {
            console.log(err);
            throw new APIError('Data Not found')
        }
    }

    //Reset token auth ---POST
    async ResetPass(id,token,password){
        
        // create salt
        
        let salt = await GenerateSalt();
        
        let userPassword = await GeneratePassword(password, salt);

        try {
            const employee = await this.repository.FindById(id);
            // console.log(employee);
           
            if(employee)
            {
                const secret = APP_SECRET + employee.password
                    //payload has email and id of user
                    const payload = jwt.verify(token,secret)
                    
                    const setNewPass = await this.repository.newResetPass(payload,salt,userPassword)
                    
                    if(setNewPass){
                        return;
                    }
            }
               
            // return FormateData(employee)
                    
                
        } catch (err) {
            console.log(err);
            throw new APIError('Data Not found')
        }
    }

        

    


       
    
    
    async GetAllEmployees(queryStr){
        try{
            const employee = await this.repository.Employees(queryStr);
            
            return FormateData({
                employee,
            })
            
        }catch(err){
            throw new APIError('Data Not found')
        }
    }
    
    async GetEmployeeById(employeeId){
        try {
            const employee = await this.repository.FindById(employeeId);
            return FormateData(employee)
        } catch (err) {
            throw new APIError('Data Not found')
        }
    }

    //user signup
    async UserSignUp(userInputs){
        
        const { email, password, details, role } = userInputs;
        
        try{
            // create salt
            let salt = await GenerateSalt();
            
            let userPassword = await GeneratePassword(password, salt);
            
            const existingUser = await this.repository.CreateUser({ email, password: userPassword, details,role, salt});
            
            const token = await GenerateSignature({ email: email, _id: existingUser._id});
            


            return FormateData({id: existingUser._id, token });

        }catch(err){
            throw new APIError('Data Not found', err)
        }

    }

    //user login
    async SignIn(userInputs){

        const { email, password } = userInputs;
        
        try {
            
            const existingUser = await this.repository.FindUser({ email});

            if(existingUser){
            
                const validPassword = await ValidatePassword(password, existingUser.password, existingUser.salt);
                
                if(validPassword){
                    const token = await GenerateSignature({ email: existingUser.email, _id: existingUser._id});
                    return FormateData({id: existingUser._id, token });
                } 
            }
    
            return FormateData(null);

        } catch (err) {
            throw new APIError('Data Not found', err)
        }

       
    }

    //user own password update
    async UpdateMyPassword(Id,newPassword){
        let salt = await GenerateSalt();
        
        let encryptedPass = await GeneratePassword(newPassword, salt);
        try {
            const existingUser = await this.repository.UserUpdatePass(Id,encryptedPass,salt);
            if(existingUser)
            {
                return FormateData(existingUser);
            }

    
            return FormateData(null);

        } catch (err) {
            console.log(err);
            throw new APIError('Data Not found', err)
        }

       
    }

    //create dummy employee
    async CreateDummyEmployee(employeeInputs){
        // const {email} = employeeInputs; 
        try{
            const employeeResult = await this.repository.CreateDumEmployee(employeeInputs)
            //send mail after storing in dummydB
            if(employeeResult){
                const email= employeeResult.email;
                const id= employeeResult._id;
               await sendMail(email,id)
            }

            return FormateData(employeeResult);
        }catch(err){
            console.log(err);
            throw new APIError('Data Not found')
        }
    }


    
}

module.exports = EmployeeService;
