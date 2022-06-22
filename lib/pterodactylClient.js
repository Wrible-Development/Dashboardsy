import Axios from 'axios'
import { executeQuery } from '../db'

const config = await executeQuery("SELECT * FROM config;")

const Client = await Axios.create({
    baseURL: `${config[0].panel_url}/api/application`,
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + config[0].pterodactylapikey
    }
})

export default Client;