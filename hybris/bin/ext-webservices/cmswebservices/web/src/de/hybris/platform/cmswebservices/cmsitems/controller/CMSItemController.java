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
package de.hybris.platform.cmswebservices.cmsitems.controller;


import static com.google.common.collect.Maps.newHashMap;
import static de.hybris.platform.cmsfacades.constants.CmsfacadesConstants.FIELD_UUID;
import static java.util.Arrays.asList;

import de.hybris.platform.cms2.data.PageableData;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cmsfacades.cmsitems.CMSItemFacade;
import de.hybris.platform.cmsfacades.data.CMSItemSearchData;
import de.hybris.platform.cmsfacades.exception.ValidationException;
import de.hybris.platform.cmsfacades.header.LocationHeaderResource;
import de.hybris.platform.cmswebservices.constants.CmswebservicesConstants;
import de.hybris.platform.cmswebservices.dto.CMSItemSearchWsDTO;
import de.hybris.platform.cmswebservices.dto.PageableWsDTO;
import de.hybris.platform.cmswebservices.security.IsAuthorizedCmsManager;
import de.hybris.platform.servicelayer.dto.converter.ConversionException;
import de.hybris.platform.servicelayer.search.SearchResult;
import de.hybris.platform.webservicescommons.dto.PaginationWsDTO;
import de.hybris.platform.webservicescommons.errors.exceptions.WebserviceValidationException;
import de.hybris.platform.webservicescommons.mapping.DataMapper;
import de.hybris.platform.webservicescommons.pagination.WebPaginationUtils;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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


/*
 * Suppress sonar warning (squid:S1166 | Exception handlers should preserve the original exceptions) : It is
 * perfectly acceptable not to handle "e" here
 */
@SuppressWarnings("squid:S1166")
/**
 * Generic controller to deal with CMS items (Components, Pages, Restrictions, etc...).
 * Any item that extends CMSItem is supported using this interface.
 *
 * @pathparam siteId Site identifier
 */
@Controller
@IsAuthorizedCmsManager
@RequestMapping(value = "/sites/{siteId}/cmsitems")
public class CMSItemController
{

	@Resource
	private CMSItemFacade cmsItemFacade;

	@Resource
	private DataMapper dataMapper;

	@Resource
	private WebPaginationUtils webPaginationUtils;

	@Resource
	private LocationHeaderResource locationHeaderResource;

