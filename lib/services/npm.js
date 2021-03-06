'use strict';

const { Service } = require('schmervice');
const Somever = require('@hapi/somever');
const Helpers = require('../helpers');

module.exports = class Npm extends Service {

    async version(pkgName) {

        const url = `https://registry.npmjs.org/${pkgName}/latest`;

        const { payload } = await Helpers.http.get(url, { json: true });

        return payload && payload.version;
    }

    async versions(pkgName) {

        const url = `https://registry.npmjs.org/${pkgName}`;
        const { payload } = await Helpers.http.get(url, { json: true });

        const byVersionDescending = (a, b) => Somever.version(b).compare(a);

        return payload && Object.keys(payload.versions || []).sort(byVersionDescending);
    }

    static get caching() {

        return {
            version: {
                expiresIn: 15 * Helpers.time.oneMinuteInMs,
                generateTimeout: Helpers.time.oneMinuteInMs
            },
            versions: {
                expiresIn: 15 * Helpers.time.oneMinuteInMs,
                generateTimeout: Helpers.time.oneMinuteInMs
            }
        };
    }
};
