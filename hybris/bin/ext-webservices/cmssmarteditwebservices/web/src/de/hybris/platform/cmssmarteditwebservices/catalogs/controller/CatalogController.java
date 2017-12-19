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
package de.hybris.platform.cmssmarteditwebservices.catalogs.controller;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import de.hybris.platform.cmssmarteditwebservices.catalogs.CatalogFacade;
import de.hybris.platform.cmssmarteditwebservices.dto.CatalogListWsDTO;
import de.hybris.platform.cmssmarteditwebservices.dto.CatalogWsDTO;
import de.hybris.platform.webservicescommons.mapping.DataMapper;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * Controller to retrieve catalog information related to a given site.
 *
 * @pathparam siteId Site identifier
 */
@RestController
@RequestMapping(value = "/sites/{siteId}")
public class CatalogController
{
	@Resource(name = "cmsSeCatalogFacade")
	private CatalogFacade catalogFacade;
	@Resource
	private DataMapper dataMapper;

	@SuppressWarnings("javadoc")
	/**
	 * Retrieve content catalog information including the related catalog versions for all catalogs for a given site.
	 * 
	 * @param siteId
	 *           the site identifier
	 * @return a list of {@code CatalogData}
	 */
	@RequestMapping(value = "/contentcatalogs", method = GET)
	public CatalogListWsDTO getContentCatalogs(@PathVariable final String siteId)
	{
		final List<CatalogWsDTO> catalogs = getDataMapper() //
				.mapAsList(getCatalogFacade().getContentCatalogs(siteId), CatalogWsDTO.class, null);

		final CatalogListWsDTO catalogList = new CatalogListWsDTO();
		catalogList.setCatalogs(catalogs);
		return catalogList;
	}

	/**
	 * Retrieve product catalog information including the related catalog versions for all catalogs for a given site.
	 * 
	 * @param siteId
	 *           the site identifier
	 * @return a list of {@code CatalogData}
	 */
	@RequestMapping(value = "/productcatalogs", method = GET)
	public CatalogListWsDTO getProductCatalogs(@PathVariable final String siteId)
	{
		final List<CatalogWsDTO> catalogs = getDataMapper() //
				.mapAsList(getCatalogFacade().getProductCatalogs(siteId), CatalogWsDTO.class, null);

		final CatalogListWsDTO catalogList = new CatalogListWsDTO();
		catalogList.setCatalogs(catalogs);
		return catalogList;
	}

	protected CatalogFacade getCatalogFacade()
	{
		return catalogFacade;
	}

	public void setCatalogFacade(final CatalogFacade catalogFacade)
	{
		this.catalogFacade = catalogFacade;
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
