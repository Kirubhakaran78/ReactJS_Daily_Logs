var CryptoJS = require("crypto-js");
const keyString = "your-16-byte-key"; // Replace with a 16-byte string key
const ivString = "your-16-byte-iv"; // Replace with a 16-byte string iv
var key = CryptoJS.enc.Utf8.parse(keyString);
var iv = CryptoJS.enc.Utf8.parse(ivString);
async function Encrypt(text) {
  try {
     var ciphertext = CryptoJS.AES.encrypt(text, key, { iv: iv });
  return ciphertext.toString(); // Convert to Base64 string
  } catch (error) {
        
    console.error("Decryption error:", error.message);
    return null;
  }
 
}

async function Decrypt(ciphertext) {
  try {
    // Decrypt using the Base64-encoded string
    var bytes = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv });
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!originalText) {
      throw new Error("Decryption failed. Check your key, iv, or ciphertext.");
    }
    
    return originalText;
  } catch (error) {
    
    console.error("Decryption error:", error.message);
    return null;
  }
}



const SECRET_VALUE = 'AGARAM_SDMS_SCRT';  // Your secret
const ITERATIONS = 100;

// AES encryption function (salt + iv + ciphertext) AGARAM_SDMS_SCRT"
export default function encryptCompatibleWithJava(msg) {
  // Generate 16-byte salt and IV
  
  const salt = CryptoJS.lib.WordArray.random(16);
  const iv = CryptoJS.lib.WordArray.random(16);

  // Derive key from password and salt using PBKDF2
  const key = CryptoJS.PBKDF2(SECRET_VALUE, salt, {
    keySize: 128 / 32, // 128-bit key
    iterations: ITERATIONS
  });

  // Encrypt the message using AES
  const encrypted = CryptoJS.AES.encrypt(msg, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  // Combine salt + iv + ciphertext (all hex/base64 safe)
  const transitMessage = salt.toString() + iv.toString() + encrypted.toString();
  return transitMessage;
}
const Scret = { VALUE: "AGARAM_SDMS_SCRT" };
const saltHex = '43f6007b2eebff13cf10434496ca58ee';
const ivHex   = '5376fa15ccc44a12dedcca82b22f0540';


function CF_encrypt(msg) {
	var salt = CryptoJS.lib.WordArray.random(128/8);
	  
	  var key = CryptoJS.PBKDF2(Scret.VALUE, salt, {
	      keySize: 128/32,
	      iterations: iterations
	    });

	  var iv = CryptoJS.lib.WordArray.random(128/8);
	  
	  var encrypted = CryptoJS.AES.encrypt(msg, key, { 
	    iv: iv, 
	    padding: CryptoJS.pad.Pkcs7,
	    mode: CryptoJS.mode.CBC
	    
	  });
	  
	  // salt, iv will be hex 32 in length
	  // append them to the ciphertext for use  in decryption
	  var transitmessage = salt.toString()+ iv.toString() + encrypted.toString();
	  return transitmessage;
}

 const CF_encryptold = (msg) => {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);

    const key = CryptoJS.PBKDF2(Scret.VALUE, salt, {
      keySize: 128 / 32,
      iterations: 100,
    });

    const iv = CryptoJS.lib.WordArray.random(128 / 8);

    const encrypted = CryptoJS.AES.encrypt(msg, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    const transitmessage =
      salt.toString() + iv.toString() + encrypted.toString();
    return transitmessage;
  };
var iterations = 100;
function CF_encrypt1(msg) {
	var salt = CryptoJS.lib.WordArray.random(128/8);
	    var iv = CryptoJS.lib.WordArray.random(128/8);
	  var key = CryptoJS.PBKDF2(SECRET_VALUE.toString(), salt, {
	      keySize: 128/32,
	      iterations: 100
	    });  
	  var encrypted = CryptoJS.AES.encrypt(msg, key, { 
	    iv: iv, 
	    padding: CryptoJS.pad.Pkcs7,
	    mode: CryptoJS.mode.CBC
	    
	  });
	  
	  var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
  var decrt=   CF_decrypt(transitmessage)
	  return transitmessage;
}

function CF_decrypt(encryptedAES) {
	var salt = CryptoJS.enc.Hex.parse(encryptedAES.substr(0, 32));
	  var iv = CryptoJS.enc.Hex.parse(encryptedAES.substr(32, 32));
	  var encrypted = encryptedAES.substring(64);
	  
	  var key = CryptoJS.PBKDF2(Scret.VALUE, salt, {
	      keySize: 128/32,
	      iterations: iterations
	    });

	  var decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
	    iv: iv, 
	    padding: CryptoJS.pad.Pkcs7,
	    mode: CryptoJS.mode.CBC
	    
	  });
	  
	  return decrypted.toString(CryptoJS.enc.Utf8);
}




export { Encrypt, Decrypt ,CF_encrypt, CF_decrypt};
