import { TestBed } from "@angular/core/testing";

import ReglogOverlayService from "./reglog-overlay.service";

describe("ReglogOverlayServiceService", () => {
	let service: ReglogOverlayService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ReglogOverlayService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
