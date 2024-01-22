import { LightningElement, wire, track,api } from 'lwc';
import { getObjectInfo, getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import Configuration_page_OBJECT from '@salesforce/schema/Configuration_page__c';

export default class AutharizationType extends LightningElement {
    @track authTypes;
    @track insertData;
    @track isOAuth2Selected = false;
    @track isApiKeySelected = false;
    @track isJWTbearerSelected = false;
    @track isBearertokenSelected = false;
    @track systemName;
    @track filteredconfigdata;
    @track selectedAuthType;
    @track accessToken;
    @track refreshToken;
    @track accessTokenError;
    @track grantTypeOptions = [
        { label: 'Authorization Code', value: 'Authorization Code' },
        { label: 'Authorization Code(With PKCE)', value: 'Authorization Code(With PKCE)' },
        { label: 'Implicit', value: 'Implicit' },
        { label: 'Password Credentials', value: 'Password Credentials' },
        { label: 'Client Credential', value: 'Client Credential' }
    ];
    @track selectedGrantType = 'Authorization Code';
    @track callbackURL ='https://login.salesforce.com/apex/CompleteAuthorization';
    @track accessTokenURL='https://slack.com/api/oauth.access';
    @track clientId='6166192181637.6192120899488';
    @track clientSecret='bb042ce848c0a9380d72b4c166843a82';
    @track authURL='https://slack.com/oauth/authorize';
    @track scope ='admin';
    @track state;
    @track username;
    @track password;
    configRecordId;
    @track apiRequestURL;
    @track oldRefreshToken;
    @track oldResponse;
     insertconfigData;
    @api alldatatocarry;
     
   
      connectedCallback(){
        console.log('@@@this.alldatatocarry =44=> '+JSON.stringify(this.alldatatocarry)); 
        console.log('InsertConfigData==auth==45',JSON.stringify(this.alldatatocarry["insertconfigData"]));
        if(this.alldatatocarry["insertconfigData"] != undefined && this.alldatatocarry["insertconfigData"] !=null){  
           this.insertconfigData = this.alldatatocarry["insertconfigData"];
        this.accessToken = this.alldatatocarry["accessToken"];
        this.dispatchAuthEventHandle();
        }
        if (this.alldatatocarry["filteredConfigdata"] != undefined && this.alldatatocarry["filteredConfigdata"] != null) {
            console.log('enter if condition==52=>');
            this.filteredconfigdata = this.alldatatocarry["filteredConfigdata"];
                let config = this.filteredconfigdata; 
                this.selectedAuthType = config[0]?.Type__c;
                this.callbackURL = config[0]?.Callback_URL__c;
                this.accessTokenURL = config[0]?.Access_Token_URL__c;
                this.clientId = config[0]?.Client_ID__c;
                this.clientSecret = config[0]?.Client_secret__c;
                this.username = config[0]?.Username__c;
                this.password = config[0]?.Password__c;
                this.authURL = config[0]?.Authentication_URL__c;
                this.scope = config[0]?.scope__c;
                this.state = config[0]?.state__c;
                this.accessToken = config[0]?.accessToken__c
                this.apiRequestURL = config[0]?.Api_Request_URL__c;
                this.handleApiAuthType(this.selectedAuthType);
                this.configRecordId = config[0]?.Id;
                this.oldRefreshToken = config[0]?.Platform_refresh_token__c;
                this.oldResponse = config[0]?.Old_Query_Response__c;
       }  if(this.alldatatocarry["insertconfigData"] != undefined && this.alldatatocarry["insertconfigData"] != null){
        console.log('enter The else Part==>>',this.alldatatocarry["insertconfigData"]);
        let config = this.alldatatocarry["insertconfigData"];
           this.selectedAuthType = config?.Type__c;
           this.callbackURL = config?.Callback_URL__c;
           this.accessTokenURL = config?.Access_Token_URL__c;
           this.clientId = config?.Client_ID__c;
           this.clientSecret = config?.Client_secret__c;
           this.username = config?.Username__c;
           this.password = config?.Password__c;
           this.authURL = config?.Authentication_URL__c;
           this.scope = config?.scope__c;
           this.state = config?.state__c;
           this.accessToken = config?.accessToken__c
           this.apiRequestURL = config?.Api_Request_URL__c;
           this.handleApiAuthType(this.selectedAuthType);
           this.configRecordId = config?.Id;
           this.oldRefreshToken = config?.Platform_refresh_token__c;
           this.oldResponse = config?.Old_Query_Response__c;
        }
    }

    @wire(getObjectInfo, { objectApiName: Configuration_page_OBJECT })
    objectInfo;

    @wire(getPicklistValuesByRecordType, { objectApiName: Configuration_page_OBJECT, recordTypeId: '$objectInfo.data.defaultRecordTypeId' })
    picklistValues({ data, error }) {
        if (data) {
            this.authTypes = data.picklistFieldValues.Type__c.values;
        } else if (error) {
            console.log('unable to fetch Auth Type ==>>', error);
        }
    }

    handleAuthTypeChange(event) {
        this.selectedAuthType = event.target.value;
        this.handleApiAuthType(this.selectedAuthType);
            
    }
    handleApiAuthType(selectedAuthTypes){
        this.isOAuth2Selected = selectedAuthTypes === 'OAuth2.0';
        this.isApiKeySelected = selectedAuthTypes === 'APIKey';
        this.isJWTbearerSelected = selectedAuthTypes === 'JWT';
        this.isBearertokenSelected = selectedAuthTypes === 'Bearer';
        this.isBasicAuthSelected = selectedAuthTypes === 'Basic';
        if(this.selectedAuthTypes){
         this.dispatchAuthEventHandle();
        }
    }

    handleGrantTypeChange(event) {
        this.selectedGrantType = event.target.value;
    }

    handleStateChange(event) {
        this.state = event.target.value;
    }

    handleClientIdChange(event) {
        this.clientId = event.target.value;
    }

    handleClientSecretChange(event) {
        this.clientSecret = event.target.value;
    }

    handleCallbackURLChange(event) {
        this.callbackURL = event.target.value;
    }

    handleScopeChange(event) {
        this.scope = event.target.value;
    }

    handleInputUserNameChange(event) {
        this.username = event.target.value;
    }

    handleInputPasswordChange(event) {
        this.password = event.target.value;
    }

    handleInputChange(event) {
        const fieldName = event.target.label;
        const fieldValue = event.target.value;
    }

    handleAuthURLChange(event){
        this.authURL = event.target.value;
    }

    handleclientAuthentication(event) {
       this.clientAuthentication = event.target.value;
       
    }

    handleAccessTokenURLChange(event){
        this.accessTokenURL = event.target.value;
    
    }
    handleAccessTokenChange(event){
        this.accessToken = event.target.value;
      
    }
    handleRefreshTokenChange(event){
        this.refreshToken = event.target.value;
    }
      
    get isAuthorizationCodeSelected() {
        return this.selectedGrantType === "Authorization Code";
    }

    get isAuthorizationCodeWithPkSelected() {
        return this.selectedGrantType === "Authorization Code(With PKCE)";
    }

    get isImplicitSelected() {
        return this.selectedGrantType === "Implicit";
    }

    get isPasswordCredentialsSelected() {
        return this.selectedGrantType === "Password Credentials";
    }

    get isClientCredentialSelected() {
        return this.selectedGrantType === "Client Credential";
    }

    handleTokenUrlChange(event) {
        let tokenurl = event.target.value;
    }

    handleClearCookies() {
    }
    
   handleinserconfigdata(event){
          this.insertconfigData = event.detail.insertconfigRecordData;
          console.log('this.insertconfigData=208=>',JSON.stringify(this.insertconfigData));
        if(JSON.stringify(this.insertconfigData).length >0)
            {
              this.dispatchAuthEventHandle();
            }
        }
   
    @api childComp (authcode){
        this.template.querySelector('c-oauth-l-w-c').superChildComp(authcode);
        
    }

    getTokens(event){
       this.accessToken = event.detail.AccessToken;
       if(this.accessToken.length >0){
        this.dispatchAuthEventHandle();
       }
       this.refreshToken = event.detail.RefreshToken;
    }

    dispatchAuthEventHandle(){
        this.dispatchEvent(new CustomEvent('authpageevent', {
            detail: {
                insertconfigData : this.insertconfigData,
                accessToken : this.accessToken
            }
        }));
    }

}