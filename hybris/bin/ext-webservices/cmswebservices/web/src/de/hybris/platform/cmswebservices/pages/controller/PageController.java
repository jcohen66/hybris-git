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

import de.hybris.platform.cms2.data.PageableData;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cmsfacades.exception.ValidationException;
import de.hybris.platform.cmsfacades.header.LocationHeaderResource;
import de.hybris.platform.cmsfacades.pages.PageFacade;
import de.hybris.platform.cmswebservices.constants.CmswebservicesConstants;
import de.hybris.platform.cmswebservices.data.AbstractPageData;
import de.hybris.platform.cmswebservices.data.PageListData;
import de.hybris.platform.cmswebservices.data.UidListData;
import de.hybris.platform.cmswebservices.dto.PageableWsDTO;
import de.hybris.platform.cmswebservices.security.IsAuthorizedCmsManager;
import de.hybris.platform.servicelayer.search.SearchResult;
import de.hybris.platform.webservicescommons.errors.exceptions.WebserviceValidationException;
import de.hybris.platform.webservicescommons.mapping.DataMapper;
import de.hybris.platform.webservicescommons.pagination.WebPaginationUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;


/**
 * Controller to deal with AbstractPageModel objects
 *
 * @pathparam siteId Site identifier
 * @pathparam catalogId Catalog name
 * @pathparam versionId Catalog version identifier
 */
@Controller
@IsAuthorizedCmsManager
@RequestMapping(value = "/sites/{siteId}/catalogs/{catalogId}/versions/{versionId}/pages")
public class PageController
{
	private static Logger LOG = LoggerFactory.getLogger(PageController.class);

	@Resource
	private LocationHeaderResource locationHeaderResource;

	@Resource
	private PageFacade cmsPageFacade;

	@Resource
	private DataMapper dataMapper;

	@Resource
	private WebPaginationUtils webPaginationUtils;

	/**
	 * Find all pages.
	 *
	 * @return all pages
	 */
	@RequestMapping(method = RequestMethod.GET)
	@ResponseBody
	public PageListData findAllPages()
	{
		final PageListData pageListData = new PageListData();
		final List<AbstractPageData> convertedPages = getDataMapper().mapAsList(getCmsPageFacade().findAllPages(),
				AbstractPageData.class, null);
		pageListData.setPages(convertedPages);
		return pageListData;
	}

	@SuppressWarnings("javadoc")
	/**
	 * Find CMS Pages using a free mask search field. <br>
	 *
	 * @return a dto which serves as a wrapper object that contains a list of AbstractPageData; never <tt>null</tt>
	 * @queryparam mask optional, the string value on which CMS Pages will be filtered
	 * @queryparam typeCode optional, the type code of a pages to be filtered
	 * @queryparam pageSize the maximum number of elements in the result list.
	 * @queryparam currentPage optional, the requested page number
	 * @queryparam sort optional, the string field the results will be sorted with
	 */
	@RequestMapping(method = RequestMethod.GET, params =
	{ "pageSize" })
	@ResponseBody
	public PageListData findPagesByMask(@RequestParam(required = false) final String mask,
			@RequestParam(required = false) final String typeCode,
			@ModelAttribute final PageableWsDTO pageableDto)
	{
		final SearchResult<de.hybris.platform.cmsfacades.data.AbstractPageData> pageSearchResult = getCmsPageFacade()
				.findPagesByMaskAndTypeCode(mask, typeCode,
						Optional.of(pageableDto).map(pageableWsDTO -> getDataMapper().map(pageableWsDTO, PageableData.class)).get());

		final PageListData pages = new PageListData();
		pages.setPages(getDataMapper().mapAsList(pageSearchResult.getResult(), AbstractPageData.class, null));
		pages.setPagination(getWebPaginationUtils().buildPagination(pageSearchResult));
		return pages;
	}

	/**
	 * Find specific pages.
	 *
	 * @param uids a list of identifier of the pages that we are looking for
	 * @return ({@link PageListData}
	 * @queryparam uids a list of identifier of the pages that we are looking for
	 */
	@RequestMapping(method = RequestMethod.GET, params =
	{ "uids" })
	@ResponseBody
	public PageListData findPagesByIds(@RequestParam("uids") final List<String> uids)
	{
		final List<de.hybris.platform.cmsfacades.data.AbstractPageData> pages = getCmsPageFacade().findAllPages().stream()
				.filter(page -> uids.contains(page.getUid())).collect(Collectors.toList());

		final PageListData pageListData = new PageListData();
		pageListData.setPages(getDataMapper().mapAsList(pages, AbstractPageData.class, null));
		return pageListData;
	}

	@SuppressWarnings("javadoc")
	/**
	 * Get the page that matches the given page uid.
	 *
	 * @return {@link AbstractPageData}
	 * @throws CMSItemNotFoundException when the page cannot be found
	 * @pathparam pageUid {@link AbstractPageData} identifier
	 */
	@RequestMapping(value = "/{pageId}", method = RequestMethod.GET)
	@ResponseBody
	public AbstractPageData getPageByUid(@PathVariable final String pageId) throws CMSItemNotFoundException
	{
		return getDataMapper().map(getCmsPageFacade().getPageByUid(pageId), AbstractPageData.class);
	}

