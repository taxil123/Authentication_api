Post json format->

{
        "title": "test",
        "body": "test",
        "active": true,
        "location": {
            "type": "Point",
            "coordinates": [
                -122.4194,
                37.7749
            ]
        }
}

User login register format :
{
    "name": "test",
    "username": "test",
    "password": "test"
}


User registration -> api: localhost:3001/register
User login -> api: localhost:3001/login



Task 3: Create the CRUD of Post for the only authenticated user.
localhost:3001/posts/create
localhost:3001/posts/:id - put
localhost:3001/posts/:id - get
localhost:3001/posts/:id - delete


Task 4:
- Create an API to retrieve posts using latitude and longitude.
localhost:3001/posts/location_coords

Task 5:
- Show the count of active and inactive post in the dashboard.
localhost:3001/showCount


- for starting server install -> npm install
- for starting server run -> npm start