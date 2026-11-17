import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import EnquiryPage from "./EnquiryPage";

describe("enquiry page", () => {
  it("renders the public enquiry form and product choices", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <EnquiryPage />
      </MemoryRouter>
    );

    expect(markup).toContain("Submit an enquiry");
    expect(markup).toContain('name="name"');
    expect(markup).toContain('name="phone"');
    expect(markup).toContain("Gemstones");
    expect(markup).toContain("Rudraksha");
    expect(markup).toContain("Puja services");
  });
});
