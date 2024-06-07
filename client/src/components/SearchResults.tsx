import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// define interfaces for Artist, Album, and SearchResultsData
interface Artist {
  image: any;
  name: string;
  url: string;
};

interface Album {
  id: number;
  image: any;
  name: string;
  artist: string;
  url: string;
};

interface SearchResultsData {
  artists: Artist[];
  albums: Album[];
};

const SearchResults = () => {
  // get query from the url using useParams
  const { query } = useParams();
  // useState used to declare searchResults and setSearchResults
  // searchResults initialized to object w artists and albums as keys and empty arrays as values
  const [searchResults, setSearchResults] = useState<SearchResultsData>({ artists: [], albums: [] });

  const saveAlbum  = (album: any) => {
    // console.log(album.artist)
    axios.post('/api/music/album', {
      albumName: album.name,
      artistName: album.artist,
    })
      .then(data => console.log('button: ', data))
      .catch(err => console.error(err));
  };

  const saveArtist = (artist: any) => {
    console.log(artist);
    axios.post('/api/music/artist', {
      artistName: artist.name
    })
      .then(data => console.log(data))
      .catch(err => console.error(err));
  };

  const saveAlbumOfTheDay = (album: any) => {
    console.log('album:', album);

    const { name: albumName, artist: artistName} = album;

    axios.post('/api/album-id', {
      albumName, artistName
    })
    .then((response) => {
      const albumId = response.data.albumId;
      console.log('got albumId:', albumId);

      axios.post('/api/album-of-the-day', { albumId })
        .then(data => console.log(data))
        .catch(err => console.error('Error setting album of the day', err));
    })
    .catch(err => console.error('Error getting albumId', err));
  };

  useEffect(() => {
    // get data from /api/search/${query}
    fetch(`/api/search/${query}`)
      // convert response to data
      .then(response => response.json())
      .then((data) => {
        // console.log('fetched data:', data);
        // update searchResults with the fetched data using setSearchResults
        setSearchResults({
          artists: data.artists.artist,
          albums: data.albums.album
        });
      })
      .catch(error => console.error('Error fetching search results:', error));
  }, [query]);

  console.log('searchResults:', searchResults);

  return (
    <div>
      <h1>Search Results for {query}</h1>
      <h2>Albums</h2>
        <ul>
          {/* map over searchResults.albums to make a list item of each album */}
          {searchResults.albums.map((album: Album) => (
            <li key={album.name}>
                <a href={album.url}>
                  {album.image[1] && <img src={album.image[1]['#text']} />}
                  {album.name}
              </a>
              <button onClick={() => saveAlbum(album)}>Save Album</button>
              <button onClick={() => saveAlbumOfTheDay(album)}>Set as Album of the Day</button>
            </li>
          ))}
        </ul>
      <h2>Artists</h2>
        <ul>
          {/* map over searchResults.artists to make a list item of each artist */}
          {searchResults.artists.map((artist: Artist) => (
            <li key={artist.name}>
              <a href={artist.url}>
                {artist.name}
              </a>
              <button onClick={() => saveArtist(artist) }>Save Artist</button>
            </li>
          ))}
        </ul>
    </div>
  );
}

export default SearchResults;
