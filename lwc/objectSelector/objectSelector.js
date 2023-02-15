import { LightningElement } from 'lwc';

export default class ObjectSelector extends LightningElement {

    objects = [{
        label: 'Account',
        value: 'Account'
    },
    {
        label: 'Contact',
        value: 'Contact'

    },
    {
        label: 'Leads',
        value: 'Leads'

    },
    {
        label: 'Opportunity',
        value: 'Opportunity'

    }];
    objSelected(ev) {
        let evt = new CustomEvent('objselected', {
            detail: ev.target.value
        })
        this.dispatchEvent(evt);
    }
}