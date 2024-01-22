/* eslint-disable no-confusing-arrow */
/* eslint-disable dot-notation */
import { LightningElement, track, api } from "lwc";
import makeHttpRequest from "@salesforce/apex/HttpRequestController.makeHttpRequest";
import createConfigData from "@salesforce/apex/ConfigurationCntr.createConfigData";

export default class ApiRequest extends LightningElement {
  @track response = "";
  @api insertconfigRecord;
  @api actualURL;
  @track openfieldMapping = false;
  @track fieldResponse;
  @track url;
  @track method = "GET";
  @track headers = "";
  @track requestBody = "";
  @track showHeaders = false;
  @track showBody = false;
  @track showQueryParams = false;
  @track showError = false;
  @track headersList = [{ id: "header_1", key: "", value: "" }];
  @track queryParamsList = [{ id: "param_1", key: "", value: "" }];
  @track buttonColor;
  @track bodyButtonColor;
  @track paramButtonColor;
  @track accessTokenError;
  @track configRecordId;
  @track oldAccessToken;
  @track oldQueryResponse;
  @track oldResponsedata = false;
  urlPlcaeHolder = "https://login.salesforce.com/services/data/v42.0/query";
  value = "GET";
  enableSpinner = false;
  insertApiData;
  @api alldatatocarry;

  get methodOptions() {
    return [
      { label: "GET", value: "GET" },
      { label: "POST", value: "POST" },
      { label: "PUT", value: "PUT" },
      { label: "DELETE", value: "DELETE" }
    ];
  }
  connectedCallback() {
    console.log('this is actual URL==46',this.actualURL);
    console.log('AllCarryData==46==>',JSON.stringify(this.alldatatocarry));
    console.log('@respose Data@@==>',this.alldatatocarry["response"]);
    console.log('SystemNameValue==48=>',this.alldatatocarry["systemName"]);
    let responseData = this.alldatatocarry.insertconfigData;
      if (this.alldatatocarry.insertconfigData != null) {
        this.insertconfigRecord = responseData;
      }
   
    if (this.insertconfigRecord) {
        this.url = this.insertconfigRecord.Api_Request_URL__c;
        this.oldQueryResponse = this.insertconfigRecord.Old_Query_Response__c;        
        if (this.oldQueryResponse) {
            this.openfieldMapping = true;
            this.response = this.oldQueryResponse;
            this.fieldResponse = this.oldQueryResponse;
            this.configRecordId = this.insertconfigRecord.Id
            this.oldResponsedata = true;
          this.dispatchApiRequestEventHandle();
       }
       console.log('this.response=63==>',this.response);
    }
     if (this.alldatatocarry["response"] != null){
      let responseData = this.alldatatocarry["response"] ;
      let url = this.alldatatocarry["url"];
        console.log('this is stringyfy response Data===>', JSON.stringify(responseData));
        this.response = responseData;
        this.url = url;
      }
     }
  

  handleMethodChange(event) {
    this.method = event.target.value;
  }

  handleUrlChange(event) {
    this.url = event.target.value;
    if(this.url){
      this.dispatchApiRequestEventHandle();
    }
    console.log('Url Value=>>>>',this.url);
    let parts = this.url.split("?query=");
    if (parts.length === 2) {
      let baseUrl = parts[0];
      let query = parts[1];
      let encodedQuery = encodeURIComponent(query);
      this.url = [];
      this.url = baseUrl + "?query=" + encodedQuery;
    }
  }

  handleHeadersKeyChange(event) {
    let headerId = event.target.dataset.id;
    let updatedHeaders = this.headersList.map((header) =>
      header.id === headerId ? { ...header, key: event.target.value } : header
    );
    this.headersList = updatedHeaders;
  }

  handleHeadersValueChange(event) {
    let headerId = event.target.dataset.id;
    let updatedHeaders = this.headersList.map((header) =>
      header.id === headerId ? { ...header, value: event.target.value } : header
    );
    this.headersList = updatedHeaders;
  }

