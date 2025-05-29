export class UpdateApplicationDto {
  status?: string;
  skills?: string[];
  timeline?: { date: string; status: string }[];
}
