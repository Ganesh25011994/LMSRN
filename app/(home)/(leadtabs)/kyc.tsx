import { StyleSheet, Button, View, Alert, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Formik, FormikValues } from "formik";
import { KeyValueString, KYCFormInitialData, Lov } from "@/apptypes";
import { KYCFormValidationSchema } from "@/apptypes/AppValidationSchemas";
import { StyledDropdown, Styledtextinput } from "@/components/formcontrols";
import * as AppType from "@/apptypes/AppTypes";
import { postMethod } from "@/lib/appAPIServices";
import LoadingControl from "@/components/loading";
import { dbopsStaticDataMasters } from "@/services";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { EventEmitter } from "../../../constants/event";
import { FontAwesome5 } from "@expo/vector-icons";

const KYCPage = () => {
  const { userLeadId } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [idProofList, setIdProofList] = useState<AppType.Lov[]>([]);
  const [appliantList, setAppliantList] = useState([]);
  const [kycDataList, setKYCDataList] = useState([]);
  const [kycDataListCount, setKYCDataListCount] = useState(0);

  const getLOVData = async () => {
    let idProofMaster: any[] = await dbopsStaticDataMasters.findByID(4);
    setIdProofList(idProofMaster);
  };

  const getApplicantList = async () => {
    try {
      let resp = await postMethod(
        AppType.APIClassName.leadManegment,
        `${AppType.APIMethods.getApplicantType}/${userLeadId}`,
        {},
        "get"
      );
      if (
        resp.code == 200 &&
        resp.hasOwnProperty("applicantList") &&
        resp.applicantList.length
      ) {
        let appList = resp.applicantList;
        let applicantMaster: any = appList.sort((a: any, b: any) =>
          a.type.toLowerCase() > b.type.toLowerCase() ? 1 : -1
        );
        setAppliantList(applicantMaster);
        getKycDetails();
      } else if (
        resp.hasOwnProperty("status") ||
        resp.hasOwnProperty("Failed")
      ) {
        setIsLoading(false);
        let errmsg =
          resp.hasOwnProperty("Failed") &&
          (resp.hasOwnProperty("status") || resp.hasOwnProperty("Failed"))
            ? resp.Failed
            : resp.status;
        Alert.alert("KYCPage-getAppliantList", JSON.stringify(errmsg));
        console.log("KYCPage-getAppliantList", JSON.stringify(errmsg));
      } else {
        setIsLoading(false);
        Alert.alert("KYCPage-getAppliantList", JSON.stringify(resp));
        console.log("KYCPage-getAppliantList", JSON.stringify(resp));
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("KYCPage-getAppliantList", JSON.stringify(error));
      console.log("Error-getApplicantList-kyc, error");
    }
  };

  const getKycDetails = async () => {
    try {
      let resp = await postMethod(
        AppType.APIClassName.leadManegment,
        `${AppType.APIMethods.getKycDetails}/${userLeadId}`,
        {},
        "get"
      );

      if (resp.status == "200 OK" && resp.hasOwnProperty("leadKycDetails")) {
        console.log("resp-getKycDetails", resp);
        setKYCDataList(resp.leadKycDetails);
        setKYCDataListCount(resp.leadKycDetails.length);
        if (kycDataList.length == appliantList.length) {
          EventEmitter.dispatch("submit", "kycTick");
        }
      } else if (
        resp.hasOwnProperty("status") ||
        resp.hasOwnProperty("Failed")
      ) {
        setIsLoading(false);
        let errmsg =
          resp.hasOwnProperty("Failed") &&
          (resp.hasOwnProperty("status") || resp.hasOwnProperty("Failed"))
            ? resp.Failed
            : resp.status;
        if (resp.Failed == "Lead Data Not Present") {
          Alert.alert("KYCPage-getKycDetails", JSON.stringify(errmsg));
          console.log("KYCPage-getKycDetails", JSON.stringify(errmsg));
        } else {
          Alert.alert("KYCPage-getKycDetails", JSON.stringify(errmsg));
          console.log("KYCPage-getKycDetails", JSON.stringify(errmsg));
        }
      } else {
        setIsLoading(false);
        Alert.alert("KYCPage-getKycDetails", JSON.stringify(resp));
        console.log("KYCPage-getKycDetails", JSON.stringify(resp));
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("KYCPage-getKycDetails", JSON.stringify(error));
      console.log("Error-getKycDetails-kyc, error");
    }
  };

  useEffect(() => {
    getLOVData().then(() => {
      if (userLeadId) {
        getApplicantList();
      }
    });
  }, []);

  /*
  @author         :   ganeshkumar.b
  @since          :   19/08/2024
  @description    :   Save KYC details in server
  */

  const kycDetailsSave = async (value: any) => {
    try {
      console.log("userLeadId", userLeadId);
      setIsLoading(true);
      const reqBody: AppType.KycRequest | any = {
        lkdSeqId: null,
        lkdApplicantType: "",
        lkdLeadId: userLeadId,
        lkdCustId: "",
        lkdOtherIdNo: value.otherIdNo,
        lkdOtherIdProof: value.otherIdProof,
        lkdPanNumber: value.panNo,
        lkdUidNumber: value.uidAadharNo,
      };
      console.log("reqBody", reqBody);
      let resp = await postMethod(
        AppType.APIClassName.leadManegment,
        AppType.APIMethods.saveKycDetails,
        reqBody
      );
      if (resp) {
        setIsLoading(false);
        Alert.alert(JSON.stringify(resp));
        console.log("kycDetailsSave-Error is", JSON.stringify(resp));
      }
    } catch (err) {
      setIsLoading(false);
      Alert.alert(JSON.stringify(err));
      console.error("kycDetailsSave-Error is", JSON.stringify(err));
    }
  };

  return (
    <View className="py-5 px-2">
      {isLoading && <LoadingControl isLoading={isLoading} />}
      <Formik
        initialValues={KYCFormInitialData}
        onSubmit={(val) => kycDetailsSave(val)}
        validationSchema={KYCFormValidationSchema}
      >
        {(formikProps: FormikValues) => (
          <>
            <StyledDropdown
              placeholder="Select Applicant Type"
              title="Applicant Type"
              mandatory={true}
              formikProps={formikProps}
              formikkey="applicantType"
              dropdownData={appliantList}
              dropLableProperty="rdValueDescription"
              dropValueProperty="rdValueCode"
            />

            <Styledtextinput
              label="PAN No."
              formikProps={formikProps}
              formikkey="panNo"
              placeholder="Enter PAN No."
              maxLength={10}
              mandatory={true}
              autoCapitalize="characters"
            />

            <Styledtextinput
              label="Aadhaar No."
              formikProps={formikProps}
              formikkey="uidAadharNo"
              placeholder="Enter Aadhaar No."
              inputMode="tel"
              maxLength={12}
              mandatory={true}
            />

            <StyledDropdown
              placeholder="Select Other ID Proof "
              title="Other ID Proof "
              mandatory={false}
              formikProps={formikProps}
              formikkey="otherIdProof"
              dropdownData={idProofList}
              dropLableProperty="rdValueDescription"
              dropValueProperty="rdValueCode"
            />

            <Styledtextinput
              label="Other ID No."
              formikProps={formikProps}
              formikkey="otherIdNo"
              placeholder="Enter Other ID No."
              mandatory={true}
              maxLength={20}
            />

            <Button title="Submit" onPress={formikProps.handleSubmit} />
          </>
        )}
      </Formik>

      <View style={{ position: "static", top: "30%", left: "80%" }}>
        <View
          style={{
            height: 20,
            width: 20,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "orange",
            left: 40,
            top: 15,
            zIndex: 2,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {kycDataListCount}
          </Text>
        </View>
        <View
          style={{
            height: 60,
            width: 60,
            borderRadius: 60,
            backgroundColor: "#06bcee",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesome5 name="eye" size={24} color="black" />
        </View>
      </View>
    </View>
  );
};

export default KYCPage;

const styles = StyleSheet.create({});