  handleAddClick() {
    let newHeaderId = "header_" + (this.headersList.length + 1);
    this.headersList = [
      ...this.headersList,
      { id: newHeaderId, key: "", value: "" }
    ];
  }

  handleRemoveClick() {
    if (this.headersList.length > 1) {
      this.headersList.pop();
    }
  }

  handleRequestBodyChange(event) {
    this.requestBody = event.target.value;
  }

  handleQueryParamsButtonClick() {
    this.showQueryParams = !this.showQueryParams;
    if (this.showQueryParams == true) {
      this.paramButtonColor = "brand";
    } else {
      this.paramButtonColor = "";
    }
  }

  handleParamKeyChange(event) {
    let paramId = event.target.dataset.id;
    let updatedParams = this.queryParamsList.map((param) =>
      param.id === paramId ? { ...param, key: event.target.value } : param
    );
    this.queryParamsList = updatedParams;
    this.updateQueryParamsUrl();
  }

  handleParamValueChange(event) {
    let paramId = event.target.dataset.id;
    let updatedParams = this.queryParamsList.map((param) =>
      param.id === paramId ? { ...param, value: event.target.value } : param
    );
    this.queryParamsList = updatedParams;
    this.updateQueryParamsUrl();
  }

  handleAddQueryParamClick() {
    let newParamId = "param_" + (this.queryParamsList.length + 1);
    this.queryParamsList = [
      ...this.queryParamsList,
      { id: newParamId, key: "", value: "" }
    ];
    this.updateQueryParamsUrl();
  }

  handleRemoveQueryParamClick() {
    if (this.queryParamsList.length > 1) {
      this.queryParamsList.pop();
      this.updateQueryParamsUrl();
    }
  }

  buildRequestUrl() {
    let requestUrl = this.url.trim();
    if (this.queryParamsList.length > 0) {
      let queryParams = this.queryParamsList
        .filter((param) => param.key.trim() !== "" && param.value.trim() !== "")
        .map(
          (param) =>
            `${encodeURIComponent(param.key)}=${encodeURIComponent(
              param.value
            )}`
        )
        .join("&");
      requestUrl += "?" + queryParams;
    }

    return requestUrl;
  }
  updateQueryParamsUrl() {
    let queryParams = this.queryParamsList
      .filter((param) => param.key.trim() !== "" && param.value.trim() !== "")
      .map(
        (param) =>
          `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`
      )
      .join("&");

    if (queryParams) {
      this.url = this.url.split("?")[0] + "?" + queryParams;
    } else {
      this.url = this.url.split("?")[0];
    }
  }

