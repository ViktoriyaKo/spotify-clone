interface IAlbum {
    album_type: string,
    total_tracks: number,
    available_markets: Array<string>,
    external_urls: {
      spotify: string
    },
    href: string,
    id: string,
    images: Array<IImage>,
    name: string,
    release_date: string,
    release_date_precision: string,
    restrictions: {
      reason: string
    },
    type: string,
    uri: string,
    copyrights: Array<ICopyrights>,
    external_ids: {
      isrc: string,
      ean: string,
      upc: string
    },
    genres: Array<string>,
    label: string,
    popularity: number,
    album_group: string,
    artists: [IArtist]
}

interface IArtist {
    external_urls: {
        spotify: string
      },
      followers: {
        href: string,
        total: number
      },
      genres: [string],
      href: string,
      id: string,
      images: [IImage],
      name: string,
      popularity: number,
      type: string,
      uri: string
}

interface ITrack {
    album: IAlbum,
      artists: [IArtist],
      available_markets: [string],
      disc_number: 0,
      duration_ms: 0,
      explicit: true,
      external_ids: {
        isrc: string,
        ean: string,
        upc: string
      },
      external_urls: {
        spotify: string
      },
      href: string,
      id: string,
      is_playable: true,
      linked_from: {},
      restrictions: {
        reason: string
      },
      name: string,
      popularity: 0,
      preview_url: string,
      track_number: 0,
      type: string,
      uri: string,
      is_local: true
}

interface IPlaylistTrack {
    added_at: string,
    added_by: {
        external_urls: {
            spotify: string
        },
        followers: {
            href: string,
            total: number
        },
        href: string,
        id: string,
        type: string,
        uri: string
    },
    is_local: true,
    track: ITrack 
}


interface IImage {
    url: string
    height: number,
    width: number
}

interface ICopyrights {
    text: string,
    type: string,
}

export {
    ITrack,
    IPlaylistTrack,
    IAlbum, 
    IArtist,
    ICopyrights,
    IImage,
}