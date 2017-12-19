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
package de.hybris.platform.cmswebservices.catalogversiondetails.controller;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import de.hybris.platform.cmsfacades.catalogversiondetails.CatalogVersionDetailFacade;
import de.hybris.platform.cmswebservices.data.CatalogVersionData;
import de.hybris.platform.cmswebservices.security.IsAuthorizedCmsManager;
import de.hybris.platform.webservicescommons.mapping.DataMapper;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * Controller to support the catalogversiondetails end point under sites.
 *
 * @pathparam siteId Identifier for a configured site
 * @deprecated since version 6.4, please use the {@code CatalogController} in cmssmarteditwebservices instead
 */
@Deprecated
@RestController
@IsAuthorizedCmsManager
@RequestMapping(value = "/sites/{siteId}")
public class CatalogVersionDetailsController
{

	@Resource
	private CatalogVersionDetailFacade catalogVersionDetailsFacade;

	@Resource
	private DataMapper dataMapper;

	@SuppressWarnings("javadoc")
	/**
	 * Get all permitted Content Catalog Versions and additional details for a given site.
	 *
	 * @return A list of all configured content catalogs and version details; never <tt>null</tt>
	 * @deprecated since 6.3. Please, use
	 *             {@link CatalogVersionDetailsController#getContentCatalogVersionsForSite(String)}
	 */
	@Deprecated
	@RequestMapping(value = "/catalogversiondetails", method = GET)
	public CatalogVersionData getAllCatalogVersionsForSite(@PathVariable final String siteId)
	{
		return getDataMapper().map(getCatalogVersionDetailDataFacade().getCatalogVersionDetailDataForSite(siteId),
				CatalogVersionData.class);
	}

	@SuppressWarnings("javadoc")
	/**
	 * Get all permitted Content Catalog Versions and additional details for a given site.
	 *
	 * @return A list of all configured content catalogs and version details; never <tt>null</tt>
	 */
	@RequestMapping(value = "/contentcatalogversiondetails", method = GET)
	public CatalogVersionData getContentCatalogVersionsForSite(@PathVariable final String siteId)
	{
		return getDataMapper().map(getCatalogVersionDetailDataFacade().getContentCatalogVersionDetailDataForSite(siteId),
				CatalogVersionData.class);
	}

	@SuppressWarnings("javadoc")
	/**
	 * Get all permitted Product Catalog Versions and additional details for a given site.
	 *
	 * @return A list of all configured product catalogs and version details; never <tt>null</tt>
	 */
	@RequestMapping(value = "/productcatalogversiondetails", method = GET)
	public CatalogVersionData getProductCatalogVersionsForSite(@PathVariable final String siteId)
	{
		return getDataMapper().map(getCatalogVersionDetailDataFacade().getProductCatalogVersionDetailDataForSite(siteId),
				CatalogVersionData.class);
	}

	protected CatalogVersionDetailFacade getCatalogVersionDetailDataFacade()
	{
		return catalogVersionDetailsFacade;
	}

	public void setCatalogVersionDetailDataFacade(final CatalogVersionDetailFacade catalogVersionDetailsFacade)
	{
		this.catalogVersionDetailsFacade = catalogVersionDetailsFacade;
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
