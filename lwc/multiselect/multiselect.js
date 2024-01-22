import { LightningElement, track, api } from 'lwc';

export default class Multiselect extends LightningElement {

    @api values = [];
    @track selectedvalues = [];
    @track listdata = [];
    showdropdown;

    handleleave() {
        let sddcheck = this.showdropdown;

        if (sddcheck) {
            this.showdropdown = false;
            this.fetchSelectedValues();
        }
    }
    onsendlistdata() {
        console.log('In OnSendListData');
        let custEvent = new CustomEvent('change', {
            // detail: [...this.listdata]
            detail: {value: this.listdata}
        })
        this.dispatchEvent(custEvent);
    }
    connectedCallback() {
        this.values.forEach(element => element.selected
            ? this.selectedvalues.push(element.value) : '');
        console.log('this.selectedvalues', JSON.stringify(this.selectedvalues));
    }



    fetchSelectedValues() {
        this.selectedvalues = [];
        this.listdata = [];

        // Get all the selected values
        this.template.querySelectorAll('c-picklist-value').forEach(element => {
            if (element.selected) {
                console.log(element.value);
                this.selectedvalues.push(element.value);
            }
        });

        // Refresh the original list
        this.refreshOrginalList();
        console.log('This is selected value', JSON.stringify(this.selectedvalues));

        console.log('Before loop');

        // for (let key in this.selectedvalues) {
        //     console.log('@@@key@@',key);
        //     if (this.selectedvalues.hasOwnProperty(key)) {
        //         console.log('key', key);
        //         console.log('value', JSON.stringify(this.selectedvalues[key]));
        //             let subvalues =this.selectedvalues[key];
        //         for (let subkey in subvalues) {
        //             console.log('subkey',subkey);
        //             let dataType = typeof subkey;
        //             console.log('dataType',dataType);
        //             this.listdata.push({
        //                 dataType: dataType,
        //                 label: subkey,
        //                 value: subkey
        //             });

        //         }
        //     }
        // }
        for (let key in this.selectedvalues) {
            console.log('@@@key@@', key);
            if (this.selectedvalues.hasOwnProperty(key)) {
                console.log('key', key);
                console.log('value', JSON.stringify(this.selectedvalues[key]));
                let subvalues = this.selectedvalues[key];
                Object.keys(subvalues).forEach((subkey) => {
                    console.log('subkey', subkey);
                    let dataType = typeof subvalues[subkey];
                    console.log('dataType', dataType);
                    this.listdata.push({
                        dataType: dataType,
                        label: subkey,
                        value: subvalues[subkey]
                    });
                });
            }
        }
        
        console.log('listdata', JSON.stringify(this.listdata));
        this.onsendlistdata();
    }

    refreshOrginalList() {
        const picklistvalues = this.values.map(eachvalue => ({ ...eachvalue }));

        picklistvalues.forEach((element, index) => {
            if (this.selectedvalues.includes(element.value)) {
                picklistvalues[index].selected = true;
            } else {
                picklistvalues[index].selected = false;
            }
        });

        this.values = picklistvalues;
    }

    handleShowdropdown() {
        let sdd = this.showdropdown;
        if (sdd) {
            this.showdropdown = false;
            this.fetchSelectedValues();
        } else {
            this.showdropdown = true;
        }
    }
    get selectedmessage() {
        return this.selectedvalues.length + ' values are selected';
    }
}