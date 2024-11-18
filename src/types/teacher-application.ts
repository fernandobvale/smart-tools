export interface TeacherApplicationForm {
  full_name: string;
  email: string;
  whatsapp: string;
  academic_background: string;
  teaching_experience: string;
  video_experience: string;
  motivation: string;
  privacy_accepted: boolean;
}

export interface TeacherApplicationFormProps {
  onSubmit: (data: TeacherApplicationForm) => Promise<void>;
  isSubmitting: boolean;
}