import { Merchant } from './merchant';
import { PaginationInfo } from './pagination-info';

export interface MerchantPage {
  pages: Merchant[],
  paginationInfo: PaginationInfo
}
