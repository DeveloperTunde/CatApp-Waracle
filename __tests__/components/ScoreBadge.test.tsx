import { render } from "@testing-library/react-native";
import React from "react";
import ScoreBadge from "../../components/ui/ScoreBadge";

describe("ScoreBadge", () => {
  it("renders positive score with + prefix", () => {
    const { getByText } = render(<ScoreBadge score={5} />);
    expect(getByText("+5")).toBeTruthy();
  });

  it("renders negative score without + prefix", () => {
    const { getByText } = render(<ScoreBadge score={-3} />);
    expect(getByText("-3")).toBeTruthy();
  });

  it("renders zero score as 0", () => {
    const { getByText } = render(<ScoreBadge score={0} />);
    expect(getByText("0")).toBeTruthy();
  });
});
