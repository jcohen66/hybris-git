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
     * checks whether some tests are "focused" with fdescribe or fit"
     * In which case the build will fail unless it is in force mode
     */
    grunt.registerTask('checkNoFocus', 'fails the build if the code contains fdescribe or fit in one of the e2e', function() {

        var taskName = "checkNoFocus";

        var gruntConfig = grunt.config.get(taskName);

        if (!gruntConfig.pattern) {
            grunt.fail.warn("pattern was not provided for task " + taskName);
        }

        var focusedFiles = grunt.file.expand({
            filter: 'isFile'
        }, gruntConfig.pattern).filter(function(filePath) {
            var fileContent = grunt.file.read(filePath);
            return fileContent.indexOf("fdescribe") > -1 || fileContent.indexOf("fit") > -1;
        });

        if (focusedFiles.length) {
            grunt.log.writeln("At least one e2e test file contains a focus (fdescribe and/or fit):".yellow);
            focusedFiles.forEach(function(filePath) {
                grunt.log.writeln(filePath.green);
            });
            grunt.fail.warn("Make sure not to commit this!");
        }
    });

};
