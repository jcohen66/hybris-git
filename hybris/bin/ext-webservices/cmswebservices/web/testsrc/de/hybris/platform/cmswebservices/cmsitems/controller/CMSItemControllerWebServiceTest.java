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

import static de.hybris.platform.cmsfacades.util.models.CMSSiteModelMother.TemplateSite.ELECTRONICS;
import static de.hybris.platform.webservicescommons.testsupport.client.WebservicesAssert.assertResponse;
import static java.util.Locale.ENGLISH;
import static junit.framework.TestCase.assertTrue;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.instanceOf;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.iterableWithSize;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

import de.hybris.bootstrap.annotations.IntegrationTest;
import de.hybris.platform.catalog.model.CatalogVersionModel;
import de.hybris.platform.cms2.enums.CmsApprovalStatus;
import de.hybris.platform.cms2.model.TimeRestrictionDescription;
import de.hybris.platform.cms2.model.navigation.CMSNavigationEntryModel;
import de.hybris.platform.cms2.model.navigation.CMSNavigationNodeModel;
import de.hybris.platform.cms2.model.pages.ContentPageModel;
import de.hybris.platform.cms2.model.pages.PageTemplateModel;
import de.hybris.platform.cms2.model.restrictions.CMSTimeRestrictionModel;
import de.hybris.platform.cmsfacades.cmsitems.CMSItemConverter;
import de.hybris.platform.cmsfacades.cmsitems.attributeconverters.DateAttributeToDataContentConverter;
import de.hybris.platform.cmsfacades.constants.CmsfacadesConstants;
import de.hybris.platform.cmsfacades.uniqueidentifier.EncodedItemComposedKey;
import de.hybris.platform.cmsfacades.uniqueidentifier.functions.DefaultCatalogVersionModelUniqueIdentifierConverter;
import de.hybris.platform.cmsfacades.util.models.CMSNavigationNodeModelMother;
import de.hybris.platform.cmsfacades.util.models.CMSSiteModelMother;
import de.hybris.platform.cmsfacades.util.models.CMSTimeRestrictionModelMother;
import de.hybris.platform.cmsfacades.util.models.CatalogVersionModelMother;
import de.hybris.platform.cmsfacades.util.models.ContentCatalogModelMother;
import de.hybris.platform.cmsfacades.util.models.ContentPageModelMother;
import de.hybris.platform.cmsfacades.util.models.ContentSlotForPageModelMother;
import de.hybris.platform.cmsfacades.util.models.ContentSlotModelMother;
import de.hybris.platform.cmsfacades.util.models.ContentSlotNameModelMother;
import de.hybris.platform.cmsfacades.util.models.FlashComponentModelMother;
import de.hybris.platform.cmsfacades.util.models.MediaFormatModelMother;
import de.hybris.platform.cmsfacades.util.models.MediaModelMother;
import de.hybris.platform.cmsfacades.util.models.PageTemplateModelMother;
import de.hybris.platform.cmsfacades.util.models.ParagraphComponentModelMother;
import de.hybris.platform.cmswebservices.constants.CmswebservicesConstants;
import de.hybris.platform.cmswebservices.util.ApiBaseIntegrationTest;
import de.hybris.platform.core.model.media.MediaModel;
import de.hybris.platform.oauth2.constants.OAuth2Constants;
import de.hybris.platform.webservicescommons.dto.error.ErrorListWsDTO;
import de.hybris.platform.webservicescommons.dto.error.ErrorWsDTO;
import de.hybris.platform.webservicescommons.testsupport.server.NeedsEmbeddedServer;

import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.xml.bind.JAXBException;

import org.joda.time.DateTime;
import org.junit.Test;


@NeedsEmbeddedServer(webExtensions =
{ CmswebservicesConstants.EXTENSIONNAME, OAuth2Constants.EXTENSIONNAME })
@IntegrationTest
public class CMSItemControllerWebServiceTest extends ApiBaseIntegrationTest
{
	private static final String ENDPOINT = "/v1/sites/{siteId}/cmsitems";

