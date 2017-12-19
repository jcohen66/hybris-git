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
package de.hybris.platform.cmswebservices.pagesrestrictions.controller;

import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cmsfacades.exception.ValidationException;
import de.hybris.platform.cmsfacades.pagesrestrictions.PageRestrictionFacade;
import de.hybris.platform.cmswebservices.data.PageRestrictionData;
import de.hybris.platform.cmswebservices.data.PageRestrictionListData;
import de.hybris.platform.cmswebservices.security.IsAuthorizedCmsManager;
import de.hybris.platform.webservicescommons.errors.exceptions.WebserviceValidationException;
import de.hybris.platform.webservicescommons.mapping.DataMapper;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;


/*
 * Suppress sonar warning (squid:S1166 | Exception handlers should preserve the original exceptions) : It is
 * perfectly acceptable not to handle "e" here
 */
@SuppressWarnings("squid:S1166")
/**
 * Controller that provides an API to retrieve all pages and their restrictions.
 *
 * @pathparam siteId Site identifier
 * @pathparam catalogId Catalog name
 * @pathparam versionId Catalog version identifier
 */
@Controller
@IsAuthorizedCmsManager
@RequestMapping(value = "/sites/{siteId}/catalogs/{catalogId}/versions/{versionId}/pagesrestrictions")
public class PagesRestrictionsController
{
	private static final Logger LOG = LoggerFactory.getLogger(PagesRestrictionsController.class);

	@Resource
	private PageRestrictionFacade pageRestrictionFacade;
	@Resource
	private DataMapper dataMapper;

	/**
	 * Find restrictions for all pages.
	 *
	 * @return a dto which serves as a wrapper object that contains a list of {@link PageRestrictionListData}; never
	 *         <tt>null</tt>
	 */
	@RequestMapping(method = RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	@ResponseBody
	public PageRestrictionListData getAllPagesRestrictions()
	{
		final List<PageRestrictionData> convertedPageRestrictions = getDataMapper()
				.mapAsList(getPageRestrictionFacade().getAllPagesRestrictions(), PageRestrictionData.class, null);

		final PageRestrictionListData pageRestrictionList = new PageRestrictionListData();
		pageRestrictionList.setPageRestrictionList(convertedPageRestrictions);
		return pageRestrictionList;
	}

	@SuppressWarnings("javadoc")
	/**
	 * Retrieve all restrictions that belong to the page for the given page ids.
	 *
	 * @return a dto which serves as a wrapper object that contains a list of {@link PageRestrictionListData}; never
	 *         <tt>null</tt>
	 */
	@RequestMapping(method = RequestMethod.GET, params =
{ "pageIds" })
	@ResponseStatus(value = HttpStatus.OK)
	@ResponseBody
	public PageRestrictionListData getAllPagesRestrictionsByPageIds(@RequestParam("pageIds") final List<String> pageIds)
	{
		final List<de.hybris.platform.cmsfacades.data.PageRestrictionData> pageRestrictions = getPageRestrictionFacade()
				.getAllPagesRestrictions().stream().filter(pageRestriction -> pageIds.contains(pageRestriction.getPageId()))
				.collect(Collectors.toList());
		final List<PageRestrictionData> convertedResult = getDataMapper().mapAsList(pageRestrictions, PageRestrictionData.class,
				null);

		final PageRestrictionListData pageRestrictionList = new PageRestrictionListData();
		pageRestrictionList.setPageRestrictionList(convertedResult);
		return pageRestrictionList;
	}

	/**
	 * Retrieve all restrictions that belong to the page for the given page id.
	 *
	 * @queryparam pageId Identifier of the page
	 * @param pageId
	 *           Identifier of the page
	 *
	 * @return a dto which serves as a wrapper object that contains a list of {@link PageRestrictionListData}; never
	 *         <tt>null</tt>
	 */
	@RequestMapping(method = RequestMethod.GET, params =
		{ "pageId" })
	@ResponseStatus(value = HttpStatus.OK)
	@ResponseBody
	public PageRestrictionListData getRestrictionsByPage(@RequestParam("pageId") final String pageId)
	{
		return getAllRestrictionsByPage(pageId);
	}

	protected PageRestrictionListData getAllRestrictionsByPage(final String pageId)
	{
		final PageRestrictionListData pageRestrictionList = new PageRestrictionListData();

		try
		{
			final List<PageRestrictionData> convertedRestrictions = getDataMapper()
					.mapAsList(getPageRestrictionFacade().getRestrictionsByPage(pageId), PageRestrictionData.class, null);
			pageRestrictionList.setPageRestrictionList(convertedRestrictions);
		}
		catch (final CMSItemNotFoundException e)
		{
			pageRestrictionList.setPageRestrictionList(Collections.emptyList());
			LOG.info(e.getMessage());
		}
		return pageRestrictionList;
	}

	/**
	 * Updates the list of page-restriction relations for the given page id.
	 *
	 * @pathparam pageId Page identifier
	 * @bodyparam pageRestrictionListData {@link PageRestrictionListData}
	 *
	 * @param pageId
	 *           page identifier
	 * @param pageRestrictionListData
	 *           list of {@link PageRestrictionData}
	 *
	 * @return a dto which serves as a wrapper object that contains the updated list of {@link PageRestrictionListData};
	 *         never <tt>null</tt>
	 * @throws CMSItemNotFoundException
	 *            if it cannot find the component
	 * @throws WebserviceValidationException
	 *            if there is any validation error
	 */
	@RequestMapping(value = "/pages/{pageId}", method = RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.OK)
	@ResponseBody
	public PageRestrictionListData updatePageRestrictionListData(@PathVariable("pageId") final String pageId,
			@RequestBody final PageRestrictionListData pageRestrictionListData)
					throws CMSItemNotFoundException, WebserviceValidationException
	{
		try
		{
			final List<de.hybris.platform.cmsfacades.data.PageRestrictionData> convertedPageRestrictions = //
					getDataMapper().mapAsList(pageRestrictionListData.getPageRestrictionList(),
							de.hybris.platform.cmsfacades.data.PageRestrictionData.class, null);
			getPageRestrictionFacade().updateRestrictionRelationsByPage(pageId, convertedPageRestrictions);
			return getAllRestrictionsByPage(pageId);
		}
		catch (final ValidationException e)
		{
			throw new WebserviceValidationException(e.getValidationObject());
		}
	}

	protected PageRestrictionFacade getPageRestrictionFacade()
	{
		return pageRestrictionFacade;
	}

	public void setPageRestrictionFacade(final PageRestrictionFacade pageRestrictionFacade)
	{
		this.pageRestrictionFacade = pageRestrictionFacade;
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
