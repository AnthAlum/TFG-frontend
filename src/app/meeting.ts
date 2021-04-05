import { ClientListResponse } from "./client-list-response";
import { FileListResponse } from "./file-list-response";
import { MerchantListResponse } from "./merchant-list-response";

export interface Meeting {
  idMeeting: number,
  matter: string,
  description: string,
  merchants: MerchantListResponse,
  clients: ClientListResponse,
  date: string,
  time: string,
  keywords: string[],
  wordCloud: string[],
  files: FileListResponse,
}
