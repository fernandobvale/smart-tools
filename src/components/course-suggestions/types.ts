
export interface CourseSuggestion {
  id: string;
  created_at: string;
  updated_at: string;
  suggestion_date: string;
  suggested_course: string;
  school: string;
  attendant: string;
  observations: string | null;
  internet_searches: string;
  course_created: boolean;
}

export interface CourseSuggestionFormData {
  suggestion_date: string;
  suggested_course: string;
  school: string;
  attendant: string;
  observations?: string;
  internet_searches: string;
  course_created: boolean;
}
