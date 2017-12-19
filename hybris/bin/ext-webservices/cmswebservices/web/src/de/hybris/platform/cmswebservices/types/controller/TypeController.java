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
package de.hybris.platform.cmswebservices.types.controller;

import de.hybris.platform.cmsfacades.types.ComponentTypeFacade;
import de.hybris.platform.cmsfacades.types.ComponentTypeNotFoundException;
import de.hybris.platform.cmswebservices.data.ComponentTypeData;
import de.hybris.platform.cmswebservices.data.ComponentTypeListData;
import de.hybris.platform.cmswebservices.security.IsAuthorizedCmsManager;
import de.hybris.platform.webservicescommons.mapping.DataMapper;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


/**
 * Controller to deal with component types.
 */
@Controller
@IsAuthorizedCmsManager
@RequestMapping(value = "/types")
public class TypeController
{
	@Resource
	private ComponentTypeFacade componentTypeFacade;
	@Resource
	private DataMapper dataMapper;

	private static final Logger LOGGER = LoggerFactory.getLogger(TypeController.class);

	/**
	 * Find all CMS component types.
	 *
	 * @return a dto which serves as a wrapper object that contains a list of {@link ComponentTypeData}; never
	 *         <tt>null</tt>
	 */
	@RequestMapping(method = RequestMethod.GET)
	@ResponseBody
	public ComponentTypeListData getAllComponentTypes()
	{
		final List<ComponentTypeData> componentTypes = getDataMapper() //
				.mapAsList(getComponentTypeFacade().getAllComponentTypes(), ComponentTypeData.class, null);

		final ComponentTypeListData listDto = new ComponentTypeListData();
		listDto.setComponentTypes(componentTypes);
		return listDto;
	}

	@SuppressWarnings("javadoc")
	/**
	 * Find all CMS component types filtered by a given category.
	 * @queryparam category The component type category of the types to be returned.
	 * @return a dto which serves as a wrapper object that contains a list of {@link ComponentTypeData}; never
	 *         <tt>null</tt>
	 */
	@RequestMapping(method = RequestMethod.GET, params =
	{ "category" })
	@ResponseBody
	public ComponentTypeListData getAllComponentTypesByCategory(@RequestParam(value = "category") final String category)
	{
		final List<ComponentTypeData> componentTypes = getDataMapper()
				.mapAsList(getComponentTypeFacade().getAllComponentTypes(category), ComponentTypeData.class, null);

		final ComponentTypeListData listDto = new ComponentTypeListData();
		listDto.setComponentTypes(componentTypes);
		return listDto;
	}

	@SuppressWarnings("javadoc")
	/**
	 * Find a single CMS component types.
	 *
	 * @pathparam code Component type code
	 * @return a dto which serves as a wrapper object that contains a {@link ComponentTypeData} DTO
	 * @throws ComponentTypeNotFoundException
	 *            when the code provided does not match any existing type
	 */
	@RequestMapping(value = "/{code}", method = RequestMethod.GET)
	@ResponseBody
	public ComponentTypeData getComponentTypeByCode(@PathVariable final String code) throws ComponentTypeNotFoundException
	{
		return getDataMapper().map(getComponentTypeFacade().getComponentTypeByCode(code), ComponentTypeData.class);
	}

	@SuppressWarnings("javadoc")
	/**
	 * Find a single CMS component type by by code and mode.
	 *
	 * @pathparam code Component type code
	 * @queryparam mode The MODE that works a a filter for the current Type.
	 * @return a dto which serves as a wrapper object that contains a {@link ComponentTypeData} DTO; or and empty list if the type and mode are not found.
	 */
	@RequestMapping(method = RequestMethod.GET, params = {"code", "mode"})
	@ResponseBody
	public ComponentTypeListData getComponentTypeByCodeAndMode(
			@RequestParam(value = "code")final String code,
			@RequestParam(value = "mode") final String mode) throws ComponentTypeNotFoundException
	{
		final List<ComponentTypeData> componentTypes = new ArrayList<>();
		final ComponentTypeListData componentTypeListData = new ComponentTypeListData();
		try
		{
			componentTypes.add(getDataMapper()
					.map(getComponentTypeFacade().getComponentTypeByCodeAndMode(code, mode), ComponentTypeData.class));
		} catch (final ComponentTypeNotFoundException e)
		{
			LOGGER.info("Component Type not found for type code = [" + code + "] and mode  = [" + mode + "]", e);
		}
		componentTypeListData.setComponentTypes(componentTypes);
		return componentTypeListData;
	}

	public ComponentTypeFacade getComponentTypeFacade()
	{
		return componentTypeFacade;
	}

	public void setComponentTypeFacade(final ComponentTypeFacade componentTypeFacade)
	{
		this.componentTypeFacade = componentTypeFacade;
	}

	protected DataMapper getDataMapper()
	{
		return dataMapper;
	}

	public void setDataMapper(final DataMapper dataMapper)
	{
		this.dataMapper = dataMapper;
	}

}
