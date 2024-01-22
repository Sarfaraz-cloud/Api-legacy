import { LightningElement, wire,track,api} from 'lwc';

import getConfigData from '@salesforce/apex/ConfigurationCntr.getConfigData';

export default class Homepage extends LightningElement {
    @track integrationwith;
    @track externalOptions = true;
    @track others = false;
    @track selectedType;
    @track systemName;
    @track allconfigdata;
    @track filteredConfigdata;
    @track slectedsystemname;
    @api alldatatocarry;
    @track selectedIntegrationWith;
    
    
    connectedCallback(){ 
        console.log('connected call back filter data' ,JSON.stringify(this.alldatatocarry));;
        if(this.alldatatocarry["selectedType"] != undefined && this.alldatatocarry["selectedType"] !=null){
            this.selectedIntegrationWith = this.alldatatocarry["selectedType"];
            this.selectedType = this.alldatatocarry["selectedType"];
            this.systemName = this.alldatatocarry["systemName"];
          
            this.filteredConfigdata = this.alldatatocarry["filteredConfigdata"];
            this.integrationwith = this.alldatatocarry["integrationwith"];
            this.dispatchEventHandle();
        }
    }
    @wire (getConfigData)
	wiredConfigData({data, error}){
		if(data) {
            this.allconfigdata = data;
            this.integrationwith = data.map(record => ({
                label: record.External_System_Name__c,
                value: record.Id
            }));
            
            this.integrationwith.push({label: 'Others',value: 'Others'});
		}else {
			this.integrationwith = [{label: 'Others',value: 'Others'}];
		}
         if(this.integrationwith.length>0){
            console.log('this.integrationwith=40==>',JSON.stringify(this.integrationwith));
            console.log('this.alldatatocarry=41==>',JSON.stringify(this.alldatatocarry));
            this.dispatchEventHandle();
        }
        
       
	}

    handleTypeChange(event){
        this.externalOptions =false;
         this.selectedType = event.target.value;
         if(this.selectedType.length>0){
            console.log('this.selectedType=53==>',JSON.stringify(this.selectedType));
            console.log('this.alldatatocarry=54==>',JSON.stringify(this.alldatatocarry));
            this.dispatchEventHandle();
        }
         let filteredConfigdata =[];
        if(this.selectedType == 'Others'){
            console.log('close');
            this.others = true;
            this.filteredConfigdata = [];
        }
        else{
            this.filterRecord();
            this.others = true;
            filteredConfigdata =  this.filteredConfigdata;
            if(this.filteredConfigdata.length>0){
            console.log('this.filteredConfigdata=70==>',JSON.stringify(this.filteredConfigdata));
            console.log('this.alldatatocarry=71==>',JSON.stringify(this.alldatatocarry));
                this.dispatchEventHandle();
            }
        }
    }
   

    handleSystemNameChange(event){
        this.systemName = event.target.value;
        console.log('system name  value' , this.systemName);
        if(this.systemName.length>0){
            console.log('this.filteredConfigdata=82==>',JSON.stringify(this.systemName));
            console.log('this.alldatatocarry=83==>',JSON.stringify(this.alldatatocarry));
            this.dispatchEventHandle();
        }
    }

    filterRecord() {
        this.filteredConfigdata = [];
        this.filteredConfigdata = this.allconfigdata.filter(record => {
          return record.Id === this.selectedType;
        });
         this.systemName = this.filteredConfigdata[0].External_System_Name__c;
        if(this.systemName.length>1){
            console.log('this.systemName=95==>',JSON.stringify(this.systemName));
            console.log('this.alldatatocarry=95==>',JSON.stringify(this.alldatatocarry));
            this.dispatchEventHandle();
        }
    }
    dispatchEventHandle(){
        this.dispatchEvent(new CustomEvent('homepageevent', {
            detail: {
                systemName : this.systemName,
                filteredConfigdata : this.filteredConfigdata,
                selectedType : this.selectedType,
                integrationwith : this.integrationwith,
               selectedIntegrationWith :this.selectedIntegrationWith
            }
        }));
    }
}