  handleSendRequest() {
    this.enableSpinner = true;
    if (!this.url || this.url.trim() === " ") {
      let error = "Url can be Empty.";
      this.handleError(error);      
        // if (error) {
        //   this.response =[];
        //   setTimeout(() => {
        //     this.enableSpinner = false;
        //   }, 2000); 
        // }
      return;
    }
   
    

    let headersMap = this.parseHeaders();
    let requestBody = null;
    if (this.method !== "GET") {
      
      requestBody = this.requestBody.trim();
    }
    console.log("null check 216");
    if (
      (this.method === "POST" ||
        this.method === "PUT" ||
        this.method === "DELETE") &&
      requestBody
    ) {
      try {
      //  console.log('Inside POST Method');
        JSON.parse(requestBody);
      } catch (error) {
        this.response = "Error: Invalid JSON format in the request body.";
        this.handleError(error);
        return;
      }
      headersMap["Content-Type"] = "application/json";
    }
    console.log("log240");
    this.configRecordId = this.insertconfigRecord["Id"];
    this.oldAccessToken = this.insertconfigRecord["accessToken__c"];

    makeHttpRequest({
      url: this.url,
      method: this.method,
      headers: headersMap,
      requestBody: requestBody,
      accesstoken: this.oldAccessToken,
      Id: this.configRecordId
    })
      .then((result) => {
        this.response = JSON.stringify(result);
        this.fieldResponse = result.records;
        if (result.records == null || result.records == undefined) {
          this.fieldResponse = result;
           this.dispatchApiRequestEventHandle();
        }
        if (this.method == "GET") {
          
          if (this.openfieldMapping) {
            console.log('Inside Get Method');
            let error = "";
            this.handleError(error);    
            this.refs.fieldMapping.handleSearch(result);
          }
          this.openfieldMapping = true;
        }
        let tempConfigObj = this.insertconfigRecord;
        let tempHeaders = JSON.stringify(headersMap);
        let tempRequestBodys = JSON.stringify(requestBody);
        console.log('tempConfigObj=271==>',tempConfigObj);
        console.log('tempConfigObj=272==>',JSON.stringify(tempConfigObj));
        console.log('SystemNameValue==273=>',this.alldatatocarry["systemName"]);
        console.log('log=actualURL=274>',this.actualURL);
        tempConfigObj = {
          ...tempConfigObj,
          Api_Request_URL__c: this.url,
          Api_Request_Method__c: this.method,
          Api_Request_Headers__c: tempHeaders,
          Api_Request_Body__c: tempRequestBodys,
          //Authentication_URL__c: this.actualURL,
          Old_Query_Response__c: this.response,
          External_System_Name__c : this.alldatatocarry["systemName"]
        };
        
        createConfigData({ configRecord: tempConfigObj })
          .then((result) => {
            console.log("Data sent successfully", result);
          })
          .catch((error) => {
            console.error("Error sending data", error);
          });
        setTimeout(() => {
          this.enableSpinner = false;
        }, 10000);
      })
      .catch((error) => {
        console.log("ERROR288==>>", JSON.stringify(error));
        let invalidurl ='Invalid URL.';
       
        if (JSON.stringify(error).length>2) {
          this.response =[];
          console.log('this.response =>', this.response)
          this.handleError(invalidurl);
          setTimeout(() => {
            this.enableSpinner = false;
          }, 2000); 
        }
        this.enableSpinner = false;
      });
  }

  parseHeaders() {
    let headersMap = {};
    for (let header of this.headersList) {
      let key = header.key.trim();
      let value = header.value.trim();
      if (key && value) {
        headersMap[key] = value;
      }
    }
    return headersMap;
  }

  handleHeadersButtonClick() {
    this.showHeaders = !this.showHeaders;
    if (this.showHeaders == true) {
      this.buttonColor = "brand";
    } else {
      this.buttonColor = "";
    }
  }

  handleBodyButtonClick() {
    this.showBody = !this.showBody;
    if (this.showBody == true) {
      this.bodyButtonColor = "brand";
    } else {
      this.bodyButtonColor = "";
    }
  }

  handleError(error) {
    if (Array.isArray(error.body)) {
      this.accessTokenError = error.body.map((e) => e.message).join(", "); 
    //else if (typeof error.body.message === "string") {
         //this.accessTokenError = error.body.message;
    // } 
    }else if (typeof error === "string") {
      this.accessTokenError = error;
      if (this.accessTokenError) {
        this.response =[];
        setTimeout(() => {
          this.enableSpinner = false;
        }, 2000); 
      }
      console.log('this is 328erroe==>',this.accessTokenError);
      if (this.accessTokenError) {
        this.dispatchApiRequestEventHandle();
      }
    }
    
  }

  spinnerHandler(event) {
    this.enableSpinner = event.detail.value;
    console.log('api Spinner==>',this.enableSpinner);
    this.dispatchApiRequestEventHandle();
  }
  
  dispatchApiRequestEventHandle() {
    this.dispatchEvent(
      new CustomEvent("apirequestpageevent", {
        detail: {
          accessTokenError: this.accessTokenError,
          fieldResponse: this.fieldResponse,
          response : this.response,
          configRecordId: this.configRecordId,
          oldResponsedata: this.oldResponsedata,
          enableSpinner :this.enableSpinner,
          url:this.url
        }
      })
    );
  }
}