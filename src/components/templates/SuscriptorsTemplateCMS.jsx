import { suscriptorApi } from "@/api";
import { getCookieValueJSX } from "@/lib/auth";
import { CardTemplate } from "../organisms/CardTemplate";
import { AddSuscriptorForm } from "../organisms/AddSuscriptorForm";
import { TableContent } from "../organisms/TableContent";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const SuscriptorsTemplateCMS = () => {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const suscriptors = await suscriptorApi.getSuscriptors(
      getCookieValueJSX("token")
    );

    if (suscriptors.status === 200) setData(suscriptors.body.suscriptors);
    else {
      toast.error("Algo salio mal obteniendo los datos");
      setData([]);
    }
  };

  const handleDelete = async (idOrIds) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];

    try {
      const token = getCookieValueJSX("token");

      const responses = await Promise.all(
        ids.map((id) => suscriptorApi.deleteSuscriptor(token, id))
      );

      const allSuccessful = responses.every((res) => res.status === 200);

      if (allSuccessful) {
        toast.success("Suscriptor(es) eliminado(s) correctamente");
      } else {
        toast.error("Ocurrió un error al eliminar uno o más suscriptores");
      }

      loadData();
    } catch (error) {
      console.error("Error al eliminar suscriptores:", error);
      toast.error("Error al eliminar los suscriptores");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <CardTemplate title="Añadir nuevo suscriptor">
        <AddSuscriptorForm fetchData={loadData} />
      </CardTemplate>

      <CardTemplate title="Lista de suscriptores">
        <TableContent
          placeholder="Filtrar por emails"
          inputValue="email"
          data={data}
          columnName="suscriptors"
          onDelete={handleDelete}
        />
      </CardTemplate>
    </div>
  );
};
