import { MeetingSimplifiedListResponse } from "./meeting-simplified-list-response";

export interface Merchant {
  idMerchant: number,
  name: string,
  email: string,
  phone: string,
  idRole: number,
  meetings: MeetingSimplifiedListResponse,
}
