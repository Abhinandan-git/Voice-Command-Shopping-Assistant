export const categories: Record<string,string> = {
  milk: "dairy",
  eggs: "dairy",
  yogurt: "dairy",
  bread: "bakery",
  apples: "produce",
  bananas: "produce",
  oranges: "produce",
  toothpaste: "personal care",
  water: "beverages"
};

export const substitutes: Record<string,string[]> = {
  milk: ["almond milk", "oat milk", "soy milk"],
  bread: ["multigrain bread", "gluten-free bread"],
  eggs: ["tofu", "egg substitute"]
};

export const seasonalByMonth: Record<number,string[]> = {
  1: ["oranges", "kale", "carrots"],
  2: ["oranges", "spinach", "beets"],
  3: ["strawberries", "asparagus", "peas"],
  4: ["strawberries", "lettuce", "radishes"],
  5: ["mango", "blueberries", "cherries"],
  6: ["watermelon", "peaches", "tomatoes"],
  7: ["corn", "berries", "cucumbers"],
  8: ["grapes", "peppers", "plums"],
  9: ["apples", "pears", "squash"],
  10: ["pumpkin", "sweet potatoes", "broccoli"],
  11: ["cranberries", "brussels sprouts", "cauliflower"],
  12: ["citrus", "pomegranate", "leeks"]
};
