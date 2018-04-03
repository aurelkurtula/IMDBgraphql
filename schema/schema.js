import axios from 'axios';
import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} from 'graphql';

const NewMoviesType = new GraphQLObjectType({
    name: 'NewMovies',
    fields:{
        id: {type: GraphQLInt},
        poster_path: {type: GraphQLString},
        title: {type: GraphQLString},

    }
})
const VideoType = new GraphQLObjectType({
    name: 'Video',
    fields:{
        id: {type: GraphQLString},
        key: {type: GraphQLString}

    }
})
const MovieCreditsType = new GraphQLObjectType({
    name: 'MovieCredits',
    fields:{
        id: {type: GraphQLString},
        character: {type: GraphQLString},
        name: {type: GraphQLString},
        profile_path: {type: GraphQLString},
        order: {type: GraphQLString}
    }
})

const MovieReviewsType = new GraphQLObjectType({
    name: 'MovieReviews',
    fields:{
        id: {type: GraphQLString},
        content: {type: GraphQLString},
        author: {type: GraphQLString},
    }
})
const MovieInfoType = new GraphQLObjectType({
    name: 'MovieInfo',
    fields: {
        id: {type: GraphQLString},
        overview: {type: GraphQLString},
        title: {type: GraphQLString},
        poster_path: {type: GraphQLString},
        genres: {type: GraphQLString},
         release_date: {type: GraphQLString},
         vote_average: {type: GraphQLString},
         production_companies: {type: GraphQLString},
         vote_average: {type: GraphQLString},
         runtime: {type: GraphQLString},
         videos: {
             type: new GraphQLList(VideoType),
             args: {id: { type: GraphQLString } },
             resolve(parentValue, args) {
                return axios.get(`https://api.themoviedb.org/3/movie/${parentValue.id}/videos?api_key=${process.env.API}&language=en-US`)
                .then(res => res.data.results)
             }
         },
         movieReviews: {
            type: new GraphQLList(MovieReviewsType),
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {
              return axios.get(`https://api.themoviedb.org/3/movie/${parentValue.id}/reviews?api_key=${process.env.API}&language=en-US&page=1`)
              .then(res =>  res.data.results)
            }
          },
          movieCredits: {
            type: new GraphQLList(MovieCreditsType),
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {
              return axios.get(`https://api.themoviedb.org/3/movie/${parentValue.id}/credits?api_key=${process.env.API}&language=en-US&page=1`)
              .then(res =>  res.data.cast.filter(cast => cast.profile_path ) )
            }
          }
    }
})
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        videos: {
            type: new GraphQLList(VideoType),
            args: {id: { type: GraphQLString } },
            resolve(parentValue, args) {
               return axios.get(`https://api.themoviedb.org/3/movie/${args.id}/videos?api_key=${process.env.API}&language=en-US`)
               .then(res => res.data.results)
            }
        },
        newMovies: {
            type: new GraphQLList(NewMoviesType),
            resolve() {
              return axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.API}&language=en-US&page=1`)
              .then(res => {
                  const movies = res.data.results;
                  movies.map(movie=> movie.poster_path = "https://image.tmdb.org/t/p/w500"+movie.poster_path
                 )
                  return movies
              })
            }
          } ,
          movieInfo: {
            type: MovieInfoType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {
              return axios.get(`https://api.themoviedb.org/3/movie/${args.id}?api_key=${process.env.API}&language=en-US&page=1`)
              .then(res => {
                  const movie = res.data;
                  movie.genres = movie.genres.map(g => g.name).join(', ')
                  movie.production_companies = movie.production_companies.map(g => g.name).join(', ')
                  movie.runtime+= ' min.'
                  return movie
              })
            }
          }         
    }
})
export default new GraphQLSchema({
    query: RootQuery
})