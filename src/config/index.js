const dotEnv  = require("dotenv");

dotEnv.config();

// if (process.env.NODE_ENV !== 'employee') {
//     const configFile =  `./.env.${process.env.NODE_ENV}`;
//     dotEnv.config({ path:  configFile });
// } else {
//     dotEnv.config();
// }

module.exports = {

    PORT: process.env.PORT,
    DB_URL: process.env.MONGODB_URI,
    APP_SECRET: process.env.APP_SECRET,
    API_KEY: process.env.API_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET
}
 