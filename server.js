import express from 'express'; 
import webpackMiddleware from 'webpack-dev-middleware';
import webpack from 'webpack';
import dotenv from 'dotenv';
import webpackConfig from './webpack.config.js';
import expressGraphQL from 'express-graphql';
import schema from './schema/schema'; // our schema file
dotenv.config()
const app = express();
app.use(webpackMiddleware(webpack(webpackConfig)));

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}))

app.listen(4000, () => {
  console.log('Listening');
});
