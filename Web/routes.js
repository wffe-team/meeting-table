var express = require('express');

var routes = [
    {
        key: '/',
        value: require('./controllers/home')
    },
    {
        key: '/meeting',
        value: require('./controllers/meeting')
    }
];

module.exports = routes;