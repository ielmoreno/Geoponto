import { useState, useEffect, useRef } from 'react';
import { Platform, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import * as api from '@/services/api'
import Globais from '@/components/Variaveis/Globais';


export default function Registro() {

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number>(-23.636412);
  const [longitude,setLongitude] = useState<number>(-45.42567);
  const [latMaxima, setLatMaxima] = useState<number>(0);
  const [latMinima, setLatMinima] = useState<number>(0);
  const [longMaxima, setLongMaxima] = useState<number>(0);
  const [longMinima, setLongMinima] = useState<number>(0);
  const [dataHora, setDataHora] = useState("")
  const [refresh, setRefresh] = useState(false);

  const mapRef = useRef<MapView>(null)

  useEffect(() => {
    getCurrentLocation();
    calculaMaxMin()
  }, []);

  useEffect(()=>{
    Location.watchPositionAsync({
      accuracy: Location.LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1,
    }, (response: Location.LocationObject)=>{
      //console.log("nova localização ", response)
      setLatitude(Number(response.coords.latitude.toFixed(6)))
      setLongitude(Number(response.coords.longitude.toFixed(6)))
      setLocation(response)
      console.log(response)
      getHora()
      mapRef.current?.animateCamera({
        center: response.coords
      })
    })
  }, [])

  useEffect(()=>{
    
  },[refresh])

  function getHora(){
    if(location){
      api.getDateTime(location.coords.longitude,location.coords.latitude).then((res:api.getTime)=>{
            setDataHora(res.dateTime.toString())
            console.log("API Time", res.dateTime)
      })
    }
  }

  function calculaMaxMin(){
    let latidudeMax = Number((((((Globais.latSec+Globais.dist)/60)+Globais.latMin)/60)+Globais.latGrau).toFixed(6))
    let latitudeMin = Number((((((Globais.latSec-Globais.dist)/60)+Globais.latMin)/60)+Globais.latGrau).toFixed(6))
    if(!Globais.latPos){
      setLatMaxima(-latidudeMax)
      setLatMinima(-latitudeMin)
    }else{
      setLatMaxima(latidudeMax)
      setLatMinima(latitudeMin)
    }

    let longitudeMax = Number((((((Globais.longSec+Globais.dist)/60)+Globais.longMin)/60)+Globais.longGrau).toFixed(6))
    let longitudeMin = Number((((((Globais.longSec-Globais.dist)/60)+Globais.longMin)/60)+Globais.longGrau).toFixed(6))
    if(!Globais.longPos){
      setLongMaxima(-longitudeMax)
      setLongMinima(-longitudeMin)
    }else{
      setLongMaxima(longitudeMax)
      setLongMinima(longitudeMin)
    }

  }

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

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    let teste = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
    }
    text = JSON.stringify(teste);
  }

  function baterPonto(){
    console.log("maxlat", latMaxima)
    console.log("minlat",latMinima)
    console.log("maxlong", longMaxima)
    console.log("minlong", longMinima)
    console.log("lat", latitude)
    console.log("long",longitude)
    if(Globais.latPos){
      if(latMaxima>latitude && latMinima<latitude){
        if(Globais.longPos){
          if(longMaxima>longitude && longMinima<longitude){
            alert("bateu o ponto")
            getHora()
          }else{
            alert("Você não está no local permitido para o registro do ponto")
          }
        }else{
          if(longMaxima<longitude && longMinima>longitude){
            alert("bateu o ponto")
            getHora()
          }else{
            alert("Você não está no local permitido para o registro do ponto")
          }
        }
      }else{
        alert("Você não está no local permitido para o registro do ponto")
      }
    }else{
      if(latMaxima<latitude && latMinima>latitude){
        if(Globais.longPos){
          if(longMaxima>longitude && longMinima<longitude){
            alert("bateu o ponto")
            getHora()
          }else{
            alert("Você não está no local permitido para o registro do ponto")
          }
        }else{
          if(longMaxima<longitude && longMinima>longitude){
            alert("bateu o ponto")
            getHora()
          }else{
            alert("Você não está no local permitido para o registro do ponto")
          }
        }
      }else{
        alert("Você não está no local permitido para o registro do ponto")
      }
    }
      setRefresh(!refresh)
  }


  return (
    <SafeAreaView>
      {
        location &&
        <MapView style={{width:"80%", height:"60%", borderRadius:20,alignSelf:'center',marginTop: "auto"}}
        ref={mapRef}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta:0.005,
          longitudeDelta:0.005
        }}>
          <Marker coordinate={{
            latitude:location.coords.latitude,
            longitude: location.coords.longitude,
          }}/>
        </MapView>
      }
      <TouchableOpacity style={styles.button} onPress={()=> baterPonto()}>
        <ThemedText style={styles.paragraph}>Bater ponto</ThemedText>
      </TouchableOpacity>
      <ThemedText style={{alignSelf:"center"}}>{dataHora}</ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight:"bold"
  },
  button:{
    backgroundColor:'#008000',
    marginTop: 200,
    width:'40%',
    height:'6%',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10,
    alignSelf:"center"
  }
});
