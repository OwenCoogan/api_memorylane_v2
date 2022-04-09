require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const http = require('https');

class ServerClass{
    constructor(){
        this.server = express();
        this.port = process.env.PORT;
    }

    init(){
        this.server.use( (req, res, next) => {
            const allowedOrigins = process.env.ALLOWED_ORIGINS.split(', ');
            const origin = req.headers.origin;
            if(allowedOrigins.indexOf(origin) > -1){ res.setHeader('Access-Control-Allow-Origin', origin)}
            res.header('Access-Control-Allow-Credentials', true);
            res.header('Access-Control-Allow-Methods', ['GET', 'PUT', 'POST', 'DELETE']);
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });

        this.server.set( 'views', __dirname + '/www' );
        this.server.use( express.static(path.join(__dirname, 'www')) );
        this.server.set( 'view engine', 'ejs' );

        this.server.use(bodyParser.json({limit: '20mb'}));
        this.server.use(bodyParser.urlencoded({ extended: true }));

        this.server.use(cookieParser(process.env.COOKIE_SECRET));
        this.config();
    }

    config(){
        const { setAuthentication } = require('./services/passport.service');
        setAuthentication(passport);

        const AuthRouterClass = require('./router/auth.router');
        const authRouter = new AuthRouterClass( { passport } );
        this.server.use('/v1/auth', authRouter.init());

        const ApiRouterClass = require('./router/api.router');
        const apiRouter = new ApiRouterClass({ passport });
        this.server.use('/v1', apiRouter.init());

        const BackRouterClass = require('./router/backoffice.router');
        const backRouter = new BackRouterClass({ passport });
        this.server.use('/', backRouter.init());
        this.launch();
    }

    launch(){
        this.server.listen( this.port, options , () => {
            console.log({
                node: `http:s//localhost:${this.port}`,
            })
        })
    }
}
const MyServer = new ServerClass();
MyServer.init();
