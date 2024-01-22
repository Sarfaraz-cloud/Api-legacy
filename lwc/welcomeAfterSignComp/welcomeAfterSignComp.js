import { LightningElement,api, track} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getAccessToken from'@salesforce/apex/AuthorizationController.getAccessToken';
 
export default class WelcomeAfterSignComp extends NavigationMixin(LightningElement) {
    @api isSalesforce = false;
    @api accessToken;
    @api refreshToken;
    @track AccessToken ='';
    @track authCode ='';
 
    connectedCallback() {
        // Check if the URL contains an authorization code
        console.log('accessToken',this.accessToken);
        console.log('refreshToken',this.refreshToken);
        const urlParams = new URLSearchParams(window.location.search);
        console.log('urlParams',urlParams);
        const authCode = urlParams.get('code');
        this.authCode = authCode;
        console.log('authCode',authCode);
        if (authCode) {
        getAccessToken({authCode:authCode})
		.then(result => {
            console.log('result',result);
            this.AccessToken = result;
            console.log('accessToken==>',this.accessToken);
            
		})
		.catch(error => {
			this.error = error;
		})
        }
    }

    handleClick(event) {
        console.log('in handle0000');
        console.log('this.authCode', this.authCode);
    
        try {
            window.onload = function () {
                console.log('window.opener',window.opener);
            };
            const parentWindow = window.opener;
            console.log('parentWindow', parentWindow);
            if (parentWindow) {
                console.log('Enter');
                const dataToSend = {
                    authCode: this.authCode
                };
                parentWindow.helloWorld();
                parentWindow.postMessage(dataToSend, '*');
                console.log('Sent authCode to parent window');
                setTimeout(() => {
                       window.close();
                }, 500);
            }
        } catch (ex) {
            console.log('Exception:', ex);
        }
    }
}