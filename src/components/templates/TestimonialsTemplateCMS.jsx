import { TableContent } from "@/components/organisms/TableContent";
import { testimonialApi } from "@/api";
import { HeaderCMSPage } from "../molecules/HeaderCMSPage.jsx";
import { useState, useEffect } from "react";
import { Button } from "../ui/button.js";
import { Plus } from "../icons/Plus.jsx";

export const TestimonialsTemplateCMS = () => {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const testimonials = await testimonialApi.getTestimonials();
    if (testimonials.status === 200) setData(testimonials.body.testimonials);
    else {
      toast.error("Algo salio mal obteniendo los datos");
      setData([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div class="space-y-6">
      <HeaderCMSPage
        title="Testimonials"
        subtitle="Gestiona los testimonios de tus clientes"
      >
        <Button>
          <Plus />
          Nuevo testimonio
        </Button>
      </HeaderCMSPage>

      <TableContent
        placeholder="Filtrar por nombres"
        inputValue="names"
        data={data}
        columnName={"testimonials"}
      />
    </div>
  );
};
