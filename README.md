# NodeJS Book Shop
Full stack project for an online book shop. This is a multiple-page application using server-side rendering.

## Stack
- NodeJS/Express.js
- EJS for server-side rendering
- Sass
- Mongoose/MongoDB

## Features implemented
- User account creation
<img src="https://github.com/jimousse/node-mongodb-shop/blob/main/screenshots/signup.jpg" height="200">

- Secure login and password reset
<img src="https://github.com/jimousse/node-mongodb-shop/blob/main/screenshots/login.jpg" height="200">

- Adding/Editing/Deleting a product with permissions
<img src="https://github.com/jimousse/node-mongodb-shop/blob/main/screenshots/add-product.jpg" height="200">

- List of books available
<img src="https://github.com/jimousse/node-mongodb-shop/blob/main/screenshots/index.jpg" height="200">

- Adding to cart
<img src="https://github.com/jimousse/node-mongodb-shop/blob/main/screenshots/cart.jpg" height="200">

- Placing an order
<img src="https://github.com/jimousse/node-mongodb-shop/blob/main/screenshots/orders.jpg" height="200">

- Pagination
- Order invoice PDF creation
- User session with cookies
- Image upload
- Password encryption


## Start this project
- Download the source code
- Run 
```sh
$ npm i
```
- Make sure you have a MongoDB server running.
- Set your MongoDB database URL in this env [file](https://github.com/jimousse/node-mongodb-shop/blob/main/.env).
- Set the port and your database name in the same file:
```
DB_CONNECTION=mongodb://127.0.0.1:27017
DB_NAME=shop
PORT=3000
```
- Run
```sh
npm start
```
and go to `http://localhost:3000/` and you should be good to go!

