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
/* jshint unused:false, undef:false */
angular.module('siteAndCatalogsMocks', ['ngMockE2E', 'functionsModule'])
    .run(function($httpBackend, parseQuery) {

        var apparelContentCatalog_global = {
            "catalogId": "apparelContentCatalog",
            "name": {
                "en": "Apparel Content Catalog",
            },
            "versions": [{
                "active": true,
                "pageDisplayConditions": [{
                    "options": [{
                        "label": "page.displaycondition.variation",
                        "value": "VARIATION"
                    }],
                    "typecode": "ProductPage"
                }, {
                    "options": [{
                        "label": "page.displaycondition.variation",
                        "value": "VARIATION"
                    }],
                    "typecode": "CategoryPage"
                }, {
                    "options": [{
                        "label": "page.displaycondition.primary",
                        "value": "PRIMARY"
                    }, {
                        "label": "page.displaycondition.variation",
                        "value": "VARIATION"
                    }],
                    "typecode": "ContentPage"
                }],
                "thumbnailUrl": "/medias/Homepage.png",
                "uuid": "apparelContentCatalog/Online",
                "version": "Online"
            }, {
                "active": false,
                "pageDisplayConditions": [{
                    "options": [{
                        "label": "page.displaycondition.variation",
                        "value": "VARIATION"
                    }],
                    "typecode": "ProductPage"
                }, {
                    "options": [{
                        "label": "page.displaycondition.variation",
                        "value": "VARIATION"
                    }],
                    "typecode": "CategoryPage"
                }, {
                    "options": [{
                        "label": "page.displaycondition.primary",
                        "value": "PRIMARY"
                    }, {
                        "label": "page.displaycondition.variation",
                        "value": "VARIATION"
                    }],
                    "typecode": "ContentPage"
                }],
                "thumbnailUrl": "/medias/Homepage.png",
                "uuid": "apparelContentCatalog/Staged",
                "version": "Staged"
            }]
        };

        var allSites = [{
            previewUrl: '/jsTests/tests/cmssmarteditContainer/e2e/_shared/dummystorefront/index.html',
            name: {
                en: "Apparel - UK"
            },
            redirectUrl: 'redirecturlApparels',
            uid: 'apparel-uk',
            contentCatalogs: ['apparelContentCatalog', 'apparel-ukContentCatalog']
        }, {
            previewUrl: '/jsTests/tests/cmssmarteditContainer/e2e/_shared/dummystorefront/index.html',
            name: {
                en: "Apparel - DE"
            },
            redirectUrl: 'redirecturlApparels',
            uid: 'apparel-de',
            contentCatalogs: ['apparelContentCatalog', 'apparel-deContentCatalog']
        }, {
            previewUrl: '/jsTests/tests/cmssmarteditContainer/e2e/features/dummystorefront.html',
            name: {
                en: "Apparel UK and EU"
            },
            redirectUrl: 'redirecturlApparels',
            uid: 'apparel',
            contentCatalogs: ['apparelContentCatalog']
        }];

        $httpBackend.whenGET(/cmswebservices\/v1\/sites$/).respond({
            sites: allSites
        });

        $httpBackend.whenGET(/cmswebservices\/v1\/sites\?catalogIds=.*/).respond(function(method, url, data, headers) {
            var params = parseQuery(url);
            var catalogIds = params.catalogIds && params.catalogIds.split(',');

            if (catalogIds) {
                var filteredItems = allSites.filter(function(site) {
                    return catalogIds.indexOf(site.contentCatalogs[site.contentCatalogs.length - 1]) > -1;
                });

                return [200, {
                    sites: filteredItems
                }];
            }

            return [200, {
                sites: []
            }];

        });

        $httpBackend.whenGET(/cmssmarteditwebservices\/v1\/sites\/apparel\/contentcatalogs/).respond({
            catalogs: [apparelContentCatalog_global]
        });

        $httpBackend.whenGET(/cmssmarteditwebservices\/v1\/sites\/apparel-uk\/contentcatalogs/).respond({
            catalogs: [apparelContentCatalog_global, {
                catalogId: "apparel-ukContentCatalog",
                name: {
                    en: "Apparel UK Content Catalog"
                },
                versions: [{
                    "active": false,
                    "pageDisplayConditions": [{
                        "options": [{
                            "label": "page.displaycondition.variation",
                            "value": "VARIATION"
                        }],
                        "typecode": "ProductPage"
                    }, {
                        "options": [{
                            "label": "page.displaycondition.variation",
                            "value": "VARIATION"
                        }],
                        "typecode": "CategoryPage"
                    }, {
                        "options": [{
                            "label": "page.displaycondition.primary",
                            "value": "PRIMARY"
                        }, {
                            "label": "page.displaycondition.variation",
                            "value": "VARIATION"
                        }],
                        "typecode": "ContentPage"
                    }],
                    "uuid": "apparel-ukContentCatalog/Staged",
                    "version": "Staged"
                }, {
                    "active": true,
                    "pageDisplayConditions": [{
                        "options": [{
                            "label": "page.displaycondition.variation",
                            "value": "VARIATION"
                        }],
                        "typecode": "ProductPage"
                    }, {
                        "options": [{
                            "label": "page.displaycondition.variation",
                            "value": "VARIATION"
                        }],
                        "typecode": "CategoryPage"
                    }, {
                        "options": [{
                            "label": "page.displaycondition.primary",
                            "value": "PRIMARY"
                        }, {
                            "label": "page.displaycondition.variation",
                            "value": "VARIATION"
                        }],
                        "typecode": "ContentPage"
                    }],
                    "uuid": "apparel-ukContentCatalog/Online",
                    "version": "Online"
                }]
            }]
        });

        $httpBackend.whenGET(/cmssmarteditwebservices\/v1\/sites\/apparel-de\/contentcatalogs/).respond({
            catalogs: [apparelContentCatalog_global, {
                catalogId: "apparel-deContentCatalog",
                name: {
                    en: "Apparel DE Content Catalog"
                },
                versions: [{
                    "active": false,
                    "pageDisplayConditions": [{
                        "options": [{
                            "label": "page.displaycondition.variation",
                            "value": "VARIATION"
                        }],
                        "typecode": "ProductPage"
                    }, {
                        "options": [{
                            "label": "page.displaycondition.variation",
                            "value": "VARIATION"
                        }],
                        "typecode": "CategoryPage"
                    }, {
                        "options": [{
                            "label": "page.displaycondition.primary",
                            "value": "PRIMARY"
                        }, {
                            "label": "page.displaycondition.variation",
                            "value": "VARIATION"
                        }],
                        "typecode": "ContentPage"
                    }],
                    "uuid": "apparel-deContentCatalog/Staged",
                    "version": "Staged"
                }, {
                    "active": true,
                    "pageDisplayConditions": [{
                        "options": [{
                            "label": "page.displaycondition.variation",
                            "value": "VARIATION"
                        }],
                        "typecode": "ProductPage"
                    }, {
                        "options": [{
                            "label": "page.displaycondition.variation",
                            "value": "VARIATION"
                        }],
                        "typecode": "CategoryPage"
                    }, {
                        "options": [{
                            "label": "page.displaycondition.primary",
                            "value": "PRIMARY"
                        }, {
                            "label": "page.displaycondition.variation",
                            "value": "VARIATION"
                        }],
                        "typecode": "ContentPage"
                    }],
                    "uuid": "apparel-deContentCatalog/Online",
                    "version": "Online"
                }]
            }]
        });

        $httpBackend.whenGET(/cmswebservices\/v1\/sites\/apparel-uk\/catalogs\/apparel-ukContentCatalog\/versions\/Staged\/targets\?mode=cloneableTo/).respond({
            "versions": [{
                "active": false,
                "name": {
                    "en": "Apparel UK Content Catalog - Staged"
                },
                "uuid": "apparel-ukContentCatalog/Staged",
                "version": "Staged"
            }]
        });

        $httpBackend.whenGET(/cmswebservices\/v1\/sites\/apparel-uk\/catalogs\/apparel-ukContentCatalog\/versions\/Online\/targets\?mode=cloneableTo/).respond({
            "versions": []
        });

        $httpBackend.whenGET(/cmswebservices\/v1\/sites\/apparel\/catalogs\/apparelContentCatalog\/versions\/Staged\/targets\?mode=cloneableTo/).respond({
            "versions": [{
                "active": false,
                "name": {
                    "en": "Apparel Content Catalog - Staged"
                },
                "uuid": "apparelContentCatalog/Staged",
                "version": "Staged"
            }]
        });

        $httpBackend.whenGET(/cmswebservices\/v1\/sites\/apparel\/catalogs\/apparelContentCatalog\/versions\/Online\/targets\?mode=cloneableTo/).respond({
            "versions": [{
                "active": false,
                "name": {
                    "en": "Apparel Content Catalog - Staged"
                },
                "uuid": "apparelContentCatalog/Staged",
                "version": "Staged"
            }, {
                "active": false,
                "name": {
                    "en": "Apparel Content Catalog - Online"
                },
                "uuid": "apparelContentCatalog/Online",
                "version": "Online"
            }, {
                "active": false,
                "name": {
                    "en": "Apparel UK Content Catalog - Staged"
                },
                "uuid": "apparel-ukContentCatalog/Staged",
                "version": "Staged"
            }, {
                "active": false,
                "name": {
                    "en": "Apparel UK Content Catalog - Online"
                },
                "uuid": "apparel-ukContentCatalog/Online",
                "version": "Online"
            }, {
                "active": false,
                "name": {
                    "en": "Apparel DE Content Catalog - Staged"
                },
                "uuid": "apparel-deContentCatalog/Staged",
                "version": "Staged"
            }, {
                "active": false,
                "name": {
                    "en": "Apparel DE Content Catalog - Online"
                },
                "uuid": "apparel-deContentCatalog/Online",
                "version": "Online"
            }]
        });

        $httpBackend.whenPOST(/thepreviewTicketURI/)
            .respond({
                ticketId: 'dasdfasdfasdfa',
                resourcePath: document.location.origin + '/jsTests/tests/cmssmarteditContainer/e2e/_shared/dummystorefront/index.html'
            });


        $httpBackend.whenGET(/view/).passThrough(); //calls to storefront render API
        $httpBackend.whenPUT(/contentslots/).passThrough();
        $httpBackend.whenGET(/\.html/).passThrough();
    });
try {
    angular.module('smarteditloader').requires.push('siteAndCatalogsMocks');
} catch (e) {}
try {
    angular.module('smarteditcontainer').requires.push('siteAndCatalogsMocks');
} catch (e) {}
