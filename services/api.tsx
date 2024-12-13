import axios from "axios";

export type getTime = {
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    seconds: number,
    milliSeconds: number,
    dateTime: string,
    date: string,
    time: string,
    timeZone: string,
    dayOfWeek: string,
    dstActive: boolean,
}

const baseURL = "https://timeapi.io/api/time/current/"

export async function getDateTime(longitude: number, latitude: number){
    return new Promise<getTime>(async (resolve, reject) =>{
      
        const config = {
            params:{
                'latitude': latitude,
                'longitude': longitude
            }
        }

        await axios.get<getTime>(`${baseURL}coordinate`,config).then((res)=>{
            console.log("get dateTime", res.data)
            resolve(res.data)
        }).catch((error)=>{
            console.log("erro encontrado no getDateTime", error)
        });

    });
  }