import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import SubHeader from "@/components/subheader";
import { Fontisto } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const { Navigator } = createMaterialTopTabNavigator();
import { EventEmitter } from "../../../constants/event";
export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const TopTabLayout = () => {
  const [sourceTick, setSoucingTick] = useState(false);
  const [personalTick, setPersonalTick] = useState(false);
  const [kycTick, setKYCTick] = useState(false);
  const [incomeTick, setIncomeTick] = useState(false);
  const [loanTick, setLoanTick] = useState(false);
  const [documentTick, setDocumentTick] = useState(false);
  const [submitTick, setSubmitTick] = useState(false);
  useEffect(() => {
    EventEmitter.subscribe("submit", (event: any) => {
      console.log("submit Event", event);
      if (event == "sourceTick") {
        setSoucingTick(true);
      } else if (event == "personalTick") {
        setPersonalTick(true);
      } else if (event == "kycTick") {
        setKYCTick(true);
      }
    });
  });

  useEffect(() => {
    return () => {
      console.log("sourcing tab is closed");
    };
  }, []);
  return (
    <>
      <SubHeader />
      <MaterialTopTabs>
        <MaterialTopTabs.Screen
          name="sourcing"
          options={{
            tabBarShowLabel: false,
            tabBarIcon: () => (
              <MaterialCommunityIcons
                name="open-source-initiative"
                size={24}
                color="black"
              />
            ),

            tabBarBadge: sourceTick
              ? () => (
                  <FontAwesome5 name="check-circle" size={16} color="green" />
                )
              : undefined,
          }}
        />
        <MaterialTopTabs.Screen
          name="personal"
          options={{
            tabBarShowLabel: false,
            tabBarIcon: () => (
              <Fontisto name="persons" size={24} color="black" />
            ),
            tabBarBadge: personalTick
              ? () => (
                  <FontAwesome5 name="check-circle" size={16} color="green" />
                )
              : undefined,
          }}
        />

        <MaterialTopTabs.Screen
          name="kyc"
          options={{
            tabBarShowLabel: false,
            tabBarIcon: () => (
              <Ionicons name="id-card-outline" size={24} color="black" />
            ),
            tabBarBadge: kycTick
              ? () => (
                  <FontAwesome5 name="check-circle" size={16} color="green" />
                )
              : undefined,
          }}
        />
        <MaterialTopTabs.Screen
          name="income"
          options={{
            tabBarShowLabel: false,
            tabBarIcon: () => (
              <FontAwesome5 name="coins" size={24} color="black" />
            ),
            tabBarBadge: incomeTick
              ? () => (
                  <FontAwesome5 name="check-circle" size={16} color="green" />
                )
              : undefined,
          }}
        />
        <MaterialTopTabs.Screen
          name="loan"
          options={{
            tabBarShowLabel: false,
            tabBarIcon: () => (
              <Ionicons name="list-outline" size={24} color="black" />
            ),
            tabBarBadge: loanTick
              ? () => (
                  <FontAwesome5 name="check-circle" size={16} color="green" />
                )
              : undefined,
          }}
        />
        <MaterialTopTabs.Screen
          name="document"
          options={{
            tabBarShowLabel: false,
            tabBarIcon: () => (
              <Ionicons
                name="document-attach-outline"
                size={24}
                color="black"
              />
            ),
            tabBarBadge: documentTick
              ? () => (
                  <FontAwesome5 name="check-circle" size={16} color="green" />
                )
              : undefined,
          }}
        />
        <MaterialTopTabs.Screen
          name="submission"
          options={{
            tabBarShowLabel: false,
            tabBarIcon: () => (
              <FontAwesome name="upload" size={24} color="black" />
            ),
            tabBarBadge: submitTick
              ? () => (
                  <FontAwesome5 name="check-circle" size={16} color="green" />
                )
              : undefined,
          }}
        />
      </MaterialTopTabs>
    </>
  );
};

export default TopTabLayout;

const styles = StyleSheet.create({});
