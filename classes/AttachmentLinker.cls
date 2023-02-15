/**
* @author Plexus Tech
* @date 2022
*
* @description this class handles the linking of attachments between different objects
*/
public class AttachmentLinker {
    
    /**
    * @description Returns the attachments from an specific record.
    * @param recordSource the id of a record
    * @return a list of ContentDocumentLink 
    * @example
    * */
    @AuraEnabled(cacheable=true)
    public static List<ContentDocumentLink> getAttatchmentsByRecord(String recordSource){
        List<ContentDocumentLink> cdl = [select Id,LinkedEntity.name,ContentDocumentId,ContentDocument.CreatedDate,
                                         ContentDocument.CreatedBy.FirstName,ContentDocument.CreatedBy.LastName,ContentDocument.Title 
                                         from ContentDocumentLink where LinkedEntityId =: recordSource];
        return cdl;
    }
    
    /**
    * @description Insert a list of attachments in a record destination
    * @param listIds  list of Id attachments 
    * @param toRecordId  id of record destination
    * @example
    * */
    @AuraEnabled(cacheable=false)
    public static void insertAttatchments(List<Id> listIds, String toRecordId){
        System.debug('listIds');
        System.debug(listIds);
        System.debug('toRecordId');
        System.debug(toRecordId);
      List<ContentDocumentLink> cdl = new List<ContentDocumentLink>();
        for(Id id: listIds){
            ContentDocumentLink c = new ContentDocumentLink();
            c.LinkedEntityId = toRecordId;
            c.ContentDocumentId = id;
            cdl.add(c);
        }
        insert cdl;      
    }
    
    /**
    * @description Universal method to return specific records of different objects
    * @param objName name of the object where we want to get records
    * @param record name of record that we are looking for
    * @return a map with id/name of the different records
    * @example
    * */
    @AuraEnabled(cacheable=true)
    public static Map<Id, String> getRecords(String objName, String record){   
 
        switch on objName {
            when ('Account') {
                return getAccountsRecords(record);
            }
            when ('Contact'){
                return getContactsRecords(record);
            }
            when ('Leads'){
                return getLeadRecords(record);
            }
            when ('Opportunity'){
                return getOpportunityRecords(record);
            }
            when else {                
                return null;
            } 
        }
    }
    
   /**
    * @description the following methods are responsible for supplying records 
    * to the called method getRecords
    * @param record name of record that we are looking for
    * @return a map with id/name of the different records
    * @example
    * */
    
    private static Map<Id, String> getAccountsRecords(String record){  
        record = '%' + record + '%';
        List<Account> listAccts = [SELECT Id, Name from Account WHERE Name LIKE : record ORDER BY Name];
        Map<Id, String> mapRecords = new Map<Id, String>();
        for(Account a : listAccts){
            System.debug(a.Name);
            mapRecords.put(a.Id, a.Name);          
        }
        return mapRecords;
    }
    
    private static Map<Id, String> getContactsRecords(String record){
        record = '%' + record + '%';
        List<Contact> listCont = [SELECT Id, Name from Contact WHERE Name LIKE : record ORDER BY Name];
        Map<Id, String> mapRecords = new Map<Id, String>();
        for(Contact a : listCont){
            mapRecords.put(a.Id, a.Name);
        }
        return mapRecords;
    }
    
    private static Map<Id, String> getLeadRecords(String record){
        record = '%' + record + '%';
        List<Lead> listLead = [SELECT Id, Name from Lead WHERE Name LIKE : record ORDER BY Name];
        Map<Id, String> mapRecords = new Map<Id, String>();
        for(Lead a : listLead){
            mapRecords.put(a.Id, a.Name);
        }
        return mapRecords;
    }
    
    private static Map<Id, String> getOpportunityRecords(String record){
        record = '%' + record + '%';
        List<Opportunity> listOpp = [SELECT Id, Name from Opportunity WHERE Name LIKE : record ORDER BY Name];
        Map<Id, String> mapRecords = new Map<Id, String>();
        for(Opportunity a : listOpp){
            mapRecords.put(a.Id, a.Name);
        }
        return mapRecords;
    }
    
}