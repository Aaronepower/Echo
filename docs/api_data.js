define({ "api": [
  {
    "type": "get",
    "url": "/api/users/",
    "title": "Request the users' friend's.",
    "name": "GetUsersFriends",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Token",
            "description": "<p>Access key.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "List",
            "description": "<p>of friends.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n  \"_id\": \"54c9050cbd7420e0074fb90c\",\n  \"avatar\": \"smileyface.jpeg\",\n  \"username\": \"\",\n  \"email\": \"johndoe@email.net\"\n  },\n  {\n  \"_id\": \"54e35727a8d330d81d001ab8\",\n  \"avatar\": \"\",\n  \"username\": \"Jane Doe\",\n  },\n  {\n  \"_id\": \"54e479e31ac5c5702aa797d2\",\n  \"avatar\": \"\",\n  \"username\": \"\",\n  \"email\": \"johnsmith@test.com\"\n  }\n]",
          "type": "json[]"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403",
            "description": "<p>No Token was placed into the request</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404",
            "description": "<p>No User was Found with that token</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "404 Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        },
        {
          "title": "403 Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        }
      ]
    }
  }
] });