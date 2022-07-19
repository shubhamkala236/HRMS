const SibApiV3Sdk  = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;


const {API_KEY} = require('../config');

module.exports.sendMail = async(emailInfo,id)=>{

  

    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = API_KEY;
    
    // Uncomment below two lines to configure authorization using: partner-key
    // var partnerKey = defaultClient.authentications['partner-key'];
    // partnerKey.apiKey = 'YOUR API KEY';
    
    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
    
    sendSmtpEmail = {
        to: [{
            email: emailInfo,
            name: 'John Doe'
        }],
        templateId: 2,
        params: {
            name: 'Death Note',
            surname: 'Doe',
            id: id
        },
        // headers: {
        //     'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
        // }
    };
    
    apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
      console.log('API called successfully. Returned data: ' + data);
    }, function(error) {
      console.error(error);
    });
    }

    //RESET EMAIL
    module.exports.sendResetMail = async(emailInfo,id,token)=>{

  

      var apiKey = defaultClient.authentications['api-key'];
      apiKey.apiKey = API_KEY;
      
      // Uncomment below two lines to configure authorization using: partner-key
      // var partnerKey = defaultClient.authentications['partner-key'];
      // partnerKey.apiKey = 'YOUR API KEY';
      
      var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      
      var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
      
      sendSmtpEmail = {
          to: [{
              email: emailInfo,
              name: 'John Doe'
          }],
          templateId: 3,
          params: {
              name: 'Death Note',
              surname: 'Doe',
              id: id,
              token: token
          },
          // headers: {
          //     'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
          // }
      };
      
      apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
        console.log('API called successfully. Returned data: ' + data);
      }, function(error) {
        console.error(error);
      });
      }