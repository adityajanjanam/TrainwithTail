const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const helmet = require('helmet'); // Added helmet for security headers


const app = express();

// Serve the 'public' directory statically
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(__dirname + '/images'));
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/styles', express.static(path.join(__dirname, 'public/styles')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/trainwithtail', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Create a mongoose model for the contact form data
const ContactForm = mongoose.model('ContactForm', {
    name: String,
    phone: String,
    email: String,
    petname: String,
});

// Create a mongoose model for the user data
const User = mongoose.model('User', {
    name: String,
    password: String,
    role: String,
});

// Create a mongoose model for the products
const Product = mongoose.model('Product', {
    name: String,
    price: Number,
    image: String,
    category: String,
});

// Add this code along with other mongoose models
const Trainer = mongoose.model('Trainer', {
    name: String,
    email: String,
    password: String,
    
});


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET || 'your_default_secret', resave: true, saveUninitialized: true }));

app.use(helmet()); // Add security headers

// Set views and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set session in locals
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Submitted Form Route - GET
app.get('/submittedform', (req, res) => {
    res.render('submittedform');
});

// Root Route - Redirect to Home
app.get('/', (req, res) => {
    res.redirect('/home');
});

// Home Route - GET
app.get('/home', (req, res) => {
    const username = req.session.username;
    res.render('home', { username });
});

// About Us Route - GET
app.get('/aboutus', (req, res) => {
    res.render('aboutus');
});

// Login Route - GET
app.get('/customerlogin', (req, res) => {
    const errorMessage = req.query.errorMessage;
    res.render('customerlogin', { errorMessage });
});


// Trainer Login Route - GET
app.get('/trainerlogin', (req, res) => {
    const errorMessage = req.query.errorMessage;
    res.render('trainerlogin', { errorMessage });
});


// Trainer Signup Route - GET
app.get('/trainersignup', (req, res) => {
    // Your logic for rendering the trainer signup page
    res.render('trainersignup');
});

// Userspace Route - GET
app.get('/userspace', (req, res) => {
    const username = req.session.username;
    res.render('userspace', { username });
});

// Contact Form Route - GET
app.get('/ContactForm', (req, res) => {
    res.render('ContactForm');
});

// Signup Route - GET
app.get('/signup', (req, res) => {
    res.render('signup');
});


// customerSignupMethod Route - POST
app.post('/customerSignupMethod', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ name: username });

        if (existingUser) {
            // If the user already exists, handle accordingly
            return res.render('signup', { errorMessage: 'Username already exists. Choose a different username.' });
        }

        // If the user doesn't exist, create and save a new user
        const newUser = new User({
            name: username,
            password: password,
            role: 'Customer', // set the role here as a string
        });

        await newUser.save();

        // Store username in the session
        req.session.username = username;
        req.session.role = 'Customer'; // set the role in the session

        // Redirect to the home page after successful signup
        res.redirect('/home');
    } catch (err) {
        console.error('Error during signup:', err);
        res.sendStatus(500);
    }
});

// trainerSignupMethod Route - POST
app.post('/trainerSignupMethod', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ name: username });

        if (existingUser) {
            // If the user already exists, handle accordingly
            return res.render('signup', { errorMessage: 'Username already exists. Choose a different username.' });
        }

        // If the user doesn't exist, create and save a new user
        const newUser = new User({
            name: username,
            password: password,
            role: 'Trainer', // set the role here as a string
        });

        await newUser.save();

        // Store username in the session
        req.session.username = username;
        req.session.role = 'Trainer'; // set the role in the session

        // Redirect to the home page after successful signup
        res.redirect('/home');
    } catch (err) {
        console.error('Error during signup:', err);
        res.sendStatus(500);
    }
});


