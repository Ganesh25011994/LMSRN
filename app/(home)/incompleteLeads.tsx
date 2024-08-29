import { Alert, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { postMethod } from "@/lib/appAPIServices";
import * as AppType from "@/apptypes/AppTypes";
import LoadingControl from "@/components/loading";
import LeadCard from "@/components/leadCard";
import { router, useNavigation } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";

const IncompleteLeadPage = () => {
  const { setUserLeadID } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [leadList, setLeadList] = useState([]);
  const [leadShow, setLeadShow] = useState(false);

  const leadpage = async (leadid: string) => {
    setUserLeadID(leadid);
    router.push("(leadtabs)/sourcing");
  };
  const incompleteList = async () => {
    try {
      let leadID = "60011";
      setIsLoading(true);
      let response = await postMethod(
        AppType.APIClassName.leadManegment,
        `${AppType.APIMethods.getUserLeadDetails}/${leadID}/INCM`,
        {},
        "get"
      );
      console.log("response", response);
      if (response.status == "200 OK") {
        setIsLoading(false);
        setLeadShow(true);
        setLeadList(response.leadList);
      } else {
        setIsLoading(false);
        Alert.alert("Alert", "No Leads available in the Inbox");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", JSON.stringify(error));
    }
  };

  useEffect(() => {
    setUserLeadID("");
    incompleteList();
  }, []);
  return (
    <View style={{ marginTop: 30 }}>
      {isLoading && <LoadingControl isLoading={isLoading} />}
      <View>
        {!leadShow && (
          <View>
            <Text>No Data Found</Text>
          </View>
        )}
        {leadShow &&
          leadList.map((val: any) => {
            return (
              <LeadCard
                key={val.viewSeqId}
                applicantName={val.mdName}
                viewSeqId={val.viewSeqId}
                Product={val.ldPrdCode}
                onRoute={() => leadpage(val.viewSeqId)}
              />
            );
          })}
      </View>
    </View>
  );
};

export default IncompleteLeadPage;

const styles = StyleSheet.create({});
