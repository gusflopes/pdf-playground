import axios from 'axios';
import { parseCookies } from 'nookies';

const cookies = parseCookies();

export const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['pdfapp.accessToken']}`,
  },
});

// import { AxiosInstance } from 'axios';
// import {getAPIClient} from './axios'
// export const api = getAPIClient();
