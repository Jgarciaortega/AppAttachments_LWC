import { LightningElement, wire, api } from 'lwc';
import getAttatchments from "@salesforce/apex/AttachmentLinker.getAttatchmentsByRecord";

const columns = [
    { label: 'Attatment Name', fieldName: 'title' },
    { label: 'Created by', fieldName: 'createdBy' },
    { label: 'Created Date', fieldName: 'createdDate' },
];

export default class TableAttachments extends LightningElement {

    attatchments;
    @api recordsource;
    recordselected;
    attachmentSelected = false;
    btnFinishAvailable = false;
    data = [];
    columns = columns;

    @api 
    get recordSelected(){
        return this.recordselected
    }
    set recordSelected(value){      
        this.recordselected = value;
        this.switchBtnFinish();
    }

    @wire(getAttatchments, { recordSource: '$recordsource' })
    wiredAttatchments({ error, data }) {
        this.attatchments = [];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                this.attatchments.push({
                    id: data[i].ContentDocumentId,
                    title: data[i].ContentDocument.Title,
                    createdBy: data[i].ContentDocument.CreatedBy.FirstName + ' ' + data[i].ContentDocument.CreatedBy.LastName,
                    createdDate: this.parseDate(data[i].ContentDocument.CreatedDate)
                })
            }
        } else if (error) {
            this.error = error;
            console.error('error => ', error)
        }
    }

    handleFinishClick() {
        let selectedRows = this.template.querySelector('lightning-datatable').getSelectedRows();
        let evt = new CustomEvent('handlefinishclick', {
            detail: selectedRows
        })
        this.dispatchEvent(evt)
    }

    handleCancelClick() {
        let evt = new CustomEvent('handlecancelclick', {
            detail: false
        })
        this.dispatchEvent(evt)
    }

    clickInRow(ev) {
        const selectedRows = ev.detail.selectedRows;
        if (selectedRows.length > 0) {
            this.attachmentSelected = true
        }
        else {
            this.attachmentSelected = false
        }
        this.switchBtnFinish();

    }

    switchBtnFinish() {
        if (this.attachmentSelected & this.recordselected != null
            & this.recordselected != '') {
            this.btnFinishAvailable = true;
        } else {
            this.btnFinishAvailable = false;
        }
    }

    parseDate(oldDate) {
        let newDate = oldDate.split('T')
        return newDate[0]
    }


}