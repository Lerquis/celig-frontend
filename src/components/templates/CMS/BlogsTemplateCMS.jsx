import { Plus } from "@/components/icons/Plus";
import { TableContent } from "@/components/organisms/CMS/TableContent";
import { HeaderCMSPage } from "../../molecules/CMS/HeaderCMSPage";
import { Button } from "../../ui/button";
import { useState, useEffect } from "react";
import { blogApi } from "@/api";
import { ModalContainer } from "../../organisms/CMS/ModalContainer";
import { DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { BlogForm } from "../../organisms/CMS/BlogForm";
import { getCookieValueJSX } from "@/lib/auth";
import { toast } from "sonner";

export const BlogsTemplateCMS = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [blogEdit, setBlogEdit] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleDelete = async (idOrIds) => {
    toast("Eliminando blog(s)");
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];

    try {
      const token = getCookieValueJSX("token");

      const responses = await Promise.all(
        ids.map((id) => blogApi.deleteBlog(id, token))
      );

      const allSuccessful = responses.every((res) => res.status === 200);

      if (allSuccessful) {
        toast.success("Blog(s) eliminado(s) correctamente");
      } else {
        toast.error("Ocurrió un error al eliminar uno o más blogs");
      }

      loadData();
    } catch (error) {
      console.error("Error al eliminar blogs:", error);
      toast.error("Error al eliminar los blogs");
    }
  };

  const loadData = async () => {
    setLoading(true);
    const blogs = await blogApi.getBlogsByTag();
    if (blogs.status === 200) setData(blogs.body.blogs);
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
      <HeaderCMSPage title="Blogs" subtitle="Gestiona tus artículos de blog">
        <Button
          onClick={() => {
            setModalOpen(true);
            setBlogEdit(null);
          }}
        >
          <Plus />
          Nuevo blog
        </Button>
      </HeaderCMSPage>

      <TableContent
        placeholder={"Filtrar por titulo"}
        inputValue="title"
        data={data}
        columnName={"blog"}
        onEdit={(blog) => {
          setBlogEdit(blog);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
        loading={loading}
      />
      <ModalContainer isOpen={modalOpen} handleClose={handleClose}>
        <>
          <DialogHeader>
            <DialogTitle>{blogEdit ? "Editar blog" : "Nuevo blog"}</DialogTitle>
            <DialogDescription>
              {blogEdit
                ? "Actualiza la información de tu blog"
                : "Crea un nuevo artículo para tu blog"}
            </DialogDescription>
          </DialogHeader>
          <BlogForm
            handleClose={handleClose}
            blogEdit={blogEdit}
            loadData={loadData}
          />
        </>
      </ModalContainer>
    </div>
  );
};
