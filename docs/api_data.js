define({ "api": [
  {
    "type": "post",
    "url": "/api/users/",
    "title": "Save a new user.",
    "name": "AddAUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Users&#39; email</p> "
          },
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Users&#39; password</p> "
          },
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "confirm",
            "description": "<p>Users&#39; confirm</p> "
          },
          {
            "group": "Body",
            "type": "String",
            "optional": true,
            "field": "username",
            "description": "<p>Users&#39; username</p> "
          },
          {
            "group": "Body",
            "type": "String",
            "optional": true,
            "field": "avatar",
            "description": "<p>Users&#39; avatar</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Token",
            "description": "<p>Users&#39; token</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n  {\n  \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdmF0YXIiOiIiLCJ1c2VybmFtZSI6IiIsImVtYWlsIjoidGVzdGVyM0B0ZXN0Lm5ldCIsIl9pZCI6IjU0ZWM2OTNmY2Q0Njg5MjgyYTM4YjExOCIsImlhdCI6MTQyNDc3OTU4M30.dbvHElTZ2vPxNX9qBSmWBSBLjKdqwt-3dt5HuTvJmE8\"\n  }",
          "type": "Object"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403",
            "description": "<p>Details are incorrect.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "409",
            "description": "<p>A user with that email already exists.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "403 Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "409 Response:",
          "content": "HTTP/1.1 409 Conflict",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "localhost/api/users/"
      }
    ]
  },
  {
    "type": "delete",
    "url": "/api/users/",
    "title": "Delete a User.",
    "name": "DeleteAUser",
    "group": "User",
    "success": {
      "fields": {
        "Success 204": [
          {
            "group": "Success 204",
            "optional": false,
            "field": "StatusCode",
            "description": "<p>the status code.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 204 No Content",
          "type": "Object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "localhost/api/users/"
      }
    ],
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
  },
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
          "content": "HTTP/1.1 200 OK\n[\n  {\n  \"_id\": \"54c9050cbd7420e0074fb90c\",\n  \"avatar\": \"smileyface.png\",\n  \"username\": \"\",\n  \"email\": \"johndoe@email.net\"\n  },\n  {\n  \"_id\": \"54e35727a8d330d81d001ab8\",\n  \"avatar\": \"\",\n  \"username\": \"Jane Doe\",\n  },\n  {\n  \"_id\": \"54e479e31ac5c5702aa797d2\",\n  \"avatar\": \"\",\n  \"username\": \"\",\n  \"email\": \"johnsmith@test.com\"\n  }\n]",
          "type": "json[]"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "localhost/api/users/"
      }
    ],
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
  },
  {
    "type": "put",
    "url": "/api/users/",
    "title": "Update a Users' information.",
    "name": "UpdateAUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>Users&#39; email</p> "
          },
          {
            "group": "Body",
            "type": "String",
            "optional": true,
            "field": "password",
            "description": "<p>Users&#39; password</p> "
          },
          {
            "group": "Body",
            "type": "String",
            "optional": true,
            "field": "confirm",
            "description": "<p>Users&#39; confirm</p> "
          },
          {
            "group": "Body",
            "type": "String",
            "optional": true,
            "field": "username",
            "description": "<p>Users&#39; username</p> "
          },
          {
            "group": "Body",
            "type": "String",
            "optional": true,
            "field": "avatar",
            "description": "<p>Users&#39; avatar</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Token",
            "description": "<p>Users&#39; token</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n  {\n  \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdmF0YXIiOiIiLCJ1c2VybmFtZSI6IiIsImVtYWlsIjoidGVzdGVyM0B0ZXN0Lm5ldCIsIl9pZCI6IjU0ZWM2OTNmY2Q0Njg5MjgyYTM4YjExOCIsImlhdCI6MTQyNDc3OTU4M30.dbvHElTZ2vPxNX9qBSmWBSBLjKdqwt-3dt5HuTvJmE8\"\n  }",
          "type": "Object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "localhost/api/users/"
      }
    ],
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
  },
  {
    "type": "get",
    "url": "/api/users/validate",
    "title": "Ensure the users' token is valid.",
    "name": "Validate_Users__token",
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
            "type": "Object",
            "optional": false,
            "field": "Users",
            "description": "<p>&#39; token.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n  {\n  \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdmF0YXIiOiIiLCJ1c2VybmFtZSI6IiIsImVtYWlsIjoidGVzdGVyM0B0ZXN0Lm5ldCIsIl9pZCI6IjU0ZWM2OTNmY2Q0Njg5MjgyYTM4YjExOCIsImlhdCI6MTQyNDc3OTU4M30.dbvHElTZ2vPxNX9qBSmWBSBLjKdqwt-3dt5HuTvJmE8\"\n  }",
          "type": "Object"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "localhostapi/users/validate"
      }
    ],
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