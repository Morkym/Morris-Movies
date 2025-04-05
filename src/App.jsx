import React from 'react'
import Search from './components/Search'
import { useState,useEffect } from 'react'
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }

}



const App = () => {
const [searchTerm, setSearchTerm] =useState('');
const [errorMessage, setErrorMessage] = useState('');
const [moviesList, setMoviesList] = useState([]);
const [loading, setLoading] = useState(false);
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
const [trendingMovies, setTrendingMovies] = useState([]);
//debouncing the search term to avoid too many API calls)
useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

//function to search movies
const fetchMovies = async (query='') => {
  //set loading and error message before fetching
  setLoading(true);
  setErrorMessage('');

  //fetching movies from the API
  try {
    const endpoint = query
    ?`${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}}`
    :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
    const response = await fetch(endpoint, API_OPTIONS);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);
    if(data.response === 'false'){
      setErrorMessage('No movies found');
      setMoviesList([]);
      return;
    }
    setMoviesList(data.results || ['No movies found']);

    if(query && data.results.length > 0) {
      //update the search count in appwrite
      await updateSearchCount(query, data.results[0]);
    }

  } catch (error) {
    setErrorMessage('Error fetching movies,try again later');
//closing the loading after fetching
  }finally {
    setLoading(false);
  }
}
const loadTrendingMovies = async () => {
  try {
    const movies = await getTrendingMovies();
    setTrendingMovies(movies);
    
  } catch (error) {
    console.error('Error fetching trending movies:', error);

    
  }
}

useEffect(() => {
  fetchMovies(debouncedSearchTerm)
  
  }, [debouncedSearchTerm]);
useEffect(() => {
  loadTrendingMovies();
}, []);
  return (
    <main>
      <div className='wrapper'>
        <header className='flex flex-col '>
          <h2 className='pt-0 margin-0-auto  text-gradient text-xs' >@Morris Macharia Movies</h2>
          <img src="./hero3-img.svg" alt="hero Banner" className='rounded-md width-100%' />
          <h1>Awesome Movies <span className='text-gradient'>Zero Effort</span></h1>
          
         <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
        
        
        
        <section className='all-movies'>
          <h2>All Movies</h2>
          {loading?(
            <p className='text-white'>Loading...</p>
          ):(errorMessage?(
            <p className='text-red-600'>{errorMessage}</p>
          
          ):(
            <ul>
              {moviesList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}

            </ul>
          ))}
        </section>
      </div>
    </main>
  );
  
}

export default App