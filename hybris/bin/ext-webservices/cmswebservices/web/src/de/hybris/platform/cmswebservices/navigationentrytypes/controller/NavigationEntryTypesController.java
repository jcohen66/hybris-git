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
package de.hybris.platform.cmswebservices.navigationentrytypes.controller;

import de.hybris.platform.cmsfacades.navigationentrytypes.NavigationEntryTypesFacade;
import de.hybris.platform.cmswebservices.data.NavigationEntryTypeData;
import de.hybris.platform.cmswebservices.data.NavigationEntryTypeListData;
import de.hybris.platform.cmswebservices.security.IsAuthorizedCmsManager;
import de.hybris.platform.webservicescommons.mapping.DataMapper;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Controller to get the supported Navigation Node Entry Types
 *
 */
@Controller
@IsAuthorizedCmsManager
@RequestMapping(value = "/navigationentrytypes")
public class NavigationEntryTypesController
{
	@Resource
	private NavigationEntryTypesFacade navigationEntryTypesFacade;
	@Resource
	private DataMapper dataMapper;

	/**
	 * Find all navigation entry types available.
	 * @return the navigation entry types supported
	 */
	@RequestMapping(method = RequestMethod.GET)
	@ResponseBody
	public NavigationEntryTypeListData findAllNavigationEntryTypes()
	{
		final List<NavigationEntryTypeData> navigationEntries = getDataMapper()
				.mapAsList(getNavigationEntryTypesFacade().getNavigationEntryTypes(), NavigationEntryTypeData.class, null);

		final NavigationEntryTypeListData navigationEntryTypeListData = new NavigationEntryTypeListData();
		navigationEntryTypeListData.setNavigationEntryTypes(navigationEntries);
		return navigationEntryTypeListData;
	}


	protected NavigationEntryTypesFacade getNavigationEntryTypesFacade()
	{
		return navigationEntryTypesFacade;
	}

	public void setNavigationEntryTypesFacade(final NavigationEntryTypesFacade navigationEntryTypesFacade)
	{
		this.navigationEntryTypesFacade = navigationEntryTypesFacade;
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
