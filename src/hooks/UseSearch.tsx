import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { AlbumObject, TrackObject } from "spotify-api-types";
import { auth } from "../firebase";

export type MappedTrack = {
  uid: string;
  name: string;
  album: string;
  artist: string;
  cover: string;
  preview: string | undefined;
  spotify_url: string;
};
export type MappedAlbum = {
  uid: string;
  name: string;
  album: string;
  artist: string;
  cover: string;
  spotify_url: string;
  preview?: string;
};

export const mapTracks = (data: TrackObject[]): MappedTrack[] => {
  return data.map((track: TrackObject) => {
    return {
      uid: track.id,
      name: track.name,
      album: track.album.name,
      artist: track.artists[0].name,
      cover: track.album.images[1].url ?? track.album.images[0].url,
      preview: track.preview_url,
      spotify_url: track.external_urls.spotify,
    };
  });
};
export const mapAlbums = (data: AlbumObject[]): MappedAlbum[] => {
  return data.map((album: AlbumObject) => {
    return {
      uid: album.id,
      name: album.name,
      album: album.name,
      artist: album.artists[0].name,
      cover: album.images[1].url ?? album.images[0].url,
      spotify_url: album.external_urls.spotify,
    };
  });
};

function useSearch() {
  const [search, setSearch] = useState<string>("");
  const [isTrack, setIsTrack] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<(MappedTrack | MappedAlbum)[]>([]);
  //////////////////////////////////////////
  const searchFn = async () => {
    const searchParam = encodeURIComponent(search);
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch(
      `${import.meta.env.VITE_SERVER}/spotify/search/${searchParam}/${isTrack ? "track" : "album"}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    return data;
  };
  const searchMutation = useMutation(searchFn, {
    onSuccess: async (data) => {
      let resultsArray = [];

      if (isTrack) {
        resultsArray = mapTracks(data);
      } else {
        resultsArray = mapAlbums(data);
      }
      setSearchResults(resultsArray);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const { isLoading } = searchMutation;
  //////////////////////////////////////////
  useEffect(() => {
    if (search) {
      searchMutation.mutate();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, isTrack]);

  return { search, setSearch, searchResults, setIsTrack, isTrack, isLoading };
}

export default useSearch;
