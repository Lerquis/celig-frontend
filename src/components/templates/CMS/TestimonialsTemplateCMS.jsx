import { TableContent } from "@/components/organisms/CMS/TableContent.jsx";
import { testimonialApi } from "@/api";
import { HeaderCMSPage } from "../../molecules/CMS/HeaderCMSPage.jsx";
import { useState, useEffect } from "react";
import { Button } from "../../ui/button.js";
import { Plus } from "../../icons/Plus.jsx";
import { ModalContainer } from "../../organisms/CMS/ModalContainer.jsx";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { getCookieValueJSX } from "@/lib/auth.js";
import { toast } from "sonner";
import { TestimonialForm } from "../../organisms/CMS/TestimonialForm.jsx";

export const TestimonialsTemplateCMS = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [testimonialEdit, setTestimonialEdit] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleDelete = async (idOrIds) => {
    toast("Eliminando testimonio(s)");
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];

    try {
      const token = getCookieValueJSX("token");

      const responses = await Promise.all(
        ids.map((id) => testimonialApi.deleteTestimonial(id, token))
      );

      const allSuccessful = responses.every((res) => res.status === 200);

      if (allSuccessful) {
        toast.success("Testimonio(s) eliminado(s) correctamente");
      } else {
        toast.error("Ocurrió un error al eliminar uno o más testimonios");
      }

      loadData();
    } catch (error) {
      console.error("Error al eliminar testimonios:", error);
      toast.error("Error al eliminar los testimonios");
    }
  };

  const loadData = async () => {
    setLoading(true);
    const testimonials = await testimonialApi.getTestimonials();
    if (testimonials.status === 200) setData(testimonials.body.testimonials);
    else {
      toast.error("Algo salio mal obteniendo los datos");
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <HeaderCMSPage
        title="Testimonios"
        subtitle="Gestiona los testimonios de tus clientes"
      >
        <Button
          onClick={() => {
            setModalOpen(true);
            setTestimonialEdit(null);
          }}
        >
          <Plus />
          Nuevo testimonio
        </Button>
      </HeaderCMSPage>

      <TableContent
        placeholder="Filtrar por nombres"
        inputValue="names"
        data={data}
        columnName={"testimonials"}
        onEdit={(testimonial) => {
          setTestimonialEdit(testimonial);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
        loading={loading}
      />

      <ModalContainer isOpen={modalOpen} handleClose={handleClose}>
        <>
          <DialogHeader>
            <DialogTitle>
              {testimonialEdit ? "Editar testimonio" : "Nuevo testimonio"}
            </DialogTitle>
            <DialogDescription>
              {testimonialEdit
                ? "Actualiza la información de tu testimonio"
                : "Crea un nuevo testimonio para tu cliente"}
            </DialogDescription>
          </DialogHeader>
          <TestimonialForm
            handleClose={handleClose}
            testimonialEdit={testimonialEdit}
            loadData={loadData}
          />
        </>
      </ModalContainer>
    </div>
  );
};
