import * as yup from "yup";

const SourcingFormValidationSchema = yup.object().shape({
  sourcingid: yup.string().required().label("Sourcing ID"),
  preferredbranch: yup.string().required().label("Preferred Branch"),
  businessdescription: yup
    .string()
    .required("Business Description is required"),
  sourcingChannel: yup.string().required("Sourcing Channel is Required"),
  sourcingname: yup.string().required("Sourcing Name is Required"),
  branchcode: yup.string().required("Branch Code is Required"),
  leadby: yup.string().required(),
  leadid: yup.string().notRequired(),
  customername: yup
    .string()
    .matches(/[a-zA-z ]/, "Enter Valid Customer Name")
    .required("Customer Name is Required"),
  dob: yup.string().required("Date of birth is required"),
  mobileno: yup
    .string()
    .matches(/[6-9]{1}[0-9]{9}$/, "Enter Valid Mobile Number")
    .max(10)
    .min(10)
    .required("Mobile no is required"),
  productinterested: yup.string().required("Product is required"),
});

const PersonalFormValidationSchema = yup.object().shape({
  customerType: yup.string().required(),
  cbsId: yup.string().when("customerType", {
    is: "EXT",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  leadCategory: yup.string().required(),
  constitution: yup.string().required(),
  title: yup.string().required(),
  applicantName: yup.string().when("constitution", {
    is: "1",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  entityName: yup.string().when("constitution", {
    is: (val: string) => val !== "1",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  nameOfKarta: yup.string().when("constitution", {
    is: "9",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  dateOfBirth: yup.string().when("constitution", {
    is: "1",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  dateOfInc: yup.string().when("constitution", {
    is: (val: string) => val !== "1",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  age: yup.string().when("constitution", {
    is: "1",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  gender: yup.string().when("constitution", {
    is: "1",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  mobileNum: yup
    .string()
    .matches(/[6-9]{1}[0-9]{9}$/, "Enter Valid Mobile Number")
    .max(10)
    .min(10)
    .required(),
  emailId: yup.string().required(),
  employmentType: yup.string().when("constitution", {
    is: "1",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  noOfDependents: yup.string().when("constitution", {
    is: "1",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  wheatherUcoStaff: yup.string().when("constitution", {
    is: "1",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  empNo: yup.string().when("wheatherUcoStaff", {
    is: "YES",
    then: (schema) => schema.required("Must Enter Employee Number"),
    otherwise: (schema) => schema.notRequired(),
  }),
  yearsinService: yup.string().when("ucoShow", {
    is: true,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  cin: yup.string().when("constitution", {
    is: (val: string) => val == "4" || val == "5",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  registered: yup.string().when("constitution", {
    is: (val: string) => val !== "1",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  registrationNo: yup.string().when("registered", {
    is: "YES",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  gstNumber: yup.string().when("constitution", {
    is: (val: string) => val !== "1",
    then: (schema) =>
      schema
        .max(15)
        .min(15)
        .matches(
          /^([0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9]{1}Z[a-zA-Z0-9]{1})$/,
          "Enter Correct GST Number"
        )
        .required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  udyogNumber: yup.string().when("constitution", {
    is: (val: string) => val !== "1",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  partnerRegNum: yup.string().when("constitution", {
    is: (val: string) => val == "3",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  dateOfPartner: yup.string().when("constitution", {
    is: (val: string) => val == "3",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  trustRegNum: yup.string().when("constitution", {
    is: (val: string) => val == "8",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  dateOfTrust: yup.string().when("constitution", {
    is: (val: string) => val == "8",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  deedOfDec: yup.string().when("constitution", {
    is: (val: string) => val == "9",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  addressLine1: yup.string().required(),
  addressLine2: yup.string().required(),
  state: yup.string().required(),
  city: yup.string().required(),
  pinCode: yup.string().required(),
  isCoApp: yup.string().required(),
  // profileImg: yup.string().required(),
  // latitude: yup.string().required(),
  // longitude: yup.string().required(),
});

const KYCFormValidationSchema = yup.object().shape({
  applicantType: yup.string().required(),
  panNo: yup
    .string()
    .required()
    .matches(
      /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
      "Enter Valid PAN Number"
    ),
  uidAadharNo: yup
    .string()
    .required()
    .min(12)
    .max(12)
    .matches(/[0-9]{12}$/, "Enter Valid Aadhaar Number"),
  otherIdProof: yup.string().notRequired(),
  otherIdNo: yup.string().required().max(20),
});

const IncomeFormValidationSchema = yup.object().shape({
  occupation: yup.string().required(),
  grossIncome: yup
    .string()
    .matches(/[0-9,.]/, "Please Enter Gross Income")
    .max(15)
    .required(),
  grossMonthlyDeductions: yup
    .string()
    .matches(/[0-9,.]/, "Please Enter Gross Monthly Deductions")
    .max(15)
    .required(),
  netIncome: yup.string().required(),
  networth: yup
    .string()
    .matches(/[0-9,.]*/, "Please Enter Valid Net Worth")
    .max(15)
    .required(),
  company: yup
    .string()
    .matches(/[a-zA-Z0-9 ]*/, "Enter Valid Company Name")
    .notRequired(),
  totYearsOfEmp: yup
    .string()
    .matches(/[a-zA-Z0-9 ]*/, "Enter Valid Company Name")
    .notRequired(),
});

const LoanFormValidationSchema = yup.object().shape({
  mainCategory: yup.string().required(),
  subCategory: yup.string().required(),
  loanProduct: yup.string().required(),
  newPurposeOfLoan: yup.string().required(),
  loanAmountRequested: yup
    .string()
    .matches(/[0-9,.]*/, "Enter Loan Amount")
    .required(),
});

export {
  SourcingFormValidationSchema,
  KYCFormValidationSchema,
  PersonalFormValidationSchema,
  IncomeFormValidationSchema,
  LoanFormValidationSchema,
};
