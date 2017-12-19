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
package de.hybris.platform.cmswebservices.synchronization.controller;

import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cmsfacades.exception.ValidationException;
import de.hybris.platform.cmsfacades.synchronization.SynchronizationFacade;
import de.hybris.platform.cmswebservices.data.SyncJobData;
import de.hybris.platform.cmswebservices.data.SyncJobRequestData;
import de.hybris.platform.cmswebservices.security.IsAuthorizedCmsManager;
import de.hybris.platform.webservicescommons.errors.exceptions.WebserviceValidationException;
import de.hybris.platform.webservicescommons.mapping.DataMapper;

import javax.annotation.Resource;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;


/*
 * Suppress sonar warning (squid:S1166 | Exception handlers should preserve the original exceptions) : It is
 * perfectly acceptable not to handle "e" here
 */
@SuppressWarnings("squid:S1166")
/**
 * Controller that handles synchronization of catalogs
 *
 * @pathparam catalogId Catalog name
 */
@Controller
@IsAuthorizedCmsManager
@RequestMapping(value = "/catalogs/{catalogId}")
public class CatalogVersionSynchronizationController
{

	@Resource
	private SynchronizationFacade synchronizationFacade;
	@Resource
	private DataMapper dataMapper;

	/**
	 * Get synchronization status

	 * @pathparam sourceVersionId Catalog version used as a starting point in this synchronization
	 * @pathparam targetVersionId Catalog version destination to be synchronized
	 *
	 * @param syncJobRequest
	 *           contains the synchronization request data

	 * @return the synchronization status
	 */
	@RequestMapping(value = "/versions/{sourceVersionId}/synchronizations/versions/{targetVersionId}", method = RequestMethod.GET)
	@ResponseBody
	@ResponseStatus(value = HttpStatus.OK)
	public SyncJobData getSynchronizationByCatalogSourceTarget(@ModelAttribute final SyncJobRequestData syncJobRequest)
	{
		try
		{
			final de.hybris.platform.cmsfacades.data.SyncJobRequestData convertedSyncJobRequest = getDataMapper().map(syncJobRequest,
					de.hybris.platform.cmsfacades.data.SyncJobRequestData.class);

			final de.hybris.platform.cmsfacades.data.SyncJobData syncJobResult = getSynchronizationFacade()
					.getSynchronizationByCatalogSourceTarget(convertedSyncJobRequest);

			return getDataMapper().map(syncJobResult, SyncJobData.class);
		}
		catch (final ValidationException e)
		{
			throw new WebserviceValidationException(e.getValidationObject());
		}
	}

	/**
	 * Creates a catalog synchronization
	 *
	 * @pathparam sourceVersionId Catalog version used as a starting point in this synchronization
	 * @pathparam targetVersionId Catalog version destination to be synchronized
	 *
	 * @param syncJobRequest
	 *           contains the synchronization request data
	 * @return the synchronization status
	 * @throws CMSItemNotFoundException
	 *            - when one of the catalogs does not exist
	 */
	@RequestMapping(value = "/versions/{sourceVersionId}/synchronizations/versions/{targetVersionId}", method = RequestMethod.PUT)
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	public SyncJobData createSynchronizationByCatalogSourceTarget(@ModelAttribute final SyncJobRequestData syncJobRequest)
			throws CMSItemNotFoundException
	{
		try
		{
			final de.hybris.platform.cmsfacades.data.SyncJobRequestData convertedSyncJobRequest = getDataMapper().map(syncJobRequest,
					de.hybris.platform.cmsfacades.data.SyncJobRequestData.class);

			final de.hybris.platform.cmsfacades.data.SyncJobData syncJobResult = getSynchronizationFacade()
					.createCatalogSynchronization(convertedSyncJobRequest);

			return getDataMapper().map(syncJobResult, SyncJobData.class);
		}
		catch (final ValidationException e)
		{
			throw new WebserviceValidationException(e.getValidationObject());
		}
	}

	/**
	 * Get the status of the last synchronization job. Information is retrieved based on the catalog version target.
	 *
	 * @pathparam targetVersionId Catalog version destination to be synchronized
	 *
	 * @param syncJobRequest contains the synchronization request data
	 * @return the synchronization status
	 */
	@RequestMapping(value = "/synchronizations/targetversions/{targetVersionId}", method = RequestMethod.GET)
	@ResponseBody
	@ResponseStatus(value = HttpStatus.OK)
	public SyncJobData getLastSynchronizationByCatalogTarget(@ModelAttribute final SyncJobRequestData syncJobRequest)
	{
		try
		{
			final de.hybris.platform.cmsfacades.data.SyncJobRequestData convertedSyncJobRequest = getDataMapper().map(syncJobRequest,
					de.hybris.platform.cmsfacades.data.SyncJobRequestData.class);

			final de.hybris.platform.cmsfacades.data.SyncJobData syncJobResult = getSynchronizationFacade()
					.getLastSynchronizationByCatalogTarget(convertedSyncJobRequest);

			return getDataMapper().map(syncJobResult, SyncJobData.class);
		}
		catch (final ValidationException e)
		{
			throw new WebserviceValidationException(e.getValidationObject());
		}
	}

	public SynchronizationFacade getSynchronizationFacade()
	{
		return synchronizationFacade;
	}

	public void setSynchronizationFacade(final SynchronizationFacade synchronizationFacade)
	{
		this.synchronizationFacade = synchronizationFacade;
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
