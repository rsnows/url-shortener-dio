import { Request, Response } from 'express';
import shortId from 'shortid';
import { config } from '../config/Constants';
import { URLModel } from '../model/URL';

export class URLcontroller {
	public async shorten(req: Request, res: Response): Promise<void> {

		// Check if URL is already registered in database
		const { originURL } = req.body;
		const url = await URLModel.findOne({ originURL });
		if (url) {
			res.json(url);
			return;
		}

		// Create hash for URL
		const hash = shortId.generate();
		const shortURL = `${config.API_URL}/${hash}`;

		// Save URL in database
		const newURL = await URLModel.create({ hash, shortURL, originURL });

		// Return saved URL
		res.json({ newURL })
	}

	public async redirect(req: Request, res: Response): Promise<void> {

		// Get hash from URL
		const { hash } = req.params;

		// Find original URL from hash
		const url = await URLModel.findOne({ hash });

		// Redirect to original URL
		if (url) {
			res.redirect(url.originURL);
			return;
		}
		
		// Send not found status in case URL is not in database
		res.status(400).json({ error: 'URL not found.'});
	}
}