	private static final String NAVIGATION_NODE_NAME = "navigation-node-name";
	private static final String NAVIGATION_NODE_UID = "navigation-node-uid";
	private static final String NAVIGATION_NODE_TITLE = "navigation-node-title";
	private static final String PARENT_UID = "parent-uid";
	private static final String NODE_UID_1 = "uid-1";
	private static final String CHILD_UID_1 = "child-uid-1";
	private static final String CHILD_UID_2 = "child-uid-2";
	private static final String CHILD_UID_3 = "child-uid-3";
	private static final String CHILD_UID_4 = "child-uid-4";
	private static final String PARENT_NAME = "parent-name";
	private static final String CODE_WITH_JPG_EXTENSION = "some-Media_Code.jpg";
	private static final String PAGE_TITLE = "pageTitle";

	private static final int DEFAULT_PAGE_SIZE = 10;
	private static final int DEFAULT_CURRENT_PAGE = 0;

	@Resource
	private CMSSiteModelMother cmsSiteModelMother;
	@Resource
	private CatalogVersionModelMother catalogVersionModelMother;
	@Resource
	private ContentSlotModelMother contentSlotModelMother;
	@Resource
	private ContentSlotForPageModelMother contentSlotForPageModelMother;
	@Resource
	private PageTemplateModelMother pageTemplateModelMother;
	@Resource
	private ContentSlotNameModelMother contentSlotNameModelMother;
	@Resource
	private CMSNavigationNodeModelMother navigationNodeModelMother;
	@Resource
	private MediaModelMother mediaModelMother;
	@Resource
	private MediaFormatModelMother mediaFormatModelMother;
	@Resource
	private CMSTimeRestrictionModelMother timeRestrictionModelMother;
	@Resource
	private ContentPageModelMother contentPageModelMother;
	@Resource
	private CMSItemConverter cmsItemConverter;
	@Resource
	private FlashComponentModelMother flashComponentModelMother;

	private CatalogVersionModel catalogVersion;

	protected void createElectronicsSite()
	{
		cmsSiteModelMother.createSiteWithTemplate(ELECTRONICS);
	}

	protected void createEmptyAppleCatalog()
	{
		catalogVersion = catalogVersionModelMother.createAppleStagedCatalogVersionModel();
	}

	protected void createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphAndLink()
	{
		createElectronicsSite();
		createEmptyAppleCatalog();
		contentSlotModelMother.createHeaderSlotWithParagraphAndLink(catalogVersion);
	}

	protected void createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphWithoutRestriction()
	{
		// Create Electronics site to associate with Apple catalog
		createElectronicsSite();
		// Create empty Apple catalog
		createEmptyAppleCatalog();
		// Create homepage template
		final PageTemplateModel pageTemplate = pageTemplateModelMother.HomePage_Template(catalogVersion);
		// Create homepage page and content slot header
		contentSlotForPageModelMother.HeaderHomepage_ParagraphOnly(catalogVersion);
		// Create header content slot name with paragraph and no type restriction
		contentSlotNameModelMother.Header_without_restriction(pageTemplate);
	}

	protected void createNavigationNodes()
	{
		final CMSNavigationNodeModel root = navigationNodeModelMother.createNavigationRootNode(catalogVersion);

		navigationNodeModelMother.createNavigationNode(NAVIGATION_NODE_NAME, NAVIGATION_NODE_UID, root, NAVIGATION_NODE_TITLE,
				catalogVersion);

		final MediaModel mediaModel = mediaModelMother.createLogoMediaModelWithCode(catalogVersion, CODE_WITH_JPG_EXTENSION);
		final CMSNavigationEntryModel entryModel = new CMSNavigationEntryModel();
		entryModel.setItem(mediaModel);
		entryModel.setName("entry name");
		entryModel.setUid("entry-uid");

		final CMSNavigationNodeModel rootNavigationNode = navigationNodeModelMother.createNavigationNodeWithEntry(PARENT_NAME,
				PARENT_UID,
				root, "title-en-1", catalogVersion, entryModel);

		final CMSNavigationNodeModel node1 = navigationNodeModelMother.createNavigationNode("name-1", NODE_UID_1,
				rootNavigationNode,
				"title-en-1", catalogVersion);

		navigationNodeModelMother.createNavigationNode("child-1", CHILD_UID_1, node1, "child-title-en-1",
				catalogVersion);
		navigationNodeModelMother.createNavigationNode("child-2", CHILD_UID_2, node1, "child-title-en-2",
				catalogVersion);
		navigationNodeModelMother.createNavigationNode("child-3", CHILD_UID_3, node1, "child-title-en-3",
				catalogVersion);

		navigationNodeModelMother.createNavigationNode("child-4", CHILD_UID_4,
				node1, "child-title-en-4", catalogVersion);
	}

