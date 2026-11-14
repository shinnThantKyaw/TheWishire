/**
 * Built-in background-music catalog for the experience step.
 * To add a track: drop the mp3 into public/music/ and add one entry here.
 */
export interface MusicTrack {
  /** Stable identifier (unique within the catalog). */
  id: string;
  /** Display name shown in the picker. */
  title: string;
  /** Public path the recipient's player loads. */
  src: string;
}

export const MUSIC_TRACKS: MusicTrack[] = [
  { id: "birthday-song", title: "Birthday Song", src: "/music/birthday-song.mp3" },
  { id: "birthday-song-2", title: "Birthday Song 2", src: "/music/birthday-song-2.mp3" },
];
