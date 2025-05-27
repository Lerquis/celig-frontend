import { podcastApi } from "@/api";
import { CardTemplate } from "../organisms/CardTemplate";
import { useEffect, useState } from "react";
import { AddPodcastForm } from "../organisms/AddPodcastForm";
import { PodcastItem } from "../molecules/PodcastItem";
import { toast } from "sonner";

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
        <AddPodcastForm fetchData={loadData} />
      </CardTemplate>

      <CardTemplate title="Lista de podcasts">
        {data.length === 0 ? (
          <p className="font-semibold">No existen podcast aun!</p>
        ) : (
          <div className="grid grid-cols-1  lg:grid-cols-2 gap-4">
            {data.map((podcast) => (
              <PodcastItem
                key={podcast.id}
                podcast={podcast}
                fetchData={loadData}
              />
            ))}
          </div>
        )}
      </CardTemplate>
    </div>
  );
};
