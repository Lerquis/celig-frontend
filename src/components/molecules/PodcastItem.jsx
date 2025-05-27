import { Trash } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useState } from "react";
import { podcastApi } from "@/api";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Loader } from "../icons/Loader";
import { getCookieValueJSX } from "@/lib/auth";

export const PodcastItem = ({ podcast, fetchData }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    toast("Eliminando podcast");
    setLoading(true);
    const response = await podcastApi.deletePodcast(
      id,
      getCookieValueJSX("token")
    );

    if (response.status === 200) {
      toast.success("Podcast eliminado correctamente");
      fetchData();
    } else {
      toast.error("Algo salio mal eliminando el podcast");
    }
    setLoading(false);
  };
  return (
    <Card>
      <CardContent>
        <div className="flex gap-4">
          <iframe
            className="rounded-[12px]"
            src={podcast.url}
            width="100%"
            height="152"
            allowFullScreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
          <Button
            variant="destructive"
            onClick={() => handleDelete(podcast.id)}
          >
            {loading ? <Loader /> : <Trash />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
