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
        />
      </CardTemplate>
    </div>
  );
};
