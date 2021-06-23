## To install mongod server locally:
# brew tap mongodb/brew
# brew install mongodb-community@4.4

## To start the mongod server after installation:
# brew services start mongodb-community@4.4
# brew services stop mongodb-community@4.4

## To start Nodejs server run:
# npm run start:server

## To import a JSON file in my mongo compass database:
# mongoimport --db db-name --collection collection-name --drop --file myfile.json --jsonArray

# --jsonArray flag signifies that json file will consist data like: [{...}, {...}, {...}...] => an array of objects.