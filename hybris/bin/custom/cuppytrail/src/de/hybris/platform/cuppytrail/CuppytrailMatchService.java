package de.hybris.platform.cuppytrail;

import de.hybris.platform.catalog.CatalogVersionService;
import de.hybris.platform.cuppy.model.NewsModel;
import de.hybris.platform.cuppy.model.PlayerModel;
import de.hybris.platform.cuppy.services.impl.DefaultMatchService;
import de.hybris.platform.servicelayer.session.SessionExecutionBody;
import de.hybris.platform.servicelayer.session.SessionService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;


/**
 * This service overrides the <code>getLatestNews</code> method to deliver only News in the <code>Default.Online</code>
 * catalog.
 */
public class CuppytrailMatchService extends DefaultMatchService
{
	@Autowired
	private SessionService sessionService;
	@Autowired
	private CatalogVersionService catalogVersionService;

	/**
	 * Does the same as the method in the superclass but finds only News belonging to the <code>Default.Online</code>
	 * catalog.
	 */
	@Override
	public List<NewsModel> getLatestNews(final PlayerModel player, final int count)
	{
		return (List<NewsModel>) this.sessionService.executeInLocalView(new SessionExecutionBody()
		{
			@Override
			public Object execute()
			{
				CuppytrailMatchService.this.catalogVersionService.setSessionCatalogVersion("Default", "Online");
				return CuppytrailMatchService.super.getLatestNews(player, count);
			}
		});
	}

	public void setSessionService(final SessionService sessionService)
	{
		this.sessionService = sessionService;
	}

	public void setCatalogVersionService(final CatalogVersionService catalogVersionService)
	{
		this.catalogVersionService = catalogVersionService;
	}
}