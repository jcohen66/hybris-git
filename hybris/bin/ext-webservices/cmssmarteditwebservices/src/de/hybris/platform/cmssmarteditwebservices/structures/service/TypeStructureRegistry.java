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
package de.hybris.platform.cmssmarteditwebservices.structures.service;

import de.hybris.platform.cmssmarteditwebservices.data.StructureTypeMode;

import java.util.Collection;
import java.util.Set;


/**
 * Registry that stores a collection of <code>StructureType</code> elements.
 * @deprecated since version 6.5
 */
@Deprecated
public interface TypeStructureRegistry
{

	/**
	 * Get a specific <code>StructureTypeAttribute</code> by typecode and mode.
	 *
	 * @param typecode
	 *           - the typecode of the element to retrieve from the registry.
	 * @param mode
	 *           - the mode of the element to retrieve from the registry.
	 * @return the element matching the typecode and qualifier; never <tt>null</tt>
	 * @deprecated since version 6.4. Use {@link TypeStructureRegistry#getTypeAttributeStructures(String, StructureTypeMode)} instead.
	 */
	@Deprecated
	Set<TypeAttributeStructure> getStructureTypeAttributesByMode(String typecode, String mode);

	/**
	 * Get a specific <code>StructureType</code> by its typecode.
	 *
	 * @param typecode
	 *           - the typecode of the element to retrieve from the registry.
	 * @return the element matching the typecode
	 */
	TypeStructure getTypeStructure(String typecode);

	/**
	 * Get all elements in the registry.
	 *
	 * @return all items in the registry or an empty collection if no elements are found.
	 * @deprecated since version 6.4. Use a combination of {@link TypeStructureRegistry#getStructureModes(String)} with {@link TypeStructureRegistry#getTypeAttributeStructures(String, StructureTypeMode)} instead.
	 */
	@Deprecated
	Collection<TypeStructure> getStructureTypes();

	/**
	 * Get all structure type modes defined for a given type code.
	 *
	 * @param typecode
	 *           - the type code
	 * @return all structure type modes
	 */
	Set<StructureTypeMode> getStructureModes(String typecode);

	/**
	 * Get a specific <code>TypeStructure</code> of an Abstract type by its itemtype.
	 *
	 * @param itemtype
	 *           - the itemtype of the element to retrieve from the registry.
	 * @return the element matching the itemtype
	 * @deprecated since version 6.4. The abstract types are not defined within this Registry. Use {@link de.hybris.platform.cmsfacades.types.service.ComponentTypeStructureRegistry#getAbstractComponentTypeStructure(String)}
	 */
	@Deprecated
	TypeStructure getAbstractTypeStructure(String itemtype);

	/**
	 * Get all structure type modes defined for the Abstract type matching the given item type.
	 *
	 * @param itemtype
	 *           - the <code>ComposedTypeModel</code> item type
	 * @return all structure type modes
	 * @deprecated since version 6.4. The abstract types are not defined within this Registry. Use a combination of {@link de.hybris.platform.cmsfacades.types.service.ComponentTypeStructureRegistry#getAbstractComponentTypeStructure(String)} with {@link TypeStructureRegistry#getStructureModes(String)}
	 */
	@Deprecated
	Set<StructureTypeMode> getAbstractStructureModes(String itemtype);

	/**
	 * Get all type attribute structures defined for a given typeCode and mode
	 * @param typeCode the type code specified on each attribute
	 * @param mode the mode in which the attribute was defined.
	 * @return a set of {@link TypeAttributeStructure}
	 */
	Set<TypeAttributeStructure> getTypeAttributeStructures(final String typeCode, final StructureTypeMode mode);

}
