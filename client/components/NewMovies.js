import React, { Component} from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { Link } from 'react-router-dom'

class NewMovies extends Component {
    Movies(){
        return this.props.data.newMovies.map(movie => {
            return (
                <article key={movie.id} className="movie_list">
                    <Link to={"/info/"+movie.id}> 
                        <img src={movie.poster_path} />
                    </Link>
                    <h1 >{movie.title}</h1>
                </article>
            );
        })
    }
    render() {
        if(this.props.data.loading) return <div>loading</div>
        return this.Movies()
    }
}


const query = gql`
{
    newMovies {
        id
        poster_path
        title
    }
}
`
export default graphql(query)(NewMovies);