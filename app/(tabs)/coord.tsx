import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, TouchableOpacity,TextInput } from 'react-native';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as api from '@/services/api'
import Globais from '@/components/Variaveis/Globais';

export default function () {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lat,setLat] = useState("");
  const [long,setLong] = useState('');
  const [radius,setRadius] = useState('');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  async function getCurrentLocation() {
    if (Platform.OS === 'android' && !Device.isDevice) {
      setErrorMsg(
        'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
      );
      return;
    }
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let localization = await Location.getCurrentPositionAsync({});
    setLocation(localization);
  }

  function enviaGlobais(){
    if(Number(lat)<0){
      let latPos= -(lat)
      let grau = latPos.toString().split(".")[0]
      let min = ((latPos-parseInt(grau))*60).toString().split(".")[0]
      let sec = ((((latPos-parseInt(grau))*60)-parseInt(min))*60).toFixed(1).toString()
      Globais.latGrau = Number(grau);
      Globais.latMin = Number(min);
      Globais.latSec = Number(sec);
      Globais.latPos = false;
      Globais.latitude = Number(lat);
      console.log(`latNM ${grau} ${min}'${sec}" S`)
    }else{
      let grau = lat.toString().split(".")[0]
      let min = ((Number(lat)-parseInt(grau))*60).toString().split(".")[0]
      let sec = ((((Number(lat)-parseInt(grau))*60)-parseInt(min))*60).toFixed(1).toString()
      Globais.latGrau = Number(grau);
      Globais.latMin = Number(min);
      Globais.latSec = Number(sec);
      Globais.latPos = true;
      Globais.latitude = Number(lat);
      console.log(`latNM ${grau} ${min}'${sec}" N`)
    }
    if(Number(long)<0){
      let longPos= -(long)
      let grau = longPos.toString().split(".")[0]
      let min = ((longPos-parseInt(grau))*60).toString().split(".")[0]
      let sec = ((((longPos-parseInt(grau))*60)-parseInt(min))*60).toFixed(1).toString()
      Globais.longGrau = Number(grau);
      Globais.longMin = Number(min);
      Globais.longSec = Number(sec);
      Globais.longPos = false;
      Globais.longitude = Number(long);
      console.log(`longNM ${grau} ${min}'${sec}" W` )
    }else{
      let grau = long.toString().split(".")[0]
      let min = ((Number(long)-parseInt(grau))*60).toString().split(".")[0]
      let sec = ((((Number(long)-parseInt(grau))*60)-parseInt(min))*60).toFixed(1).toString()
      Globais.longGrau = Number(grau);
      Globais.longMin = Number(min);
      Globais.longSec = Number(sec);
      Globais.longPos = true;
      Globais.longitude = Number(long);
      console.log(`longNM ${grau} ${min}'${sec}" E` )
    }
    Globais.radius = Number(radius);
    Globais.dist = Number(((Number(radius)/1852)*60).toFixed(1))
    // console.log("distancia em NM", Globais.dist)
    // console.log(`latidude máxima ${Globais.latGrau} ${Globais.latMin} ${Globais.latSec+Globais.dist}`)
    // console.log(`latidude minima ${Globais.latGrau} ${Globais.latMin} ${Globais.latSec-Globais.dist}`)
    // let latitudeMax = (((((Globais.latSec+Globais.dist)/60)+Globais.latMin)/60)+Globais.latGrau).toFixed(6)
    // let latitudeMin = (((((Globais.latSec-Globais.dist)/60)+Globais.latMin)/60)+Globais.latGrau).toFixed(6)
    // console.log("coord lat max", latitudeMax)
    // console.log("coord lat min", latitudeMin)
    alert("globais atualizada")
  }

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    api.getDateTime(location.coords.longitude,location.coords.latitude).then((res:api.getTime)=>{
      console.log("API Time", res.dateTime)
    })
    //console.log(location)
    let teste = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
    }
    text = JSON.stringify(teste);
  }

  return (
    <ThemedView style={styles.container}>
        <ThemedText style={styles.paragraph}>Latitude:</ThemedText>
        <TextInput value={lat} style={styles.input} onChangeText={setLat}/>
        <ThemedText style={styles.paragraph}>Longitude:</ThemedText>
        <TextInput value={long} style={styles.input} onChangeText={setLong}/>
        <View >
          <ThemedText style={styles.paragraph}>Raio:</ThemedText>
          <ThemedText style={styles.minorparagraph}>(aconselhado mín:20)</ThemedText>
        </View>
        <TextInput value={radius} placeholder={"20"} placeholderTextColor={"#AAA"} style={styles.input} onChangeText={setRadius}/>
        <ThemedText style={styles.paragraph}>{text}</ThemedText>
        <TouchableOpacity onPress={()=> enviaGlobais()} style={styles.button}>
            <ThemedText style={styles.paragraph}>Enviar Dados</ThemedText>
        </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight:"bold"
  },
  minorparagraph: {
    fontSize: 14,
    textAlign: 'center',
  },
  input:{
    height:40,
    width:"70%",
    backgroundColor:"#777",
    borderRadius:5,
    paddingHorizontal:5,
    textAlign:'center',
    fontWeight:"bold",
    fontSize:16
  },
  button:{
    backgroundColor:'#008000',
    marginTop: 200,
    width:'40%',
    height:'5%',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10

  }
});
