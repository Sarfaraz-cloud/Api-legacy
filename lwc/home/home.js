import { LightningElement, track, wire, api } from 'lwc';

export default class LwcNavigateThroughComponents extends LightningElement {
    @track optionList = [];
    @track usercurrentvalue = 'HomePage';
    @track usercurrentpathvalue = '';
    @track userselectedpathvalue = '';
    @track homepage = true;
    @track apiRequest = false;
    @track autharizationType = false;
    @track fieldMapping = false;
    @track cronMaker = false;
    @track finished = false;
    @track hideLeftButton = false;
    @track hideRightButton = false;
    @track goDisableButton = false;
    @track selectedIntegrationWith;
    @track allDataToCarry =[];
    @track HomePageData =[];

    connectedCallback() {
        let labelList = ['Homepage', 'Autharization Type', 'API Request', 'Field Mapping', 'Schedule Jobs', 'Finished'];
        for (let value of labelList) {
            this.optionList.push({ label: value, value: value, selected: false });
        }
    }

    handleProgressBar(filteredConfigdata) {
        const allSteps = this.template.querySelectorAll('lightning-progress-step');
        allSteps.forEach(step => {
            step.classList.add('unclickable-step');
            if (step.value == 1) {
                if ((this.filteredConfigdata != null || this.filteredConfigdata != '' || this.filteredConfigdata.length > 0) && this.filteredConfigdata != undefined) {
                     step.classList.remove('unclickable-step');
                } else if (this.filteredConfigdata == undefined) {
                    step.classList.add('unclickable-step');
                }
            }
        });
    }

    resetChildComponent() {
        this.processing = true;
        this.homepage = false;
        this.apiRequest = false;
        this.autharizationType = false;
        this.fieldMapping = false;
        this.cronMaker = false;
        this.showChildComponent();
    }

    showChildComponent() {
        for (let option of this.optionList) {
            if (option.selected) {
                if (option.label === 'Homepage') {
                    this.homepage = true;
                    this.hideLeftButton = true;
                    this.hideRightButton = false;
                } else if (option.label === 'Autharization Type') {
                    this.goDisableButton = true;
                    this.autharizationType = true;
                    this.hideLeftButton = false;
                    this.hideRightButton = false;
                } else if (option.label === 'API Request') {
                    this.goDisableButton = true;
                    this.apiRequest = true;
                    this.hideTopButtons = true;
                    this.hideLeftButton = false;
                    this.hideRightButton = false;
                } else if (option.label === 'Field Mapping') {
                    this.goDisableButton = true;
                    this.fieldMapping = true;
                    this.hideTopButtons = false;
                    this.hideLeftButton = false;
                    this.hideRightButton = false;
                } else if (option.label === 'Schedule Jobs') {
                    this.goDisableButton = true;
                    this.cronMaker = true;
                    this.hideTopButtons = true;
                    this.hideRightButton = false;
                    this.hideLeftButton = false;
                } else if (option.label === 'Finished') {
                    
                    this.Finished = true;
                    this.hideTopButtons = true;
                    this.hideRightButton = true;
                    this.hideLeftButton = false;
                } else {
                    console.log('@@@ Error');
                }
            }
        }
        this.processing = false;
    }

    nextPage() {
        let index = 0;
        for (let option of this.optionList) {
            if (option.label === this.usercurrentvalue) {
                index = this.optionList.indexOf(option);
                option.selected = false;
            }
        }
        this.optionList[index + 1].selected = true;
        this.usercurrentvalue = this.optionList[index + 1].label;
        this.resetChildComponent();
    }

    previousPage() {
        let index = 0;
        for (let option of this.optionList) {
            if (option.label === this.usercurrentvalue) {
                index = this.optionList.indexOf(option);
                option.selected = false;
            }
        }
        this.optionList[index - 1].selected = true;
        this.usercurrentvalue = this.optionList[index - 1].label;
        this.resetChildComponent();
    }

