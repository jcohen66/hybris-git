/*
 * [y] hybris Platform
 *
 * Copyright (c) 2017 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */
module.exports = function(grunt) {

    /**
     * checks whether code contains forbidden namespaces where they should be using framework supported wrappers
     * in which case the build will fail unless it is in force mode
     */
    grunt.registerTask('checkNoForbiddenNameSpaces', 'fails the build if the code contains forbidden napespaces', function() {

        var IGNORE_HINT = "/* forbiddenNameSpaces:false */";

        var VIOLATION_TEMPLATE = "File <%= filePath %> contains forbidden namespace <%= forbiddenNamespace %>, consider using <%= allowedNamespace %>";

        var containsKey = function(text, key) {
            var escapedKeyForRegexp = key.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            return new RegExp("[\\s]+" + escapedKeyForRegexp, 'g').test(text);
        };

        var defaultMap = {
            'jQuery': 'yjQuery in recipes or window.smarteditJQuery outside angular',
            '$(': 'yjQuery in recipes or window.smarteditJQuery outside angular',
            '$.': 'yjQuery in recipes or window.smarteditJQuery outside angular',
            'window.$': 'yjQuery in recipes or window.smarteditJQuery outside angular',
            '_.': 'lodash in recipes or window.smarteditLodash outside angular',
            'window._': 'lodash in recipes or window.smarteditLodash outside angular',
        };

        var taskName = "checkNoForbiddenNameSpaces";

        var gruntConfig = grunt.config.get(taskName);

        if (!gruntConfig.pattern) {
            grunt.fail.warn("pattern was not provided for task " + taskName);
        }

        var mergedMap = JSON.parse(JSON.stringify(defaultMap));

        if (gruntConfig.map) {
            mergedMap = Object.assign(mergedMap, gruntConfig.map);
        }

        var violations = [];

        grunt.file.expand({
            filter: 'isFile'
        }, gruntConfig.pattern).filter(function(filePath) {
            var fileContent = grunt.file.read(filePath);
            Object.keys(mergedMap).forEach(function(key) {
                if (containsKey(fileContent, key) && fileContent.indexOf(IGNORE_HINT) === -1) {
                    violations.push(grunt.template.process(VIOLATION_TEMPLATE, {
                        data: {
                            filePath: filePath,
                            forbiddenNamespace: key,
                            allowedNamespace: mergedMap[key]
                        }
                    }));
                }
            });
        });

        if (violations.length) {
            grunt.log.writeln("At least one file contains a forbidden namespace".yellow);
            violations.forEach(function(violation) {
                grunt.log.writeln(violation.green);
            });
            grunt.fail.warn("Make sure not to commit this!");
        }

    });

};
