export interface CreateCalendarRequest {
  id: string;
  data: string;
  timezone: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  externalID?: number;
}

export interface GetCalendarResponse {
  id: string;
  data: string;
  timezone: string;
  color: string;
  externalID: number;
  createdAt: string;
  updatedAt: string;
}
