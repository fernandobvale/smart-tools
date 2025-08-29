
export interface CourseComplaint {
  id: string;
  created_at: string;
  updated_at: string;
  complaint_date: string;
  course: string;
  school: string;
  complaint: string;
  analyst: string | null;
  action_taken: string | null;
  status: string;
  feedback: string | null;
}

export interface CourseComplaintFormData {
  complaint_date: string;
  course: string;
  school: string;
  complaint: string;
  analyst?: string;
  action_taken?: string;
  status: string;
  feedback?: string;
}
