import { podcastApi } from "@/api";
import { CardTemplate } from "../organisms/CardTemplate";
import { AddSuscriptorForm } from "../organisms/AddSuscriptorForm";
import { useEffect, useState } from "react";

export const PodcastsTemplateCMS = () => {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const podcasts = await podcastApi.getPodcasts();

    if (podcasts.status === 200) setData(podcasts.body.podcasts);
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
      <CardTemplate title="Añadir nuevo podcast">
        <AddSuscriptorForm />
      </CardTemplate>

      <CardTemplate title="Lista de podcasts">
        <p>Trabajar con lo de spotify - Podcasts = {data.length}</p>
      </CardTemplate>
    </div>
  );
};
