## API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

*   Index 
*   Show
*   Create \[token required\]
*   \[OPTIONAL\] Top 5 most popular products
*   \[OPTIONAL\] Products by category (args: product category)

#### Users

*   Index \[token required\]
*   Show \[token required\]
*   Create N\[token required\]

#### Orders

*   Current Order by user (args: user id)\[token required\]
*   \[OPTIONAL\] Completed Orders by user (args: user id)\[token required\]

## Data Shapes

#### Product

*   id
*   name
*   price
*   \[OPTIONAL\] category

#### User

*   id
*   firstName
*   lastName
*   password

#### Orders

*   id
*   id of each product in the order
*   quantity of each product in the order
*   user\_id
*   status of order (active or complete)

## **Database Schema**

*   **products** (id _SERIAL PRIMARY KEY_, name _VARCHAR(255) NOT NULL,  price INTEGER NOT NULL)_
*   **users** (id _SERIAL PRIMARY KEY_, user\_name _VARCHAR(255) NOT NULL,_ first\_name _VARCHAR(255),  last\_name VARCHAR(255),_ password\_digest _VARCHAR(255))_
*   **orders** (id _SERIAL PRIMARY KEY_, status _VARCHAR(255) NOT NULL,  user\_id  INTEGER REFERENCES users(id))_
*   **orders\_products** (id _SERIAL PRIMARY KEY_, order\_id  INTEGER REFERENCES orders(id), product\_id INTEGER REFERENCES products(id), quantity INTEGER NOT NULL)

## **API Endpoint Documentation**

### **1- Products**

<table><tbody><tr><td>Action</td><td>API Endpoint</td><td>Sent Data Shape/Parameters</td><td>Returned Data Shape</td></tr><tr><td>Index</td><td><strong>GET /products</strong></td><td><p>&nbsp;</p><p>None.</p><p>&nbsp;</p><p>&nbsp;</p></td><td><pre><code class="language-plaintext">{
id: number,
name: string,
price: number,
}[]</code></pre></td></tr><tr><td>Show</td><td><strong>GET /products/:id</strong></td><td><p>Parameters:&nbsp;</p><pre><code class="language-plaintext">{
id: number
}</code></pre></td><td><pre><code class="language-plaintext">{
id: number,
name: string,
price: number,
}</code></pre></td></tr><tr><td>Create</td><td><strong>POST /products</strong></td><td><pre><code class="language-plaintext">BODY
{
name: string,
price: number,
}</code></pre><p>+ JWT Token in the header</p></td><td><pre><code class="language-plaintext">{
id: number,
name: string,
price: number,
}</code></pre></td></tr></tbody></table>

### **2- Users**

<table><tbody><tr><td>Action</td><td>API Endpoint</td><td>Sent Data Shape/Parameters</td><td>Returned Data Shape</td></tr><tr><td>Index</td><td><strong>GET /users</strong></td><td><p>&nbsp;</p><p>JWT Token in the header</p><p>&nbsp;</p><p>&nbsp;</p></td><td><pre><code class="language-plaintext">{
id: number,
username: string,
firstName: string,
lastName: string,
}[]</code></pre></td></tr><tr><td>Show</td><td><strong>GET /users/:id</strong></td><td><p>Parameters:&nbsp;</p><pre><code class="language-plaintext">{
id: number
}</code></pre><p>+ JWT Token in the header</p></td><td><pre><code class="language-plaintext">{
id: number,
username: string,
firstName: string,
lastName: string,
}</code></pre></td></tr><tr><td>Create</td><td><strong>POST /users</strong></td><td><pre><code class="language-plaintext">BODY
{
userName: string,
firstName: string,
lastName: string,
password: string
}</code></pre><p>+ JWT Token in the header</p></td><td><pre><code class="language-plaintext">
token: string
</code></pre></td></tr><tr><td>Login</td><td><strong>POST /login</strong></td><td><pre><code class="language-plaintext">BODY
{
userName: string,
password: string
}</code></pre></td><td><pre><code class="language-plaintext">
token: string
</code></pre></td></tr></tbody></table>

### **3- Orders**

<table><tbody><tr><td>Action</td><td>API Endpoint</td><td>Sent Data Shape/Parameters</td><td>Returned Data Shape</td></tr><tr><td>Current Order By User</td><td><strong>GET /users/:userId/active_order</strong></td><td><p>Parameters:&nbsp;</p><pre><code class="language-plaintext">{
userId: number
}</code></pre><p>JWT Token in the header</p><p>&nbsp;</p><p>&nbsp;</p></td><td><pre><code class="language-plaintext">{
id: number,
userId: number,
status: 'active' | 'complete'
}</code></pre></td></tr><tr><td>Add Product to Order</td><td><strong>POST /orders/:orderId/products</strong></td><td><p>Parameters:&nbsp;</p><pre><code class="language-plaintext">{
orderId: number
}</code></pre><p>&nbsp;</p><p>Body:</p><pre><code class="language-plaintext">{
productId: number,
quantity: number
}</code></pre><p>JWT Token in the header</p><p>&nbsp;</p></td><td><pre><code class="language-plaintext">{
order_id: number,
product_id: number,
quantity: number
}</code></pre><p>&nbsp;</p></td></tr></tbody></table>