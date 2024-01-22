import { LightningElement, api, track } from 'lwc';

export default class FieldMappingChild extends LightningElement {
    @api objectName;
    @api responseFields;
    @api salesforceFields;
    @api requiredMapping;
    @track isrequriedFieldOptionsLoaded = true;
    @track isfieldOptionsLoaded = true;
    @track openTable =true;

    openCloseTable(event){
        let testing = event.target.value;
        console.log('testing',testing);

    }

}