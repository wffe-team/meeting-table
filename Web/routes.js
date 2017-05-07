var express = require('express');

var routes = [
    {
        key: '/',
        value: require('./controllers/home')
    },
    {
        key: '/meeting',
        value: require('./controllers/meeting')
    },
    {
        key: '/history',
        value: require('./controllers/history')
    }
];

module.exports = routes;