	@SuppressWarnings("javadoc")
	/**
	 * Get all default or variation pages that matches the given page type.
	 *
	 * @return all default or variation pages for a given page type
	 * @queryparam typeCode the type code of a page
	 * @queryparam defaultPage setting this to true will find all default pages; otherwise find all variation pages
	 */
	@RequestMapping(method = RequestMethod.GET, params =
	{ "typeCode", "defaultPage" })
	@ResponseBody
	public PageListData findPagesByType(@RequestParam("typeCode") final String typeCode,
			@RequestParam("defaultPage") final Boolean isDefaultPage)
	{
		final List<de.hybris.platform.cmsfacades.data.AbstractPageData> pages = getCmsPageFacade().findPagesByType(typeCode,
				isDefaultPage);

		final PageListData pageListData = new PageListData();
		pageListData.setPages(getDataMapper().mapAsList(pages, AbstractPageData.class, null));
		return pageListData;
	}

	@SuppressWarnings("javadoc")
	/**
	 * Get all variation pages uid for a given page.
	 *
	 * @return all variation pages uid for a given page; empty if the given page is already a variation page; never
	 *         <tt>null</tt>
	 * @throws CMSItemNotFoundException when the pageId is invalid
	 * @pathparam pageId the page identifier
	 */
	@RequestMapping(value = "/{pageId}/variations", method = RequestMethod.GET)
	@ResponseBody
	public UidListData findVariationPages(@PathVariable final String pageId) throws CMSItemNotFoundException
	{
		return convertToUidListData(getCmsPageFacade().findVariationPages(pageId));
	}

	@SuppressWarnings("javadoc")
	/**
	 * Get all fallback pages uid for a given page.
	 *
	 * @return all fallback pages uid for a given page; empty if the given page is already a fallback page; never
	 *         <tt>null</tt>
	 * @throws CMSItemNotFoundException when the pageId is invalid
	 * @pathparam pageId the page identifier
	 */
	@RequestMapping(value = "/{pageId}/fallbacks", method = RequestMethod.GET)
	@ResponseBody
	public UidListData findFallbackPages(@PathVariable final String pageId) throws CMSItemNotFoundException
	{
		return convertToUidListData(getCmsPageFacade().findFallbackPages(pageId));
	}

	protected UidListData convertToUidListData(final List<String> pageIds)
	{
		final UidListData pageData = new UidListData();
		pageData.setUids(pageIds);
		return pageData;
	}

	@SuppressWarnings("javadoc")
	/**
	 * Create a new page. <br>
	 *
	 * @param request the {@link HttpServletRequest}
	 * @param response the {@link HttpServletResponse}
	 * @return {@link AbstractPageData}
	 * @bodyparam pageData {@link AbstractPageData}
	 */
	@RequestMapping(method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	@ResponseBody
	public AbstractPageData createPage(@RequestBody final AbstractPageData pageData, final HttpServletRequest request,
			final HttpServletResponse response)
	{
		try
		{
			final de.hybris.platform.cmsfacades.data.AbstractPageData convertedPageData = getDataMapper().map(pageData,
					de.hybris.platform.cmsfacades.data.AbstractPageData.class);
			final de.hybris.platform.cmsfacades.data.AbstractPageData createPage = getCmsPageFacade().createPage(convertedPageData);

			response.addHeader(CmswebservicesConstants.HEADER_LOCATION,
					getLocationHeaderResource().createLocationForChildResource(request, createPage.getUid()));

			return getDataMapper().map(createPage, AbstractPageData.class);
		}
		catch (final ValidationException e)
		{
			LOG.info("validation exception", e);
			throw new WebserviceValidationException(e.getValidationObject());
		}
	}

	@SuppressWarnings("javadoc")
	/**
	 * Update a page.
	 *
	 * @return {@link AbstractPageData}
	 * @pathparam pageId Page identifier
	 * @bodyparam pageData the {@link AbstractPageData}
	 */
	@RequestMapping(value = "/{pageId}", method = RequestMethod.PUT)
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	public AbstractPageData updatePage(@PathVariable final String pageId, @RequestBody final AbstractPageData pageData)
	{
		try
		{
			final de.hybris.platform.cmsfacades.data.AbstractPageData convertedPage = getDataMapper().map(pageData,
					de.hybris.platform.cmsfacades.data.AbstractPageData.class);
			final de.hybris.platform.cmsfacades.data.AbstractPageData updatedPage = getCmsPageFacade().updatePage(pageId,
					convertedPage);
			return getDataMapper().map(updatedPage, AbstractPageData.class);
		}
		catch (final ValidationException e)
		{
			LOG.info("valiation exception", e);
			throw new WebserviceValidationException(e.getValidationObject());
		}
	}

	protected LocationHeaderResource getLocationHeaderResource()
	{
		return locationHeaderResource;
	}

	public void setLocationHeaderResource(final LocationHeaderResource locationHeaderResource)
	{
		this.locationHeaderResource = locationHeaderResource;
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

	protected WebPaginationUtils getWebPaginationUtils()
	{
		return webPaginationUtils;
	}

	public void setWebPaginationUtils(final WebPaginationUtils webPaginationUtils)
	{
		this.webPaginationUtils = webPaginationUtils;
	}
}
