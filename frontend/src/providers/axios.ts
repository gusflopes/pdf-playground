import axios, { AxiosInstance } from 'axios';
import { parseCookies } from 'nookies';
import { HeadersDefaults } from 'axios';

interface CommonHeaderProperties extends HeadersDefaults {
  Authorization: string;
}

interface IGetApiClient {
  api: AxiosInstance;
}

export function getAPIClient<IGetApiClient>(ctx?: any) {
  const { 'pdfapp.accessToken': accessToken } = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'http://localhost:3334',
  });

  api.interceptors.request.use((config) => {
    console.log(config);
    return config;
  });

  if (accessToken) {
    api.defaults.headers = {
      Authorization: `Bearer ${accessToken}`,
    } as CommonHeaderProperties;
  }
}
