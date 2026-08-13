const { withPodfile } = require('@expo/config-plugins');

const LINES = ['$RNFirebaseDisableSPM = true', 'use_modular_headers!'];

module.exports = function withRNFirebaseDisableSPM(config) {
    return withPodfile(config, (config) => {
        for (const line of LINES) {
            if (!config.modResults.contents.includes(line)) {
                config.modResults.contents = `${line}\n${config.modResults.contents}`;
            }
        }
        return config;
    });
};
