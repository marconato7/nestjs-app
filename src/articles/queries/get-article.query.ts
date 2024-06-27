import { IsNotEmpty, IsString } from "class-validator"

// Get Article
// GET /api/articles/:slug
// No authentication required, will return single article
// Single Article
// {
//   "article": {
//     "slug": "how-to-train-your-dragon",
//     "title": "How to train your dragon",
//     "description": "Ever wonder how?",
//     "body": "It takes a Jacobian",
//     "tagList": ["dragons", "training"],
//     "createdAt": "2016-02-18T03:22:56.637Z",
//     "updatedAt": "2016-02-18T03:48:35.824Z",
//     "favorited": false,
//     "favoritesCount": 0,
//     "author": {
//       "username": "jake",
//       "bio": "I work at statefarm",
//       "image": "https://i.stack.imgur.com/xHWG8.jpg",
//       "following": false
//     }
//   }
// }
export class GetArticleQuery
{
    @IsString()
    @IsNotEmpty()
    private readonly _slug: string;

    constructor(slug: string)
    {
        this._slug = slug;
    }

    public get slug(): string {
        return this._slug;
    }
}
