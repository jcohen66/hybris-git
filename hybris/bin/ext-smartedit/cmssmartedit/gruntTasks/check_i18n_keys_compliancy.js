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
/*jshint loopfunc:true */
module.exports = function(grunt) {

    grunt.registerTask(
        "check_i18n_keys_compliancy",
        "Compare i18n keys parsed from JS/HTML sources with properties files content",
        function() {

            /* ----------
             [ variables ]
             ---------- */

            var gruntConfig = grunt.config.get("check_i18n_keys_compliancy");
            var regExs = [
                // usages for Angular attribute "data-translate"
                /(data-translate=)[\\]?["']([\w]+[\.])+[\w]+[\\]?["']/g,
                // usages for Angular filter "| translate"
                /["']([\w]+[\.])+[\w]+[-](\s?\|\s?translate)/g,
                // usages for Angular service "$translate"
                /(\$translate)(.instant)?\(["']([\w]+[\.])+[\w]+["']/g,
                // usages for HTML tag "<translate>"
                /<translate>[\s]*([\w]+[\.])+[\w]+[\s]*<\/translate>/g
            ];

            var files = {
                    sources: {},
                    i18n: {}
                },
                output = {
                    i18n: {},
                    sources: {
                        prefixed_translation_found: [],
                        prefixed_translation_missing: [],
                        not_prefixed_translation_found: [],
                        not_prefixed_translation_missing: []
                    }
                },
                fileName = '',
                foundKeys = [],
                foundKeysPerFile = {},
                processedKeys = [];

            var returnFileName = function(filePath) {
                return filePath.split("/").pop();
            };
            var singularOrPlurial = function(array) {
                return (array.length > 1) ? "s" : "";
            };

            /* ------------------
             [ file conversions ]
             ----------------- */

            /* converting properties files into temporary json file  */
            var convertPropertiesToJson = function() {

                grunt.file.expand(gruntConfig.paths.properties).forEach(function(filePath) {

                    fileName = returnFileName(filePath);

                    if (filePath.split(".").pop() !== "properties") {
                        grunt.fail.fatal("Can only convert file of '.properties' type.");
                    } else {

                        files.i18n[fileName] = {};

                        // creating json from properties
                        grunt.file.read(filePath).split("\n").forEach(function(row) {
                            if (row !== "" &&
                                row.indexOf("#") !== 0 &&
                                row.indexOf("=") !== 0 &&
                                (row.match(/=/g) || []).length === 1) {
                                row = row.split("=");
                                files.i18n[fileName][row[0]] = row[1];
                            }
                        });

                    }

                });

            };


            /* saving file content as array of rows for each file */
            var convertSourcesToArray = function() {
                grunt.file.expand(gruntConfig.paths.files).forEach(function(filePath) {
                    files.sources[returnFileName(filePath)] = grunt.file.read(filePath).split("\n");
                });
            };

            /* -----------------------
             [ checking source files ]
             ---------------------- */

            // using defined regular expressions to report all i18n keys from sources files
            var checkSourceI18nCompliancy = function() {

                /* [ variables ] */

                var keyProperlyPrefixed = false,
                    translationStatus = "missing";

                /* [ private methods ] */

                // parsing i18n keys out of the regexp returned results
                this._cleaningFoundKey = function(foundKey) {
                    [/\\/g, /'/g, /"/g, /\|/g, /=/g, , / /g, "data-", "<translate>", "</translate>", "translate", "\$", ".instant", "(", ")"].forEach(function(character) {
                        foundKey = foundKey.replace(character, "");
                    });
                    return foundKey.trim();
                };

                this._returnSourceReport = function(key) {

                    var sourceReport = ["- " + key + ":"],
                        foundIndexes = [];

                    for (var fileName in foundKeysPerFile) {

                        foundIndexes = [];

                        foundKeysPerFile[fileName].forEach(function(foundKeys, index) {
                            if (foundKeys.indexOf(key) !== -1) {
                                foundIndexes.push(index);
                            }
                        });

                        if (foundIndexes.length !== 0) {
                            sourceReport.push("  " + fileName + ": " + foundIndexes.join(", "));
                        }

                    }

                    return sourceReport;

                };

                this._updateOutputSources = function(errorType, key) {
                    output.sources[errorType].push(this._returnSourceReport(key).join("\n"));
                }.bind(this);

                /* [ main ] */

                for (var fileName in files.sources) {

                    foundKeysPerFile[fileName] = [];

                    files.sources[fileName].forEach(function(row, rowIndex) {

                        regExs.forEach(function(regEx) {
                            processedKeys = row.match(regEx);
                            if (processedKeys !== null) {

                                for (var i = 0; i < processedKeys.length; i++) {
                                    // removing any reference to Angular controller found in html template
                                    if (processedKeys[i][0] === "$") {
                                        processedKeys.splice(i, 1);
                                        i--;
                                    } else {
                                        processedKeys[i] = this._cleaningFoundKey(processedKeys[i]);
                                    }
                                }

                                foundKeys = foundKeys.concat(processedKeys);
                                foundKeysPerFile[fileName][rowIndex + 1] = "|" + processedKeys.join("|") + "|";

                            }
                        }.bind(this));

                    });

                }

                // removing duplicates and sorting keys
                foundKeys = Array.from(new Set(foundKeys)).sort();

                foundKeys.forEach(function(key) {

                    // invalid or missing translation
                    keyProperlyPrefixed = false;

                    for (var option in gruntConfig.prefix) {
                        gruntConfig.prefix[option].forEach(function(prefix) {
                            if (key.indexOf(prefix) === 0) {
                                keyProperlyPrefixed = true;
                            }
                        });
                    }

                    // checking whether a translation has been added for the found i18n key
                    translationStatus = "missing";

                    for (fileName in files.i18n) {
                        if (files.i18n[fileName].hasOwnProperty(key) &&
                            typeof files.i18n[fileName][key] === "string" &&
                            files.i18n[fileName][key].length !== 0) {
                            translationStatus = "found";
                            break;
                        }
                    }

                    this._updateOutputSources(
                        (keyProperlyPrefixed) ?
                        "prefixed_translation_" + translationStatus :
                        "not_prefixed_translation_" + translationStatus,
                        key
                    );

                }.bind(this));

            };

            /* ---------------------------
             [ checking properties files ]
             -------------------------- */

            // reporting conformity of each translation with properties files
            var checkPropertiesI18nCompliancy = function() {

                /* [ variable ] */

                var prefixStatus = "";

                /* [ private method ] */

                // updating output reports with i18n key being processed and line indexes
                this._updateOutputI18n = function(fileName, errorType, key, index) {
                    output.i18n[fileName][errorType].push("  " + index + ": " + key);
                };

                /* [ main ] */

                for (var fileName in files.i18n) {

                    // initializing output reports for each file being processed
                    output.i18n[fileName] = {
                        invalid_translation: [],
                        prefixed: [],
                        not_prefixed: []
                    };

                    Object.getOwnPropertyNames(files.i18n[fileName]).forEach(function(key, index) {

                        // prefix can be expected ('se.cms.' or 'extensionname.') and ignored ('se.', back-end provided keys)
                        prefixStatus = "not_prefixed";
                        for (var option in gruntConfig.prefix) {
                            gruntConfig.prefix[option].forEach(function(prefix) {
                                if (key.indexOf(prefix) === 0) {
                                    prefixStatus = "prefixed";
                                }
                            });
                        }

                        // reporting whether i18n key is being properly prefixed
                        this._updateOutputI18n(fileName, prefixStatus, key, index);

                        // reporting whether i18n translation is valid
                        if (typeof files.i18n[fileName][key] !== "string" || files.i18n[fileName][key].length === 0) {
                            this._updateOutputI18n(fileName, "invalid_translation", key, index);
                        }

                    }.bind(this));

                }

            };


            /* -------------------
             [ publishing report ]
             ------------------ */

            var publishReport = function() {

                /* [ variables ] */

                var issueInI18n = false,
                    report = "";

                /* [ private methods ] */

                // properties
                this._publishPropertiesnOutputLog = function() {

                    for (var fileName in output.i18n) {

                        var keys = Object.getOwnPropertyNames(files.i18n[fileName]);

                        // name of properties file being processed with numbers of keys contained
                        grunt.log.writeln(">> " + fileName + ": " + keys.length + " key" + singularOrPlurial(keys));

                        // report for each available status
                        for (var status in output.i18n[fileName]) {

                            report = "- " + status.replace(/_/g, " ") + ": " + output.i18n[fileName][status].length + " key" + singularOrPlurial(output.i18n[fileName][status]);

                            // print out for each status type
                            if (output.i18n[fileName][status].length > 0) {
                                switch (status) {
                                    case "invalid_translation":
                                    case "not_prefixed":
                                        grunt.log.writeln(report.red);
                                        grunt.log.writeln(output.i18n[fileName][status].join("\n"));
                                        break;
                                    default:
                                        grunt.log.writeln(report.white);
                                }
                            }

                        }
                    }

                };

                // sources
                this._publishSourceOutputLog = function() {

                    for (var type in output.sources) {

                        var report = ">> " + type.replace(/_/g, " ") + ": " + output.sources[type].length + " key" + singularOrPlurial(output.sources[type]) + "";

                        // print out for each status type
                        if (output.sources[type].length > 0) {
                            switch (type) {
                                case "not_prefixed_translation_found":
                                case "not_prefixed_translation_missing":
                                case "prefixed_translation_missing":
                                    grunt.log.writeln(report.red);
                                    output.sources[type].forEach(function(report) {
                                        grunt.log.writeln(report);
                                    });
                                    break;
                                default:
                                    grunt.log.writeln(report.white);
                            }
                        }

                    }
                };

                /* [ main ] */

                // aborting Grunt build when required
                for (var fileName in output.i18n) {
                    if (output.i18n[fileName].invalid_translation.length !== 0 ||
                        output.i18n[fileName].not_prefixed.length !== 0) {
                        issueInI18n = true;
                    }
                }
                if (issueInI18n ||
                    output.sources.prefixed_translation_missing.length !== 0 ||
                    output.sources.not_prefixed_translation_found.length !== 0 ||
                    output.sources.not_prefixed_translation_missing.length !== 0) {
                    grunt.log.writeln();

                    // i18n
                    grunt.log.writeln();
                    grunt.log.writeln("From the i18n properties file:");
                    this._publishPropertiesnOutputLog();

                    // sources
                    grunt.log.writeln();
                    grunt.log.writeln("From the source files:");
                    this._publishSourceOutputLog();

                    grunt.log.writeln();
                    grunt.fail.fatal("Aborted due to warnings.");

                }

            };

            /* --------------
             [ running task ]
             ------------- */

            convertPropertiesToJson();
            convertSourcesToArray();

            checkSourceI18nCompliancy();
            checkPropertiesI18nCompliancy();

            publishReport();

        }
    );

};