    homePageEvent(event){
        this.hideLeftButton =true;
        let systemName = event.detail.systemName;
        let integrationwith = event.detail.integrationwith;
        let filteredConfigdata = event.detail.filteredConfigdata;
        let selectedType = event.detail.selectedType;
        let selectedIntegrationWith = event.detail.selectedIntegrationWith;
        if(selectedIntegrationWith != undefined && selectedIntegrationWith != null){
            this.goDisableButton = false;;
        }
        else if (event.detail.selectedType != null && event.detail.selectedType != undefined) {        
                if(event.detail.systemName != undefined && event.detail.systemName.length >1 ){
                    this.goDisableButton = false;
                }else{
                    this.goDisableButton = true;
                }
            } else {
                this.goDisableButton = true;
            }
        
        this.allDataToCarry= 
            {
            ...this.allDataToCarry,
            systemName: systemName,
            integrationwith: integrationwith,
            filteredConfigdata: filteredConfigdata,
            selectedType:selectedType,
        };
          if(selectedType =='Others'){
            this.allDataToCarry =[];
            systemName ='';;
          }
        console.log('log==system==>',systemName);
        console.log('log==selected==>',selectedType);

        systemName
        console.log('AllData===>1',JSON.stringify(this.allDataToCarry));
    }

    authPageEvent(event) {
        let insertconfigData = event.detail.insertconfigData;
        let accessToken = event.detail.accessToken
        if ( accessToken != undefined && accessToken != null) {
            this.goDisableButton = false;
        }else{
            this.goDisableButton = true;
        }
        this.allDataToCarry = 
            {
            ...this.allDataToCarry,
            insertconfigData : insertconfigData,
            accessToken : accessToken
        };
        console.log('AllData===>2', JSON.stringify(this.allDataToCarry));
    }
    

    apiRequestPageEvent(event){
        console.log('Inside apiRequestPageEvent Method ');
        console.log('spinner==>',event.detail.enableSpinner);
        let accessTokenError = event.detail.accessTokenError;
        console.log('this is access tokken Error174==>',accessTokenError);
        let fieldResponse = event.detail.fieldResponse;
        let response = event.detail.response;
        let url = event.detail.url;
       

        console.log('this is response==>',response);
        console.log("accessTokenError:", accessTokenError);
        let configRecordId = event.detail.configRecordId;
        let oldResponsedata = event.detail.oldResponsedata;
        this.allDataToCarry = 
            {
            ...this.allDataToCarry,
            accessTokenError: accessTokenError,
            fieldResponse: fieldResponse,
            configRecordId: configRecordId,
            oldResponsedata: oldResponsedata,
            response :response,
            url : url
        };

        console.log("accessTokenError=>",accessTokenError," accessTokenError ",accessTokenError," response =>",JSON.stringify(response), " fieldResponse =>",JSON.stringify(fieldResponse)); 
        if ((response != undefined && response != null) || (fieldResponse != undefined && fieldResponse != null)) {
            this.goDisableButton = false;
            console.log('response===>197',JSON.stringify(response)); 
            console.log('accessTokenError===>3',accessTokenError);
            console.log('this is response==196=>S->',JSON.stringify(response));
            console.log('this is response==196=>S->Lenngth=>',response.length);

            if(response != undefined && response != null && response.length>0){           
                this.goDisableButton = false;
            }
            else if(accessTokenError != undefined && accessTokenError !=null){
                console.log('this is URL208==>',url);
                console.log('Inside accessTokenError Block');
                this.goDisableButton = true;
                             
            }
            
        } 
        console.log('AllData===>3', JSON.stringify(this.allDataToCarry));
    }
    fieldMappingEventHandle(event){
        let tableData = event.detail.tableData;
         if(tableData !=null){
            this.goDisableButton = false;
        }else{
            this.goDisableButton = true;
        }
     }

    @api apiFunction(authcode){
        console.log('authcode', authcode);
        this.template.querySelector('c-autharization-type').childComp(authcode);
    }
}