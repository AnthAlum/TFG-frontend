import { MeetingSimplifiedListResponse } from "./meeting-simplified-list-response";

export interface Client {
  idClient: number,
  name: string,
  email: string,
  phone: string,
  company: string,
  meetings: MeetingSimplifiedListResponse,
}
