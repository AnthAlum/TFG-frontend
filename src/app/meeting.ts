export interface Meeting {
  idMeeting: number,
  matter: string,
  idsMerchant: number[],
  idsClient: number[],
  dateTime: string
}
