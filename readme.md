## Local Setup

To install mongod server locally

```bash
  brew tap mongodb/brew
  brew install mongodb-community@4.4
```
To start the mongod server after installation

```bash
  brew services start mongodb-community@4.4
  brew services stop mongodb-community@4.4
```
To start Node.js server run (nodemon custom command)

```bash
  npm run start:server
```
To import a JSON file in my mongo compass database:

```bash
  mongoimport --db db-name --collection collection-name --drop --file myfile.json --jsonArray
```
Note: --jsonArray flag signifies that json file will consist data like: [{...}, {...}, {...}...] => an array of objects.

 
### Configs of this app: Environment Variables

#### JWT_KEY

```bash
  export movie_renting_JWT_KEY=this_key_should_be_very_anonymous
```

#### NODE_ENV

```bash
  export NODE_ENV=development
``` 

#### DEBUG

```bash
  export DEBUG=app:*
``` 
