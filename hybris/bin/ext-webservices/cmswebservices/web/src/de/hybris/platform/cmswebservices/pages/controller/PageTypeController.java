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
package de.hybris.platform.cmswebservices.pages.controller;

import de.hybris.platform.cmsfacades.pages.PageFacade;
import de.hybris.platform.cmswebservices.data.PageTypeData;
import de.hybris.platform.cmswebservices.data.PageTypeListData;
import de.hybris.platform.cmswebservices.security.IsAuthorizedCmsManager;
import de.hybris.platform.webservicescommons.mapping.DataMapper;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;


/**
 * Controller to get page types.
 */
@Controller
@IsAuthorizedCmsManager
@RequestMapping(value = "/pagetypes")
public class PageTypeController
{
	@Resource
	private PageFacade cmsPageFacade;
	@Resource
	private DataMapper dataMapper;

	@SuppressWarnings("javadoc")
	/**
	 * Find all page types.
	 */
	@RequestMapping(method = RequestMethod.GET)
	@ResponseBody
	public PageTypeListData findAllPageTypes()
	{
		final List<PageTypeData> pageTypes = getDataMapper() //
				.mapAsList(getCmsPageFacade().findAllPageTypes(), PageTypeData.class, null);

		final PageTypeListData pageTypeListData = new PageTypeListData();
		pageTypeListData.setPageTypes(pageTypes);
		return pageTypeListData;
	}

	protected PageFacade getCmsPageFacade()
	{
		return cmsPageFacade;
	}

	public void setCmsPageFacade(final PageFacade pageFacade)
	{
		this.cmsPageFacade = pageFacade;
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
