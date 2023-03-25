interface IQuizConfigration {
  [group: string]: IQuizQuestion;
}

interface IQuizQuestion {
  options: IQuizOption[];
}

interface IQuizOption {
  key: string;
  condition?: {
    fulfillmentCode: string[];
  };
}

export const config: IQuizConfigration = {
  skinType: {
    options: [
      {
        key: "normal",
      },
      {
        key: "dry",
      },
      {
        key: "oily",
      },
      {
        key: "mixed",
      },
    ],
  },
  skinGoals: {
    options: [
      {
        key: "wrinkles",
      },
      {
        key: "acne",
      },
      {
        key: "sensitive",
      },
      {
        key: "dehydrated",
      },
      {
        key: "pimple",
      },
      {
        key: "lighten",
      },
      {
        key: "antioxidant",
        /*  condition: {
          fulfillmentCode: ["NL", "UA"],
        }, */
      },
    ],
  },
  bodyGoals: {
    options: [
      {
        key: "body",
      },
      {
        key: "body_atopic",
        /* condition: {
          fulfillmentCode: ["NL", "UA", "BY"],
        }, */
      },
      {
        key: "cleansing",
      },
    ],
  },
};

export const getAllowedOptions = (
  group: "skinType" | "bodyGoals" | "skinGoals",
  fulfillmentCode: string
): string[] => {
  if (!config[group]) throw Error("unkonwn goals group");

  const checkCondition = (option: IQuizOption) => {
    if (!option.condition) return true;

    return option.condition.fulfillmentCode.includes(fulfillmentCode);
  };

  return config[group].options
    .filter(checkCondition)
    .map((option) => option.key);
};
