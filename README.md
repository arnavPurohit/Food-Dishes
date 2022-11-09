Steps to Run -

1) Clone the reporsitory into local
2) run "npm i" 
3) database should be made in postgres with details as
    "username": "postgres",
    "password": "12345",
    "database": "demo",
    "host": "127.0.0.1",
    "dialect": "postgres"
    or change accordingly in config.js 
 Note: for addind data run script first then script2 (node script.js/script2.js)
4) start the server with "npm start" 
5) go to http://localhost:4000
6) routes are defined in routes.js in routes folder
7) for listing if we need to filter by name/ids of ingredients either of the keys should be used in payload (ingredientIds/ingredients) eg: (ingredientIds: [1, 2]/ ingredients: ['Maida flour']);
8) for creating a new dish the payload should be following 
    {
  "name": "'Balu shahi'",
  "ingredients": "[ 'Maida flour', ' yogurt', ' oil', ' sugar' ]",
  "diet": "'vegetarian'",
  "preprationTime": 45,
  "cookingTime": 25,
  "flavourProfile": "'sweet'",
  "courseType": "'dessert'",
  "state": "'West Bengal'",
  "region": "'East'",
  "dishItems": [
    { "serialNo": 1, "ingredientId": 1 },
    { "serialNo": 2, "ingredientId": 2 },
    { "serialNo": 3, "ingredientId": 3 },
    { "serialNo": 4, "ingredientId": 4 }
  ]
}

