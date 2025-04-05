import React from 'react'

const MovieCard = ({movie: {title, poster_path, release_date,vote_average}}) => {
  return (
    <div className='movie-card'>
      <img src={poster_path ? 
        `https://image.tmdb.org/t/p/w500/${poster_path}` : `/no-movie.png`} 
      alt={title} />
      <div className="mt-4">
        <h3>{title}</h3>
      </div>

     <div className='content'>
        <div className='rating'>
          <img src="star.svg" alt="star" />
          <p>{vote_average? vote_average.toFixed(1):'None'}</p>
        </div>
        
         <p className='year'>
          {release_date? release_date.split('-')[0]:'N/A'}
         </p>
         

     </div>
      
    </div>
  )
}

export default MovieCard