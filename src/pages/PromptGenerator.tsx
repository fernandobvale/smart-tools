import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PromptForm } from "@/components/prompt-generator/PromptForm";
import { FormData } from "@/components/prompt-generator/types";

export default function PromptGenerator() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  if (isLoading) {
    return <div className="container py-8">Carregando...</div>;
  }

  const initialData: Partial<FormData> = prompt ? {
    courseName: prompt.course_name,
    courseContent: prompt.course_content,
    workload: prompt.workload,
    courseArea: prompt.course_area,
    areaLink: prompt.area_link,
    course1: prompt.course_1,
    course1Link: prompt.course_1_link,
    course2: prompt.course_2,
    course2Link: prompt.course_2_link,
  } : {};

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-8">
        {id ? "Editar Prompt" : "Gerar Novo Prompt"}
      </h1>
      <PromptForm initialData={initialData} promptId={id} />
    </div>
  );
}