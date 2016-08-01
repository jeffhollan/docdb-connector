export interface Document_Request {
    upsert : boolean;
    index : boolean;
    body : any;
};

export interface Document_Response {
    request_charge : number;
    session_token : string;
    body : any;
};