export interface PlayerEpisode {
  guid: string;
  title: string;
  podcastName: string;
  audioUrl: string;
}

// useState gives us SSR-safe shared state across all components
export const usePodcastPlayer = () => {
  const currentEpisode = useState<PlayerEpisode | null>("player:episode", () => null);

  const play = (episode: PlayerEpisode) => {
    currentEpisode.value = episode;
  };

  const close = () => {
    currentEpisode.value = null;
  };

  return { currentEpisode, play, close };
};
