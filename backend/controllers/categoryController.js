const CATEGORY_DISPLAY_NAMES = {
  arts_and_literature: "Arts & Literature",
  film_and_tv: "Film & TV",
  food_and_drink: "Food & Drink",
  general_knowledge: "General Knowledge",
  geography: "Geography",
  history: "History",
  music: "Music",
  science: "Science",
  society_and_culture: "Society & Culture",
  sport_and_leisure: "Sport & Leisure",
};
export async function getCategories(req, res) {
  try {
    const response = await fetch("https://the-trivia-api.com/v2/categories");
    const data = await response.json();

    const categoryList = Object.entries(data).map(([displayName, apiKey]) => ({
      id: apiKey[0],       // This is the actual data i send to the API
      name: displayName,  // the pretty name for display  ....lol
    }));

    return res.status(200).json(categoryList);

  } catch (error) {
    console.error("Error inside getCategories:", error);
    return res.status(500).json({ message: "Failed to fetch categories" });
  }
}