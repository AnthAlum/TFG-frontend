import { Client } from "./client";
import { PaginationInfo } from "./pagination-info";

export interface ClientPage {
  pages: Client[],
  paginationInfo: PaginationInfo
}
