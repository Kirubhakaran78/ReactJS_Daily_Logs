
import { getCookie, getCookienormal} from "../Components/Common/CookieSessionStorage/CookieFun";
import configData from "../config.json";
import axios from "axios";

const baseUrl = configData.SERVER_URL; 
const timeout = configData.TIME_OUT;
const production_URl =configData.Production_URL;
const serviceName=configData.Service_name
async function validate(req, endpoint,site) {
  let fullUrl;
  // const fullUrl = baseUrl + endpoint;
const machineName = window.location.hostname;
let port = window.location.port;
if (production_URl) {
  fullUrl = `http://${machineName}:${port}/${serviceName}/${endpoint}`;
} else {
  // const fullUrl = ${baseUrl}${endpoint}?site=${site};
  fullUrl = `${baseUrl}/${serviceName}/${endpoint}`;
}
  return await axios
    .post(fullUrl, req, {
      timeout: timeout,
    headers: {
    "Content-Type": "application/json; charset=utf-8"
  },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    })
    .then((response) => {
      
      const data = response.data;
      return data;
    })
    .catch((errs) => {
      
      const errormsg = errs.message;
      const err = {
        Resp: {
          Sts: "0",
          desc: errormsg,
        },
      };
      
      // alert(err);
      console.error(`API error: ${err}`);
      // return JSON.stringify(err); // Return error object as JSON string
      var error = {
        error:errs.message
      }
      return error;
    });
}
export async function postAPI(req, endpoint, first = false, site) {
  ;
  
  let sitedata;
  if (site !== undefined) {
    sitedata = site;
  } else {
    sitedata = await getCookienormal("site");
  }

  const Auth = true; // Assuming Auth check logic is handled elsewhere

  if (Auth || first) {
    ;
    const response = await validate(req, endpoint, sitedata);
    let resp;

    // Check if the response.error is defined and not empty
    if (response.error !== undefined && response.error !== '' ) {
      // If there's an error, throw it
      if(response.error == 'Network Error'){
        // dispatch(DialogBox_State(true))
        // dispatch(api_MSG(response.error))
      }
  
      throw new Error(response.error);
    }
    
      resp = {
        Resp: {
          Sts: "1",
          desc: response,
        },
      
    }
   
    let Result = JSON.stringify(resp);
    ;

    // Return false if the ErrCode is 10000, otherwise return the result
    return response?.Resp?.ErrCode === 10000 ? false : Result;
  } else {
    ;
    return false;
  }
}


// Updated postAPI function to accept a dynamic endpoint
export async function postAPIS(req, endpoint, first = false,site) {
  
  // const Auth = UseAuth();
  let sitedata;
  if (site != undefined){
    sitedata = site
  }else{
    sitedata = await getCookienormal("site");
  }
  const Auth = true;
  if (Auth || first) {
    
    const response = await validate(req, endpoint,sitedata);
    // let resp = JSON.parse(response); row.Resp.desc[0].error == ''
    let resp ;
    //if(JSON.parse(response).Resp.Sts != 0){
    if(response.error == undefined || response.error == '' || response[0].error == '' ) {
      resp = {
        Resp: {
          Sts: "1",
          desc: response,
        },
      };
    }else{
      resp = {
        Resp: {
          Sts: "0",
          desc: response[0].error,
        },
      };
  

    }
      
    // let resp = response;
    let Result = JSON.stringify(resp)
    
    // return resp?.Resp?.ErrCode == 10000 ? false : response;
    return response?.Resp?.ErrCode == 10000 ? false : Result;
  } else {
    
    return false;
  }
}
async function validateuserimport(req, endpoint,site) {
  let fullUrl;
  // const fullUrl = baseUrl + endpoint;
const machineName = window.location.hostname;
let port = window.location.port;
if (production_URl) {
  fullUrl = `http://${machineName}:${port}/${serviceName}/${endpoint}`;
} else {
  // const fullUrl = ${baseUrl}${endpoint}?site=${site};
  fullUrl = `${baseUrl}/${serviceName}/${endpoint}`;
}
  return await axios.post(fullUrl, req, {
  timeout: timeout,
  headers: {
    "Content-Type": "multipart/form-data"
  },
  maxContentLength: Infinity,
  maxBodyLength: Infinity
}).then((response) => {
      
      const data = response.data;
      return data;
    }).catch((errs) => {
      
      const errormsg = errs.message;
      const err = {
        Resp: {
          Sts: "0",
          desc: errormsg,
        },
      };
      
      // alert(err);
      console.error(`API error: ${err}`);
      // return JSON.stringify(err); // Return error object as JSON string
      var error = {
        error:errs.message
      }
      return error;
    });
}

export async function postAPIUserimport(req, endpoint, first = false,site) {
  
  // const Auth = UseAuth();
  let sitedata;
  if (site != undefined){
    sitedata = site
  }else{
    sitedata = await getCookienormal("site");
  }
  const Auth = true;
  if (Auth || first) {
    
    const response = await validateuserimport(req, endpoint,sitedata);
    // let resp = JSON.parse(response); row.Resp.desc[0].error == ''
    let resp ;
    //if(JSON.parse(response).Resp.Sts != 0){
    if(response.error == undefined || response.error == '' || response[0].error == '' ) {
      resp = {
        Resp: {
          Sts: "1",
          desc: response,
        },
      };
    }else{
      resp = {
        Resp: {
          Sts: "0",
          desc: response[0].error,
        },
      };
  

    }
      
    // let resp = response;
    let Result = JSON.stringify(resp)
    
    // return resp?.Resp?.ErrCode == 10000 ? false : response;
    return response?.Resp?.ErrCode == 10000 ? false : Result;
  } else {
    
    return false;
  }
}