//Trainer Login Route - POST
app.post('/trainerLoginMethod', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ name: username });

        if (!user) {
            // If the user doesn't exist, display a message
            return res.render('trainerlogin', { errorMessage: 'Invalid username or password.' });
        }

        // Check if the password is correct
        if (user.password !== password) {
            // If the password is incorrect, display an error message
            return res.render('trainerlogin', { errorMessage: 'Invalid username or password.' });
        }

        // Set the username and role in the session
        req.session.username = username;
        req.session.role = 'Trainer'; // assuming you have a role field in your user model

        res.redirect('/home');
    } catch (err) {
        console.error('Error during login:', err);
        res.sendStatus(500);
    }
});

//Customer Login Route - POST
app.post('/customerLoginMethod', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ name: username });

        if (!user) {
            // If the user doesn't exist, display a message
            return res.render('customerlogin', { errorMessage: 'Invalid username or password.' });
        } else if (user.password !== password) {
            // If the password is incorrect, display an error message
            return res.render('customerlogin', { errorMessage: 'Invalid username or password.' });
        }

        // Set the username and role in the session
        req.session.username = username;
        req.session.role = 'Customer'; // assuming you have a role field in your user model

        res.redirect('/home');
    } catch (err) {
        console.error('Error during login:', err);
        res.sendStatus(500);
    }
});



// ContactForm Route - POST
app.post('/ContactForm', async (req, res) => {
    const { name, phone, email, petname } = req.body;
    console.log('Form data:', req.body);

    try {
        // Save the form data to the database
        const newContactForm = new ContactForm({
            name,
            phone,
            email,
            petname,
        });

        await newContactForm.save();

        // Render the "Thank You" page
        res.redirect('/submittedform');
    } catch (err) {
        console.error('Error saving contact form data:', err);
        res.status(500).render('error', { errorMessage: 'Internal Server Error' });
    }
});





// Logout Route - GET
app.get('/logout-success', (req, res) => {
    // Clear the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err);
            res.sendStatus(500);
        } else {
            // Redirect to the login page or another page
            res.redirect('/');
        }
    });
});

// Products Route - GET
app.get('/Buy', async (req, res) => {
    try {
        // Fetch products from the database based on categories
        const categories = ['Dog Toys', 'Dog Jackets', 'Tennis Balls', 'Dog Food'];
        
        // Fetch products for each category
        const toys = await Product.find({ category: 'Dog Toys' });
        const jackets = await Product.find({ category: 'Dog Jackets' });
        const tennisBalls = await Product.find({ category: 'Tennis Balls' });
        const dogFoods = await Product.find({ category: 'Dog Food' });

        // Render the 'Buy' view with the fetched products
        res.render('Buy', { toys, jackets, tennisBalls, dogFoods });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.sendStatus(500);
    }
});



// Add to Cart Route - POST
app.post('/addToCart', async (req, res) => {
    const productId = req.body.productId;

    try {
        // Fetch the selected product from the database
        const product = await Product.findById(productId);

        // Add the product to the user's cart
        req.session.cart = req.session.cart || [];
        req.session.cart.push(product);

        // Redirect to the products page after adding to cart
        res.redirect('/Buy');
    } catch (err) {
        console.error('Error adding to cart:', err);
        res.sendStatus(500);
    }
});

// Add this route along with other routes
app.post('/submittrainersignup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Create a new Trainer document
        const newTrainer = new Trainer({
            name,
            email,
            password,
            // Add other fields as needed
        });

        // Save the new trainer to MongoDB
        await newTrainer.save();

        // Redirect or respond as needed
        res.redirect('/trainersignupsuccess'); // Redirect to a success page, for example
    } catch (err) {
        console.error('Error during trainer signup:', err);
        res.status(500).render('error', { errorMessage: 'Internal Server Error' });
    }
});


app.get('/logout-success', (req, res) => res.render('logout-success'));

// Cart Route - GET
app.get('/cart', (req, res) => {
    // Retrieve the cart items from the session
    const cartItems = req.session.cart || [];

    // Render the cart page, passing the cart items to the view
    res.render('cart', { cartItems });
});


// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('error', { errorMessage: 'Internal Server Error' });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
