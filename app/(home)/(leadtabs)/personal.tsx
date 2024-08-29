import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Button,
  Text,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Formik, FormikValues, useField } from "formik";
import { PetsonalFormInitialData } from "@/apptypes";
import { PersonalFormValidationSchema } from "@/apptypes/AppValidationSchemas";
import {
  Styledtextinput,
  StyledDropdown,
  StyleDateInput,
  StyledTextInputwithButton,
} from "@/components/formcontrols";
import {
  dbopsStaticDataMasters,
  dbopsStatesMasters,
  dbopsCityMasters,
} from "@/services";
import axios from "axios";
import * as AppType from "@/apptypes/AppTypes";
import LoadingControl from "@/components/loading";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { postMethod } from "@/lib/appAPIServices";
import { EventEmitter } from "../../../constants/event";

const Personal = ({}) => {
  const { userLeadId, sourcingData } = useGlobalContext();
  const ref = useRef(null);
  const [initialPersonalFormData, setInitialPersonalFormData] = useState<any>(
    PetsonalFormInitialData
  );
  const [customertype, setCustomerType] = useState<AppType.Lov[]>([]);
  const [constitution, setConstitution] = useState<AppType.Lov[]>([]);
  const [categorytype, setCategoryType] = useState<AppType.Lov[]>([]);
  const [title, setTitle] = useState<AppType.Lov[]>([]);
  const [gender, setGender] = useState<AppType.Lov[]>([]);
  const [employmenttype, setEmploymentType] = useState<AppType.Lov[]>([]);
  const [registered, setRegistered] = useState<AppType.Lov[]>([]);
  const [yesno, setYesNo] = useState<AppType.Lov[]>([]);
  const [state, setState] = useState<AppType.stateMaster[]>([]);
  const [city, setCity] = useState([]);
  const [coappGuarant, setCoappGuarant] = useState<AppType.Lov[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [dob, setDob] = useState("");
  const [applicantName, setApplicantName] = useState("");

  const [loanProduct, setLoanProduct] = useState("");

  const [mercId, setMercID] = useState("");
  const [seqId, setSeqID] = useState("");
  const [personalLeadData, setPersonalLeadData] = useState("");
  const [promoterDetails, setPromoterDetails] = useState([]);

  const [showCBS, setShowCBS] = useState(false);
  const [showucoEmp, setShowUCOEmp] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showapplicant, setShowApplicant] = useState(false);
  const [showEntity, setShowEntity] = useState(false);
  const [showPartner, setShowPartner] = useState(false);
  const [showKarta, setShowKarta] = useState(false);
  const [showCIN, setShowCIN] = useState(false);
  const [showTrust, setShowTrust] = useState(false);
  const [showCity, setShowCity] = useState(false);

  const [valconstitution, setValConstitution] = useState("");
  const getlovaData = async () => {
    let customertypeData: any[] = await dbopsStaticDataMasters.findByID(12);
    let constitutionData: any[] = await dbopsStaticDataMasters.findByID(3);
    let categoryData: any[] = await dbopsStaticDataMasters.findByID(1);
    let titleData: any[] = await dbopsStaticDataMasters.findByID(4);
    let genderData: any[] = await dbopsStaticDataMasters.findByID(13);
    let employmenttypeData: any[] = await dbopsStaticDataMasters.findByID(14);
    let registeredData: any[] = await dbopsStaticDataMasters.findByID(6);
    let yesnoData: any[] = await dbopsStaticDataMasters.findByID(18);
    let stateMaster: any[] = await dbopsStatesMasters.findAll();

    setCustomerType(customertypeData);
    setConstitution(constitutionData);
    setCategoryType(categoryData);
    setTitle(titleData);
    setGender(genderData);
    setEmploymentType(employmenttypeData);
    setRegistered(registeredData);
    setYesNo(yesnoData);
    setCoappGuarant(yesnoData);
    setState(stateMaster);
  };

  // Get CityMaster From Service
  const getcityMaster = async (stateCodeValue: any) => {
    const response = await axios.request({
      url: `https://onlineucolps.in:450/lendperfect/location/getCityList/${stateCodeValue}`,
      method: "GET",
    });
    if (Array.isArray(response.data.response)) {
      response.data.response.forEach(
        (val: Record<string, string | number | null>) => {
          dbopsCityMasters.save(val);
        }
      );
      let cityMaster = response.data.response;
      console.log("cityMaster", cityMaster);
      setCity(cityMaster);
      setShowCity(true);
    } else {
      console.error(
        ` Type Error getStatesData : response.data.response is not an array `
      );
    }
  };

  const onChangeState = async (val: any) => {
    let cityMaster: any = await dbopsCityMasters.findByID(val);
    if (cityMaster.length > 0) {
      setCity(cityMaster);
      setShowCity(true);
    } else {
      getcityMaster(val);
    }
  };

  const onchangeUCOStaff = async (val: string, formikProps: FormikValues) => {
    console.log("onchangeUCOStaff", val);
    if (val == "YES") {
      setShowUCOEmp(true);
    } else {
      setShowUCOEmp(false);
    }
    formikProps.setFieldValue("empNo", "");
    formikProps.setFieldValue("yearsinService", "");
  };

  const onchangeRegister = async (val: string, formikProps: FormikValues) => {
    console.log("onchangeRegister", val);
    if (val == "YES") {
      setShowRegister(true);
    } else {
      setShowRegister(false);
    }
    formikProps.setFieldValue("registrationNo", "");
  };

  const onChangeCustomerType = async (
    val: string,
    formikProps: FormikValues
  ) => {
    if (val == "EXT") {
      setShowCBS(true);
    } else {
      setShowCBS(false);
    }
    formikProps.setFieldValue("cbsId", "");
  };

  const onChangeConstitution = async (
    val: string,
    formikProps?: FormikValues
  ) => {
    console.log("onChangeConstitution", val);
    setValConstitution(val);
    if (val == "1") {
      setShowApplicant(true);
      setShowEntity(false);
      setShowPartner(false);
      setShowKarta(false);
      setShowCIN(false);
      setShowTrust(false);
      if (formikProps) {
        let formFieldArray = [
          "entityName",
          "dateOfInc",
          "registered",
          "gstNumber",
          "udyogNumber",
          "partnerRegNum",
          "dateOfPartner",
          "cin",
          "trustRegNum",
          "dateOfTrust",
          "nameOfKarta",
          "deedOfDec",
        ];
        clearField(formFieldArray, formikProps);
      }
    } else if (val == "3") {
      setShowApplicant(false);
      setShowEntity(true);
      setShowPartner(true);
      setShowKarta(false);
      setShowCIN(false);
      setShowTrust(false);
      if (formikProps) {
        let formFieldArray = [
          "applicantName",
          "dateOfBirth",
          "age",
          "gender",
          "employmentType",
          "noOfDependents",
          "wheatherUcoStaff",
          "cin",
          "trustRegNum",
          "dateOfTrust",
          "nameOfKarta",
          "deedOfDec",
        ];
        clearField(formFieldArray, formikProps);
      }
    } else if (val == "4" || val == "5") {
      setShowApplicant(false);
      setShowEntity(false);
      setShowPartner(false);
      setShowKarta(false);
      setShowCIN(true);
      setShowTrust(false);
      if (formikProps) {
        let formFieldArray = [
          "applicantName",
          "dateOfBirth",
          "age",
          "gender",
          "employmentType",
          "noOfDependents",
          "wheatherUcoStaff",
          "partnerRegNum",
          "dateOfPartner",
          "trustRegNum",
          "dateOfTrust",
          "nameOfKarta",
          "deedOfDec",
        ];
        clearField(formFieldArray, formikProps);
      }
    } else if (val == "8") {
      setShowApplicant(false);
      setShowEntity(false);
      setShowPartner(false);
      setShowKarta(false);
      setShowCIN(false);
      setShowTrust(true);
      if (formikProps) {
        let formFieldArray = [
          "applicantName",
          "dateOfBirth",
          "age",
          "gender",
          "employmentType",
          "noOfDependents",
          "wheatherUcoStaff",
          "partnerRegNum",
          "dateOfPartner",
          "cin",
          "nameOfKarta",
          "deedOfDec",
        ];
        clearField(formFieldArray, formikProps);
      }
    } else if (val == "9") {
      setShowApplicant(false);
      setShowEntity(false);
      setShowPartner(false);
      setShowKarta(true);
      setShowCIN(false);
      setShowTrust(false);
      if (formikProps) {
        let formFieldArray = [
          "applicantName",
          "dateOfBirth",
          "age",
          "gender",
          "employmentType",
          "noOfDependents",
          "wheatherUcoStaff",
          "partnerRegNum",
          "dateOfPartner",
          "cin",
          "trustRegNum",
          "dateOfTrust",
        ];
        clearField(formFieldArray, formikProps);
      }
    } else {
      setShowApplicant(false);
      setShowEntity(true);
      setShowPartner(false);
      setShowKarta(false);
      setShowCIN(false);
      setShowTrust(false);
      if (formikProps) {
        let formFieldArray = [
          "applicantName",
          "nameOfKarta",
          "dateOfBirth",
          "age",
          "gender",
          "employmentType",
          "noOfDependents",
          "wheatherUcoStaff",
          "empNo",
          "yearsinService",
          "cin",
          "registrationNo",
          "partnerRegNum",
          "dateOfPartner",
          "trustRegNum",
          "dateOfTrust",
          "deedOfDec",
        ];
        clearField(formFieldArray, formikProps);
      }
    }
  };

  const clearField = (formFieldArray: any, formikProps: FormikValues) => {
    let FieldArray = formFieldArray;
    for (let i = 0; i < FieldArray.length; i++) {
      formikProps.setFieldValue(FieldArray[i], "");
      if (i == FieldArray.length - 1) {
        console.log("cleared Fields is ", FieldArray);
        return;
      }
    }
  };

  const ValidateCBSID = async (val: string, formikProps: FormikValues) => {
    try {
      setIsLoading(true);
      if (val == "" || val == undefined || val == null) {
        Alert.alert("Please Fill Valid CBS Customer ID.");
      } else {
        let custId: string = val;
        let mappedCustType = valconstitution === "1" ? "I" : "N";
        console.log("mappedCustType", mappedCustType);

        let body = {
          cbsId: custId,
          custType: mappedCustType.toString(),
          userId: "AGRI01",
        };
        let response = await postMethod(
          "leadPersonalDetails",
          `getExistingCustomerDetails`,
          body
        );

        setIsLoading(false);
        Alert.alert(JSON.stringify(response));
        console.log("response-ValidateCBSID", response);
      }
    } catch (error) {
      setIsLoading(false);
      console.log("", error);
    }
  };

  const getpersonalDetails = async (val: any) => {
    try {
      let value = "LP240820014";
      // if (userLeadId != "" && userLeadId != undefined) {
      if (value != "" && value != undefined) {
        setIsLoading(true);
        // let value = userLeadId;
        // let value = "LP240820014";
        let response = await postMethod(
          "lead-management",
          `get-personal-details/${value}`,
          {},
          "get"
        );
        if (response.status == "200 OK") {
          console.log("getpersonaldetails - response", response);
          setFormData(response);
        } else {
          console.log("getpersonalDetailsSave", response);
          Alert.alert(JSON.stringify(response));
        }
      } else {
        Alert.alert("Lead ID Not Available");
      }
    } catch (error) {
      console.log("", error);
    }
  };

  const getpersonalDetailsSave = async (val: any) => {
    try {
      let value = "LP240820014";
      // if (userLeadId != "" && userLeadId != undefined) {
      if (value != "" && value != undefined) {
        setIsLoading(true);
        // let value = userLeadId;
        // let value = "LP240820014";
        let response = await postMethod(
          "lead-management",
          `get-personal-details/${value}`,
          {},
          "get"
        );
        if (response.status == "200 OK") {
          setSeqID(response.mercDemo.mdSeqId);
          setMercID(response.mercDemo.mdMercId);
          // setApplicantName(response.mercDemo.mdName);
          setDob(response.mercDemo.mdCustDob.split("T")[0]);
          setLoanProduct(response.mercDemo.mdLeadInterest);
          setPersonalLeadData(response.leadDetail);
          personalDetailsSave(val, response);
        } else {
          setIsLoading(false);
          console.log("getpersonalDetailsSave", response);
          Alert.alert(JSON.stringify(response));
        }
      } else {
        Alert.alert("Lead ID Not Available");
      }
    } catch (error) {
      setIsLoading(false);
      console.log("", error);
    }
  };

  const setFormData = async (response: any) => {
    try {
      console.log(
        "response.addressModel.amState",
        response.addressModel.amState
      );
      onChangeConstitution(response.mercDemo.mdConstitution);
      onChangeState(response.addressModel.amState);

      const setInitData = {
        ...initialPersonalFormData,
        customerType: response.mercDemo.mdCustomerType,
        cbsId: response.mercDemo.mdCbsCustomerId,
        leadCategory: response.mercDemo.mdLeadCategory,
        constitution: response.mercDemo.mdConstitution,
        title: response.mercDemo.mdLeadTitle,
        applicantName: response.mercDemo.mdName,
        entityName: response.mercDemo.mdContactName,
        nameOfKarta: response.mercDemo.mdNameOfKarta,
        dateOfBirth: response.mercDemo.mdCustDob
          ? response.mercDemo.mdCustDob.split("T")[0]
          : response.mercDemo.mdCustDob,
        dateOfInc: response.mercDemo.mdDoi
          ? response.mercDemo.mdDoi.split("T")[0]
          : response.mercDemo.mdDoi,
        age: "",
        gender: response.mercDemo.mdGender,
        mobileNum: response.mercDemo.mdCorpPhone,
        emailId: response.mercDemo.mdEmail,
        employmentType: response.mercDemo.mdEmploymentType,
        noOfDependents: response.mercDemo.mdNoOfDependents.toString(),
        wheatherUcoStaff: response.mercDemo.mdUcoStaff,
        empNo: response.mercDemo.mdEmpNo,
        yearsinService: response.mercDemo.mdNoOfYearsService,
        cin: response.mercDemo.mdCin,
        registered: response.mercDemo.mdRegistered,
        registrationNo: response.mercDemo.mdRegistrationNumber,
        gstNumber: response.mercDemo.mdGstNumber,
        udyogNumber: response.mercDemo.mdUdyogAadharUdyamNo,
        partnerRegNum: response.mercDemo.mdPartnershipFirmRegNo,
        dateOfPartner: response.mercDemo.mdDateOfPartnershipDeed
          ? response.mercDemo.mdDateOfPartnershipDeed.split("T")[0]
          : response.mercDemo.mdDateOfPartnershipDeed,
        trustRegNum: response.mercDemo.mdTrustRegistrationNumber,
        dateOfTrust: response.mercDemo.mdDateOfTrustDeed
          ? response.mercDemo.mdDateOfTrustDeed.split("T")[0]
          : response.mercDemo.mdDateOfTrustDeed,
        deedOfDec: response.mercDemo.mdDeedOfDeclOfHuf,
        addressLine1: response.addressModel.amAddressline1,
        addressLine2: response.addressModel.amAddressline2,
        state: response.addressModel.amState
          ? response.addressModel.amState
          : "",
        city: response.addressModel.amCity ? response.addressModel.amCity : "",
        pinCode: response.addressModel.amZip,
        isCoApp: response.mercDemo.mdAppYesNo,
        profileImg: "",
        latitude: "",
        longitude: "",
      };
      console.log("setInitData", setInitData);
      setInitialPersonalFormData(setInitData);
      EventEmitter.dispatch("submit", "personalTick");
      setIsLoading(false);
      console.log("initialPersonalFormData", initialPersonalFormData);
    } catch (error) {
      Alert.alert("Personal Details - setFormData", JSON.stringify(error));
    }
  };

  const personalDetailsSave = async (value: any, response: any) => {
    try {
      setPromoterDetails([]);
      if (value.isCoApp == "YES") {
        if (promoterDetails.length > 0) {
          personalDetailServiceCall(value, response);
        } else {
          setIsLoading(false);
          Alert.alert("Alert", "Please add Co-Applicant or Guarantor details");
        }
      } else if (value.isCoApp == "NO") {
        if (promoterDetails.length == 0) {
          setPromoterDetails;
          personalDetailServiceCall(value, response);
        } else {
          setIsLoading(false);
          Alert.alert(
            "Alert",
            "You should keep YES only, because already Promoter Details Added."
          );
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log("error-personalDetailsSave", error);
      Alert.alert("error-personalDetailsSave", JSON.stringify(error));
    }
  };

  useEffect(() => {
    getlovaData().then(() => {
      if (userLeadId) {
        getpersonalDetails(userLeadId);
      }
    });
  }, []);

  useEffect(() => {
    console.log("sourcingData", sourcingData);
    setLoanProduct(sourcingData.productinterested);
    const setInitData = {
      ...initialPersonalFormData,
      applicantName: sourcingData.customername,
      dateOfBirth: sourcingData.dob ? sourcingData.dob : "",
      mobileNum: sourcingData.mobileno,
    };
    console.log("setInitData", setInitData);

    setInitialPersonalFormData(setInitData);
  }, [sourcingData]);

  /*
  @author         :   ganeshkumar.b
  @since          :   20/08/2024
  @description    :   Save Personal details in server
  */

  const personalDetailServiceCall = async (value: any, response: any) => {
    try {
      console.log("userLeadId", userLeadId);
      // setIsLoading(true);
      const reqBody = {
        merchantDemographics: {
          mdSeqId: seqId,
          mdAppYesNo: value.isCoApp,
          mdCbsCustomerId: value.cbsId,
          mdCin: value.cin,
          mdConstitution: value.constitution,
          mdContactName: value.entityName,
          mdContactPhone: value.mobileNum,
          mdCorpAddress1: value.addressLine1,
          mdCorpAddress2: value.addressLine2,
          mdCorpCity: value.city,
          mdCorpPhone: value.mobileNum,
          mdCorpState: value.state,
          mdCorpZip: value.pinCode,
          mdCustDob: dob,
          mdCustomerType: value.customerType,
          mdDateOfPartnershipDeed: value.dateOfPartner,
          mdDateOfTrustDeed: value.dateOfTrust,
          mdDba: value.applicantName,
          mdDeedOfDeclOfHuf: value.deedOfDec,
          mdDoi: value.dateOfInc,
          mdEmail: value.emailId,
          mdEmpNo: value.empNo,
          mdEmploymentType: value.employmentType,
          mdEntityStatus: "ACT",
          mdGender: value.gender,
          mdGstNumber: value.gstNumber,
          mdLeadCategory: value.leadCategory,
          mdLeadInterest: loanProduct,
          mdLeadTitle: value.title,
          mdMercId: mercId,
          mdMercSource: "WEB",
          mdMercType: "Lead",
          mdName: value.mobileNum,
          mdNameOfKarta: value.nameOfKarta,
          mdNatureOfBusi: value.lineOfActivity,
          mdNoOfDependents: value.noOfDependents,
          mdNoOfYearsService: value.yearsinService,
          mdOrgCode: null,
          mdPartnershipFirmRegNo: value.partnerRegNum,
          mdRegistered: value.registered,
          mdRegistrationNumber: value.RegistrationNumber,
          mdTrustRegistrationNumber: value.trustRegNum,
          mdUcoStaff: value.wheatherUcoStaff,
          mdUdyogAadharUdyamNo: value.udyogNumber,
          appAdvanceDetails: [],
          leadDetails: [personalLeadData],
        },
        leadDetails: personalLeadData,
        fromPage: "personal",
      };
      console.log("reqBody", reqBody);
      let resp = await postMethod(
        AppType.APIClassName.leadManegment,
        AppType.APIMethods.savePersonalDetails,
        reqBody
      );
      if (resp) {
        if (resp.code == 200 || resp.status == "200 OK") {
          setIsLoading(false);
          Alert.alert("Success", "Personal Details saved successfully");
          EventEmitter.dispatch("submit", "personalTick");
          console.log("PersonalDetailsSave is", JSON.stringify(resp));
        } else {
          setIsLoading(false);
          Alert.alert("Alert at Personal", `${response.status}`);
          console.log("Alert at Personal", `${JSON.stringify(response)}`);
        }
      }
    } catch (err) {
      setIsLoading(false);
      Alert.alert(JSON.stringify(err));
      console.error("PersonalDetailsSave-Error is", JSON.stringify(err));
    }
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        {isLoading && <LoadingControl isLoading={isLoading} />}
        <View className="py-5 px-2">
          <Formik
            innerRef={ref}
            enableReinitialize
            initialValues={initialPersonalFormData}
            onSubmit={(values) => getpersonalDetailsSave(values)}
            validationSchema={PersonalFormValidationSchema}
          >
            {(formikProps: FormikValues) => (
              <>
                <StyledDropdown
                  placeholder="Select Customer"
                  title="Customer Type"
                  mandatory={true}
                  formikProps={formikProps}
                  formikkey="customerType"
                  dropdownData={customertype}
                  dropLableProperty="rdValueDescription"
                  dropValueProperty="rdValueCode"
                  onChangeDrobDown={(val: any) =>
                    onChangeCustomerType(val, formikProps)
                  }
                />

                <StyledDropdown
                  placeholder="Select Constitution"
                  title="Constitution"
                  mandatory={true}
                  formikProps={formikProps}
                  formikkey="constitution"
                  dropdownData={constitution}
                  dropLableProperty="rdValueDescription"
                  dropValueProperty="rdValueCode"
                  onChangeDrobDown={(val: any) =>
                    onChangeConstitution(val, formikProps)
                  }
                />

                {showCBS && (
                  <>
                    {/* <Styledtextinput
                      label="CBS Customer ID"
                      formikProps={formikProps}
                      formikkey="cbsId"
                      placeholder="Enter CBS ID"
                      mandatory={true}
                    /> */}

                    <StyledTextInputwithButton
                      label="CBS Customer ID"
                      title="Validate"
                      formikProps={formikProps}
                      formikkey="cbsId"
                      placeholder="Enter CBS ID"
                      mandatory={true}
                      ValidateInput={(val: any, formikProps: FormikValues) =>
                        ValidateCBSID(val, formikProps)
                      }
                    />
                  </>
                )}

                <StyledDropdown
                  placeholder="Select Lead Category "
                  title="Lead Category"
                  mandatory={true}
                  formikProps={formikProps}
                  formikkey="leadCategory"
                  dropdownData={categorytype}
                  dropLableProperty="rdValueDescription"
                  dropValueProperty="rdValueCode"
                />

                <StyledDropdown
                  placeholder="Select title"
                  title="Title"
                  mandatory={true}
                  formikProps={formikProps}
                  formikkey="title"
                  dropdownData={title}
                  dropLableProperty="rdValueDescription"
                  dropValueProperty="rdValueCode"
                />

                {showapplicant && (
                  <>
                    <Styledtextinput
                      label="Applicant Name"
                      formikProps={formikProps}
                      formikkey="applicantName"
                      placeholder="Enter Applicant Name"
                      mandatory={true}
                    />
                  </>
                )}

                {showEntity && (
                  <>
                    <Styledtextinput
                      label="Entity Name"
                      formikProps={formikProps}
                      formikkey="entityName"
                      placeholder="Enter Entity Name"
                      mandatory={true}
                    />
                  </>
                )}

                {showKarta && (
                  <>
                    <Styledtextinput
                      label="Name of Karta"
                      formikProps={formikProps}
                      formikkey="nameOfKarta"
                      placeholder="Enter Name of Karta"
                      mandatory={true}
                    />
                  </>
                )}

                {showapplicant && (
                  <>
                    <StyleDateInput
                      label="Date of Birth"
                      formikProps={formikProps}
                      mandatory={true}
                      placeholder="Enter dob"
                      formikkey="dateOfBirth"
                    />
                  </>
                )}

                {showEntity && (
                  <>
                    <StyleDateInput
                      label="DOI"
                      formikProps={formikProps}
                      mandatory={true}
                      placeholder="Enter DOI"
                      formikkey="dateOfInc"
                    />
                  </>
                )}

                {showapplicant && (
                  <>
                    <Styledtextinput
                      label="Age"
                      formikProps={formikProps}
                      formikkey="age"
                      placeholder="Enter age"
                      mandatory={true}
                    />

                    <StyledDropdown
                      placeholder="Select gender"
                      title="Gender"
                      mandatory={true}
                      formikProps={formikProps}
                      formikkey="gender"
                      dropdownData={gender}
                      dropLableProperty="rdValueDescription"
                      dropValueProperty="rdValueCode"
                    />
                  </>
                )}

                <Styledtextinput
                  label="Mobile Number"
                  formikProps={formikProps}
                  formikkey="mobileNum"
                  placeholder="Enter mobile number"
                  mandatory={true}
                  maxLength={10}
                  inputMode="numeric"
                />

                <Styledtextinput
                  label="Email ID"
                  formikProps={formikProps}
                  formikkey="emailId"
                  placeholder="Enter emailId"
                  mandatory={false}
                />

                {showapplicant && (
                  <>
                    <StyledDropdown
                      placeholder="Select Employment Type"
                      title="Employment Type"
                      mandatory={true}
                      formikProps={formikProps}
                      formikkey="employmentType"
                      dropdownData={employmenttype}
                      dropLableProperty="rdValueDescription"
                      dropValueProperty="rdValueCode"
                    />

                    <Styledtextinput
                      label="No. of Dependents (Excluding Spouse)"
                      formikProps={formikProps}
                      formikkey="noOfDependents"
                      placeholder="Enter Dependents"
                      mandatory={true}
                    />

                    <StyledDropdown
                      placeholder="Select UCO staff"
                      title="Wheather UCO staff"
                      mandatory={true}
                      formikProps={formikProps}
                      formikkey="wheatherUcoStaff"
                      dropdownData={yesno}
                      dropLableProperty="rdValueDescription"
                      dropValueProperty="rdValueCode"
                      onChangeDrobDown={(val: any) =>
                        onchangeUCOStaff(val, formikProps)
                      }
                    />
                  </>
                )}

                {showucoEmp && (
                  <>
                    <Styledtextinput
                      label="Emp. No."
                      formikProps={formikProps}
                      formikkey="empNo"
                      placeholder="Enter Emp No."
                      mandatory={true}
                    />

                    <Styledtextinput
                      label="No. of Years in Service"
                      formikProps={formikProps}
                      formikkey="yearsinService"
                      placeholder="Enter No. of Years"
                      mandatory={true}
                    />
                  </>
                )}

                {showCIN && (
                  <>
                    <Styledtextinput
                      label="CIN"
                      formikProps={formikProps}
                      formikkey="cin"
                      placeholder="Enter CIN"
                      mandatory={true}
                    />
                  </>
                )}

                {showEntity && (
                  <>
                    <StyledDropdown
                      placeholder="Select Registered"
                      title="Registered"
                      mandatory={true}
                      formikProps={formikProps}
                      formikkey="registered"
                      dropdownData={registered}
                      dropLableProperty="rdValueDescription"
                      dropValueProperty="rdValueCode"
                      onChangeDrobDown={(val: any) =>
                        onchangeRegister(val, formikProps)
                      }
                    />
                  </>
                )}

                {showRegister && (
                  <>
                    <Styledtextinput
                      label="Registration No."
                      formikProps={formikProps}
                      formikkey="registrationNo"
                      placeholder="Enter Registration No."
                      mandatory={true}
                    />
                  </>
                )}

                {showEntity && (
                  <>
                    <Styledtextinput
                      label="GST Number"
                      formikProps={formikProps}
                      formikkey="gstNumber"
                      placeholder="Enter GST Number"
                      mandatory={true}
                    />

                    <Styledtextinput
                      label="Udyog Number"
                      formikProps={formikProps}
                      formikkey="udyogNumber"
                      placeholder="Enter Udyog Number"
                      mandatory={true}
                    />
                  </>
                )}

                {showPartner && (
                  <>
                    <Styledtextinput
                      label="Partnership firm Registration Number"
                      formikProps={formikProps}
                      formikkey="partnerRegNum"
                      placeholder="Enter Partnership firm Registration Number"
                      mandatory={true}
                    />

                    <StyleDateInput
                      label="Date of Partnership Deed"
                      formikProps={formikProps}
                      mandatory={true}
                      placeholder="Enter date"
                      formikkey="dateOfPartner"
                    />
                  </>
                )}

                {showTrust && (
                  <>
                    <Styledtextinput
                      label="Trust Registration Number"
                      formikProps={formikProps}
                      formikkey="trustRegNum"
                      placeholder="Enter Trust Registration Number"
                      mandatory={true}
                    />

                    <StyleDateInput
                      label="Date of Trust Deed"
                      formikProps={formikProps}
                      mandatory={true}
                      placeholder="Enter Date of Trust Deed"
                      formikkey="dateOfTrust"
                    />
                  </>
                )}

                {showKarta && (
                  <>
                    <Styledtextinput
                      label="Deed of declaration of HUF"
                      formikProps={formikProps}
                      formikkey="deedOfDec"
                      placeholder="Enter Deed of declaration of HUF"
                      mandatory={true}
                    />
                  </>
                )}

                <Styledtextinput
                  label="Address Line 1"
                  formikProps={formikProps}
                  formikkey="addressLine1"
                  placeholder="Enter Address Line 1"
                  mandatory={true}
                />

                <Styledtextinput
                  label="Address Line 2"
                  formikProps={formikProps}
                  formikkey="addressLine2"
                  placeholder="Enter Address Line 2"
                  mandatory={true}
                />

                <StyledDropdown
                  placeholder="Select State"
                  title="State"
                  mandatory={true}
                  formikProps={formikProps}
                  formikkey="state"
                  dropdownData={state}
                  dropLableProperty="sgmStateName"
                  dropValueProperty="sgmStateCode"
                  onChangeDrobDown={(val: any) => onChangeState(val)}
                />

                {showCity && (
                  <>
                    <StyledDropdown
                      placeholder="Select City"
                      title="City"
                      mandatory={true}
                      formikProps={formikProps}
                      formikkey="city"
                      dropdownData={city}
                      dropLableProperty="sgmCityName"
                      dropValueProperty="sgmCityCode"
                    />
                  </>
                )}

                <Styledtextinput
                  label="Pincode"
                  formikProps={formikProps}
                  formikkey="pinCode"
                  placeholder="Enter Pincode"
                  mandatory={true}
                  maxLength={6}
                />

                <StyledDropdown
                  placeholder="Select Co-App/Guarantor"
                  title="Whether Co-App/Guarantor Applicable ?"
                  mandatory={true}
                  formikProps={formikProps}
                  formikkey="isCoApp"
                  dropdownData={coappGuarant}
                  dropLableProperty="rdValueDescription"
                  dropValueProperty="rdValueCode"
                />

                <Button title="Submit" onPress={formikProps.handleSubmit} />
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Personal;

const styles = StyleSheet.create({
  dropdown: {
    marginTop: 10,
    marginLeft: 16,
    height: 40,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
