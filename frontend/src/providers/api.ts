import axios from 'axios';
import { parseCookies } from 'nookies';

const cookies = parseCookies();

export const api = axios.create({
  baseURL: 'http://localhost:3334',
  headers: {
    Authorization: `Bearer ${cookies['pdfapp.accessToken']}`,
  },
});

// import { AxiosInstance } from 'axios';
// import {getAPIClient} from './axios'
// export const api = getAPIClient();
