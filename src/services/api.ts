import axios from "axios";
import { Poll } from "../Interfaces/Poll";
const baseApiUrl = import.meta.env.VITE_API_BASEURL
export const CreatePollApi = async (poll:Poll) => {
  try {
    return axios.post(`${baseApiUrl}/create-poll`,poll)
  } catch (err) {
    console.log(err);
    return null
  }
};

export const GetPoll =async(id:unknown)=>{
  try {
    if(id){
      return axios.get(`${baseApiUrl}/poll/${id}`)
    }
    console.log("No id provided!");
    

  } catch (err) {
    console.log(err);
    return null
  }
}
