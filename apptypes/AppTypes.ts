export enum APIURL {
  PRODURL = "https://onlineucolps.in:450/lendperfect",
  UATURL = "https://lpsonlineuat.ucoonline.in:1801/lendperfect",
}

export interface User {
  email: string;
  password: string;
}

export interface Master {
  masterType: string;
  downloadStatus: boolean;
}

export interface HeaderParams {
  username: string;
  password: string;
}

export interface TestUser {
  id: number;
  name: string;
  age: number;
}

export interface KeyValueString {
  [key: string]: string;
}

export interface TableConfig {
  tableName: string;
  pk: string;
  tableData: KeyValueString;
}

export interface Lov {
  rdValueCode?: string;
  rdValueDescription?: string;
  masterid?: number;
}

export interface OrgMaster {
  BRANCH_ID: number;
  orgCode: string;
  orgId: string;
  orgLevel: string;
  orgName: string;
  orgScode: string;
}

export interface productMaster {
  PRODUCT_MAIN_ID: number;
  facDesc: string;
  facId: string;
  facParentID: string;
  vertical: string;
}

export interface subProductMaster {
  PRODUCT_SUB_ID: number;
  facDesc: string;
  facId: string;
  facParentID: string;
  vertical: string;
}

export interface stateMaster {
  STATE_ID: number;
  sgmStateCode: string;
  sgmStateName: string;
}

export interface KycRequest {
  lkdSeqId: string | null;
  lkdApplicantType: string;
  lkdLeadId: string;
  lkdCustId: string;
  lkdOtherIdNo: string;
  lkdOtherIdProof: string;
  lkdPanNumber: string;
  lkdUidNumber: string;
}

export interface SourcingFormData {
  sourcingid: string | null;
  preferredbranch: string;
  businessdescription: string;
  sourcingChannel: string;
  sourcingname: string;
  branchcode: string;
  leadby: string;
  leadid: string;
  customername: string;
  dob: string;
  mobileno: string;
  productinterested: string;
}

export enum APIClassName {
  userAttendance = "userAttendanceDetails",
  leadManegment = "lead-management",
  web = "web",
}

export enum APIMethods {
  saveAttendance = "saveAttendanceDetails",
  saveClientVisit = "save-clientvisit-detail",
  getApplicantType = "get-application-type",
  saveKycDetails = "save-kyc-details-mobile",
  getKycDetails = "get-kyc-details-mobile",
  getLeadDetails = "get-lead-detail",
  saveSourcingDetails = "save-lead-detail",
  savePersonalDetails = "save-personal-details",
  loanProdutForLead = "loanProdutForLead",
  purposeOfLoan = "purposeOfLoan",
  getUserLeadDetails = "get-user-lead-details",
}
