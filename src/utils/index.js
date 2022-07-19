const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
// const Sib = require('sib-api-v3-sdk');

// const nodeMailer = require('nodemailer');

// const axios = require('axios');

const { APP_SECRET} = require('../config');

//Utility functions
module.exports.GenerateSalt = async() => {
        return await bcrypt.genSalt()    
},

module.exports.GeneratePassword = async (password, salt) => {
        return await bcrypt.hash(password, salt);
};


module.exports.ValidatePassword = async (enteredPassword, savedPassword, salt) => {
        return await this.GeneratePassword(enteredPassword, salt) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
        return await jwt.sign(payload, APP_SECRET, { expiresIn: '1d'} )
}, 

module.exports.ValidateSignature  = async(req) => {

        const signature = req.get('Authorization');

        console.log(signature);
        
        if(signature){
            const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET);
            req.user = payload;
            return true;
        }

        return false
};

module.exports.FormateData = (data) => {
        if(data){
            return { data }
        }else{
            throw new Error('Data Not found!')
        }
    }

// SendinBlue api 
// module.exports.SendEmail = async()=>{
//         const client = Sib.ApiClient.instance

//         const apiKey = client.authentications['api-key']
//         apiKey.apiKey = process.env.API_KEY
        
//         const campaignEmailApi = new Sib.campaignEmailApi()

//         const sender = {
//                 email:'lawkktd@gmail.com'
//         }

//         const receiver = [
//                 {
//                         email:'shinegami236@gmail.com'
//                 },
//         ]
//         return await campaignEmailApi.sendCampaignEmail({
//                 sender,
//                 to: receiver,
//                 subject: 'hey there from the API',
//                 textContent:`Hey this is the text content`
//         })
// }


// module.exports.PublishCustomerEvent = async(payload) => {
        
//         axios.post('http://localhost:8000/customer/app-events', {
//                 payload
//         })
// }

// module.exports.PublishShoppingEvent = async(payload) => {
//         axios.post('http://localhost:8000/shopping/app-events', {
//                 payload
//         })
// }
