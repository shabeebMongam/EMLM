# Role-Based Access Control

This document outlines the different roles and their permissions in the API system.

## Available Roles

### Admin
Has full access to all endpoints including:
- User management (add, delete, view all users)
- Artist management (add, update, delete, view)
- Album management (add, update, delete, view)
- Track management (add, update, delete, view)
- Favorites management (add, delete, view)

### Editor
Has access to:
- Artist management (update, delete, view)
- Album management (update, delete, view)
- Track management (update, delete, view)
- Favorites management (add, delete, view)

### Regular User
Has access to:
- View artists, albums, and tracks
- Update their own password
- Manage their favorites (add and view)

## API Endpoints Access by Role

### Public Endpoints (No Authentication Required)
- POST /signup
- POST /login

### Protected Endpoints

#### Admin Only
- POST /users/add-user
- GET /users
- DELETE /users/:user_id
- POST /artists/add-artist
- POST /albums/add-album
- POST /tracks/add-track

#### Admin and Editor
- PUT /artists/:artist_id
- DELETE /artists/:artist_id
- PUT /albums/:album_id
- DELETE /albums/:album_id
- PUT /tracks/:track_id
- DELETE /tracks/:track_id
- DELETE /favorites/remove-favorite/:favorite_id

#### All Authenticated Users
- GET /logout
- PUT /users/update-password
- GET /artists
- GET /artists/:artist_id
- GET /albums
- GET /albums/:album_id
- GET /tracks
- GET /tracks/:track_id
- POST /favorites/add-favorite
- GET /favorites/:category
