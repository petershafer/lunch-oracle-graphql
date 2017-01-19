# GraphQL Implementation of Lunch Oracle
A learning project using GraphQL to implement my app for figuring out where to go to lunch.

Start with `yarn install` and then `yarn start`

Open your browser to `http://localhost:3000/graphql`

Try out a query like:
```
    query myFirstQuery {
        choices(features: ["Coffee", "Walking Distance"]) {
          title,
          features,
        }
    }
```

The choices type accepts arguments specifying to filter by one feature (as a string), by multiple features (as a list of strings) and you can also specify a mode for filtering to show choices that include `all` specified features, `any` of the specified features, or `none` of the specified features.

The options type provides a list of all possible features that can be used to filter the list of choices.
