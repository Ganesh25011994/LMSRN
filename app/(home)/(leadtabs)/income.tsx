import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Alert,
  Button,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Formik, FormikValues } from "formik";
import { IncomeFormInitialData } from "@/apptypes";
import { IncomeFormValidationSchema } from "@/apptypes/AppValidationSchemas";
import { StyledDropdown, Styledtextinput } from "@/components/formcontrols";
import { dbopsStaticDataMasters } from "@/services";
import * as AppType from "@/apptypes/AppTypes";

const IncomePage = () => {
  const [occupation, setOccupation] = useState<AppType.Lov[]>([]);

  const getLovData = async () => {
    let occupationMaster: any[] = await dbopsStaticDataMasters.findByID(7);
    console.log("occupationMaster", occupationMaster);
    setOccupation(occupationMaster);
  };
  useEffect(() => {
    getLovData();
  }, []);

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <View className="py-5 px-2">
          <Formik
            initialValues={IncomeFormInitialData}
            onSubmit={(val) => console.log(val)}
            validationSchema={IncomeFormValidationSchema}
          >
            {(formikProps: FormikValues) => (
              <>
                <StyledDropdown
                  placeholder="Select Occupation Type"
                  title="Occupation"
                  mandatory={true}
                  formikProps={formikProps}
                  formikkey="occupation"
                  dropdownData={occupation}
                  dropLableProperty="rdValueDescription"
                  dropValueProperty="rdValueCode"
                />

                <Styledtextinput
                  label="Gross Income / Salary(₹) (Per Month) "
                  formikProps={formikProps}
                  formikkey="grossIncome"
                  placeholder="Enter Gross Income"
                  inputMode="tel"
                  maxLength={15}
                  mandatory={true}
                />

                <Styledtextinput
                  label="Gross Monthly Deductions(₹) (Per Month) "
                  formikProps={formikProps}
                  formikkey="grossMonthlyDeductions"
                  placeholder="Enter Gross Monthly Deductions"
                  inputMode="tel"
                  maxLength={15}
                  mandatory={true}
                />

                <Styledtextinput
                  label="Net Income(₹) (Per Year) "
                  formikProps={formikProps}
                  formikkey="netIncome"
                  placeholder="Enter Net Income"
                  inputMode="tel"
                  maxLength={15}
                  mandatory={true}
                />

                <Styledtextinput
                  label="Networth of the Applicant(₹) "
                  formikProps={formikProps}
                  formikkey="networth"
                  placeholder="Enter Net Worth"
                  inputMode="tel"
                  maxLength={15}
                  mandatory={true}
                />

                <Styledtextinput
                  label="Company"
                  formikProps={formikProps}
                  formikkey="company"
                  placeholder="Enter Company Name"
                  inputMode="text"
                  maxLength={15}
                  mandatory={false}
                />

                <Styledtextinput
                  label="Total years of Employment"
                  formikProps={formikProps}
                  formikkey="totYearsOfEmp"
                  placeholder="Enter Total years of Employment"
                  inputMode="tel"
                  maxLength={15}
                  mandatory={false}
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

export default IncomePage;

const styles = StyleSheet.create({});
