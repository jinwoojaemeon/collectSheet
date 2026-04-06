import {api} from './axios';
import {API_ENDPOINTS} from './config';

export const sheetService = {
  list: () => api.get(API_ENDPOINTS.sheets.list),
  detail: (id: string | number) => api.get(API_ENDPOINTS.sheets.detail(id)),
};

const services = {sheetService};

export default services;
