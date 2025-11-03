export interface GeneratedPrompt {
  id: number;
  prompt_pt: string;
  prompt_en: string;
}

export interface GeneratedPromptsResponse {
  prompts: GeneratedPrompt[];
}

export interface GeneratedImage {
  image: string;
  size: number;
  format: string;
  dimensions: string;
}

export interface CourseImage {
  id: string;
  course_name: string;
  prompt_pt: string;
  prompt_en: string;
  image_data: string;
  image_size: number;
  created_at: string;
}
