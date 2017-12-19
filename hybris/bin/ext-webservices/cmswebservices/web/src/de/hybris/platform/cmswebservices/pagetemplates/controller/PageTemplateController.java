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
package de.hybris.platform.cmswebservices.pagetemplates.controller;

import de.hybris.platform.cmsfacades.pagetemplates.PageTemplateFacade;
import de.hybris.platform.cmswebservices.data.PageTemplateDTO;
import de.hybris.platform.cmswebservices.data.PageTemplateData;
import de.hybris.platform.cmswebservices.data.PageTemplateListData;
import de.hybris.platform.cmswebservices.security.IsAuthorizedCmsManager;
import de.hybris.platform.webservicescommons.mapping.DataMapper;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;


/**
 * Controller to deal with PageTemplate objects
 *
 * @pathparam siteId Site identifier
 * @pathparam catalogId Catalog name
 * @pathparam versionId Catalog version identifier
 */
@Controller
@IsAuthorizedCmsManager
@RequestMapping(value = "/sites/{siteId}/catalogs/{catalogId}/versions/{versionId}/pagetemplates")
public class PageTemplateController
{
	@Resource
	private PageTemplateFacade pageTemplateFacade;
	@Resource
	private DataMapper dataMapper;

	/**
	 * Returns a holder of a collection of {@link PageTemplateData} filtered on the given data passed as query string
	 *
	 * @param pageTemplateDTO the {@link PageTemplateDTO} holder of search filters
	 * @return {@link PageTemplateListData}
	 */
	@RequestMapping(method = RequestMethod.GET)
	@ResponseBody
	public PageTemplateListData findPageTemplatesByPageType(@ModelAttribute final PageTemplateDTO pageTemplateDTO)
	{
		final de.hybris.platform.cmsfacades.data.PageTemplateDTO convertedPageTemplateDTO = getDataMapper().map(pageTemplateDTO,
				de.hybris.platform.cmsfacades.data.PageTemplateDTO.class);
		final List<PageTemplateData> pageTemplates = getDataMapper()
				.mapAsList(getPageTemplateFacade().findPageTemplates(convertedPageTemplateDTO), PageTemplateData.class, null);

		final PageTemplateListData pageTemplateListData = new PageTemplateListData();
		pageTemplateListData.setTemplates(pageTemplates);
		return pageTemplateListData;
	}

	public PageTemplateFacade getPageTemplateFacade() {
		return pageTemplateFacade;
	}

	public void setPageTemplateFacade(final PageTemplateFacade pageTemplateFacade) {
		this.pageTemplateFacade = pageTemplateFacade;
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