	@SuppressWarnings("javadoc")
	/**
	 * Get the item that matches the given item uuid (Universally Unique Identifier).
	 * The uuid is a composed key formed by the cms item uid + the catalog + the catalog version.
	 *
	 * @return object a map <tt>Map&lt;String, Object&gt;</tt> representation of the CMS Item object.
	 * @throws CMSItemNotFoundException when the item has not been found
	 * @throws ConversionException if there is a conversion error
	 * @pathparam uuid Content identifier
	 */
	@RequestMapping(value = "/{uuid}", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getCMSItemByUUid(@PathVariable final String uuid)
			throws CMSItemNotFoundException, ConversionException
	{
		return getCmsItemFacade().getCMSItemByUuid(uuid);
	}

	@SuppressWarnings("javadoc")
	/**
	 * Remove a content item (CMSItem) from the system.
	 *
	 * @throws CMSItemNotFoundException if it cannot find the content item.
	 * @pathparam uuid Content Universally Unique Identifier
	 */
	@RequestMapping(value = "/{uuid}", method = RequestMethod.DELETE)
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void removeCMSItembyUUid(@PathVariable final String uuid)
			throws CMSItemNotFoundException
	{
		getCmsItemFacade().deleteCMSItemByUuid(uuid);
	}

	@SuppressWarnings("javadoc")
	/**
	 * Create a new CMS Item.
	 *
	 * @param request the {@link HttpServletRequest}
	 * @param response the {@link HttpServletResponse}
	 * @return the multi-level Map representing the newly created CMS Item.
	 * @throws WebserviceValidationException if there is any validation error
	 * @queryparam fields Response configuration (list of fields, which should be returned in the response)
	 * @bodyparam inputMap a multi-level map with the contents of the new CMS Item
	 * @bodyparams uid, name, itemtype
	 */
	@RequestMapping(method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	@ResponseBody
	public Map<String, Object> createCMSItem(@RequestBody final Map<String, Object> inputMap,
			final HttpServletRequest request, final HttpServletResponse response) throws CMSItemNotFoundException {
		try
		{
 			final Map<String, Object> outputMap = getCmsItemFacade().createItem(inputMap);
			response.addHeader(CmswebservicesConstants.HEADER_LOCATION,
					getLocationHeaderResource().createLocationForChildResource(request, outputMap.get(FIELD_UUID)));
			return outputMap;
		}
		catch (final ValidationException e)
		{
			throw new WebserviceValidationException(e.getValidationErrors());
		}
	}

	@SuppressWarnings("javadoc")
	/**
	 * Validate the new CMS Item in a Dry Run mode. 
	 *
	 * @param request the {@link HttpServletRequest}
	 * @param response the {@link HttpServletResponse}
	 * @return the multi-level Map representing the newly created CMS Item.
	 * @throws WebserviceValidationException if there is any validation error
	 * @queryparam fields Response configuration (list of fields, which should be returned in the response)
	 * @bodyparam inputMap a multi-level map with the contents of the new CMS Item
	 * @bodyparams uid, name, itemtype
	 */
	@RequestMapping(method = RequestMethod.POST, params = {"dryRun=true"})
	@ResponseBody
	public Map<String, Object> validateCMSItemForCreation(@RequestParam("dryRun") final Boolean dryRun,
			@RequestBody final Map<String, Object> inputMap,
			final HttpServletRequest request, final HttpServletResponse response) throws CMSItemNotFoundException {
		try
		{
			final Map<String, Object> outputMap = getCmsItemFacade().validateItemForCreate(inputMap);
			return outputMap;
		}
		catch (final ValidationException e)
		{
			throw new WebserviceValidationException(e.getValidationErrors());
		}
	}

	@SuppressWarnings("javadoc")
	/**
	 * Update a CMS Item.
	 *
	 * @throws WebserviceValidationException if there is any validation error
	 * @throws CMSItemNotFoundException if it cannot find the component
	 * @pathparam uuid Unique Identifier of a CMS Item.
	 * @queryparam fields Response configuration (list of fields, which should be returned in the response)
	 * @bodyparam inputMap a Multi-level map with the contents of the new CMS Item
	 * @bodyparams uuid, uid, name, itemtype
	 */
	@RequestMapping(value = "/{uuid}", method = RequestMethod.PUT)
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	public Map<String, Object> updateCMSItem(@PathVariable final String uuid, @RequestBody final Map<String, Object> inputMap)
			throws WebserviceValidationException, CMSItemNotFoundException
	{
		try
		{
			return getCmsItemFacade().updateItem(uuid, inputMap);
		}
		catch (final ValidationException e)
		{
			throw new WebserviceValidationException(e.getValidationErrors());
		}
	}


	@SuppressWarnings("javadoc")
	/**
	 * Validate a CMS Item in a Dry Run mode.
	 *
	 * @throws WebserviceValidationException if there is any validation error
	 * @throws CMSItemNotFoundException if it cannot find the component
	 * @pathparam uuid Unique Identifier of a CMS Item.
	 * @queryparam fields Response configuration (list of fields, which should be returned in the response)
	 * @bodyparam inputMap a Multi-level map with the contents of the new CMS Item
	 * @bodyparams uuid, uid, name, itemtype
	 */
	@RequestMapping(value = "/{uuid}", method = RequestMethod.PUT, params = {"dryRun=true"})
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	public Map<String, Object> validateCMSItemForUpdate(@RequestParam("dryRun") final Boolean dryRun, 
			@PathVariable final String uuid, @RequestBody final Map<String, Object> inputMap)
			throws WebserviceValidationException, CMSItemNotFoundException
	{
		try
		{
			return getCmsItemFacade().validateItemForUpdate(uuid, inputMap);
		}
		catch (final ValidationException e)
		{
			throw new WebserviceValidationException(e.getValidationErrors());
		}
	}

	@SuppressWarnings("javadoc")
	/**
	 * Find CMSItems matching the given uuids. <br>
	 *
	 * @return A map list of elements in the form of <tt>Map&lt;String, Object&gt;</tt>,
	 * each representing a CMSItem. Never null
	 * @queryparam uuids list of uuids representing the items to retrieve.
	 * @throws CMSItemNotFoundException      if it cannot find one of the items
	 */
	@RequestMapping(method = RequestMethod.GET, params = { "uuids" })
	@ResponseBody
	public Map<String, Object> findCmsItemsByUuids(@RequestParam("uuids") final String[] uuids) throws CMSItemNotFoundException{

		final Map<String, Object> results = newHashMap();

		final List<Map<String, Object>> searchResults = getCmsItemFacade().findCMSItems(asList(uuids));

		results.put(CmswebservicesConstants.WSDTO_RESPONSE_PARAM_RESULTS, searchResults);
		return results;
	}


	/**
	 * Paged Search for CMSItems
	 *
	 * @return A map of paging info and results. Results are in the form of <tt>Map&lt;String, Object&gt;</tt>,
	 *         each representing a CMSItem. Never null
	 * @throws WebserviceValidationException If the required fields are missing
	 * @queryparam pageSize Required page size for paging
	 * @queryparam currentPage Required current page for paging
	 * @queryparam catalogId Required catalog on which to search
	 * @queryparam catalogVersion Required catalogVersion on which to search
	 * @queryparam mask Optional search mask applied to the UID and NAME fields, Uses partial matching
	 * @queryparam typeCode Optional typeCode filter. Exact matches only.
	 * @queryparam itemSearchParams Optional search on additional fields using a comma separated list of field name and value
	 * pairs which are separated by a colon. Exact matches only.
	 */
	@RequestMapping(method = RequestMethod.GET, params =
		{ "pageSize", "currentPage" })
	@ResponseBody
	public Map<String, Object> findCmsItems(@ModelAttribute final CMSItemSearchWsDTO cmsItemSearchWsDTO,
			@ModelAttribute final PageableWsDTO pageableDto)
					throws WebserviceValidationException
	{

		final Map<String, Object> results = newHashMap();
		try
		{
			final PageableData pageableData = getDataMapper().map(pageableDto, PageableData.class);
			final CMSItemSearchData searchParams = getDataMapper().map(cmsItemSearchWsDTO,
					CMSItemSearchData.class);

			final SearchResult<Map<String, Object>> searchResults = getCmsItemFacade().findCMSItems(searchParams, pageableData);

			final PaginationWsDTO paginationWsDTO = getWebPaginationUtils().buildPagination(searchResults);

			results.put(CmswebservicesConstants.WSDTO_RESPONSE_PARAM_RESULTS, searchResults.getResult());
			results.put(CmswebservicesConstants.WSDTO_RESPONSE_PARAM_PAGINATION, paginationWsDTO);
		}
		catch (final ValidationException e)
		{
			throw new WebserviceValidationException(e.getValidationObject());
		}

		return results;
	}

	protected CMSItemFacade getCmsItemFacade()
	{
		return cmsItemFacade;
	}

	public void setCmsItemFacade(final CMSItemFacade cmsItemFacade)
	{
		this.cmsItemFacade = cmsItemFacade;
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

	protected LocationHeaderResource getLocationHeaderResource()
	{
		return locationHeaderResource;
	}

	public void setLocationHeaderResource(final LocationHeaderResource locationHeaderResource)
	{
		this.locationHeaderResource = locationHeaderResource;
	}


}
