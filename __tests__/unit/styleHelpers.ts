import { combineStyles } from "../../src/helpers/styleHelpers";

const TestData = {
  input: {
    initial: {
      firstStyle: {
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 10,
        marginTop: 10,
        alignContent: "center",
        alignItems: "center",
      },
      secondStyle: {
        backgroundColor: "black",
      },
    },
    upcomingStyle: {
      firstStyle: {
        marginLeft: 16,
        marginRight: 16,
      },
      secondStyle: {
        backgroundColor: "lightblue",
      },
    },
  },
};

test("[combineStyles()] Empty initial and style arrays", () => {
  const expected = {};
  const combined = combineStyles([], []);
  expect(combined).toStrictEqual(expected);
});

test("[combineStyles()] Empty initial and style objects", () => {
  const expected = {};
  const combined = combineStyles({}, {});
  expect(combined).toStrictEqual(expected);
});

test("[combineStyles()] Combine 2 styles", () => {
  const expected = {
    ...TestData.input.initial.firstStyle,
    ...TestData.input.upcomingStyle.firstStyle,
  };

  const combined = combineStyles(TestData.input.initial.firstStyle, TestData.input.upcomingStyle.firstStyle);
  expect(combined).toStrictEqual(expected);
});

test("[combineStyles()] Combine an array of styles as initial and 1 style", () => {
  const expected = {
    ...TestData.input.initial.firstStyle,
    ...TestData.input.initial.secondStyle,
    ...TestData.input.upcomingStyle.firstStyle,
  };

  const initial = [TestData.input.initial.firstStyle, TestData.input.initial.secondStyle];
  const combined = combineStyles(initial, TestData.input.upcomingStyle.firstStyle);
  expect(combined).toStrictEqual(expected);
});

test("[combineStyles()] Combine an array of styles as initial and 1 style (inside an array)", () => {
  const expected = {
    ...TestData.input.initial.firstStyle,
    ...TestData.input.initial.secondStyle,
    ...TestData.input.upcomingStyle.firstStyle,
  };

  const initial = [TestData.input.initial.firstStyle, TestData.input.initial.secondStyle];
  const combined = combineStyles(initial, [TestData.input.upcomingStyle.firstStyle]);
  expect(combined).toStrictEqual(expected);
});

test("[combineStyles()] Combine an array of styles as initial and an array of upcoming styles", () => {
  const expected = {
    ...TestData.input.initial.firstStyle,
    ...TestData.input.initial.secondStyle,
    ...TestData.input.upcomingStyle.firstStyle,
    ...TestData.input.upcomingStyle.secondStyle,
  };

  const initial = [TestData.input.initial.firstStyle, TestData.input.initial.secondStyle];
  const style = [TestData.input.upcomingStyle.firstStyle, TestData.input.upcomingStyle.secondStyle];

  const combined = combineStyles(initial, style);
  expect(combined).toStrictEqual(expected);
});
