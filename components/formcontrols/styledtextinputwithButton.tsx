import { FormikValues } from "formik";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TextInputProps,
  ButtonProps,
} from "react-native";

export type StyledtextinputProps = {
  formikProps: any;
  label: string;
  title: string;
  formikkey: string;
  mandatory: boolean;
  ValidateInput: Function;
};

const StyledTextInputwithButton = ({
  formikProps,
  label,
  title,
  formikkey,
  mandatory,
  ValidateInput,
  ...rest
}: TextInputProps & ButtonProps & StyledtextinputProps) => {
  const [value, setValue] = useState("");
  return (
    <>
      <View className="">
        <Text className="absolute pt-[-5] text-navy text-sm pl-3 w-full">
          {label}
          {mandatory && <Text className="text-psemibold text-error"> *</Text>}
        </Text>

        <View className="p-2 mt-2 ml-2 border-b border-gray-100 w-full">
          <TextInput
            style={{ width: "50%" }}
            onChangeText={formikProps.handleChange(formikkey)}
            onBlur={formikProps.handleBlur(formikkey)}
            value={formikProps.values[formikkey]}
          />
          <View
            style={{
              width: "30%",
              position: "absolute",
              right: "10%",
              maxWidth: "40%",
            }}
          >
            <Button
              title={title}
              onPress={() => ValidateInput(formikProps.values[formikkey])}
            />
          </View>
        </View>

        <Text className="text-error px-3 ">
          {formikProps.touched[formikkey] && formikProps.errors[formikkey]}
        </Text>
      </View>
    </>
  );
};

export default StyledTextInputwithButton;
