import {
  Alert,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Formik, FormikHelpers, FormikValues, useFormik } from "formik";
import {
  Styledtextinput,
  StyledDropdown,
  StyleDateInput,
} from "@/components/formcontrols";
import { ScrollView } from "react-native-gesture-handler";
import { SourcingFormInitialData } from "@/apptypes";
import { SourcingFormValidationSchema } from "@/apptypes/AppValidationSchemas";
import {
  dbopsStaticDataMasters,
  dbopsBranchMasters,
  dbopsMainProductsMasters,
} from "@/services";
import LoadingControl from "@/components/loading";
import { postMethod } from "@/lib/appAPIServices";
import * as AppType from "@/apptypes/AppTypes";
import { Lov } from "@/apptypes";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { EventEmitter } from "../../../constants/event";

const validationSchema = SourcingFormValidationSchema;

const SourcingPage = () => {
  const { userLeadId, setUserLeadID, setSourcingData } = useGlobalContext();
  const [initialSourcingFormData, setInitialSourcingFormData] =
    useState<AppType.SourcingFormData>(SourcingFormInitialData);
  const [bussDescription, setBussDescription] = useState<AppType.Lov[]>([]);
  const [sourcingChannel, setSourcingChannel] = useState<AppType.Lov[]>([]);
  const [userBranch, setUserBranch] = useState<AppType.OrgMaster[]>([]);
  const [productInterest, setProductInterest] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orgID, setOrgID] = useState({});

  const getlovaData = async () => {
    let bussDescription: any[] = await dbopsStaticDataMasters.findByID(17);
    let sourcingchannel: any[] = await dbopsStaticDataMasters.findByID(11);
    let branchmaster: any[] | any = await dbopsBranchMasters.findAll();
    let productMaster: any[] | any = await dbopsMainProductsMasters.findAll();
    console.log("productMaster", productMaster);
    setProductInterest(productMaster);
    setUserBranch(branchmaster);
    setBussDescription(bussDescription);
    setSourcingChannel(sourcingchannel);
  };

  const getSourcingDetails = async (leadid: string) => {
    try {
      let leadID = leadid;
      setIsLoading(true);
      let resp = await postMethod(
        AppType.APIClassName.leadManegment,
        `${AppType.APIMethods.getLeadDetails}/${leadID}`,
        {},
        "get"
      );
      if (resp.status == "200" || resp.status == "200 OK") {
        setIsLoading(false);
        console.log("productlist", productInterest);
        console.log("sourcing resp - ", resp);
        let prdCode = resp.leadDetail.ldPrdCode;
        let productlist: any[] = productInterest;
        console.log("prdCode", prdCode);

        let getApp = productlist.find((val) => {
          return val.facId == prdCode;
        });
        console.log("getApp", getApp);
        const setInitData = {
          ...initialSourcingFormData,
          sourcingid: resp.leadDetail.ldLeadSource,
          preferredbranch: resp.leadDetail.ldBranchCode,
          businessdescription: resp.leadDetail.ldBusinessDesc,
          sourcingChannel: resp.leadDetail.ldLeadSource,
          sourcingname: resp.leadDetail.ldModifiedBy,
          branchcode: resp.leadDetail.ldBranchCode,
          leadby: resp.leadDetail.ldModifiedBy,
          leadid: resp.leadDetail.ldLeadNo,
          customername: resp.mercDemo.mdName,
          dob: resp.mercDemo.mdCustDob
            ? resp.mercDemo.mdCustDob.split("T")[0]
            : resp.mercDemo.mdCustDob,
          mobileno: resp.mercDemo.mdCorpPhone,
          productinterested: getApp ? getApp : resp.leadDetail.ldPrdCode,
        };
        console.log("setInitData", setInitData);
        setInitialSourcingFormData(setInitData);
        EventEmitter.dispatch("submit", "sourceTick");
        console.log("setInitialSourcingFormData", initialSourcingFormData);
      } else {
        setIsLoading(false);
        Alert.alert(JSON.stringify(resp));
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert(JSON.stringify(error));
      console.log("Sourcing-getSourcingDetails", error);
    }
  };

  useEffect(() => {
    getlovaData().then(() => {
      console.log("Sourcing page userLeadId is", userLeadId);
      if (userLeadId) {
        getSourcingDetails(userLeadId);
      }
    });
  }, []);

  const onChangeBranch = (val: string, formikProps: FormikValues) => {
    console.log("userBranch", userBranch);
    console.log("orgId", val);
    let orgId = userBranch.filter((x: any) => {
      return x.orgId == val;
    });
    setOrgID(orgId);
    formikProps.setFieldValue("branchcode", val);
  };

  const onChangeSourcingChannel = (val: string, formikProps: FormikValues) => {
    formikProps.setFieldValue("sourcingid", val);
  };

  /*
  @author         :   ganeshkumar.b
  @since          :   14/08/2024
  @description    :   Save Sourcing details in server
  */

  const SouringDetailsSave = async (
    values: FormikValues,
    action: FormikHelpers<AppType.SourcingFormData>
  ) => {
    try {
      setIsLoading(true);
      let orgid: any = orgID;
      console.log("orgid-SouringDetailsSave", orgid[0].orgId);
      // let dataformat = moment(values.dob, "DD/MM/YYYY").format("YYYY-MM-DD");
      // console.log("dataformat", dataformat);
      const reqBody = {
        leadDetails: {
          ldLeadNo: values.leadid,
          ldBusinessDesc: values.businessdescription,
          ldLeadSource: values.sourcingChannel,
          ldOrgSeqId: orgid[0].orgId,
          ldBranchCode: values.branchcode,
          ldPrdCode: values.productinterested,
        },
        merchantDemographics: {
          mdCustomerType: "",
          mdLeadCategory: "",
          mdName: values.customername,
          mdCustDob: values.dob,
          mdCorpPhone: values.mobileno,
          mdLeadInterest: values.productinterested,
        },
      };
      console.log("reqBody", reqBody);
      const response = await postMethod(
        AppType.APIClassName.leadManegment,
        AppType.APIMethods.saveSourcingDetails,
        reqBody
      );
      if (response.status == "200" || response.status == "200 OK") {
        if (response.Success) {
          Alert.alert(JSON.stringify(response.Success));
          setIsLoading(false);
          // setLeadID(response.leadNo);

          const setInitData = {
            ...initialSourcingFormData,
            sourcingid: values.sourcingid,
            preferredbranch: values.preferredbranch,
            businessdescription: values.businessdescription,
            sourcingChannel: values.sourcingChannel,
            sourcingname: values.sourcingname,
            branchcode: values.branchcode,
            leadby: values.leadby,
            leadid: response.leadNo,
            customername: values.customername,
            dob: values.dob,
            mobileno: values.mobileno,
            productinterested: values.productinterested,
          };
          setInitialSourcingFormData(setInitData);

          setUserLeadID(response.leadNo);
          setSourcingData(values);
          EventEmitter.dispatch("submit", "sourceTick");
          // action.resetForm();
          // action.setSubmitting(true);
        } else {
          Alert.alert(JSON.stringify(response));
          setIsLoading(false);
        }
      } else {
        Alert.alert(JSON.stringify(response));
        console.log(response, "SouringDetailsSave");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert(JSON.stringify(error));
      console.error("SouringDetailsSave-Error is", JSON.stringify(error));
    }
  };

  return (
    <KeyboardAvoidingView>
      {isLoading && <LoadingControl isLoading={isLoading} />}
      <ScrollView>
        <View className="py-5 px-2">
          <Formik
            enableReinitialize
            initialValues={initialSourcingFormData}
            onSubmit={(values, action) => SouringDetailsSave(values, action)}
            validationSchema={validationSchema}
          >
            {(formikProps: FormikValues) => (
              <>
                <StyledDropdown
                  placeholder="Select Business"
                  title="Business Description"
                  mandatory={true}
                  formikProps={formikProps}
                  formikkey="businessdescription"
                  dropdownData={bussDescription}
                  dropLableProperty="rdValueDescription"
                  dropValueProperty="rdValueCode"
                />

                <StyledDropdown
                  placeholder="--Select--"
                  title="Sourcing Channel"
                  mandatory={true}
                  formikProps={formikProps}
                  formikkey="sourcingChannel"
                  dropdownData={sourcingChannel}
                  dropLableProperty="rdValueDescription"
                  dropValueProperty="rdValueCode"
                  onChangeDrobDown={(val: any) =>
                    onChangeSourcingChannel(val, formikProps)
                  }
                />

                <Styledtextinput
                  label="Sourcing ID"
                  formikProps={formikProps}
                  formikkey="sourcingid"
                  placeholder="Enter User ID"
                  mandatory={true}
                />

                {/* password text field */}
                <Styledtextinput
                  label="Sourcing Name"
                  formikProps={formikProps}
                  formikkey="sourcingname"
                  placeholder="Enter User Name"
                  mandatory={true}
                />

                <StyledDropdown
                  placeholder="--Select--"
                  title="Preffered Branch"
                  mandatory={true}
                  formikProps={formikProps}
                  formikkey="preferredbranch"
                  dropdownData={userBranch}
                  dropLableProperty="orgName"
                  dropValueProperty="orgId"
                  onChangeDrobDown={(val: any) =>
                    onChangeBranch(val, formikProps)
                  }
                />

                <Styledtextinput
                  label="Branch Code"
                  formikProps={formikProps}
                  formikkey="branchcode"
                  placeholder="Enter Branch Code"
                  mandatory={true}
                />

                <Styledtextinput
                  label="Lead Generated By"
                  formikProps={formikProps}
                  formikkey="leadby"
                  placeholder=""
                  mandatory={true}
                />

                <Styledtextinput
                  label="Lead ID"
                  formikProps={formikProps}
                  formikkey="leadid"
                  placeholder=""
                  mandatory={false}
                  inputMode="text"
                />

                <Styledtextinput
                  label="Customer Name"
                  formikProps={formikProps}
                  formikkey="customername"
                  placeholder="Enter Customer Name"
                  mandatory={true}
                />

                <StyleDateInput
                  label="Date Of Birth"
                  formikProps={formikProps}
                  mandatory={true}
                  placeholder="Enter Date Of Birth"
                  formikkey="dob"
                  maxDate={
                    new Date(
                      new Date().getFullYear() - 12,
                      new Date().getMonth(),
                      new Date().getDate()
                    )
                  }
                  minDate={
                    new Date(
                      new Date().getFullYear() - 69,
                      new Date().getMonth(),
                      new Date().getDate()
                    )
                  }
                />

                <Styledtextinput
                  label="Mobile Number"
                  formikProps={formikProps}
                  formikkey="mobileno"
                  placeholder="Enter Mobile Number"
                  mandatory={true}
                  maxLength={10}
                  inputMode="numeric"
                />
                <StyledDropdown
                  placeholder="--Select--"
                  title="Product Interested"
                  mandatory={true}
                  formikProps={formikProps}
                  formikkey="productinterested"
                  dropdownData={productInterest}
                  dropLableProperty="facDesc"
                  dropValueProperty="facId"
                />
                {/*  */}
                <Button title="Submit" onPress={formikProps.handleSubmit} />
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SourcingPage;
