import { Decrypt, Encrypt } from "../EncrptDecrpt/encryption";

export function setCookie(cname, cvalue) {

    document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";path=/";

}

export function removeCookie(cname) {
  document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Synchronous version for simple cookies
export function getCookieSync(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export async function getCookie(cname) {
  
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      let value = c.substring(name.length, c.length);
      // Try to decrypt first, if it fails, return the plain value
      try {
        return await Decrypt(value);
      } catch (error) {
        // If decryption fails, return the plain value (for simple cookies like 'isAuthenticated')
        return value;
      }
    }
  }
  return '';
}

export async function getCookienormal(cname) {
  
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      let value = c.substring(name.length, c.length);
      // Try to decrypt first, if it fails, return the plain value
      try {
        return value;
      } catch (error) {
        // If decryption fails, return the plain value (for simple cookies like 'isAuthenticated')
        return value;
      }
    }
  }
  return '';
}
// Session storage functions
export function CF_sessionGet(key, encrypt) {
  const sessionValue = sessionStorage.getItem(key);
  return encrypt === 1 ? Decrypt(sessionValue) : sessionValue;
}

export function CF_sessionSet(key, val, encrypt) {
  const valueToStore = encrypt === 1 ? Encrypt(val) : val;
  return sessionStorage.setItem(key, valueToStore);
}


  