const speakeasy = require('speakeasy')
const qrcode = require('qrcode')

/// genarate a secret code base 32
function getTwoAuthenaticationCode()
{
    const secretCode = speakeasy.generateSecret({
      name: process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
    });
    return {
      otpauthUrl : secretCode.otpauth_url,
      base32: secretCode.base32,
    };
}


var sec = getTwoAuthenaticationCode()

// convert secert to img qrcodr
qrcode.toDataURL(secret.otpauth_url,function(err,data){
    console.log(data);
})

