export interface Login {
	email: string;
	password: string;
}

export interface User {
	id: number;
	username: string;
	name: string;
	surname: string;
	password: string;
	email: string;
	tel: string;
	bio: string;
}

export interface AuthResponse {
	accessToken: string;
	user: User;
}

export interface Register {
	email: string;
	password: string;
	username: string;
}
