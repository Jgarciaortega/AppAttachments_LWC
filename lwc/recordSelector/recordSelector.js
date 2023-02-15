import { LightningElement, api } from 'lwc';
import getRecords from "@salesforce/apex/AttachmentLinker.getRecords";
export default class RecordSelector extends LightningElement {

    objselected;
    recordList;
    message;
    searchKey = "";
    recordSelected = "";
    selectedRecordId;
    lookupLabel = "Search when user hits the 'enter' key";

    @api
    get objSelected(){
        return this.objselected;
    }
    set objSelected(value){
        this.objselected = value;
        this.recordSelected = "";
        this.selectedRecordId ="";
        this.recordSelected = "";
        this.searchKey = "";
        this.onSeletedRecordUpdate();
    }

    handleKeyChange(ev) {
        const searchKey = ev.target.value;
        console.log(searchKey)
        this.searchKey = searchKey;
        this.getLookupResult();
    }

    onRecordSelection(event) {
        this.selectedRecordId = event.target.dataset.key;
        this.recordSelected = event.target.dataset.name;
        this.searchKey = "";
        this.onSeletedRecordUpdate();
    }

    onSeletedRecordUpdate() {
        const passEventr = new CustomEvent('recordselection', {
            detail: { selectedRecordId: this.selectedRecordId, selectedValue: this.selectedValue }
        });
        this.dispatchEvent(passEventr);
    }

    onLeave(event) {
        setTimeout(() => {
            this.searchKey = "";
            this.recordList = null;
        }, 300);
    }

    removeRecordOnLookup(event) {
        this.searchKey = "";
        this.recordSelected = null;
        this.selectedRecordId = null;
        this.recordsList = null;
        this.onSeletedRecordUpdate();
    }

    getLookupResult() {
        getRecords({ objName: this.objselected, record: this.searchKey })
            .then((result) => {
                if (result.length === 0) {
                    this.recordsList = null;
                    this.message = "No Records Found";
                } else {
                    this.message = "";
                    this.recordList = [];
                    for (let key in result) {
                        this.recordList.push({ Name: result[key], Id: key })
                    }

                }
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                this.recordsList = undefined;
            });
    }
}