import { Meeting } from "./meeting";
import { PaginationInfo } from "./pagination-info";

export interface MeetingPage {
  pages: Meeting[],
  paginationInfo: PaginationInfo
}
