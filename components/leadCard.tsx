import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export type LeadCardProps = {
  applicantName: string;
  viewSeqId: string;
  Product: string;
  onRoute: Function | any;
};
const LeadCard = ({
  applicantName,
  viewSeqId,
  Product,
  onRoute,
}: LeadCardProps) => {
  return (
    <TouchableOpacity onPress={onRoute}>
      <View style={styles.card}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "40%" }}>
            <Image
              source={{
                uri: "https://picsum.photos/seed/696/3000/2000",
              }}
              style={{ width: 100, height: 100, borderRadius: 10 }}
              resizeMode="cover"
            />
          </View>

          <View style={{ width: "60%", marginTop: 15 }}>
            <View style={styles.fulllabel}>
              <Text style={styles.label}>Applicant Name:</Text>
              <Text style={styles.data}>{applicantName}</Text>
            </View>

            <View style={styles.fulllabel}>
              <Text style={styles.label}>Seq ID:</Text>
              <Text style={styles.data}>{viewSeqId}</Text>
            </View>

            <View style={styles.fulllabel}>
              <Text style={styles.label}>Product</Text>
              <Text style={styles.data}>{Product}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LeadCard;

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    width: "90%",
    marginLeft: "5%",
    marginBottom: 20,
    padding: 15,
  },
  fulllabel: {
    flexDirection: "row",
  },
  label: {
    fontSize: 16,
  },
  data: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
