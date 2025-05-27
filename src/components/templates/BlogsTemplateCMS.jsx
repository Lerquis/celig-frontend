import { Plus } from "@/components/icons/Plus";
import { TableContent } from "@/components/organisms/TableContent";
import { HeaderCMSPage } from "../molecules/HeaderCMSPage";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { blogApi } from "@/api";
import { ModalContainer } from "../organisms/ModalContainer";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { BlogForm } from "../organisms/BlogForm";
import { getCookieValueJSX } from "@/lib/auth";
import { toast } from "sonner";

export const BlogsTemplateCMS = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [blogEdit, setBlogEdit] = useState(null);
  const [data, setData] = useState([]);

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    const response = await blogApi.deleteBlog(id, getCookieValueJSX("token"));
    if (response.status === 200) {
      toast.success("Blog eliminado correctamente");
      loadData();
    } else {
      toast.error("Error al eliminar el blog");
    }
  };

  const loadData = async () => {
    const blogs = await blogApi.getBlogsByTag();
    if (blogs.status === 200) setData(blogs.body.blogs);
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
