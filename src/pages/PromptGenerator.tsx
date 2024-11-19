import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PromptForm } from "@/components/prompt-generator/PromptForm";
import { FormData } from "@/components/prompt-generator/types";

export default function PromptGenerator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    courseName: "",
    courseContent: "",
    workload: "",
    courseArea: "",
    areaLink: "",
    course1: "",
    course1Link: "",
    course2: "",
    course2Link: "",
  });

  const { data: prompt, isLoading } = useQuery({
    queryKey: ["prompt", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) {
        navigate("/prompt-list");
        return null;
      }
      
      return data;
    },
    enabled: !!id,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (prompt) {
      setFormData({
        courseName: prompt.course_name || "",
        courseContent: prompt.course_content || "",
        workload: prompt.workload || "",
        courseArea: prompt.course_area || "",
        areaLink: prompt.area_link || "",
        course1: prompt.course_1 || "",
        course1Link: prompt.course_1_link || "",
        course2: prompt.course_2 || "",
        course2Link: prompt.course_2_link || "",
      });
    }
  }, [prompt]);

  if (isLoading) {
    return <div className="container py-8">Carregando...</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-8">
        {id ? "Editar Prompt" : "Gerar Novo Prompt"}
      </h1>
      <PromptForm 
        formData={formData}
        onChange={handleChange}
      />
    </div>
  );
}