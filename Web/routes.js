var express = require('express');

var routes = [
    {
        key: '/',
        value: require('./controllers/home')
    },
    {
        key: '/conference',
        value: require('./controllers/conference')
    }
];

module.exports = routes;