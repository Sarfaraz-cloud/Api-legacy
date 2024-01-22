import { LightningElement, track, api } from "lwc";
import getAccessTokenOutput from "@salesforce/apex/AuthorizationController.getAccessTokenOutput";

export default class OAuthLWC extends LightningElement {
  @api callbackURL ;//='https://login.salesforce.com/apex/CompleteAuthorization';
  @api accessTokenURL;//='https://login.salesforce.com/services/oauth2/token';
  @api clientId;// ='3MVG9G9pzCUSkzZs48s1BDZC7MWksaw3DnrRMQRGH6r3EU6j74wfhvYom_G.5LjH4M0Owr7_j6eBseBrfbGss';
  @api clientSecret;//='5279742A05C6902BED023B96B3456A167B65FD77AF1865D1B0AF6999C25B567B';
  @api authURL;// ='https://login.salesforce.com/services/oauth2/authorize';
  @api scope;
  @api state;
  @api grantType;
  @api userName;
  @api password;
  @api systemName;
  @api selectedAuthType;
  @api configRecordId;
  @api apiRequestURL;
  @api oldAccessToken;
  @api oldRefreshToken;
  @api oldResponse;
  @track insertconfigRecordData;
  @track accessToken = "";
  @track openAccessToken = true;
  @track authCode;
  @track accessTokenError;
  @track insertconfigRecord;
  @track actualURL;
  @track refreshToken;
  @track configRecordId
  @api alldatatocarry;


  connectedCallback() {
    console.log('systemName==35>',this.systemName);
    if (this.oldAccessToken != null) {
      this.refreshToken = this.oldRefreshToken;
      this.accessToken = this.oldAccessToken;
      this.actualURL = this.authURL;
      this.handleUpdateConfig();
    }
    this.actualURL = this.authURL;
  }
  
  @api superChildComp (authcode){
    this.accessToken = "";
    this.accessTokenError = "";
    this.authCode = authcode;
    this.getAccessToken();
   }

  handleAuthClick() {
    this.actualURL = this.authURL;
    if (this.authURL) {
      this.authURL += "?response_type=code";
      if (
        this.clientId !== null &&
        this.clientId !== undefined &&
        this.clientId !== ""
      ) {
        this.authURL += `&client_id=${this.clientId}`;
      }
      if (
        this.callbackURL !== null &&
        this.callbackURL !== undefined &&
        this.callbackURL !== ""
      ) {
        this.authURL += `&redirect_uri=${encodeURIComponent(this.callbackURL)}`;
      }
      if (
        this.scope !== null &&
        this.scope !== undefined &&
        this.scope !== ""
      ) {
        this.authURL += `&scope=${this.scope}`;
      }
      if (
        this.state !== null &&
        this.state !== undefined &&
        this.state !== ""
      ) {
        this.authURL += `&state=${this.state}`;
      }
    } else {
      return "";
    }
    if (this.grantType === "Authorization Code") {
      const popupName = "_blank";
      const popupFeatures =
        "width=700,height=500,scrollbars=yes,resizable=yes,menubar=no,toolbar=no";
      window.open(this.authURL, popupName, popupFeatures);
    } else if (this.grantType === "Password Credentials") {
      if (
        this.clientId &&
        this.clientSecret &&
        this.userName &&
        this.password
      ) {
        this.accessToken = "";
        this.accessTokenError = "";
        this.getAccessToken();
      } else {
        console.log("Some of the required values are null. Cannot proceed.");
      }
    } else if (this.grantType === "Client Credential") {
      if (this.clientId && this.clientSecret && this.scope && this.state) {
        this.accessToken = "";
        this.accessTokenError = "";
        this.getAccessToken();
      } else {
        console.log("Some values are null. Cannot proceed.");
      }
    }
  }

  getAccessToken() {
    const params = {
      authCode: this.authCode,
      CLIENT_ID: this.clientId,
      CLIENT_SECRET: this.clientSecret,
      REDIRECT_URI: this.callbackURL,
      SCOPE: this.scope,
      STATE: this.state,
      API_ENDPOINT: this.accessTokenURL,
      grantType: this.grantType,
      Password: this.password,
      UserName: this.userName
    };
    console.log('parameter access token' + JSON.stringify(params));

    getAccessTokenOutput(params)
      .then((result) => {
        for (let key in result) {
          if (result.hasOwnProperty(key)) {
            let value = JSON.stringify(result[key]);
            if (key === "accessToken") {
              this.accessToken = value.replace(/"/g, "");
            } else if (key === "refreshToken") {
              this.refreshToken = value.replace(/"/g, "");
            }
          }
        }
        this.handleError(this.accessToken, this.accessTokenError);
        this.handleUpdateConfig();
        const selectedEvent = new CustomEvent("sendtokens", {
              detail: {
                AccessToken: this.accessToken,
                RefreshToken: this.refreshToken
              }
            });
            this.dispatchEvent(selectedEvent);
      })
      .catch((error) => {
        this.handleError(this.accessToken, error);
        console.error("Error while getting access token:", error);
      });
  }
  handleEventUpload(event) {
    let accessTokenError = event.detail.accessTokenError;
    this.handleError(this.accessToken, accessTokenError);
  }

  handleError(result, error) {
    if (result != null) {
      this.accessToken = result;
    }

    if (Array.isArray(error.body)) {
      console.log('error.body',error.body);
      this.accessTokenError = error.body.map((e) => e.message).join(", ");
    } else if (typeof error === "string") {
      this.accessTokenError = error;
    }
    //  else if (typeof error.body.message === "string") {
    //   this.accessTokenError = error.body.message;
    // }
  }

  handleUpdateConfig() {
    this.insertconfigRecord = {
      Id: this.configRecordId,
      External_System_Name__c: this.systemName,
      Callback_URL__c: this.callbackURL,
      Access_Token_URL__c: this.accessTokenURL,
      Client_ID__c: this.clientId,
      Client_secret__c: this.clientSecret,
      Username__c: this.userName,
      Password__c: this.password,
      Authentication_URL__c: this.actualURL,
      scope__c: this.scope,
      state__c: this.state,
      Grant_Type__c: this.grantType,
      Type__c: this.selectedAuthType,
      accessToken__c: this.accessToken,
      Api_Request_URL__c: this.apiRequestURL,
      Platform_refresh_token__c: this.refreshToken,
      Old_Query_Response__c:this.oldResponse
    };
      this.insertconfigRecordData = this.insertconfigRecord;
      console.log('insertconfigRecordData==>',JSON.stringify(this.insertconfigRecordData));
    if(JSON.stringify(this.insertconfigRecordData).length>0){
           this.authLwcPageHandle();
    }
  }
  authLwcPageHandle(){
    this.dispatchEvent(new CustomEvent('authlwcpagehandle', {
      detail: {
        insertconfigRecordData : this.insertconfigRecordData, 
      }
  }));
  }
}