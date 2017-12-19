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
package de.hybris.platform.cmswebservices.catalogversions.controller;

import static de.hybris.platform.cmswebservices.constants.CmswebservicesConstants.MODE_CLONEABLE_TO;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cmsfacades.catalogversions.CatalogVersionFacade;
import de.hybris.platform.cmsfacades.data.CatalogVersionData;
import de.hybris.platform.cmswebservices.data.CatalogVersionListData;
import de.hybris.platform.cmswebservices.security.IsAuthorizedCmsManager;
import de.hybris.platform.webservicescommons.mapping.DataMapper;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;


/**
 * Controller that provides an API to retrieve a catalog version information.
 *
 * @pathparam siteId Site identifier
 * @pathparam catalogId Catalog name
 */

@RestController
@IsAuthorizedCmsManager
@RequestMapping(value = "/sites/{siteId}/catalogs/{catalogId}/versions")
public class CatalogVersionController
{
	@Resource
	private CatalogVersionFacade catalogVersionFacade;

	@Resource
	private DataMapper dataMapper;

	@SuppressWarnings("javadoc")
	/**
	 * Retrieve catalog version information for a given catalog and version name.
	 *
	 * @deprecated since version 6.4, please use the {@code CatalogController} in cmssmarteditwebservices instead
	 * @pathparam versionId Catalog version name
	 * @return a {@code CatalogVersionData}
	 * @throws CMSItemNotFoundException
	 *            when the catalog and/or version specified is not valid
	 */
	@RequestMapping(value = "/{versionId}", method = GET)
	@Deprecated
	public CatalogVersionData getCatalogVersion(@PathVariable("catalogId") final String catalogId,
			@PathVariable("versionId") final String versionId) throws CMSItemNotFoundException
	{
		return getDataMapper().map(getCatalogVersionFacade().getCatalogVersion(catalogId, versionId), CatalogVersionData.class);
	}

	/**
	 * Retrieve target content catalog versions by mode.
	 * For mode = "cloneableTo" returns the list of content catalog versions (which are used as targets for page clone operations) for a given catalog or all child catalogs.
	 *
	 * @param catalogId - the catalog identifier
	 * @param siteId    - the site identifier
	 * @param versionId - the version of the catalog
	 * @param mode      - the mode to filter the result
	 * @return the list of content catalog versions by mode.
	 */
	@RequestMapping(value = "/{versionId}/targets", method = GET, params = { "mode" })
	public CatalogVersionListData getWritableContentCatalogVersionsStartWith(@PathVariable("catalogId") final String catalogId,
			@PathVariable("siteId") final String siteId, @PathVariable("versionId") final String versionId,
			@RequestParam(value = "mode") final String mode)
	{
		CatalogVersionListData listData = new CatalogVersionListData();
		if (mode.equals(MODE_CLONEABLE_TO))
		{
			List<CatalogVersionData> catalogVersionDataList = getCatalogVersionFacade()
					.getWritableContentCatalogVersionTargets(siteId, catalogId, versionId);
			listData.setVersions(getDataMapper().mapAsList(catalogVersionDataList, CatalogVersionData.class, null));
		}
		else
		{
			listData.setVersions(new ArrayList<>());
		}
		return listData;
	}

	protected CatalogVersionFacade getCatalogVersionFacade()
	{
		return catalogVersionFacade;
	}

	public void setCatalogVersionFacade(final CatalogVersionFacade catalogVersionFacade)
	{
		this.catalogVersionFacade = catalogVersionFacade;
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
