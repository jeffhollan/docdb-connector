export const sample_create_doc_response : Object = {
  "id": "AndersenFamily",
  "LastName": "Andersen",
  "Parents": [
    {
      "FamilyName": null,
      "FirstName": "Thomas"
    },
    {
      "FamilyName": null,
      "FirstName": "Mary Kay"
    }
  ],
  "Children": [
    {
      "FamilyName": null,
      "FirstName": "Henriette Thaulow",
      "Gender": "female",
      "Grade": 5,
      "Pets": [
        {
          "GivenName": "Fluffy"
        }
      ]
    }
  ],
  "Address": {
    "State": "WA",
    "County": "King",
    "City": "Seattle"
  },
  "IsRegistered": true,
  "_rid": "1KtjAImkcgwBAAAAAAAAAA==",
  "_self": "dbs/1KtjAA==/colls/1KtjAImkcgw=/docs/1KtjAImkcgwBAAAAAAAAAA==/",
  "_etag": "\"00003200-0000-0000-0000-56f9e84d0000\"",
  "_ts": 1459218509,
  "_attachments": "attachments/"
}

export const sample_get_doc_response : Object = {
  "id": "SalesOrder1",
  "ponumber": "PO18009186470",
  "OrderDate": "2005-07-01T00:00:00",
  "ShippedDate": "0001-01-01T00:00:00",
  "AccountNumber": "Account1",
  "SubTotal": 419.4589,
  "TaxAmount": 12.5838,
  "Freight": 472.3108,
  "TotalDue": 985.018,
  "Items": [
    {
      "OrderQty": 1,
      "ProductId": 760,
      "UnitPrice": 419.4589,
      "LineTotal": 419.4589
    }
  ],
  "_rid": "d9RzAJRFKgwBAAAAAAAAAA==",
  "_self": "dbs/d9RzAA==/colls/d9RzAJRFKgw=/docs/d9RzAJRFKgwBAAAAAAAAAA==/",
  "_etag": "\"0000d986-0000-0000-0000-56f9e25b0000\"",
  "_ts": 1459216987,
  "_attachments": "attachments/"
}

export const sample_put_doc_response : Object = {
  "id": "_SalesOrder5",
  "AccountNumber": "NewUser01",
  "PurchaseOrderNumber": "PO18009186470",
  "OrderDate": "2016-03-29T02:03:07.3526153Z",
  "Total": 5.95,
  "_rid": "d9RzAJRFKgwEAAAAAAAAAA==",
  "_self": "dbs/d9RzAA==/colls/d9RzAJRFKgw=/docs/d9RzAJRFKgwEAAAAAAAAAA==/",
  "_etag": "\"0000df86-0000-0000-0000-56f9e25c0000\"",
  "_ts": 1459216988,
  "_attachments": "attachments/",
  "shippedDate": "2016-03-29T02:03:07.4680723Z",
  "foo": "bar"
}