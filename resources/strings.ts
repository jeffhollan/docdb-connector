export const err_missing_master_key : string = "Missing Master Key.  Please pass either a master key parameter or store an application setting of `masterKey`";
export const err_missing_dbs_header : string = "Missing database identifier for resource ID.  Please provide a database identifier";
export const err_missing_colls_header : string = "Missing collection identifier for resource ID.  Please provide a collection identifier";
export const err_missing_account_header : string = "Missing account identifier for resource.  Please provide a valid DocumentDB account";

export const err_invalid_json_body = function (body : any) : string { return `Input body must be a valid JSON Object.  Recieved a payload of type: ${typeof body == 'string' ? 'string' : 'array'}`; };

export const test_err_invalid_json : string = "";