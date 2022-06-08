export default class Movie {
	public id?: number = 0;
	public userId: number | undefined = NaN;
	public movieId: string = "";
	constructor(userId: number | undefined, movieId: string) {
		this.userId = userId;
		this.movieId = movieId;
	}
}
