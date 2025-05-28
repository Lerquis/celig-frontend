import { podcastApi } from "@/api";
import { CardTemplate } from "../../organisms/CMS/CardTemplate";
import { useEffect, useState } from "react";
import { AddPodcastForm } from "../../organisms/CMS/AddPodcastForm";
import { PodcastItem } from "../../molecules/CMS/PodcastItem";
import { toast } from "sonner";
import { Loader } from "../../icons/Loader";

export const PodcastsTemplateCMS = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const podcasts = await podcastApi.getPodcasts();

    if (podcasts.status === 200) setData(podcasts.body.podcasts);
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
      <CardTemplate title="Añadir nuevo podcast">
        <AddPodcastForm fetchData={loadData} />
      </CardTemplate>

      <CardTemplate title="Lista de podcasts">
        {loading ? (
          <div className="min-h-[100px] flex items-center">
            <Loader customClass="!text-black mx-auto" />
          </div>
        ) : data.length === 0 ? (
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
