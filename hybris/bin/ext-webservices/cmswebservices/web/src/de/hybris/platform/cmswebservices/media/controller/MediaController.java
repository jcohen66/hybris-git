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
package de.hybris.platform.cmswebservices.media.controller;

import de.hybris.platform.cmsfacades.exception.ValidationException;
import de.hybris.platform.cmsfacades.media.MediaFacade;
import de.hybris.platform.cmswebservices.controller.AbstractSearchableController;
import de.hybris.platform.cmswebservices.data.MediaData;
import de.hybris.platform.cmswebservices.data.MediaListData;
import de.hybris.platform.cmswebservices.data.NamedQueryData;
import de.hybris.platform.cmswebservices.security.IsAuthorizedCmsManager;
import de.hybris.platform.webservicescommons.errors.exceptions.WebserviceValidationException;
import de.hybris.platform.webservicescommons.mapping.DataMapper;

import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;


/*
 * Suppress sonar warning (squid:S1166 | Exception handlers should preserve the original exceptions) : It is
 * perfectly acceptable not to handle "e" here
 */
@SuppressWarnings("squid:S1166")
/**
 * Controller that handles searching for media.
 */
@Controller
@IsAuthorizedCmsManager
@RequestMapping(value = "/media")
public class MediaController extends AbstractSearchableController
{
	@Resource
	private MediaFacade mediaFacade;

	@Resource
	private DataMapper dataMapper;

	@SuppressWarnings("javadoc")
	@RequestMapping(value="/{uuid}", method = RequestMethod.GET)
	@ResponseBody
	public MediaData getMediaByUuid(@PathVariable final String uuid)
			throws WebserviceValidationException
	{
		final de.hybris.platform.cmsfacades.data.MediaData media = getMediaFacade().getMediaByUUID(uuid);

		return getDataMapper().map(media, MediaData.class);
	}

	/**
	 * Get media by named query.
	 *
	 * @queryparam namedquery The name of the named query to use for the search.
	 * @queryparam params The query parameter values to inject into the named query.
	 * @queryparam currentpage The index of the requested page (index 0 means page 1).
	 * @queryparam pagesize The number of results per page.
	 * @queryparam sort The requested ordering for the search results.
	 *
	 * @return A single page of query results as a list of media or an empty list.
	 * @throws WebserviceValidationException
	 *            when the named query parameters provide contain validation errors
	 */
	@RequestMapping(method = RequestMethod.GET)
	@ResponseBody
	public MediaListData getMediaByQuery(@ModelAttribute("namedQuery") final NamedQueryData namedQuery)
			throws WebserviceValidationException
	{
		final MediaListData mediaList = new MediaListData();

		try
		{
			final de.hybris.platform.cmsfacades.data.NamedQueryData convertedNamedQuery = //
					getDataMapper().map(namedQuery, de.hybris.platform.cmsfacades.data.NamedQueryData.class);
			final List<MediaData> mediaDataList = getMediaFacade().getMediaByNamedQuery(convertedNamedQuery).stream()
					.map(media -> getDataMapper().map(media, MediaData.class)) //
					.collect(Collectors.toList());
			mediaList.setMedia(mediaDataList);
		}
		catch (final ValidationException e)
		{
			throw new WebserviceValidationException(e.getValidationObject());
		}
		return mediaList;
	}

	protected DataMapper getDataMapper()
	{
		return dataMapper;
	}

	public void setDataMapper(final DataMapper dataMapper)
	{
		this.dataMapper = dataMapper;
	}

	protected MediaFacade getMediaFacade()
	{
		return mediaFacade;
	}

	public void setMediaFacade(final MediaFacade mediaFacade)
	{
		this.mediaFacade = mediaFacade;
	}
}
