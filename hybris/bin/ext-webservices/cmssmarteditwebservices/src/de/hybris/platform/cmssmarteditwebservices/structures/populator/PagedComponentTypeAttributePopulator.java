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
package de.hybris.platform.cmssmarteditwebservices.structures.populator;

import de.hybris.platform.cmsfacades.data.ComponentTypeAttributeData;
import de.hybris.platform.converters.Populator;
import de.hybris.platform.core.model.type.AttributeDescriptorModel;
import de.hybris.platform.servicelayer.dto.converter.ConversionException;

import org.springframework.beans.factory.annotation.Required;


/**
 * Populator that populates the paged field of the {@link ComponentTypeAttributeData} POJO.
 * @deprecated since version 6.5
 */
@Deprecated
public class PagedComponentTypeAttributePopulator implements Populator<AttributeDescriptorModel, ComponentTypeAttributeData>
{
	private boolean isPaged;

	@Override
	public void populate(final AttributeDescriptorModel source, final ComponentTypeAttributeData target) throws ConversionException
	{
		target.setPaged(isPaged());
	}

	protected boolean isPaged()
	{
		return isPaged;
	}

	@Required
	public void setPaged(final boolean isPaged)
	{
		this.isPaged = isPaged;
	}
}
