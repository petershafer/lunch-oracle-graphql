'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const { graphql, buildSchema } = require ('graphql');

const PORT = process.env.port || 3000;
const server = express();

const options = require('./data/options.json');
const choices = require('./data/choices.json');

// DEFINE SOME RELATIONSHIPS IN THE DATA
/*
    NOTES
    I think `Schema` is always required.  It's
    the default thing that GraphQL is going to look
    at for data relationships.
    Queries, in their most basic sense, are trees.
    Select a node, then select which child nodes to
    follow.  A node is a leaf if it has a resolver.
    Any child fields of a leaf limit the data returned
    off of that resolver.
*/
// TODO: probably need to go back and do this in JS rather than string
// https://egghead.io/lessons/javascript-write-a-graphql-schema-in-javascript
const schema = buildSchema(`
    type Query {
        option: Option,
        options: [Option],
        choice: Choice,
        choices: [Choice],
    }
    type Option {
        name: String
    }
    type Choice {
        title: String,
        features: [String]
    }
    type Schema {
        query: Query
    }
`);

// TELL US HOW YOU'LL FETCH DATA
/*
    NOTES
    These are the leaves!
*/
const resolvers = {
    option: () => ({
        name: 'Sit Down'
    }),
    options: () => (options),
    choice: () => ({
        title: 'Renners',
        features: 'Sit Down'
    }),
    choices: () => (choices),
};

// const query = `
//     query myFirstQuery {
//         choices {
//             title
//         } 
//     }
// `;

// graphql(schema, query, resolvers)
//     .then((result) => console.log(result))
//     .catch((error) => console.log(error));

server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
    rootValue: resolvers
}));

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});