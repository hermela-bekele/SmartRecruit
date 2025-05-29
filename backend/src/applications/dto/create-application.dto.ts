export class CreateApplicationDto {
  name: string;
  email: string;
  position: string;
  company: string;
  coverLetter?: string;
  phone?: string;

  skills?: string[];
  timeline?: { date: string; status: string }[];
}
