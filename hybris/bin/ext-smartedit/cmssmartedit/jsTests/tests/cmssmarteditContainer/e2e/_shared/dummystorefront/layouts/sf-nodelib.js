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
/* jshint unused:false, undef:false, undef:false */
var sfNodeLib = function() {

    var nodes = {};

    function addNode(alias, conf) {
        if (nodes[alias]) {
            throw "sfNodeLib - duplicate node alias: " + alias;
        }
        nodes[alias] = conf;
    }

    // ================= COMPONENTS =================

    addNode('nodeLib1', {
        componentId: "componentId1",
        componentType: "componentTypeA",
        nodeType: 'component'
    });
    addNode('anotherComp', {
        componentId: "componentId2",
        componentType: "componentTypeB",
        nodeType: 'component'
    });
    addNode('component5', {
        componentId: 'component5',
        componentType: 'componentType5',
        nodeType: 'component',
    });
    addNode('Component10', {
        componentId: 'component10',
        componentType: 'componentType10',
        nodeType: 'component',
    });
    addNode('asyncComponent', {
        componentId: "asyncComponent",
        componentType: "componentType1",
        nodeType: 'component',
        view: {
            hasTemplate: true
        }
    });
    addNode('resizeComponentDomListenerTest', {
        componentId: "resizeComponentDomListenerTest",
        componentType: "componentType1",
        nodeType: 'component'
    });


    // =================== SLOTS ===================

    addNode('sfBuilderFixtures', {
        componentId: "sfBuilderFixtures",
        componentType: "ContentSlot",
        nodeType: 'slot',
        view: {
            hasTemplate: true,
            showHeader: false
        }
    });
    addNode('resizeSlotDomListenerTest', {
        componentId: "resizeSlotDomListenerTest",
        componentType: "ContentSlot",
        nodeType: 'slot',
        children: [],
        view: {
            hasTemplate: true
        }
    });
    addNode('slotWrapper', {
        componentId: "slotWrapper",
        componentType: "ContentSlot",
        nodeType: 'slot',
        view: {
            hasTemplate: true
        }
    });
    addNode('blabla', {
        componentId: "balablbalbablalblba",
        componentType: "ContentSlot",
        nodeType: 'slot'
    });

    return {
        addNode: addNode,
        getNode: function(alias) {
            if (!nodes[alias]) {
                console.error('sfNodeLib.getNode() - Unknown node alias: ' + alias);
            }
            var tree = testLodash.cloneDeep(nodes[alias]);
            // this cross dependency with builder config is super ugly, but whatever... no time
            tree = sfConfigManager.getSanitizedNodeTree(tree);
            return tree;
        }
    };
}();
