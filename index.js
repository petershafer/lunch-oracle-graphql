'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const { 
    GraphQLSchema, 
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean, 
    GraphQLList,
} = require ('graphql');

const PORT = process.env.port || 3000;
const server = express();

const options = require('./data/options.json');
const choices = require('./data/choices.json');


const optionType = new GraphQLObjectType({
    name: 'Option',
    description: 'An option describing a feature of a choice for lunch.',
    fields: {
        name: {
            type: GraphQLString
        },
    }
});
const choiceType = new GraphQLObjectType({
    name: 'Choice',
    description: 'A choice for lunch.',
    fields: {
        title: {
            type: GraphQLString
        },
        features: {
            type: new GraphQLList(GraphQLString)
        },
    }
});
const optionsType = new GraphQLList(optionType);
const choicesType = new GraphQLList(choiceType);

const queryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'The root query type.',
    fields: {
        options: {
            type: optionsType,
            resolve: () => new Promise((resolve) => {
                resolve(options);
            }),
        },
        choices: {
            type: choicesType,
            args: {
                feature: {
                    type: GraphQLString,
                    description: 'A feature to limit returned choices to.'
                },
                features: {
                    type: new GraphQLList(GraphQLString),
                    description: 'A list of features to limit returned choices to.'
                },
                mode: {
                    type: GraphQLString,
                    description: 'Describes how to filter choices based on specified features. Values include `any`, `all`, and `none`.'
                },
            },
            resolve: (_, args) => new Promise((resolve) => {
                let filterMode = args.mode || 'all';
                if(args.feature){
                    resolve(choices.filter((choice) => {
                        return choice.features.includes(args.feature);
                    }));
                }else if(args.features){
                    resolve(choices.filter((choice) => {
                        let intersection = args.features.filter(feature => choice.features.includes(feature));
                        if(filterMode == 'any'){
                            return intersection.length > 0;
                        }else if(filterMode == 'none'){
                            return intersection.length == 0;
                        }else{
                            return args.features.length == intersection.length;
                        }
                    }));
                }else{
                    resolve(choices);
                }
            }),
        },
    }
});

const schema = new GraphQLSchema({
    query: queryType,
    // mutation,
    // subscription
});

server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
