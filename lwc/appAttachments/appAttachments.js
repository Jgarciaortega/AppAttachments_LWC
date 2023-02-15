import { LightningElement , api} from 'lwc';
import insertAttachments from "@salesforce/apex/AttachmentLinker.insertAttatchments";
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class AppAttatchments extends LightningElement {

    recordIdselected;
    recordsource;
    attachmentsId = [];

    @api set recordId(value) {
        this.recordsource = value;
    }

    get recordId() {
        return this.recordsource;
    }

    closeModal(){
        this.dispatchEvent(new CloseActionScreenEvent());
    }
    

    setRecordSelected(ev) {
        this.recordIdselected = ev.detail.selectedRecordId
    }

    attachmentsToLink(ev) {
        let attachs = ev.detail;
        this.attachmentsId = [];
        for (let i = 0; i < attachs.length; i++) {
            this.attachmentsId.push(attachs[i].id);
        }
        this.insertTheAttachments();

    }

    insertTheAttachments() {
        
        if(this.recordIdselected != null & this.attachmentsId.length > 0){
        
            insertAttachments({ listIds: this.attachmentsId, toRecordId: this.recordIdselected })
            .then((result) => {
                this.closeModal();
                this.showToast();
            })
            .catch((error) => {
                this.closeModal();
                this.showErrorToast();
                console.log('ERROR')
                console.log(error.body.fieldErrors)
            });

        }
       
    }

    showToast() {
        const event = new ShowToastEvent({
            title: 'Success',
            message: 'Operation sucessful',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

    showErrorToast() {
        
        const evt = new ShowToastEvent({
            title: 'Error',
            message: 'Some unexpected error',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

}