import { TableContent } from "@/components/organisms/TableContent";
import { testimonialApi } from "@/api";
import { HeaderCMSPage } from "../molecules/HeaderCMSPage.jsx";
import { useState, useEffect } from "react";
import { Button } from "../ui/button.js";
import { Plus } from "../icons/Plus.jsx";
import { ModalContainer } from "../organisms/ModalContainer.jsx";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { getCookieValueJSX } from "@/lib/auth.js";
import { toast } from "sonner";
import { TestimonialForm } from "../organisms/TestimonialForm.jsx";

export const TestimonialsTemplateCMS = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [testimonialEdit, setTestimonialEdit] = useState(null);

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    const response = await testimonialApi.deleteTestimonial(
      id,
      getCookieValueJSX("token")
    );
    if (response.status === 200) {
      toast.success("Testimonio eliminado correctamente");
      loadData();
    } else {
      toast.error("Error al eliminar el testimonio");
    }
  };

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
    <div className="space-y-6">
      <HeaderCMSPage
        title="Testimonials"
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