	protected Map<Object, Map<String, Object>> resultsToUidMap(final List<Map<String, Object>> results)
	{
		return results
				.stream()
				.collect(Collectors.toMap(
						f -> f.get("uid"),
						Function.identity()));
	}

	protected void createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraph_WithNavigationTypeRestrictions()
	{
		// Create Electronics site to associate with Apple catalog
		createElectronicsSite();
		// Create empty Apple catalog
		createEmptyAppleCatalog();
		// Create homepage template
		final PageTemplateModel pageTemplate = pageTemplateModelMother.HomePage_Template(catalogVersion);
		// Create homepage page and content slot header
		contentSlotForPageModelMother.HeaderHomepage_ParagraphOnly(catalogVersion);
		// Create header content slot name with paragraph and link type restrictions
		contentSlotNameModelMother.Header(pageTemplate);
	}

	protected String getUuid(final String catalogId, final String catalogVersion, final String uid)
	{
		final EncodedItemComposedKey itemComposedKey = new EncodedItemComposedKey();
		itemComposedKey.setCatalogId(catalogId);
		itemComposedKey.setCatalogVersion(catalogVersion);
		itemComposedKey.setItemId(uid);

		return itemComposedKey.toEncoded();
	}

	protected String getUuidForAppleStage(final String uid)
	{
		return getUuid(ContentCatalogModelMother.CatalogTemplate.ID_APPLE.name(),
				CatalogVersionModelMother.CatalogVersion.STAGED.getVersion(), uid);
	}

	protected String generateRandomRestrictionName()
	{
		return "restrictionName_" + UUID.randomUUID();
	}

