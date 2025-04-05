import { Client, Databases,ID,Query } from 'appwrite';

const DATABASE_ID=import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECT_ID=import.meta.env.VITE_APPWRITE_PROJECT_ID;
const COLLECTION_ID=import.meta.env.VITE_APPWRITE_COLLECTION_ID;

//get access tp appwrite by defining new clieny
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject(PROJECT_ID);
//what we want to access in he client
const database = new Databases(client);

export const updateSearchCount = async (searchTerm,movie) => {
//use appwrite api to check if the search term already exists in the database
try {
    const result = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal('searchTerm', searchTerm)]
    );

    if(result.documents.length > 0) {
        // If the search term exists, update the count
        const doc = result.documents[0];;
        await database.updateDocument(
            DATABASE_ID,
            COLLECTION_ID,
            doc.$id,
            {
                count: doc.count + 1,
            }
        );
    }else {
        // If the search term does not exist, create a new document
        await database.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            {
                searchTerm: searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `htps://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            }
        );
    }
} catch (error) {
    console.error('Error checking search term:', error);
    return;
}
}
export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.limit(5),
            Query.orderDesc('count'),
            ],
            
        );
        return result.documents;
    } catch (error) {
        console.error('Error fetching trending movies:', error);
    }
}