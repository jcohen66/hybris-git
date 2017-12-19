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
package de.hybris.platform.cmswebservices.usergroups.controller;

import de.hybris.platform.cms2.data.PageableData;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cmsfacades.data.UserGroupData;
import de.hybris.platform.cmsfacades.usergroups.UserGroupFacade;
import de.hybris.platform.cmswebservices.dto.PageableWsDTO;
import de.hybris.platform.cmswebservices.dto.UserGroupListWsDTO;
import de.hybris.platform.cmswebservices.dto.UserGroupWsDTO;
import de.hybris.platform.cmswebservices.security.IsAuthorizedCmsManager;
import de.hybris.platform.servicelayer.search.SearchResult;
import de.hybris.platform.webservicescommons.mapping.DataMapper;
import de.hybris.platform.webservicescommons.pagination.WebPaginationUtils;

import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


/**
 * Controller to retrieve and search for User Groups.
 */
@Controller
@IsAuthorizedCmsManager
@RequestMapping(value = "/usergroups")
public class UserGroupController
{
	@Resource
	private UserGroupFacade cmsUserGroupFacade;

	@Resource
	private DataMapper dataMapper;

	@Resource
	private WebPaginationUtils webPaginationUtils;

	@SuppressWarnings("javadoc")
	/**
	 * Get a user group that matches the given id.
	 *
	 * @pathparam userGroupId the unique identifier of the user group
	 * @return UserGroupWsDTO
	 * @throws CMSItemNotFoundException
	 *            when the user group was not found
	 * @throws ConversionException
	 *            when there was problem during conversion.
	 */
	@RequestMapping(value = "/{userGroupId}", method = RequestMethod.GET)
	@ResponseBody
	public UserGroupWsDTO getUserGroupById(@PathVariable final String userGroupId) throws CMSItemNotFoundException
	{
		return getDataMapper().map(getCmsUserGroupFacade().getUserGroupById(userGroupId), UserGroupWsDTO.class);
	}

	@SuppressWarnings("javadoc")
	/**
	 * Find user groups using a free text search field. <br>
	 *
	 * @queryparam mask optional, the string value on which products will be filtered
	 * @queryparam pageSize the maximum number of elements in the result list.
	 * @queryparam currentPage optional, the requested page number
	 * @queryparam sort optional, the string field the results will be sorted with
	 * @return a dto which serves as a wrapper object that contains a list of UserGroupData; never <tt>null</tt>
	 */
	@RequestMapping(method = RequestMethod.GET, params =
	{ "pageSize" })
	@ResponseBody
	public UserGroupListWsDTO findUserGroupsByText(@RequestParam(required = false) final String mask,
			@ModelAttribute final PageableWsDTO pageableDto)
	{
		final SearchResult<UserGroupData> userGroupSearchResult = getCmsUserGroupFacade().findUserGroups(mask,
				Optional.of(pageableDto).map(pageableWsDTO -> getDataMapper().map(pageableWsDTO, PageableData.class)).get());

		final UserGroupListWsDTO userGroups = new UserGroupListWsDTO();
		userGroups.setUserGroups(userGroupSearchResult //
				.getResult() //
				.stream() //
				.map(productData -> getDataMapper().map(productData, UserGroupWsDTO.class)) //
				.collect(Collectors.toList()));
		userGroups.setPagination(getWebPaginationUtils().buildPagination(userGroupSearchResult));
		return userGroups;
	}

	protected UserGroupFacade getCmsUserGroupFacade()
	{
		return cmsUserGroupFacade;
	}

	public void setCmsUserGroupFacade(final UserGroupFacade cmsUserGroupFacade)
	{
		this.cmsUserGroupFacade = cmsUserGroupFacade;
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
