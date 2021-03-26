export interface NewMeetingBody {
  matter: string,
  date: string,
  description: string,
  merchants: number[],
  clients: number[],
  keywords: string[],
}
