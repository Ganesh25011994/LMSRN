import {
  Alert,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Formik, FormikValues, FormikState } from "formik";
import { LoanFormValidationSchema } from "@/apptypes/AppValidationSchemas";
import { LoanFormInitialData, Lov } from "@/apptypes";
import { StyledDropdown, Styledtextinput } from "@/components/formcontrols";
import {
  dbopsSubProductsMasters,
  dbopsMainProductsMasters,
  dbopsLoanProductMaster,
  dbopsLoanPurposeMaster,
} from "@/services";
import { postMethod } from "@/lib/appAPIServices";
import * as AppType from "@/apptypes/AppTypes";

const LoanPage = () => {
  const [maincategory, setMainCategory] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [loanproduct, setLoanProduct] = useState([]);
  const [purpose, setPurpose] = useState([]);
  const [maincode, setMainCode] = useState("");

  const getLovData = async () => {
    let mainproduct: any = await dbopsMainProductsMasters.findAll();
    let productMaster: any = mainproduct.map((lov: any) => ({
      rdValueDescription: lov.facDesc,
      rdValueCode: lov.facId,
    }));
    setMainCategory(productMaster);
  };

  const onChangeMainCategory = async (val: any, formikProps: FormikValues) => {
    formikProps.setFieldValue("mainCategory", val);
    let subproduct = await dbopsSubProductsMasters.findByfacParentID(val);
    let subProductMaster: any = subproduct.map((lov: any) => ({
      rdValueDescription: lov.facDesc,
      rdValueCode: lov.facId,
    }));
    setSubCategory(subProductMaster);
    setMainCode(val);
  };

  const onChangeSubCategory = async (val: any, formikProps: FormikValues) => {
    formikProps.setFieldValue("subCategory", val);
    let subproduct: any[] = await dbopsSubProductsMasters.findByfasID(val);
    let vertical: string = subproduct[0].vertical;
    console.log("vertical", vertical);
    console.log("maincode", maincode);
    getLoanProductMaster(val, vertical);
  };

  const getLoanProductMaster = async (subCode: string, vertical: string) => {
    try {
      const reqBody = {
        businessDescription: vertical,
        mainCategory: maincode,
        subCategory: subCode,
      };
      const resp = await postMethod(
        AppType.APIClassName.web,
        AppType.APIMethods.loanProdutForLead,
        reqBody
      );
      if (resp.responseCode == "200" && resp.responseMessage == "Success") {
        let productMaster = resp.lpstpProductDetailsList;
        let loanproduct: any[] =
          await dbopsLoanProductMaster.findBySubCodeID(subCode);

        console.log("loanproduct", loanproduct);
        console.log("loanproduct-length", loanproduct.length);

        if (loanproduct.length == 0) {
          if (Array.isArray(productMaster)) {
            productMaster.forEach(
              (val: Record<string, string | number | null>) => {
                dbopsLoanProductMaster.save(val, subCode);
              }
            );
          }
        }
        mappingLoanProductMaster(productMaster, subCode);
      } else {
        Alert.alert(JSON.stringify(resp));
        console.log(JSON.stringify(resp), "getLoanProductMaster-loan.tsx");
      }
    } catch (error) {
      Alert.alert(JSON.stringify(error));
      console.log(JSON.stringify(error), "getLoanProductMaster-loan.tsx");
    }
  };

  //MapCity Data in master
  const mappingLoanProductMaster = (productMaster: any, subCode: string) => {
    let mapcitydata: any = productMaster.map((lov: any) => ({
      rdValueDescription: lov.lpdPrdDesc,
      rdValueCode: lov.lpdProdId,
      subCode: subCode,
      lpdPrdType: lov.lpdPrdType,
      lpdHlType: lov.lpdHlType,
    }));
    setLoanProduct(mapcitydata);
  };

  const onChangeLoanProduct = async (val: any, formikProps: FormikValues) => {
    formikProps.setFieldValue("loanProduct", val);
    console.log("onChangeLoanProduct", val);
    let loanpurpose: any[] = await dbopsLoanPurposeMaster.findByID(val);
    if (loanpurpose.length == 0) {
      let loanproduct: any[] = await dbopsLoanProductMaster.findByProdID(val);
      console.log("loanproduct", loanproduct);
      getPurposeofLoanMaster(loanproduct);
    } else {
      mappingLoanPurposeMaster(loanpurpose);
    }
  };

  const getPurposeofLoanMaster = async (loanproduct: any) => {
    try {
      const reqBody = {
        loanType: loanproduct[0].lpdPrdType,
        hlType: loanproduct[0].lpdHlType,
      };

      console.log("reqBody-getPurposeofLoanMaster", reqBody);
      const resp = await postMethod(
        AppType.APIClassName.web,
        AppType.APIMethods.purposeOfLoan,
        reqBody
      );
      if (resp.responseCode == "200" && resp.responseMessage == "Success") {
        let loanPurposeMaster = resp.lpmasListofValueList;
        if (Array.isArray(loanPurposeMaster)) {
          loanPurposeMaster.forEach(
            (val: Record<string, string | number | null>) => {
              dbopsLoanPurposeMaster.save(val);
            }
          );
        }
        mappingLoanPurposeMaster(loanPurposeMaster);
      } else {
        Alert.alert(JSON.stringify(resp));
        console.log(JSON.stringify(resp), "getPurposeofLoanMaster-loan.tsx");
      }
    } catch (error) {
      Alert.alert(JSON.stringify(error));
      console.log(JSON.stringify(error), "getPurposeofLoanMaster-loan.tsx");
    }
  };

  //MapCity Data in master
  const mappingLoanPurposeMaster = (productMaster: any) => {
    let mapcitydata: any = productMaster.map((lov: any) => ({
      rdValueDescription: lov.optionDescription,
      rdValueCode: lov.optionValue,
    }));
    setPurpose(mapcitydata);
  };

  useEffect(() => {
    getLovData();
  }, []);

  return (
    <KeyboardAvoidingView>
      <View className="py-5 px-2">
        <Formik
          initialValues={LoanFormInitialData}
          onSubmit={(val) => console.log(val)}
          validationSchema={LoanFormValidationSchema}
        >
          {(formikProps: FormikValues) => (
            <>
              <StyledDropdown
                placeholder="Select Main Category"
                title="Main Category "
                mandatory={true}
                formikProps={formikProps}
                formikkey="mainCategory"
                dropdownData={maincategory}
                dropLableProperty="rdValueDescription"
                dropValueProperty="rdValueCode"
                onChangeDrobDown={(val: any) =>
                  onChangeMainCategory(val, formikProps)
                }
              />

              <StyledDropdown
                placeholder="Select Sub Category"
                title="Sub Category "
                mandatory={true}
                formikProps={formikProps}
                formikkey="subCategory"
                dropdownData={subcategory}
                dropLableProperty="rdValueDescription"
                dropValueProperty="rdValueCode"
                onChangeDrobDown={(val: any) =>
                  onChangeSubCategory(val, formikProps)
                }
              />

              <StyledDropdown
                placeholder="Select Loan Product"
                title="Loan Product "
                mandatory={true}
                formikProps={formikProps}
                formikkey="loanProduct"
                dropdownData={loanproduct}
                dropLableProperty="rdValueDescription"
                dropValueProperty="rdValueCode"
                onChangeDrobDown={(val: any) =>
                  onChangeLoanProduct(val, formikProps)
                }
              />

              <StyledDropdown
                placeholder="Select Purpose of Loan Type"
                title="Purpose of Loan Type"
                mandatory={true}
                formikProps={formikProps}
                formikkey="newPurposeOfLoan"
                dropdownData={purpose}
                dropLableProperty="rdValueDescription"
                dropValueProperty="rdValueCode"
              />

              <Styledtextinput
                label="Loan Amount Requested (₹) "
                formikProps={formikProps}
                formikkey="loanAmountRequested"
                placeholder="Enter Loan Amount"
                maxLength={12}
                mandatory={true}
              />

              <Button title="Submit" onPress={formikProps.handleSubmit} />
            </>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoanPage;
