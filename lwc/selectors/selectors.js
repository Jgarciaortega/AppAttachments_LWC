import { LightningElement } from 'lwc';

export default class Selectors extends LightningElement {

    objSelected;

    setObjSelected(ev) {
        this.objSelected = ev.detail
    }

    recordselection(ev){
       const newEvent = new CustomEvent('recordselection', {
            detail: { selectedRecordId: ev.detail.selectedRecordId, selectedValue: ev.detail.selectedValue }
        })
        this.dispatchEvent(newEvent);

    }

}