	@Test
	public void shouldDeleteOneComponent() throws Exception
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphAndLink();

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());
		final String uuid = getUuidForAppleStage(ParagraphComponentModelMother.UID_HEADER);

		Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.path(uuid)
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.delete();

		assertResponse(Response.Status.NO_CONTENT, response);

		response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.path(uuid)
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		assertResponse(Response.Status.NOT_FOUND, response);
	}

	@Test
	public void shouldGetOneComponent_Paragraph() throws Exception
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphAndLink();

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());
		final String uuid = getUuidForAppleStage(ParagraphComponentModelMother.UID_HEADER);

		final Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.path(uuid)
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		assertResponse(Response.Status.OK, response);

		final Map<String, Object> map = response.readEntity(Map.class);
		assertThat(map.isEmpty(), is(false));
		assertThat(map.get("content"), instanceOf(Map.class));
		assertThat(((Map) map.get("content")).get("en"), is(ParagraphComponentModelMother.CONTENT_HEADER_EN));
	}


	@Test
	public void shouldGetOneSlot() throws Exception
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphAndLink();

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());
		final String uuid = getUuidForAppleStage(ContentSlotModelMother.UID_HEADER);

		final Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.path(uuid)
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		assertResponse(Response.Status.OK, response);

		final Map<String, Object> map = response.readEntity(Map.class);
		assertThat(map.isEmpty(), is(false));
		assertThat(map.get("cmsComponents"), instanceOf(Collection.class));
		assertThat(((Collection) map.get("cmsComponents")).size(), is(2));
	}


	@Test
	public void shouldGetOnePage() throws Exception
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphWithoutRestriction();

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());
		final String uuid = getUuidForAppleStage(PageTemplateModelMother.UID_HOME_PAGE);

		final Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.path(uuid)
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		assertResponse(Response.Status.OK, response);

		final Map<String, Object> map = response.readEntity(Map.class);
		assertThat(map.isEmpty(), is(false));
	}

	@Test
	public void shouldGetOneNavigationNode() throws Exception
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraph_WithNavigationTypeRestrictions();
		createNavigationNodes();

		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphWithoutRestriction();

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());
		final String uuid = getUuidForAppleStage(PARENT_UID);

		final Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.path(uuid)
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		assertResponse(Response.Status.OK, response);

		final Map<String, Object> map = response.readEntity(Map.class);
		assertThat(map.isEmpty(), is(false));
		assertThat(map.get("children"), instanceOf(Collection.class));
		assertThat(((Collection) map.get("children")).size(), is(1));
		assertThat(map.get("entries"), instanceOf(Collection.class));
		assertThat(((Collection) map.get("entries")).size(), is(1));
	}


	@Test
	public void searchWithNoMaskOrTypeShouldGetAllCMSItems()
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphWithoutRestriction();

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());

		final Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.queryParam(CmswebservicesConstants.URI_PAGE_SIZE, DEFAULT_PAGE_SIZE)
				.queryParam(CmswebservicesConstants.URI_CURRENT_PAGE, DEFAULT_CURRENT_PAGE)
				.queryParam(CmswebservicesConstants.URI_CATALOG_ID, catalogVersion.getCatalog().getId())
				.queryParam(CmswebservicesConstants.URI_CATALOG_VERSION, catalogVersion.getVersion())
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		final Map<String, Object> results = response.readEntity(Map.class);
		final List<Map<String, Object>> items = (List<Map<String, Object>>) results.get("response");
		final Map<Object, Map<String, Object>> uidMap = resultsToUidMap(items);

		assertResponse(Response.Status.OK, response);

		assertEquals(4, items.size());
		assertTrue(uidMap.containsKey(ParagraphComponentModelMother.UID_HEADER));
		assertTrue(uidMap.containsKey(ContentPageModelMother.UID_HOMEPAGE));
		assertTrue(uidMap.containsKey(ContentSlotModelMother.UID_HEADER));
		assertTrue(uidMap.containsKey(PageTemplateModelMother.UID_HOME_PAGE));
	}

	@Test
	public void searchWithHomeMaskGetsHomePageAndHomePageTemplate()
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphWithoutRestriction();

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());

		final Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.queryParam(CmswebservicesConstants.URI_PAGE_SIZE, DEFAULT_PAGE_SIZE)
				.queryParam(CmswebservicesConstants.URI_CURRENT_PAGE, DEFAULT_CURRENT_PAGE)
				.queryParam(CmswebservicesConstants.URI_CATALOG_ID, catalogVersion.getCatalog().getId())
				.queryParam(CmswebservicesConstants.URI_CATALOG_VERSION, catalogVersion.getVersion())
				.queryParam("mask", "home")
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		final Map<String, Object> results = response.readEntity(Map.class);
		final List<Map<String, Object>> items = (List<Map<String, Object>>) results.get("response");
		final Map<Object, Map<String, Object>> uidMap = resultsToUidMap(items);

		assertResponse(Response.Status.OK, response);

		assertEquals(2, items.size());
		assertTrue(uidMap.containsKey(ContentPageModelMother.UID_HOMEPAGE));
		assertTrue(uidMap.containsKey(PageTemplateModelMother.UID_HOME_PAGE));
	}

	@Test
	public void searchWithLabelGetsHomePage()
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphWithoutRestriction();

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());

		final Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.queryParam(CmswebservicesConstants.URI_PAGE_SIZE, DEFAULT_PAGE_SIZE)
				.queryParam(CmswebservicesConstants.URI_CURRENT_PAGE, DEFAULT_CURRENT_PAGE)
				.queryParam(CmswebservicesConstants.URI_CATALOG_ID, catalogVersion.getCatalog().getId())
				.queryParam(CmswebservicesConstants.URI_CATALOG_VERSION, catalogVersion.getVersion())
				.queryParam(CmswebservicesConstants.URI_TYPECODE, ContentPageModel._TYPECODE)
				.queryParam("params", ContentPageModel.LABEL + ":" + ContentPageModelMother.LABEL_HOMEPAGE)
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		final Map<String, Object> results = response.readEntity(Map.class);
		final List<Map<String, Object>> items = (List<Map<String, Object>>) results.get("response");
		final Map<Object, Map<String, Object>> uidMap = resultsToUidMap(items);

		assertResponse(Response.Status.OK, response);

		assertEquals(1, items.size());
		assertTrue(uidMap.containsKey(ContentPageModelMother.UID_HOMEPAGE));
	}

	@Test
	public void searchWithParagraphComponentTypeReturnsOnlyTheOneInstance()
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphWithoutRestriction();

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());

		final Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.queryParam(CmswebservicesConstants.URI_PAGE_SIZE, DEFAULT_PAGE_SIZE)
				.queryParam(CmswebservicesConstants.URI_CURRENT_PAGE, DEFAULT_CURRENT_PAGE)
				.queryParam(CmswebservicesConstants.URI_CATALOG_ID, catalogVersion.getCatalog().getId())
				.queryParam(CmswebservicesConstants.URI_CATALOG_VERSION, catalogVersion.getVersion())
				.queryParam("typeCode", "CMSParagraphComponent")
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		final Map<String, Object> results = response.readEntity(Map.class);
		final List<Map<String, Object>> items = (List<Map<String, Object>>) results.get("response");
		final Map<Object, Map<String, Object>> uidMap = resultsToUidMap(items);

		assertResponse(Response.Status.OK, response);

		assertEquals(1, items.size());
		assertTrue(uidMap.containsKey(ParagraphComponentModelMother.UID_HEADER));
	}

	@Test
	public void searchWithBothMaskAndTypeReturnsBothFiltered()
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphWithoutRestriction();

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());

		final Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.queryParam(CmswebservicesConstants.URI_PAGE_SIZE, DEFAULT_PAGE_SIZE)
				.queryParam(CmswebservicesConstants.URI_CURRENT_PAGE, DEFAULT_CURRENT_PAGE)
				.queryParam(CmswebservicesConstants.URI_CATALOG_ID, catalogVersion.getCatalog().getId())
				.queryParam(CmswebservicesConstants.URI_CATALOG_VERSION, catalogVersion.getVersion())
				.queryParam("typeCode", "CMSParagraphComponent")
				.queryParam("mask", "paragraph")
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		final Map<String, Object> results = response.readEntity(Map.class);
		final List<Map<String, Object>> items = (List<Map<String, Object>>) results.get("response");
		final Map<Object, Map<String, Object>> uidMap = resultsToUidMap(items);

		assertResponse(Response.Status.OK, response);

		assertEquals(1, items.size());
		assertTrue(uidMap.containsKey(ParagraphComponentModelMother.UID_HEADER));
	}

	@Test
	public void searchWithUnkownTypeReturnsEmptyResults()
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphWithoutRestriction();

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());

		final Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.queryParam(CmswebservicesConstants.URI_PAGE_SIZE, DEFAULT_PAGE_SIZE)
				.queryParam(CmswebservicesConstants.URI_CURRENT_PAGE, DEFAULT_CURRENT_PAGE)
				.queryParam(CmswebservicesConstants.URI_CATALOG_ID, catalogVersion.getCatalog().getId())
				.queryParam(CmswebservicesConstants.URI_CATALOG_VERSION, catalogVersion.getVersion())
				.queryParam("typeCode", "UknownComponent")
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		final Map<String, Object> results = response.readEntity(Map.class);
		final List<Map<String, Object>> items = (List<Map<String, Object>>) results.get("response");

		assertResponse(Response.Status.OK, response);

		assertEquals(items.size(), 0);
	}

	@Test
	public void searchWithoutCatalogIdWillFailValidation()
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphWithoutRestriction();

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());

		final Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.queryParam(CmswebservicesConstants.URI_PAGE_SIZE, DEFAULT_PAGE_SIZE)
				.queryParam(CmswebservicesConstants.URI_CURRENT_PAGE, DEFAULT_CURRENT_PAGE)
				.queryParam(CmswebservicesConstants.URI_CATALOG_VERSION, catalogVersion.getVersion())
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		assertResponse(Response.Status.BAD_REQUEST, response);
	}

	@Test
	public void searchWithoutCatalogVersionWillFailValidation()
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphWithoutRestriction();

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());

		final Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.queryParam(CmswebservicesConstants.URI_PAGE_SIZE, DEFAULT_PAGE_SIZE)
				.queryParam(CmswebservicesConstants.URI_CURRENT_PAGE, DEFAULT_CURRENT_PAGE)
				.queryParam(CmswebservicesConstants.URI_CATALOG_ID, catalogVersion.getCatalog().getId())
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		assertResponse(Response.Status.BAD_REQUEST, response);
	}

	@Test
	public void shouldCreateOneContentSlot() throws Exception
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphWithoutRestriction();
		final String catalogUuid = catalogVersion.getCatalog().getId()
				+ DefaultCatalogVersionModelUniqueIdentifierConverter.SEPARATOR
				+ catalogVersion.getVersion();

		final Map<String, Object> inputMap = new HashMap<>();
		inputMap.put(CmswebservicesConstants.URI_CATALOG_VERSION, catalogUuid);
		inputMap.put("active", "true");
		inputMap.put("name", "name-responsive-banner-header-logo");
		inputMap.put("urlLink", "url-responsive-banner-header-logo");
		inputMap.put("typeCode", "ContentSlot");
		inputMap.put("itemtype", "ContentSlot");

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());
		final Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.post(Entity.entity(inputMap, MediaType.APPLICATION_JSON));

		assertResponse(Response.Status.CREATED, response);

		final Map<String, Object> map = response.readEntity(Map.class);
		assertThat(map.isEmpty(), is(false));
		assertThat(map.get("uuid"), notNullValue());
	}

	@Test
	public void shouldValidateForCreatingTimeRestrictionAndReturnComputedData() throws Exception
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphWithoutRestriction();
		final String catalogUuid = catalogVersion.getCatalog().getId()
				+ DefaultCatalogVersionModelUniqueIdentifierConverter.SEPARATOR
				+ catalogVersion.getVersion();

		final CMSTimeRestrictionModel restriction = new CMSTimeRestrictionModel();
		restriction.setActiveFrom(DateTime.now().toDate());
		restriction.setActiveUntil(DateTime.now().plusDays(5).toDate());
		restriction.setUseStoreTimeZone(Boolean.TRUE);

		final DateAttributeToDataContentConverter dateAttributeToDataContentConverter = new DateAttributeToDataContentConverter();

		String restrictionName = generateRandomRestrictionName();

		final Map<String, Object> inputMap = new HashMap<>();
		inputMap.put(CmswebservicesConstants.URI_CATALOG_VERSION, catalogUuid);
		inputMap.put("name", "cms-time-restriction-name");
		inputMap.put("activeFrom", dateAttributeToDataContentConverter.convert(restriction.getActiveFrom()));
		inputMap.put("activeUntil", dateAttributeToDataContentConverter.convert(restriction.getActiveUntil()));
		inputMap.put("useStoreTimeZone", restriction.getUseStoreTimeZone());
		inputMap.put("itemtype", "CMSTimeRestriction");
		inputMap.put("name", restrictionName);

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());
		final Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.queryParam("dryRun", "true")
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.post(Entity.entity(inputMap, MediaType.APPLICATION_JSON));

		assertResponse(Response.Status.OK, response);

		Map<String, Object> map = response.readEntity(Map.class);
		assertThat(map.isEmpty(), is(false));
		assertThat(map.get("uuid"), nullValue());
		assertThat(map.get("uid"), nullValue());
		assertThat(map.get("name"), is(restrictionName));
		assertThat(map.get("description"), is(new TimeRestrictionDescription().get(restriction)));

		final Response responseGet = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.queryParam(CmswebservicesConstants.URI_PAGE_SIZE, DEFAULT_PAGE_SIZE)
				.queryParam(CmswebservicesConstants.URI_CURRENT_PAGE, DEFAULT_CURRENT_PAGE)
				.queryParam(CmswebservicesConstants.URI_CATALOG_ID, catalogVersion.getCatalog().getId())
				.queryParam(CmswebservicesConstants.URI_CATALOG_VERSION, catalogVersion.getVersion())
				.queryParam("mask", restrictionName)
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		map = responseGet.readEntity(Map.class);
		Collection<?> pagedResponse = (Collection) map.get("response");
		assertResponse(Status.OK, responseGet);
		assertThat(pagedResponse, empty());
	}

	@Test
	public void shouldCreateOneContentPage() throws Exception
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphWithoutRestriction();
		final String catalogUuid = catalogVersion.getCatalog().getId()
				+ DefaultCatalogVersionModelUniqueIdentifierConverter.SEPARATOR
				+ catalogVersion.getVersion();
		final PageTemplateModel pageTemplate = pageTemplateModelMother.HomePage_Template(catalogVersion);
		final String pageTemplateUuid = getUuid(catalogVersion.getCatalog().getId(), catalogVersion.getVersion(),
				pageTemplate.getUid());

		final CMSTimeRestrictionModel timeRestriction = timeRestrictionModelMother.today(catalogVersion);

		final Map<String, String> titleMap = new HashMap<>();
		titleMap.put("en", "custom content page test");

		final Map<String, Object> inputMap = new HashMap<>();
		inputMap.put(CmswebservicesConstants.URI_CATALOG_VERSION, catalogUuid);
		inputMap.put("homepage", "false");
		inputMap.put("name", "name-custom-content-page");
		inputMap.put("masterTemplate", pageTemplateUuid);
		inputMap.put("defaultPage", "true");
		inputMap.put("restrictions", Arrays.asList(cmsItemConverter.convert(timeRestriction)));
		inputMap.put("onlyOneRestrictionMustApply", "false");
		inputMap.put("approvalStatus", CmsApprovalStatus.APPROVED);
		inputMap.put("title", titleMap);
		inputMap.put("itemtype", "ContentPage");
		inputMap.put("label", "somelabel");

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());
		final Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.post(Entity.entity(inputMap, MediaType.APPLICATION_JSON));

		assertResponse(Response.Status.CREATED, response);

		final Map<String, Object> map = response.readEntity(Map.class);
		assertThat(map.isEmpty(), is(false));
		assertThat(map.get("uuid"), notNullValue());
	}

	@Test
	public void shouldCreateOneNavigationNode() throws Exception
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphWithoutRestriction();
		final String catalogUuid = catalogVersion.getCatalog().getId()
				+ DefaultCatalogVersionModelUniqueIdentifierConverter.SEPARATOR
				+ catalogVersion.getVersion();

		final Map<String, Object> inputMap = new HashMap<>();
		inputMap.put(CmswebservicesConstants.URI_CATALOG_VERSION, catalogUuid);
		inputMap.put("visible", "false");
		inputMap.put("name", "name-custom-navigation-node");
		inputMap.put("typeCode", "CMSNavigationNode");
		inputMap.put("itemtype", "CMSNavigationNode");

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());
		final Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.post(Entity.entity(inputMap, MediaType.APPLICATION_JSON));

		assertResponse(Response.Status.CREATED, response);

		final Map<String, Object> map = response.readEntity(Map.class);
		assertThat(map.isEmpty(), is(false));
		assertThat(map.get("uuid"), notNullValue());
	}

	@Test
	public void shouldUpdateOneParagraphComponent() throws Exception
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphWithoutRestriction();

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());
		final String uuid = getUuidForAppleStage(ParagraphComponentModelMother.UID_HEADER);

		Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.path(uuid)
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		assertResponse(Response.Status.OK, response);

		final Map<String, Object> inputMap = response.readEntity(Map.class);
		final String newName = "new_paragraph_name";
		inputMap.put("name", newName);

		response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint) //
				.path(uuid) //
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.put(Entity.entity(inputMap, MediaType.APPLICATION_JSON));

		assertResponse(Response.Status.OK, response);

		final Map<String, Object> map = response.readEntity(Map.class);
		assertThat(map.isEmpty(), is(false));
		assertThat(map.get("name"), is(newName));

	}


	@Test
	public void shouldValidateForUpdateOneParagraphComponent() throws Exception
	{
		createElectronicsSiteAndHomeAppleCatalogPageHeaderWithParagraphWithoutRestriction();

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());
		final String uuid = getUuidForAppleStage(ParagraphComponentModelMother.UID_HEADER);

		Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.path(uuid)
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		assertResponse(Response.Status.OK, response);

		final Map<String, Object> inputMap = response.readEntity(Map.class);
		final String oldName = (String) inputMap.get("name");
		final String newName = "new_paragraph_name";
		inputMap.put("name", newName);

		response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint) //
				.path(uuid) //
				.queryParam("dryRun", "true")
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.put(Entity.entity(inputMap, MediaType.APPLICATION_JSON));

		assertResponse(Response.Status.OK, response);

		Map<String, Object> map = response.readEntity(Map.class);
		assertThat(map.isEmpty(), is(false));
		assertThat(map.get("uuid"), notNullValue());
		assertThat(map.get("name"), is(newName));

		final Response responseGet = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint)
				.path(uuid)
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		assertResponse(Status.OK, responseGet);
		map = responseGet.readEntity(Map.class);
		assertThat(map.isEmpty(), is(false));
		assertThat(map.get("name"), is(oldName));
	}

	@Test
	public void shouldFailUpdatePage_DuplicateLabelForPrimaryPage() throws JAXBException
	{
		// Create Electronics site to associate with Apple catalog
		createElectronicsSite();
		// Create empty Apple catalog
		createEmptyAppleCatalog();

		contentPageModelMother.SearchPage(catalogVersion);
		contentPageModelMother.DefaultHomePage(catalogVersion);
		contentPageModelMother.HomePage(catalogVersion);

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());
		final String uuid = getUuidForAppleStage(ContentPageModelMother.UID_HOMEPAGE);

		Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint).path(uuid).build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		assertResponse(Response.Status.OK, response);

		final Map<String, Object> inputMap = response.readEntity(Map.class);
		inputMap.put("uid", ContentPageModelMother.UID_DEFAULT_HOMEPAGE);
		inputMap.put("name", ContentPageModelMother.NAME_HOMEPAGE);
		inputMap.put("typeCode", ContentPageModel._TYPECODE);
		inputMap.put("template", PageTemplateModelMother.UID_HOME_PAGE);
		inputMap.put("title", getLocalizedContent(PAGE_TITLE));
		inputMap.put("defaultPage", Boolean.TRUE);
		inputMap.put("label", ContentPageModelMother.LABEL_SEARCHPAGE);

		response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint) //
				.path(uuid) //
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.put(Entity.entity(inputMap, MediaType.APPLICATION_JSON));

		assertResponse(Status.BAD_REQUEST, response);

		final ErrorListWsDTO result = response.readEntity(ErrorListWsDTO.class);
		assertThat(result.getErrors(), iterableWithSize(3));
		final Set<String> subjects = result.getErrors().stream().map(ErrorWsDTO::getSubject).collect(Collectors.toSet());
		assertThat(subjects.contains(ContentPageModel.LABEL), is(true));
	}

	@Test
	public void shouldReturnLinkToggleContentForComponentModelThatContainsExternalAndUrlLinkFields() throws JAXBException
	{
		// GIVEN
		createElectronicsSite();
		createEmptyAppleCatalog();
		flashComponentModelMother.createHeaderFlashComponentModel(catalogVersion);

		final String endPoint = replaceUriVariablesWithDefaults(ENDPOINT, new HashMap<>());

		// WHEN
		Response response = getCmsManagerWsSecuredRequestBuilder() //
				.path(endPoint) //
				.path(getUuid(ContentCatalogModelMother.CatalogTemplate.ID_APPLE.name(), catalogVersion.getVersion(),
						FlashComponentModelMother.UID_HEADER)) //
				.build() //
				.accept(MediaType.APPLICATION_JSON) //
				.get();

		// THEN
		assertResponse(Response.Status.OK, response);

		final Map<String, Object> map = response.readEntity(Map.class);
		assertThat(map.isEmpty(), is(false));

		assertThat(map.containsKey("external"), is(false));
		assertThat(map.containsKey("urlLink"), is(false));

		Map<String, Object> linkToggle = (HashMap<String, Object>) map.get(CmsfacadesConstants.FIELD_LINK_TOGGLE_NAME);
		assertThat(linkToggle.get("external"), is(false));
		assertThat(linkToggle.get("urlLink"), is(FlashComponentModelMother.URL_LINK_HEADER));
	}

	protected Map<String, String> getLocalizedContent(final String value)
	{
		final Map<String, String> localizedMap = new HashMap<>();
		localizedMap.put(ENGLISH.getLanguage(), value);
		return localizedMap;
	}
}
