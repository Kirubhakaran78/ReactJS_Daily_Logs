import React, { useState } from 'react'
import CryptoJs from "crypto-js";

function EncryptDecrypt() {
    const[text,setText]=useState();
    const[encrypted,setEncrypted]=useState();
    const[decrypted,setDecrypted]=useState();

    const secretkey="mysecretkey";

    function handleEncrypt(){
        const ciphertext=CryptoJs.AES.encrypt(text,secretkey).toString();
        setEncrypted(ciphertext);
    }

    function handleDecrypt(){
        const bytes=CryptoJs.AES.decrypt(encrypted,secretkey);
        const originalText=bytes.toString(CryptoJs.enc.Utf8);
        setDecrypted(originalText);

    }


  return (
    <>
    <div>
      <h2>Encryption and decryption</h2>
      <label htmlFor="text_name"></label>
        <input type="text" id='text_name' onChange={(e)=>setText(e.target.value)}/>

    </div>

    <div>
        <button onClick={handleEncrypt} type='submit'>Encrypt</button>
        <button onClick={handleDecrypt} type='submit'>Decrypt</button>
    </div>
    <p>
        <strong>Encrypted : {encrypted}</strong>
    </p><br />
    <p>
        <strong>Decrypted : {decrypted}</strong>
    </p><br />
    </>
  )
}

export default EncryptDecrypt
