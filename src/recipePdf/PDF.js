import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 30,
    color: 'red'
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10
  },
  picDes: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    color: 'red',
    borderBottom: '1 solid red'
  },
  pic: {
    width: 283,
    height: 270
  },
  desc: {
    width: 283,
    height: 270,
    padding: 10
  },
  ing: {
    width: '100%',
    height: 'auto',
    padding: 10,
    marginTop: 10
  },
  ins: {
    width: '100%',
    height: 'auto',
    padding: 10,
    marginTop: 10
  },
  item: {
    marginLeft: 5
  }
});

export const PDF = ({
  imageUrl,
  instructions,
  ingredients,
  name,
  description
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <Text style={styles.title}>Title</Text>
        <View style={styles.picDes}>
          {/* <Image
            style={styles.pic}
            src="https://storage.googleapis.com/foodtomake-recipe-photos/558075a3-2e65-44b0-8f1f-0a44fcc19e97Grilled-Chicken-Salad-with-Seasonal-Fruit.jpg"
          /> */}
          <Text style={styles.pic}>hello</Text>
          <Text style={styles.desc}>hello</Text>
        </View>
        <View style={styles.ing}>
          <Text style={styles.header}>Ingredients</Text>
          <Text style={styles.item}>Word</Text>
          <Text style={styles.item}>Word</Text>
          <Text style={styles.item}>Word</Text>
          <Text style={styles.item}>Word</Text>
          <Text style={styles.item}>Word</Text>
          <Text style={styles.item}>Word</Text>
          <Text style={styles.item}>Word</Text>
          <Text style={styles.item}>Word</Text>
          <Text style={styles.item}>Word</Text>
          <Text style={styles.item}>Word</Text>
        </View>
        <View style={styles.ins}>
          <Text style={styles.header}>Instructions</Text>
          <Text style={styles.item}>Word</Text>
          <Text style={styles.item}>Word</Text>
          <Text style={styles.item}>Word</Text>
          <Text style={styles.item}>Word</Text>
          <Text style={styles.item}>Word</Text>
          <Text style={styles.item}>Word</Text>
          <Text style={styles.item}>Word</Text>
          <Text style={styles.item}>Word</Text>
        </View>
      </Page>
    </Document>
  );
};

export const PDF2 = (
  <Document>
    <Page size="A4" style={styles.body}>
      <Text style={styles.title}>Title</Text>
      <View style={styles.picDes}>
        <Text style={styles.pic}>hello</Text>
        <Text style={styles.desc}>hello</Text>
      </View>
      <View style={styles.ing}>
        <Text style={styles.header}>Ingredients</Text>
        <Text style={styles.item}>Word</Text>
        <Text style={styles.item}>Word</Text>
        <Text style={styles.item}>Word</Text>
        <Text style={styles.item}>Word</Text>
        <Text style={styles.item}>Word</Text>
        <Text style={styles.item}>Word</Text>
        <Text style={styles.item}>Word</Text>
        <Text style={styles.item}>Word</Text>
        <Text style={styles.item}>Word</Text>
        <Text style={styles.item}>Word</Text>
      </View>
      <View style={styles.ins}>
        <Text style={styles.header}>Instructions</Text>
        <Text style={styles.item}>Word</Text>
        <Text style={styles.item}>Word</Text>
        <Text style={styles.item}>Word</Text>
        <Text style={styles.item}>Word</Text>
        <Text style={styles.item}>Word</Text>
        <Text style={styles.item}>Word</Text>
        <Text style={styles.item}>Word</Text>
        <Text style={styles.item}>Word</Text>
      </View>
    </Page>
  </Document>
);
