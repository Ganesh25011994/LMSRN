import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TextInputProps,
} from "react-native";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";

export type DatePickerProps = {
  formikProps: any;
  label: string;
  formikkey: string;
  mandatory: boolean;
  maxDate?: Date;
  minDate?: Date;
};

const StyleDateInput = ({
  formikProps,
  label,
  formikkey,
  mandatory,
  maxDate,
  minDate,
  ...rest
}: TextInputProps & DatePickerProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [age, setAge] = useState("");
  const [date, setDate] = useState(new Date());

  const onChange = (event: any, selectedDate: any) => {
    setAge("");
    const currentDate = selectedDate || date;
    let age = moment(currentDate).format("DD/MM/YYYY");
    age = moment(currentDate, "DD/MM/YYYY").format("YYYY-MM-DD");
    let agevalue = age.toString();
    setShowDatePicker(false);
    setAge(agevalue);
    formikProps.setFieldValue(formikkey, age);
    setDate(currentDate);
  };

  return (
    <View>
      <Text className="absolute pt-[-5] text-navy text-sm pl-3 w-full">
        {label}
        {mandatory && <Text className="text-psemibold text-error"> *</Text>}
      </Text>
      <TextInput
        className="p-2 mt-2 ml-2 border-b border-gray-100"
        onFocus={() => {
          setShowDatePicker(true);
        }}
        inputMode="none"
        value={formikProps.values[formikkey]}
        defaultValue={age}
        {...rest}
      />

      <Text className="text-error px-3 ">
        {formikProps.touched[formikkey] && formikProps.errors[formikkey]}
      </Text>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
          maximumDate={maxDate}
          minimumDate={minDate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputCard: {
    height: 50,
    marginLeft: 10,
    marginTop: 30,
  },
  label: {
    fontSize: 18,
  },
  inputData: {
    borderBottomWidth: 1,
    zIndex: 100,
  },
  button: {
    height: 40,
    backgroundColor: "transparent",
    opacity: 0.2,
  },
  errorText: {
    color: "red",
  },
});

export default StyleDateInput;
