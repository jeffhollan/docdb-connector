# Azure DocumentDB Connector

[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://azuredeploy.net/)

This is a REST API Connector for [Azure DocumentDB](https://azure.microsoft.com/en-us/services/documentdb/) built to work with Azure Logic Apps.

## Setup and Configuration

To setup, simply click the [Deploy to Azure]((https://azuredeploy.net/) button.  This will start a deployment script to provision and clone this repository in your Azure subscription.

### Setting a key as an environmental variable

To prevent you from having to reference your key during every action, you can add an Application Setting after deployment for your DocumentDB access key.  Simply open the web site in Azure, click **Settings** -> **Application Settings** and add an applicaiton setting for `masterkey` with the value being your DocumentDB access key.

## Actions

This connector comes with 6 actions:

- Get Document
- Create Document
- Update Document
- Upsert Document
- Delete Document
- Query Documents

## Accessing Data within a Logic App

One piece of note with this connector is if you need to parse the data returned from a document.  Since the nature of DocumentDB and NoSQL is that there isn't a defined schema, the only properties selectable as tokens are the ID.  If you have other properties you want to access, please use the [Logic App Workflow Definition Language](http://aka.ms/logicappsdocs) and the `@body()` command.  For example if I retrieved a document that looked like this from a **Get Document** step:

``` json
{
    "id": "myID",
    "type": "order",
    "placedBy": {
        "name": "Jeff" 
    }
    ...
}
```

and I wanted to access the `"name"` property I could use the following workflow language in my logic app: `@body('Get_Document')['placedBy']['name']`

In addition the **Query Documents** action outputs an array of **Documents** so you would need to put **Documents** in a foreach loop and could access each document property with an expression like `@item()['placedBy']['name']`.

Please refer to the [DocumentDB REST API](https://msdn.microsoft.com/en-us/library/azure/mt489082.aspx#Documents) reference for an understanding of the shape of the outputs returned.
