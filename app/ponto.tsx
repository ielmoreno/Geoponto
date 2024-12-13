import { GeofencingEventType } from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { useEffect, useState } from 'react';

type region = {
  latitude: number,
  longitude:number,
  radius: number
}

export default function Ponto(){
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [region, setRegion] = useState<region>();
  
    useEffect(() => {  
      let insertRegion = {
        latitude: -23.63682128755108,
        longitude: 45.425695167196686,
        radius: 200,
      }
      setRegion(insertRegion);
    }, []);

    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de leitura da localização negada');
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
    
    TaskManager.defineTask("ponto", ({ data: {eventType,region} , error }) => {
        if (error) {
          // check `error.message` for more details.
          return;
        }
        if (eventType === GeofencingEventType.Enter) {
          console.log("You've entered region:", region);
        } else if (eventType === GeofencingEventType.Exit) {
          console.log("You've left region:", region);
        }
      });
}