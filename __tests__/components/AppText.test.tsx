import { render } from "@testing-library/react-native";
import React from "react";
import AppText from "../../components/ui/AppText";

describe("AppText", () => {
  it("renders children", () => {
    const { getByText } = render(<AppText>Hello world</AppText>);
    expect(getByText("Hello world")).toBeTruthy();
  });

  it("applies h1 variant styles with larger font size", () => {
    const { getByText } = render(<AppText variant="h1">Title</AppText>);
    const el = getByText("Title");
    expect(el.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ fontSize: 30 })]),
    );
  });

  it("applies caption variant with small font", () => {
    const { getByText } = render(<AppText variant="caption">Small</AppText>);
    const el = getByText("Small");
    expect(el.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ fontSize: 11 })]),
    );
  });

  it("applies textAlign when align prop provided", () => {
    const { getByText } = render(<AppText align="center">Centered</AppText>);
    const el = getByText("Centered");
    const flatStyle = el.props.style.flat
      ? el.props.style.flat()
      : el.props.style;
    const hasCenter = JSON.stringify(flatStyle).includes('"center"');
    expect(hasCenter).toBe(true);
  });
});
